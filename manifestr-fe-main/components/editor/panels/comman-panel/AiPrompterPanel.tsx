import { useState, useRef, useEffect, useId } from "react";
import Image from "next/image";
import {
  Sparkles,
  History,
  Mic,
  FileUp,
  FileText,
  Send,
  Upload,
  Search,
  Loader2,
  AlertCircle,
  X,
  CloudUpload,
  Plus,
  ImageIcon,
  Video,
  Trash2,
} from "lucide-react";
import useAiPrompter, {
  PromptHistoryItem,
} from "../../../../hooks/useAiPrompter";
import api from "../../../../lib/api";
import { useToast } from "../../../ui/Toast";

interface AiPrompterPanelProps {
  store: any;
  editorType?: "image" | "document" | "spreadsheet" | "presentation" | "chart";
  onClose?: () => void;
  generationId?: string;
}

type DropzoneFileKind = "image" | "video" | "document";

interface DropzoneFileItem {
  id: string;
  name: string;
  kind: DropzoneFileKind;
  file: File;
  extractedText?: string;
}

export default function AiPrompterPanel({
  store,
  editorType = "image",
  onClose,
  generationId,
}: AiPrompterPanelProps) {
  const toast = useToast();
  const dropzoneFileInputId = useId();
  const [activeTab, setActiveTab] = useState("Freestyle");
  const [mode, setMode] = useState("Prompt Mode");
  const [isRecording, setIsRecording] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState("All");

  // Freestyle tab state
  const [freestylePrompt, setFreestylePrompt] = useState("");

  // Brief Me tab state
  const [briefData, setBriefData] = useState({
    whatToDo: "",
    focusArea: "",
    style: "",
    presentation: "",
    constraints: "",
  });
  const [briefToneTags, setBriefToneTags] = useState<string[]>([]);
  const [briefGoalTags, setBriefGoalTags] = useState<string[]>([]);

  const BRIEF_TONE_TAGS = [
    "Stronger",
    "More concise",
    "Persuasive",
    "Confident",
    "Professional",
  ] as const;
  const BRIEF_GOAL_TAGS = [
    "Clarity",
    "Shorten",
    "Strengthen",
    "Polish",
    "Restructure",
  ] as const;

  const toggleBriefTag = (
    tag: string,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // Voice recording state
  const recognitionRef = useRef<any>(null);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropzone state
  const [dropzoneFiles, setDropzoneFiles] = useState<DropzoneFileItem[]>([]);
  const [dropzoneGeneratingPrompt, setDropzoneGeneratingPrompt] = useState<
    string | null
  >(null);
  const [isDropzoneDragging, setIsDropzoneDragging] = useState(false);

  // AI Prompter hook
  const {
    isProcessing,
    error: aiError,
    history,
    modifyImage,
    modifyContent,
    generateContent,
    processVoiceInput,
    processUploadedFile,
    processBrief,
    clearHistory,
    clearError,
  } = useAiPrompter({
    editorType,
    onSuccess: async (result) => {
      console.log(" AI Prompter success! Result keys:", Object.keys(result));
      console.log(" Result data:", result);
      console.log(" Editor/Store available:", !!store);
      console.log(" Editor type check:", editorType);

      // Update editor based on result
      if (store) {
        console.log(" Calling updateEditorWithData...");
        await updateEditorWithData(result);
        console.log(" updateEditorWithData completed!");

        // Show success message to user
        setTimeout(() => {
          console.log(" Document updated successfully!");
        }, 100);
      } else {
        console.error(" No store/editor available to update!");
        console.error(
          " This means the editor instance was not passed correctly",
        );
        toast.error("Editor not available. Please refresh the page and try again.");
      }
    },
    onError: (error) => {
      console.error(" AI Prompter error:", error);
    },
  });

  // Get current editor data (image URL, spreadsheet data, or presentation data)
  const getCurrentEditorData = (): any => {
    console.log(" Getting current editor data for:", editorType);
    console.log(" Store available:", !!store);

    if (!store) {
      console.warn(" No store available");
      return null;
    }

    try {
      if (editorType === "image") {
        // For Polotno store (image editor)
        const page = store.activePage;
        if (!page) {
          console.warn(" No active page");
          return null;
        }

        // Find the first image element
        const imageElement = page.children.find(
          (child: any) => child.type === "image",
        );
        if (imageElement && imageElement.src) {
          console.log(" Got image URL:", imageElement.src);
          return imageElement.src;
        }

        console.warn(" No image element found");
        return null;
      } else if (editorType === "document") {
        // For Tiptap editor (HTML content)
        // Get HTML content from editor
        if (store && store.getHTML) {
          const html = store.getHTML();
          console.log(" Got document HTML, length:", html?.length || 0);
          return html;
        } else if (store && store.state) {
          // Fallback: Try to get HTML from editor state
          console.log(" Using fallback method to get HTML");
          return null;
        } else {
          console.warn(" Store does not have getHTML method");
          console.log(" Store type:", typeof store);
          console.log(
            " Store methods:",
            store
              ? Object.keys(store)
                  .filter((k) => typeof store[k] === "function")
                  .slice(0, 10)
              : "no store",
          );
          return null;
        }
      } else if (editorType === "presentation") {
        // For Polotno store (presentation editor)
        // Get complete presentation JSON
        if (store.toJSON) {
          const data = store.toJSON();
          console.log(" Got presentation data, pages:", data?.pages?.length);
          return data;
        } else {
          console.warn(" Store does not have toJSON method");
          return null;
        }
      } else if (editorType === "spreadsheet") {
        // For Univer (spreadsheet editor)
        // Get current spreadsheet data from store (univerAPI)
        console.log("📋 Store type:", typeof store);
        console.log(
          " Store has getActiveWorkbook:",
          typeof store.getActiveWorkbook === "function",
        );

        try {
          // The store is the univerAPI object
          if (store.getActiveWorkbook) {
            const workbook = store.getActiveWorkbook();

            if (!workbook) {
              console.warn(" No active workbook found");
              return null;
            }

            console.log(" Got active workbook");

            // Get workbook data as JSON
            if (workbook.save) {
              const data = workbook.save();
              console.log(" Got workbook data via save()");
              console.log(" Data keys:", Object.keys(data).slice(0, 10));
              return data;
            } else if (workbook.getSnapshot) {
              const data = workbook.getSnapshot();
              console.log(" Got workbook data via getSnapshot()");
              return data;
            } else {
              console.error(" Workbook has no save() or getSnapshot() method");
              return null;
            }
          } else if (store.getData) {
            // Fallback for different API structure
            const data = store.getData();
            console.log(" Got data via getData()");
            return data;
          } else {
            console.error(
              " Store has no getActiveWorkbook() or getData() method",
            );
            console.error(
              " Available methods:",
              Object.keys(store)
                .filter((k) => typeof store[k] === "function")
                .slice(0, 20),
            );
            return null;
          }
        } catch (error) {
          console.error(" Error extracting workbook data:", error);
          return null;
        }
      } else if (editorType === "chart") {
        // For Chart Editor
        // Get current chart data from store
        console.log(" Getting chart data");
        console.log(" Store available:", !!store);

        try {
          // Extract chart state from the store object
          if (store && typeof store === "object") {
            const chartData = {
              chartType: store.chartType,
              labels: store.labels,
              datasets: store.datasets,
              chartTitle: store.chartTitle,
              showLegend: store.showLegend,
              showGrid: store.showGrid,
              selectedColorScheme: store.selectedColorScheme,
            };

            console.log(" Got chart data");
            console.log(" Chart type:", chartData.chartType);
            console.log(" Labels:", chartData.labels?.length || 0);
            console.log(" Datasets:", chartData.datasets?.length || 0);

            return chartData;
          } else {
            console.warn(" Store is not an object");
            return null;
          }
        } catch (error) {
          console.error(" Error extracting chart data:", error);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error(" Error getting current editor data:", error);
      return null;
    }
  };

  // Update editor with new data (image, spreadsheet, or presentation)
  const updateEditorWithData = async (result: any) => {
    if (!store) return;

    try {
      if (editorType === "image" && result.imageUrl) {
        // Update image editor
        const page = store.activePage;
        if (!page) return;

        // Find existing image element or create new one
        let imageElement = page.children.find(
          (child: any) => child.type === "image",
        );

        if (imageElement) {
          // Update existing image
          imageElement.set({ src: result.imageUrl });
          console.log(" Updated existing image element");
        } else {
          // Create new image element
          page.addElement({
            type: "image",
            src: result.imageUrl,
            x: 0,
            y: 0,
            width: page.width,
            height: page.height,
          });
          console.log(" Created new image element");
        }
      } else if (editorType === "document" && result.documentData) {
        // Update document editor (Tiptap - HTML content)
        console.log(" Updating document with new HTML");
        console.log(" New HTML length:", result.documentData?.length || 0);
        console.log(" Store available:", !!store);
        console.log(" Store type:", typeof store);

        try {
          // Verify editor instance
          if (!store) {
            console.error(" No editor instance available");
            toast.error("Editor not ready. Please try again.");
            return;
          }

          // Log available methods for debugging
          if (store.commands) {
            console.log(" Editor has commands object");
          }

          // Tiptap setContent method (Primary method)
          if (
            store.commands &&
            typeof store.commands.setContent === "function"
          ) {
            console.log(" Calling editor.commands.setContent()...");
            const success = store.commands.setContent(result.documentData);
            console.log(" setContent result:", success);
            console.log(" Document HTML updated successfully!");
            console.log(" You should see the changes in the editor now!");
          } else if (
            store.setContent &&
            typeof store.setContent === "function"
          ) {
            // Alternative method 1
            console.log(" Calling editor.setContent()...");
            store.setContent(result.documentData);
            console.log(" Document updated successfully using setContent");
          } else if (store.setHTML && typeof store.setHTML === "function") {
            // Alternative method 2
            console.log(" Calling editor.setHTML()...");
            store.setHTML(result.documentData);
            console.log("Document updated successfully using setHTML");
          } else {
            console.error(" Could not find method to update document HTML");
            console.log(
              " Available store properties:",
              Object.keys(store).slice(0, 30),
            );
            console.log(
              " Commands available:",
              store.commands
                ? Object.keys(store.commands).slice(0, 30)
                : "no commands",
            );
            toast.error(
              "Failed to update document. The editor API might have changed. Please refresh the page and try again.",
            );
          }
        } catch (updateError) {
          console.error("Error updating document HTML:", updateError);
          console.error(" Error details:", updateError);
          toast.error(
            "Failed to update document: " +
              (updateError instanceof Error
                ? updateError.message
                : String(updateError)),
          );
        }
      } else if (editorType === "presentation" && result.presentationData) {
        // Update presentation editor (Polotno)
        console.log(
          "📽️  Updating presentation with new data:",
          result.presentationData,
        );

        try {
          // Polotno loadJSON method to replace entire presentation
          if (store.loadJSON) {
            store.loadJSON(result.presentationData);
            console.log("Presentation updated successfully using loadJSON");
          } else if (store.clear && store.addPage) {
            // Fallback: Clear all pages and add new ones
            store.clear();
            const pages = result.presentationData.pages || [];
            pages.forEach((pageData: any) => {
              const page = store.addPage(pageData);
              console.log("Added page:", page.id);
            });
            console.log("Presentation updated successfully via clear/addPage");
          } else {
            console.warn(" Could not find method to update presentation");
            console.log("Try refreshing the page to see updated presentation");
          }
        } catch (loadError) {
          console.error("Error loading presentation JSON:", loadError);
          console.log(
            "Consider refreshing the page to see updated presentation",
          );
        }
      } else if (editorType === "spreadsheet" && result.spreadsheetData) {
        // Update spreadsheet editor (Univer)
        console.log("📊 Updating spreadsheet with new data");
        console.log(
          "New data keys:",
          Object.keys(result.spreadsheetData).slice(0, 10),
        );

        try {
          // The store is the univerAPI object
          if (
            store.getActiveWorkbook &&
            store.disposeUnit &&
            store.createWorkbook
          ) {
            console.log("Updating spreadsheet with AI-generated data...");

            // Get current workbook
            const currentWorkbook = store.getActiveWorkbook();

            if (
              currentWorkbook &&
              typeof currentWorkbook.getId === "function"
            ) {
              // Get workbook ID using the correct method
              const workbookId = currentWorkbook.getId();
              console.log("Current workbook ID:", workbookId);
              console.log(" Disposing current workbook...");

              // Dispose current workbook
              store.disposeUnit(workbookId);
              console.log("Workbook disposed");

              // Small delay to ensure disposal is complete
              await new Promise((resolve) => setTimeout(resolve, 50));

              // Create new workbook with AI-generated data
              console.log("Creating new workbook with AI-generated data...");
              console.log(
                "📋 Data keys:",
                Object.keys(result.spreadsheetData || {}),
              );

              store.createWorkbook(result.spreadsheetData);

              // Verify new workbook was created
              await new Promise((resolve) => setTimeout(resolve, 100));
              const verifyWorkbook = store.getActiveWorkbook();

              if (verifyWorkbook) {
                console.log("  New workbook created successfully!");
                console.log(
                  " New workbook ID:",
                  verifyWorkbook.getId ? verifyWorkbook.getId() : "Unknown",
                );
                console.log(
                  " Spreadsheet updated immediately! Changes are now visible.",
                );

                // Show success message
                console.log("🎉 AI-generated spreadsheet is now displayed!");

                // Auto-save to database if generationId is available
                if (generationId) {
                  console.log(
                    " Auto-saving AI-generated spreadsheet to database...",
                  );
                  try {
                    const saveData =
                      typeof verifyWorkbook.save === "function"
                        ? verifyWorkbook.save()
                        : result.spreadsheetData;

                    await api.patch(`/ai/generation/${generationId}`, {
                      content: saveData,
                    });

                    console.log(" AI-generated spreadsheet saved to database!");
                    console.log(
                      " Your changes are now persisted and will be available on reload!",
                    );
                  } catch (saveError) {
                    console.error(" Error saving to database:", saveError);
                    console.log(
                      " Spreadsheet is displayed but not saved. Try manual save or refresh.",
                    );
                  }
                } else {
                  console.log(
                    "ℹNo generation ID available, skipping database save",
                  );
                  console.log(" Create a saved document to enable persistence");
                }
              } else {
                console.error(" Failed to create new workbook");
                console.warn(
                  " Refresh the page to see the updated spreadsheet",
                );
              }
            } else {
              console.warn(
                " No active workbook found or getId() method not available",
              );
              console.log(" Trying direct creation...");

              // Try direct creation without disposal
              try {
                store.createWorkbook(result.spreadsheetData);
                await new Promise((resolve) => setTimeout(resolve, 100));
                console.log("Spreadsheet created directly");
              } catch (directError) {
                console.error(" Direct creation failed:", directError);
              }
            }
          } else if (store.setData) {
            // Fallback 1: setData method
            console.log(" Using setData() method...");
            store.setData(result.spreadsheetData);
            console.log(" Spreadsheet updated via setData()");
          } else if (store.loadData) {
            // Fallback 2: loadData method
            console.log(" Using loadData() method...");
            store.loadData(result.spreadsheetData);
            console.log(" Spreadsheet updated via loadData()");
          } else {
            console.warn(" Could not find method to update spreadsheet data");
            console.log(
              " Available methods:",
              Object.keys(store)
                .filter((k) => typeof store[k] === "function")
                .slice(0, 30),
            );
            console.log(
              " Refresh the page to see the AI-generated spreadsheet",
            );
          }
        } catch (updateError) {
          console.error(" Error updating spreadsheet:", updateError);
          console.error(" Error details:", updateError.message || updateError);
          console.log(" Refresh the page to see the AI-generated spreadsheet");
        }
      } else if (editorType === "chart" && result.chartData) {
        // Update chart editor
        console.log(" Updating chart with AI-generated data");
        console.log(" New chart data keys:", Object.keys(result.chartData));

        try {
          // The store object has setter functions for each state
          if (store && typeof store === "object") {
            const chartData = result.chartData;

            // Update chart type
            if (
              chartData.chartType &&
              typeof store.setChartType === "function"
            ) {
              store.setChartType(chartData.chartType);
              console.log("✅ Updated chart type:", chartData.chartType);
            }

            // Update labels
            if (chartData.labels && typeof store.setLabels === "function") {
              store.setLabels(chartData.labels);
              console.log("✅ Updated labels:", chartData.labels.length);
            }

            // Update datasets
            if (chartData.datasets && typeof store.setDatasets === "function") {
              store.setDatasets(chartData.datasets);
              console.log("✅ Updated datasets:", chartData.datasets.length);
            }

            // Update chart title
            if (
              chartData.chartTitle !== undefined &&
              typeof store.setChartTitle === "function"
            ) {
              store.setChartTitle(chartData.chartTitle);
              console.log("✅ Updated title:", chartData.chartTitle);
            }

            // Update legend visibility
            if (
              chartData.showLegend !== undefined &&
              typeof store.setShowLegend === "function"
            ) {
              store.setShowLegend(chartData.showLegend);
              console.log(
                "✅ Updated legend visibility:",
                chartData.showLegend,
              );
            }

            // Update grid visibility
            if (
              chartData.showGrid !== undefined &&
              typeof store.setShowGrid === "function"
            ) {
              store.setShowGrid(chartData.showGrid);
              console.log("✅ Updated grid visibility:", chartData.showGrid);
            }

            // Update color scheme
            if (
              chartData.selectedColorScheme &&
              typeof store.setSelectedColorScheme === "function"
            ) {
              store.setSelectedColorScheme(chartData.selectedColorScheme);
              console.log(
                "✅ Updated color scheme:",
                chartData.selectedColorScheme,
              );
            }

            console.log(
              "✅ Chart updated successfully with AI-generated data!",
            );
            console.log(
              "🎉 Your chart is now displaying the AI-generated visualization!",
            );
          } else {
            console.error(" Store is not available or not an object");
            console.log("💡 Refresh the page to see the AI-generated chart");
          }
        } catch (updateError) {
          console.error(" Error updating chart:", updateError);
          console.error(" Error details:", updateError.message || updateError);
          console.log("💡 Refresh the page to see the AI-generated chart");
        }
      }
    } catch (error) {
      console.error(" Error updating editor:", error);
    }
  };

  // Handle Freestyle prompt submission
  const handleFreestyleSubmit = async () => {
    if (!freestylePrompt.trim()) return;

    const currentData = getCurrentEditorData();

    try {
      if (currentData) {
        await modifyContent(freestylePrompt, currentData, "Freestyle");
      } else {
        await generateContent(freestylePrompt, "Freestyle");
      }

      // Clear input on success
      setFreestylePrompt("");
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  // Handle voice recording with Web Speech API
  const startRecording = () => {
    try {
      // Check if browser supports Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        toast.error(
          "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
        );
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        console.log("🎤 Voice recognition started");
        setIsRecording(true);
        setVoiceTranscript("");
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setVoiceTranscript((prev) => (prev + finalTranscript).trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          console.log("No speech detected, continuing...");
        } else {
          toast.error(`Speech recognition error: ${event.error}`);
          setIsRecording(false);
        }
      };

      recognition.onend = () => {
        console.log("🎤 Voice recognition ended");
        setIsRecording(false);
        // Note: No auto-send here - user must click "Send Prompt" button
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast.error(
        "Failed to start speech recognition. Please check microphone permissions.",
      );
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Handle the transcribed voice input
  const handleVoiceTranscript = async (transcript: string) => {
    if (!transcript.trim()) {
      toast.error("No speech was detected. Please try again.");
      return;
    }

    console.log("🎤 Processing transcript:", transcript);

    const currentData = getCurrentEditorData();

    try {
      if (currentData) {
        await modifyContent(transcript, currentData, "Talk To Me");
      } else {
        await generateContent(transcript, "Talk To Me");
      }

      // Clear transcript on success
      setVoiceTranscript("");
    } catch (error) {
      // Error is already handled by the hook
      console.error("Failed to process voice input:", error);
    }
  };

  // Read a plain-text file in the browser (no backend call needed).
  const readPlainTextFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        resolve(typeof result === "string" ? result : "");
      };
      reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
      reader.readAsText(file);
    });

  const getDropzoneFileKind = (file: File): DropzoneFileKind | null => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (
      [
        "text/plain",
        "application/msword",
        "application/vnd.ms-word",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type) ||
      /\.(txt|doc|docx)$/i.test(file.name)
    ) {
      return "document";
    }
    return null;
  };

  const addDropzoneFile = (item: DropzoneFileItem) => {
    setDropzoneFiles((prev) => {
      if (prev.some((f) => f.name === item.name && f.file.size === item.file.size)) {
        return prev;
      }
      return [...prev, item];
    });
    setDropzoneGeneratingPrompt(null);
  };

  const removeDropzoneFile = (id: string) => {
    setDropzoneFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const buildDropzonePrompt = (files: DropzoneFileItem[]) =>
    files
      .map((f) => {
        if (f.kind === "document" && f.extractedText?.trim()) {
          return `Content from ${f.name}:\n${f.extractedText.trim()}`;
        }
        return `Use the attached ${f.kind} file "${f.name}" as context for the requested changes.`;
      })
      .join("\n\n");

  // Process a single file (used by both <input> change and drag-and-drop).
  const processFile = async (file: File | null | undefined) => {
    if (!file) return;

    clearError();
    const kind = getDropzoneFileKind(file);
    if (!kind) {
      toast.error(
        "Unsupported file type. Upload images, videos, or documents (.txt, .doc, .docx).",
      );
      return;
    }

    const maxSize =
      kind === "video"
        ? 30 * 1024 * 1024
        : kind === "image"
          ? 2 * 1024 * 1024
          : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const limitLabel =
        kind === "video" ? "30" : kind === "image" ? "2" : "10";
      toast.error(`File size must be less than ${limitLabel} MB`);
      return;
    }

    if (editorType === "image" && kind === "video") {
      toast.error("Please upload an image or document for the image editor.");
      return;
    }

    if (
      editorType === "spreadsheet" &&
      kind !== "document" &&
      ![
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type)
    ) {
      toast.error(
        "Please upload a CSV, Excel file, or document (.txt, .doc, .docx).",
      );
      return;
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    if (kind === "document") {
      const isPlainText =
        file.type === "text/plain" || /\.txt$/i.test(file.name);

      if (isPlainText) {
        try {
          const text = await readPlainTextFile(file);
          if (!text.trim()) {
            toast.error("This text file appears to be empty.");
            return;
          }
          addDropzoneFile({ id, name: file.name, kind, file, extractedText: text });
          toast.success(`"${file.name}" added. Tap Generate Prompt when ready.`);
          return;
        } catch (error) {
          console.error("❌ Failed to read text file:", error);
          toast.error("Couldn't read this text file. Please try another.");
          return;
        }
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post("/api/uploads/extract-text", formData);
        const extractedText = response?.data?.data?.extractedText || "";
        if (!extractedText.trim()) {
          toast.error(
            "No text could be extracted from this document. Try saving it as .txt and uploading again.",
          );
          return;
        }
        addDropzoneFile({
          id,
          name: file.name,
          kind,
          file,
          extractedText,
        });
        toast.success(`"${file.name}" added. Tap Generate Prompt when ready.`);
      } catch (error: any) {
        console.error("❌ Document text extraction failed:", error);
        toast.error(
          "Couldn't extract text from this document. As a workaround, save the file as .txt and drop it here.",
        );
      }
      return;
    }

    addDropzoneFile({ id, name: file.name, kind, file });
    toast.success(`"${file.name}" added. Tap Generate Prompt when ready.`);
  };

  const processFiles = async (files: FileList | File[] | null | undefined) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      await processFile(file);
    }
  };

  // Handle file upload from <input type="file">
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      await processFiles(event.target.files);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Drag-and-drop handlers for the Dropzone tab
  const handleDropzoneDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDropzoneDragging) setIsDropzoneDragging(true);
  };

  const handleDropzoneDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only clear when actually leaving the dropzone, not when entering a child element.
    if (
      e.currentTarget instanceof Node &&
      e.relatedTarget instanceof Node &&
      e.currentTarget.contains(e.relatedTarget)
    ) {
      return;
    }
    setIsDropzoneDragging(false);
  };

  const handleDropzoneDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropzoneDragging(false);
    await processFiles(e.dataTransfer?.files);
  };

  const handleDropzoneGeneratePrompt = async () => {
    if (dropzoneFiles.length === 0 || isProcessing) return;

    const prompt = buildDropzonePrompt(dropzoneFiles);
    setDropzoneGeneratingPrompt(prompt);

    const currentData = getCurrentEditorData();
    const mediaFiles = dropzoneFiles.filter(
      (f) => f.kind === "image" || f.kind === "video",
    );
    const hasDocumentText = dropzoneFiles.some(
      (f) => f.kind === "document" && f.extractedText?.trim(),
    );

    try {
      for (const item of mediaFiles) {
        await processUploadedFile(item.file, currentData || undefined);
      }

      if (hasDocumentText || (mediaFiles.length === 0 && prompt.trim())) {
        if (currentData) {
          await modifyContent(prompt, currentData, "Dropzone");
        } else {
          await generateContent(prompt, "Dropzone");
        }
      }

      setDropzoneFiles([]);
      setDropzoneGeneratingPrompt(null);
    } catch (error) {
      console.error("Failed to generate prompt from dropzone:", error);
    }
  };

  // Handle Brief Me submission
  const handleBriefSubmit = async () => {
    const hasContent =
      briefData.whatToDo.trim() ||
      briefData.style.trim() ||
      briefToneTags.length > 0 ||
      briefGoalTags.length > 0;

    if (!hasContent) {
      toast.error("Please fill in at least one field");
      return;
    }

    const currentData = getCurrentEditorData();
    const payload = {
      whatToDo: briefData.whatToDo,
      focusArea: "",
      style: briefData.style,
      presentation: briefGoalTags.join(", "),
      constraints: briefToneTags.join(", "),
    };

    try {
      await processBrief(payload, currentData || undefined);

      setBriefData({
        whatToDo: "",
        focusArea: "",
        style: "",
        presentation: "",
        constraints: "",
      });
      setBriefToneTags([]);
      setBriefGoalTags([]);
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  // Keyboard shortcut for Freestyle (Cmd/Ctrl + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (activeTab === "Freestyle" && mode === "Prompt Mode") {
          handleFreestyleSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, mode, freestylePrompt]);

  // Filter history based on search and filter
  const filteredHistory = history.filter((item) => {
    // Apply type filter
    if (historyFilter !== "All" && item.type !== historyFilter) {
      return false;
    }

    // Apply search filter
    if (
      searchQuery &&
      !item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const talkToMeMicIdleSrc =
    "https://res.cloudinary.com/dlifgfg6m/image/upload/v1779166774/Group_1577709164_eiwl3o.png";
  const talkToMeMicRecordingSrc =
    "https://res.cloudinary.com/dlifgfg6m/image/upload/v1779166798/Group_1577709164_1_gauha2.png";
  const talkToMeWatermarkSrc =
    "https://res.cloudinary.com/dlifgfg6m/image/upload/v1779166955/YOUR_WORK_YOUR_WAY_juempq.png";
  const talkToMeMicSizePx = 108;

  const prompterTabs = [
    { name: "Freestyle", icon: Sparkles },
    { name: "Talk To Me", icon: Mic },
    { name: "Dropzone", icon: Upload },
    { name: "Brief Me", icon: FileText },
  ];

  const noFocusRing =
    "outline-none focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none";

  const historyFilterButtonClass = (isActive: boolean) =>
    `flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition-all ${noFocusRing} ${
      isActive
        ? "bg-black text-white"
        : "bg-[#f4f4f4] text-[#0a0a0a] hover:bg-[#ebebeb]"
    }`;

  const handleHistoryItemClick = (item: PromptHistoryItem) => {
    setActiveTab(item.type);
    setMode("Prompt Mode");
    if (item.type === "Freestyle") {
      setFreestylePrompt(item.prompt);
    }
  };

  return (
    <div
      className={`w-full relative overflow-hidden border border-[#dcdfe5] bg-white shadow-[0_-1px_2px_rgba(0,0,0,0.25)] ${noFocusRing} [&_button]:outline-none [&_button]:focus:outline-none [&_button]:focus:ring-0 [&_button]:focus-visible:outline-none [&_button]:focus-visible:ring-0 [&_input]:outline-none [&_input]:focus:outline-none [&_input]:focus:ring-0 [&_input]:focus-visible:outline-none [&_input]:focus-visible:ring-0 [&_textarea]:outline-none [&_textarea]:focus:outline-none [&_textarea]:focus:ring-0 [&_textarea]:focus-visible:outline-none [&_textarea]:focus-visible:ring-0 [&_button]:focus:shadow-none [&_input]:focus:shadow-none [&_textarea]:focus:shadow-none`}
    >
      {/* Background watermark (hidden on Talk To Me & Dropzone — those tabs have their own) */}
      {activeTab !== "Talk To Me" &&
        activeTab !== "Dropzone" &&
        mode !== "History" && (
        <p
          className="pointer-events-none absolute right-6 top-2 z-0 hidden text-center text-[48px] leading-none text-black opacity-[0.05] sm:block lg:right-10"
          style={{
            fontFamily: "'IvyPresto Headline', serif",
            fontWeight: 600,
            fontStyle: "italic",
          }}
          aria-hidden
        >
          YOUR WORK, YOUR WAY
        </p>
      )}

      {/* Close Button - Top Right */}
      {onClose && (
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 z-50 flex h-8 w-8 items-center justify-center rounded-md border border-[#dcdfe5] bg-white shadow-sm transition-all hover:bg-[#f4f4f4] group ${noFocusRing}`}
          title="Close AI Prompter"
        >
          <X className="h-4 w-4 text-[#71717a] group-hover:text-[#18181b]" />
        </button>
      )}

      {/* Warning if editor not ready (for document editor) */}
      {editorType === "document" && !store && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Editor is loading...</strong> Please wait a moment for
                the editor to initialize, then try again.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-full space-y-5 px-6 py-5 sm:px-10 sm:py-6">
        {/* Row 1: Mode toggle + divider + prompt tabs */}
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-0">
          <div className="flex h-10 shrink-0 items-center rounded-md bg-black p-1">
            {["Prompt Mode", "History"].map((t) => {
              const isActive = mode === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMode(t)}
                  className={`flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-all ${
                    isActive
                      ? "border border-[#ededed] bg-white text-[#0a0a0a] shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
                      : "text-white hover:text-white/90"
                  }`}
                >
                  {t === "Prompt Mode" ? (
                    <Sparkles className="h-4 w-4 shrink-0" />
                  ) : (
                    <History className="h-4 w-4 shrink-0" />
                  )}
                  <span>{t}</span>
                  {t === "History" && (
                    <span className="rounded-full bg-[#f1f5f9] px-1.5 py-0.5 text-xs font-semibold text-[#65758b]">
                      {history.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {mode === "Prompt Mode" && (
            <>
              <div
                className="hidden h-7 w-px shrink-0 bg-[#dcdfe5] lg:mx-5 lg:block"
                aria-hidden
              />
              <div className="flex flex-wrap items-center gap-2">
                {prompterTabs.map((tab) => {
                  const isActive = activeTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      type="button"
                      onClick={() => setActiveTab(tab.name)}
                      disabled={isProcessing}
                      className={`flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        isActive
                          ? "bg-black text-white"
                          : "bg-[#f4f4f4] text-[#0a0a0a] hover:bg-[#ebebeb]"
                      }`}
                    >
                      <tab.icon className="h-4 w-4 shrink-0" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {mode === "History" && (
            <>
              <div
                className="hidden h-7 w-px shrink-0 bg-[#dcdfe5] lg:mx-5 lg:block"
                aria-hidden
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHistoryFilter("All")}
                  className={historyFilterButtonClass(historyFilter === "All")}
                >
                  All
                </button>
                {prompterTabs.map((tab) => (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => setHistoryFilter(tab.name)}
                    className={historyFilterButtonClass(
                      historyFilter === tab.name,
                    )}
                  >
                    <tab.icon className="h-4 w-4 shrink-0" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
              <div
                className="hidden h-7 w-px shrink-0 bg-[#dcdfe5] lg:mx-5 lg:block"
                aria-hidden
              />
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 lg:justify-end">
                <div className="relative min-w-[200px] flex-1 lg:max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717a]" />
                  <input
                    type="text"
                    placeholder="Search your prompt history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`h-10 w-full rounded-md border border-[#e1e7ef] bg-[#f5f5f5] py-2 pl-9 pr-3 text-sm text-[#0a0a0a] placeholder:text-[#71717a] focus:border-[#e1e7ef] ${noFocusRing}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearHistory();
                    setSearchQuery("");
                  }}
                  disabled={history.length === 0}
                  className="flex h-10 shrink-0 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              </div>
            </>
          )}
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
            <Loader2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 animate-spin" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                Processing your request...
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                This may take 20-30 seconds. Please wait.
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {aiError && !isProcessing && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-xs text-red-600 mt-0.5">{aiError}</p>
            </div>
          </div>
        )}

        {mode === "Prompt Mode" && (
          <div className="overflow-visible">
            {/* Freestyle tab content */}
            {activeTab === "Freestyle" && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold leading-7 text-[#18181b]">
                  Type your thoughts - we will turn it into a prompt
                </h2>

                <div className="relative">
                  <textarea
                    value={freestylePrompt}
                    onChange={(e) => setFreestylePrompt(e.target.value)}
                    disabled={isProcessing}
                    placeholder="Describe what you'd like to modify... For example: 'Change the header to navy blue, make the buttons larger, and add spacing between sections.'"
                    className={`h-[113px] w-full resize-none rounded-md border border-[#e1e7ef] bg-[#f4f4f4] p-3 pb-14 text-[15px] leading-6 text-[#18181b] placeholder:text-[#71717a] focus:border-[#e1e7ef] disabled:cursor-not-allowed disabled:opacity-50 ${noFocusRing}`}
                  />

                  <button
                    type="button"
                    onClick={handleFreestyleSubmit}
                    disabled={isProcessing || !freestylePrompt.trim()}
                    className="absolute bottom-3 right-3 flex h-[42px] items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Prompt</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            {/* Talk To Me */}
            {activeTab === "Talk To Me" && (
              <div className="relative overflow-hidden bg-white">
                <div className="relative z-10 flex min-h-[180px] flex-col sm:flex-row sm:items-center">
                  {/* Left: mic + status */}
                  <div className="flex shrink-0 flex-col items-center justify-center px-6 py-6 sm:w-[280px]">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      disabled={isProcessing && !isRecording}
                      className="relative flex shrink-0 items-center justify-center transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        width: talkToMeMicSizePx,
                        height: talkToMeMicSizePx,
                      }}
                      aria-label={
                        isRecording ? "Stop recording" : "Start recording"
                      }
                    >
                      {isProcessing && !isRecording ? (
                        <span
                          className="flex items-center justify-center"
                          style={{
                            width: talkToMeMicSizePx,
                            height: talkToMeMicSizePx,
                          }}
                        >
                          <Loader2 className="h-10 w-10 animate-spin text-[#71717a]" />
                        </span>
                      ) : (
                        <img
                          src={
                            isRecording
                              ? talkToMeMicRecordingSrc
                              : talkToMeMicIdleSrc
                          }
                          alt=""
                          width={talkToMeMicSizePx}
                          height={talkToMeMicSizePx}
                          className="object-contain"
                          style={{
                            width: talkToMeMicSizePx,
                            height: talkToMeMicSizePx,
                          }}
                        />
                      )}
                    </button>

                    <div className="mt-4 inline-flex flex-row items-center gap-2 whitespace-nowrap">
                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${
                          isRecording
                            ? "bg-[#f51010] opacity-85"
                            : "bg-black opacity-85"
                        }`}
                      />
                      <span className="text-base font-semibold leading-none tracking-[-0.16px] text-[#0a0a0a]">
                        {isProcessing && !isRecording
                          ? "Processing..."
                          : isRecording
                            ? "Recording... Click to stop"
                            : "Click to Start Recording"}
                      </span>
                    </div>
                  </div>

                  <div
                    className="mx-0 h-px w-full shrink-0 bg-[#dcdfe5] sm:h-[93px] sm:w-px"
                    aria-hidden
                  />

                  {/* Right: transcript panel */}
                  <div className="relative z-10 flex flex-1 flex-col border-t border-[#dcdfe5] p-5 pb-16 sm:border-t-0 sm:p-6 sm:pb-16">
                    <span className="absolute right-5 top-5 rounded-full border border-white/70 bg-white/60 px-3 py-0.5 text-[11px] leading-none text-[#0a0a0a] shadow-sm sm:right-6 sm:top-6">
                      {voiceTranscript.length} characters
                    </span>

                    <div className="flex min-h-0 flex-1 flex-col gap-1 pr-28">
                      <p className="text-[13px] font-semibold leading-[18px] text-[#0a0a0a]">
                        Transcript
                      </p>

                      <h3 className="text-base font-medium leading-6 text-black">
                        {isRecording
                          ? "I'm Listening... What changes do you want to make?"
                          : "What changes do you want to make?"}
                      </h3>

                      <div className="min-h-[48px] flex-1 overflow-y-auto">
                        {voiceTranscript ? (
                          <p className="whitespace-pre-wrap text-sm leading-5 text-[#71717a]">
                            {voiceTranscript}
                          </p>
                        ) : (
                          <p className="text-sm leading-5 text-[#71717a]">
                            <span className="font-bold">Pro tip:</span> Be
                            specific with your requests. Include colors,
                            sizes, spacing, and any other details to get the
                            best results.
                          </p>
                        )}
                      </div>
                    </div>

                    <img
                      src={talkToMeWatermarkSrc}
                      alt=""
                      className="pointer-events-none absolute  left-34 top-30 z-0 h-auto max-h-[72px] w-auto object-contain object-left-bottom "
                      aria-hidden
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (isRecording) stopRecording();
                        if (voiceTranscript.trim()) {
                          handleVoiceTranscript(voiceTranscript);
                        }
                      }}
                      disabled={isProcessing || !voiceTranscript.trim()}
                      className="absolute bottom-5 right-5 z-10 flex h-[42px] items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:bottom-6 sm:right-6"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Prompt</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Row 3: Dropzone */}
            {activeTab === "Dropzone" && (
              <div
                onDragOver={handleDropzoneDragOver}
                onDragEnter={handleDropzoneDragOver}
                onDragLeave={handleDropzoneDragLeave}
                onDrop={handleDropzoneDrop}
                className={`relative w-full overflow-hidden rounded-[10px] bg-[#f4f4f4] transition-colors ${
                  isDropzoneDragging ? "ring-2 ring-dashed ring-[#62748E]" : ""
                } ${
                  dropzoneGeneratingPrompt ||
                  (isProcessing && dropzoneFiles.length > 0)
                    ? "min-h-[254px] p-4"
                    : dropzoneFiles.length > 0
                      ? "min-h-[254px] px-4 pb-4 pt-4"
                      : "min-h-[254px] px-6 py-10 sm:px-12 sm:py-12"
                }`}
              >
                <img
                  src={talkToMeWatermarkSrc}
                  alt=""
                  className="pointer-events-none absolute bottom-2 left-1/2 z-0 h-auto max-h-[72px] w-full max-w-[1100px] -translate-x-1/2 object-contain opacity-[0.06] sm:bottom-3"
                  aria-hidden
                />

                {dropzoneGeneratingPrompt ||
                (isProcessing && dropzoneFiles.length > 0) ? (
                  <div className="relative z-10 flex min-h-[200px] flex-col gap-6 sm:flex-row sm:items-stretch sm:gap-0">
                    <div className="flex flex-1 flex-col justify-between gap-6 sm:pr-4">
                      <div className="flex flex-wrap gap-4">
                        {dropzoneFiles.map((item) => (
                          <div
                            key={item.id}
                            className="flex h-[58px] min-w-[200px] max-w-full items-center gap-3.5 rounded-md border border-[#e4e4e7] bg-white pl-6 pr-3 sm:min-w-[231px]"
                          >
                            {item.kind === "image" ? (
                              <ImageIcon className="h-5 w-5 shrink-0 text-[#18181b]" />
                            ) : item.kind === "video" ? (
                              <Video className="h-5 w-5 shrink-0 text-[#18181b]" />
                            ) : (
                              <FileText className="h-5 w-5 shrink-0 text-[#18181b]" />
                            )}
                            <span className="truncate text-base font-medium leading-5 text-[#18181b]">
                              {item.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDropzoneFile(item.id)}
                              disabled={isProcessing}
                              className="ml-auto shrink-0 rounded p-1 hover:bg-[#f4f4f4] disabled:opacity-50"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X className="h-4 w-4 text-[#71717a]" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleDropzoneGeneratePrompt}
                        disabled={isProcessing || dropzoneFiles.length === 0}
                        className="flex h-9 w-fit items-center gap-2 rounded-md bg-black px-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Generate Prompt
                      </button>
                    </div>
                    <div
                      className="hidden w-px shrink-0 bg-[#dcdfe5] sm:mx-4 sm:block sm:self-stretch"
                      aria-hidden
                    />
                    <div className="flex flex-1 flex-col gap-2 sm:pl-2">
                      <p className="text-base font-semibold text-black">
                        Generating Prompt....
                      </p>
                      <p className="max-h-[120px] overflow-y-auto whitespace-pre-wrap text-sm leading-5 text-[#71717a]">
                        {dropzoneGeneratingPrompt}
                      </p>
                    </div>
                  </div>
                ) : dropzoneFiles.length > 0 ? (
                  <div className="relative z-10 flex min-h-[180px] flex-col justify-between gap-10">
                    <div className="flex flex-wrap gap-4">
                      {dropzoneFiles.map((item) => (
                        <div
                          key={item.id}
                          className="flex h-[58px] min-w-[200px] max-w-full items-center gap-3.5 rounded-md border border-[#e4e4e7] bg-white pl-6 pr-3 sm:min-w-[231px]"
                        >
                          {item.kind === "image" ? (
                            <ImageIcon className="h-5 w-5 shrink-0 text-[#18181b]" />
                          ) : item.kind === "video" ? (
                            <Video className="h-5 w-5 shrink-0 text-[#18181b]" />
                          ) : (
                            <FileText className="h-5 w-5 shrink-0 text-[#18181b]" />
                          )}
                          <span className="truncate text-base font-medium leading-5 text-[#18181b]">
                            {item.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDropzoneFile(item.id)}
                            disabled={isProcessing}
                            className="ml-auto shrink-0 rounded p-1 hover:bg-[#f4f4f4] disabled:opacity-50"
                            aria-label={`Remove ${item.name}`}
                          >
                            <X className="h-4 w-4 text-[#71717a]" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleDropzoneGeneratePrompt}
                      disabled={isProcessing}
                      className="flex h-9 w-fit items-center gap-2 rounded-md bg-black px-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      Generate Prompt
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                    <div className="relative flex h-[40px] w-[29px] items-center justify-center">
                      <Image
                        src="/assets/icons/upload-logo.svg"
                        alt=""
                        width={29}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <p className="text-[10px] font-bold leading-[14px] text-[#18181b]">
                      Upload File
                    </p>
                    <p className="max-w-[468px] text-center text-xs leading-[18px] text-[#71717a]">
                      Videos must be less than{" "}
                      <span className="font-bold">30 MB</span> and photos must be
                      less than <span className="font-bold">2 MB</span> in size
                    </p>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                      <label
                        htmlFor={dropzoneFileInputId}
                        className={`flex h-9 cursor-pointer items-center gap-2 rounded-md border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#18181b] transition hover:bg-[#fafafa] ${
                          isProcessing
                            ? "pointer-events-none opacity-50"
                            : ""
                        }`}
                      >
                        <CloudUpload className="h-4 w-4" />
                        Click to upload
                      </label>
                      <button
                        type="button"
                        disabled
                        className="flex h-9 items-center gap-2 rounded-md border border-[#e4e4e7] bg-white px-3 text-sm font-medium text-[#18181b] opacity-60"
                        title="Coming soon"
                      >
                        <Plus className="h-4 w-4" />
                        Import from drive
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  id={dropzoneFileInputId}
                  name="dropzone-file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/*,.txt,.doc,.docx,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </div>
            )}

            {/* Row 3: Brief Me */}
            {activeTab === "Brief Me" && (
              <div className="relative w-full overflow-visible">
                <div className="relative z-10 space-y-3">
                  <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-4">
                    <div className="min-w-0">
                      <label className="mb-1 block text-sm font-semibold leading-5 text-[#18181b]">
                        Remove / Adjust
                      </label>
                      <input
                        type="text"
                        value={briefData.whatToDo}
                        onChange={(e) =>
                          setBriefData({
                            ...briefData,
                            whatToDo: e.target.value,
                          })
                        }
                        disabled={isProcessing}
                        placeholder="Describe what you want to create or modify..."
                        className={`box-border h-9 w-full min-w-0 rounded-md border border-[#e1e7ef] bg-[#f4f4f4] px-3 text-sm leading-5 text-[#18181b] placeholder:text-[#71717a] shadow-none focus:border-[#e1e7ef] disabled:cursor-not-allowed disabled:opacity-50 ${noFocusRing}`}
                      />
                    </div>

                    <div
                      className="hidden w-px shrink-0 bg-[#dcdfe5] lg:block lg:min-h-[36px] lg:self-stretch"
                      aria-hidden
                    />

                    <div className="min-w-0">
                      <label className="mb-1 block text-sm font-semibold leading-5 text-[#18181b]">
                        Add / Enhance
                      </label>
                      <input
                        type="text"
                        value={briefData.style}
                        onChange={(e) =>
                          setBriefData({ ...briefData, style: e.target.value })
                        }
                        disabled={isProcessing}
                        placeholder="Describe the style, tone, or aesthetic..."
                        className={`box-border h-9 w-full min-w-0 rounded-md border border-[#e1e7ef] bg-[#f4f4f4] px-3 text-sm leading-5 text-[#18181b] placeholder:text-[#71717a] shadow-none focus:border-[#e1e7ef] disabled:cursor-not-allowed disabled:opacity-50 ${noFocusRing}`}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-4">
                    <div className="min-w-0">
                      <p className="mb-1.5 text-sm font-semibold leading-5 text-[#18181b]">
                        Tone / Direction
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {BRIEF_TONE_TAGS.map((tag) => {
                          const selected = briefToneTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                toggleBriefTag(tag, setBriefToneTags)
                              }
                              className={`h-8 rounded-full border px-3 text-sm leading-5 transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 ${
                                selected
                                  ? "border-black bg-black text-white"
                                  : "border-black/10 bg-white text-[#0a0a0a] hover:bg-[#fafafa]"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className="hidden w-px shrink-0 bg-[#dcdfe5] lg:block lg:min-h-[32px] lg:self-stretch"
                      aria-hidden
                    />

                    <div className="min-w-0">
                      <p className="mb-1.5 text-sm font-semibold leading-5 text-[#18181b]">
                        Main Goal
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {BRIEF_GOAL_TAGS.map((tag) => {
                          const selected = briefGoalTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                toggleBriefTag(tag, setBriefGoalTags)
                              }
                              className={`h-8 rounded-full border px-3 text-sm font-medium leading-5 transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 ${
                                selected
                                  ? "border-black bg-black text-white"
                                  : "border-black/10 bg-white text-[#0a0a0a] hover:bg-[#fafafa]"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleBriefSubmit}
                      disabled={
                        isProcessing ||
                        (!briefData.whatToDo.trim() &&
                          !briefData.style.trim() &&
                          briefToneTags.length === 0 &&
                          briefGoalTags.length === 0)
                      }
                      className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-black px-3 text-sm font-medium tracking-[-0.15px] text-white transition-opacity hover:opacity-90 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Refine Document</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === "History" && (
          <div>
            {!history || history.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center w-full h-[140px] sm:h-[200px]"
                style={{
                  minHeight: "120px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.90)",
                  background: "rgba(255, 255, 255, 0.80)",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)",
                }}
              >
                <div
                  className="flex flex-col items-center justify-center"
                  style={{ gap: "10px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: "46px",
                      width: "44px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "16777200px",
                      background: "rgba(255, 255, 255, 0.70)",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M3 12C3 13.78 3.52784 15.5201 4.51677 17.0001C5.50571 18.4802 6.91131 19.6337 8.55585 20.3149C10.2004 20.9961 12.01 21.1743 13.7558 20.8271C15.5016 20.4798 17.1053 19.6226 18.364 18.364C19.6226 17.1053 20.4798 15.5016 20.8271 13.7558C21.1743 12.01 20.9961 10.2004 20.3149 8.55585C19.6337 6.91131 18.4802 5.50571 17.0001 4.51677C15.5201 3.52784 13.78 3 12 3C9.48395 3.00947 7.06897 3.99122 5.26 5.74L3 8"
                        stroke="#90A1B9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 3V8H8"
                        stroke="#90A1B9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 7V12L16 14"
                        stroke="#90A1B9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div
                    style={{
                      color: "#45556C",
                      textAlign: "center",
                      fontFamily: "Inter",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "16px",
                    }}
                  >
                    No history yet
                  </div>

                  <div
                    style={{
                      color: "#62748E",
                      textAlign: "center",
                      fontFamily: "Inter",
                      fontSize: "10px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "15px",
                      letterSpacing: "0.117px",
                    }}
                    className="mt-1 mb-3"
                  >
                    Your prompts will appear here
                  </div>

                  <button
                    className="
                      flex items-center gap-1.5
                      text-[#0A0A0A]
                      font-inter
                      text-[14px] font-medium
                      px-4 py-[7px]
                      transition-all
                      leading-[15px]
                      tracking-[0.117px]
                    "
                    onClick={() => setMode("Prompt Mode")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_10665_106407)">
                        <path
                          d="M7.34496 1.87581C7.37353 1.72287 7.45468 1.58475 7.57436 1.48535C7.69404 1.38595 7.84472 1.33154 8.00029 1.33154C8.15587 1.33154 8.30655 1.38595 8.42623 1.48535C8.54591 1.58475 8.62706 1.72287 8.65563 1.87581L9.35629 5.58114C9.40606 5.84457 9.53408 6.08688 9.72365 6.27645C9.91322 6.46602 10.1555 6.59404 10.419 6.64381L14.1243 7.34447C14.2772 7.37304 14.4154 7.45419 14.5147 7.57387C14.6141 7.69355 14.6686 7.84423 14.6686 7.99981C14.6686 8.15538 14.6141 8.30606 14.5147 8.42574C14.4154 8.54542 14.2772 8.62657 14.1243 8.65514L10.419 9.35581C10.1555 9.40557 9.91322 9.53359 9.72365 9.72316C9.53408 9.91273 9.40606 10.155 9.35629 10.4185L8.65563 14.1238C8.62706 14.2767 8.54591 14.4149 8.42623 14.5143C8.30655 14.6137 8.15587 14.6681 8.00029 14.6681C7.84472 14.6681 7.69404 14.6137 7.57436 14.5143C7.45468 14.4149 7.37353 14.2767 7.34496 14.1238L6.64429 10.4185C6.59453 10.155 6.46651 9.91273 6.27694 9.72316C6.08737 9.53359 5.84506 9.40557 5.58163 9.35581L1.87629 8.65514C1.72336 8.62657 1.58524 8.54542 1.48584 8.42574C1.38644 8.30606 1.33203 8.15538 1.33203 7.99981C1.33203 7.84423 1.38644 7.69355 1.48584 7.57387C1.58524 7.45419 1.72336 7.37304 1.87629 7.34447L5.58163 6.64381C5.84506 6.59404 6.08737 6.46602 6.27694 6.27645C6.46651 6.08688 6.59453 5.84457 6.64429 5.58114L7.34496 1.87581Z"
                          stroke="#0A0A0A"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.332 1.3335V4.00016"
                          stroke="#0A0A0A"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.6667 2.66666H12"
                          stroke="#0A0A0A"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.66536 14.6667C3.40174 14.6667 3.9987 14.0697 3.9987 13.3333C3.9987 12.597 3.40174 12 2.66536 12C1.92898 12 1.33203 12.597 1.33203 13.3333C1.33203 14.0697 1.92898 14.6667 2.66536 14.6667Z"
                          stroke="#0A0A0A"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_10665_106407">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    Back to Prompter
                  </button>
                </div>
              </div>
            ) : filteredHistory.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#71717a]">
                No prompts match your search.
              </p>
            ) : (
              <div className="flex max-h-[320px] flex-col gap-2 overflow-y-auto">
                {filteredHistory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleHistoryItemClick(item)}
                    className="flex h-9 w-full min-w-0 items-center gap-3 rounded-xl border border-[#e1e7ef] bg-white px-3 text-left transition-colors hover:bg-[#fafafa]"
                  >
                    <div className="relative h-[30px] w-[30px] shrink-0 rounded-full border border-[#e4e4e7] p-0.5 shadow-sm">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#18181b]">
                        <Image
                          src="/assets/icons/manifestr-icon.svg"
                          alt=""
                          width={12}
                          height={12}
                        />
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md bg-black px-2 py-0.5 text-xs font-medium text-white">
                      {item.type}
                    </span>
                    <span className="shrink-0 text-xs text-[#71717a]">
                      {item.timestamp}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm text-[#71717a]">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
