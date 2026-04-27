import { useState, useCallback, useEffect } from 'react';
import api from '../lib/api';

export interface PromptHistoryItem {
  id: string;
  type: 'Freestyle' | 'Talk To Me' | 'Dropzone' | 'Brief Me';
  timestamp: string;
  prompt: string;
  imageUrl?: string;
  response?: any;
}

interface UseAiPrompterOptions {
  editorType: 'image' | 'document' | 'spreadsheet' | 'presentation' | 'chart';
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export type EditorType = 'image' | 'document' | 'spreadsheet' | 'presentation' | 'chart';

export function useAiPrompter(options: UseAiPrompterOptions) {
  const { editorType, onSuccess, onError } = options;
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const storageKey = `ai-prompter-history-${editorType}`;
    const savedHistory = localStorage.getItem(storageKey);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, [editorType]);

  // Save history to localStorage whenever it changes
  const saveHistory = useCallback((newHistory: PromptHistoryItem[]) => {
    const storageKey = `ai-prompter-history-${editorType}`;
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
    setHistory(newHistory);
  }, [editorType]);

  // Add item to history
  const addToHistory = useCallback((item: Omit<PromptHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: PromptHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
    
    const newHistory = [newItem, ...history].slice(0, 50); // Keep last 50 items
    saveHistory(newHistory);
    return newItem;
  }, [history, saveHistory]);

  // Clear history
  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  // Modify content (image or spreadsheet) with prompt
  const modifyContent = useCallback(async (prompt: string, currentData: any, type: PromptHistoryItem['type']) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Validate currentData
      if (!currentData) {
        const errorMsg = `No ${editorType} data available to modify. Please ensure the editor is loaded.`;
        console.error('❌', errorMsg);
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      let endpoint = '';
      let requestData: any = { prompt, meta: { editorType } };

      // Route to appropriate modification endpoint based on editor type
      if (editorType === 'image') {
        console.log(' Modifying image with prompt:', prompt);
        console.log('  Image URL:', currentData);
        endpoint = '/image-generator/modify';
        requestData.imageUrl = currentData;
      } else if (editorType === 'spreadsheet') {
        console.log(' Modifying spreadsheet with prompt:', prompt);
        console.log(' Current data type:', typeof currentData);
        console.log(' Current data keys:', currentData ? Object.keys(currentData).slice(0, 10) : 'null');
        endpoint = '/spreadsheet-generator/modify';
        requestData.spreadsheetData = currentData;
      } else if (editorType === 'presentation') {
        console.log('📽️  Modifying presentation with prompt:', prompt);
        console.log('🎬 Current data:', currentData);
        endpoint = '/presentation-generator/modify';
        requestData.presentationData = currentData;
      } else if (editorType === 'document') {
        console.log('📝 Modifying document with prompt:', prompt);
        console.log('📄 Current document pages:', currentData?.pages?.length || 0);
        endpoint = '/document-generator/modify';
        requestData.documentData = currentData;
      } else {
        throw new Error(`Modification not supported for ${editorType}`);
      }

      console.log('🚀 Sending request to:', endpoint);
      console.log('📦 Request data keys:', Object.keys(requestData));

      const response = await api.post(endpoint, requestData, {
        timeout: 90000 // 90 seconds timeout
      });

      console.log('📦 Response received:', response.data);

      // Handle different response structures
      const result = response.data?.data || response.data;
      
      if (!result) {
        console.error('❌ No result in response:', response.data);
        throw new Error('Invalid response from server');
      }
      
      console.log(' Content modified successfully:', result);

      // Add to history
      addToHistory({
        type,
        prompt,
        imageUrl: result.imageUrl || result.spreadsheetData || result.presentationData || result.documentData,
        response: result
      });

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to modify content';
      console.error(' Content modification failed:', errorMessage);
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [editorType, onSuccess, onError, addToHistory]);

  // Backwards compatibility - modifyImage now calls modifyContent
  const modifyImage = useCallback(async (prompt: string, imageUrl: string, type: PromptHistoryItem['type']) => {
    return modifyContent(prompt, imageUrl, type);
  }, [modifyContent]);

  // Generate new image (for non-image editors)
  const generateContent = useCallback(async (prompt: string, type: PromptHistoryItem['type']) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log(' Generating content with prompt:', prompt);

      // Route to appropriate endpoint based on editor type
      let endpoint = '';
      let requestData: any = { prompt, meta: { editorType } };
      
      switch (editorType) {
        case 'image':
          endpoint = '/image-generator/generate';
          break;
        case 'document':
          endpoint = '/doc-generator/generate';
          break;
        case 'spreadsheet':
          endpoint = '/spreadsheet-generator/generate';
          break;
        case 'presentation':
          endpoint = '/presentation-generator/generate';
          // Add default page count for presentations
          requestData.pageCount = 5;
          break;
        default:
          throw new Error(`Unsupported editor type: ${editorType}`);
      }

      const response = await api.post(endpoint, requestData, {
        timeout: 90000 // 90 seconds timeout for content generation
      });

      const result = response.data.data;
      console.log(' Content generated successfully:', result);

      // Add to history
      addToHistory({
        type,
        prompt,
        response: result
      });

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to generate content';
      console.error(' Content generation failed:', errorMessage);
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [editorType, onSuccess, onError, addToHistory]);

  // Process voice input (deprecated - now handled directly in component with Web Speech API)
  const processVoiceInput = useCallback(async (audioBlob: Blob, imageUrl?: string) => {
    // This function is kept for backward compatibility but is no longer used
    // Voice recognition is now handled directly in the component using Web Speech API
    console.log(' processVoiceInput is deprecated - use Web Speech API in component');
    throw new Error('This method is deprecated. Voice recognition is now handled in the component.');
  }, []);

  // Process uploaded file
  const processUploadedFile = useCallback(async (file: File, currentData?: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log(' Processing uploaded file:', file.name);

      // Upload file first
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await api.post('/api/uploads/direct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const uploadedFileUrl = uploadResponse.data.data.url;
      console.log(' File uploaded:', uploadedFileUrl);

      // For image editor, if we have a current image, we'll blend/combine them
      // Otherwise, just replace with the uploaded image
      if (editorType === 'image' && currentData) {
        const prompt = 'Blend and combine these images seamlessly while maintaining composition';
        return await modifyImage(prompt, currentData, 'Dropzone');
      } else {
        // Add to history as a dropzone action
        addToHistory({
          type: 'Dropzone',
          prompt: `Uploaded file: ${file.name}`,
          imageUrl: uploadedFileUrl,
          response: { fileUrl: uploadedFileUrl }
        });

        if (onSuccess) {
          onSuccess({ imageUrl: uploadedFileUrl, fileUrl: uploadedFileUrl });
        }

        return { imageUrl: uploadedFileUrl, fileUrl: uploadedFileUrl };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to upload file';
      console.error(' File upload failed:', errorMessage);
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [editorType, modifyImage, addToHistory, onSuccess, onError]);

  // Process structured brief form
  const processBrief = useCallback(async (briefData: {
    whatToDo: string;
    focusArea: string;
    style: string;
    presentation: string;
    constraints: string;
  }, currentData?: any) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log(' Processing brief:', briefData);

      // Construct a detailed prompt from the brief
      const prompt = `
Task: ${briefData.whatToDo}
Focus Area: ${briefData.focusArea}
Style: ${briefData.style}
Presentation: ${briefData.presentation}
Constraints: ${briefData.constraints}
      `.trim();

      console.log(' Constructed prompt from brief:', prompt);

      // Process based on whether we have current data
      if (currentData) {
        return await modifyContent(prompt, currentData, 'Brief Me');
      } else {
        return await generateContent(prompt, 'Brief Me');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to process brief';
      console.error(' Brief processing failed:', errorMessage);
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [modifyContent, generateContent, onError]);

  return {
    isProcessing,
    error,
    history,
    modifyImage,
    modifyContent,
    generateContent,
    processVoiceInput,
    processUploadedFile,
    processBrief,
    addToHistory,
    clearHistory
  };
}

export default useAiPrompter;
