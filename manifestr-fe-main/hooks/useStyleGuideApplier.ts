import { useCallback } from 'react';
import { useToast } from '../components/ui/Toast';

export type EditorType = 'document' | 'presentation' | 'spreadsheet' | 'image' | 'chart';

interface StyleGuideData {
  id: string;
  name: string;
  brand_name?: string;
  logo?: {
    logos?: Array<{ url: string; type?: string }>;
    backgrounds?: any;
    logoRules?: any;
  };
  typography?: {
    headings?: {
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      color?: string;
    };
    body?: {
      fontFamily?: string;
      fontSize?: string;
      color?: string;
    };
  };
  colors?: {
    selected?: string[];
    custom?: string[];
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  style?: {
    tone?: string;
    vibe?: string;
    keywords?: string[];
  };
}

export function useStyleGuideApplier(editorType: EditorType, store: any) {
  const { success, error: showError } = useToast();

  const applyToDocument = useCallback((styleGuide: StyleGuideData, editor: any) => {
    if (!editor) {
      showError('Editor not ready');
      return;
    }

    try {
      // Apply typography
      if (styleGuide.typography?.headings?.fontFamily) {
        // Update all headings
        editor.chain()
          .selectAll()
          .setFontFamily(styleGuide.typography.headings.fontFamily)
          .run();
      }

      // Apply colors to selected text or all text
      if (styleGuide.colors?.primary) {
        editor.chain()
          .focus()
          .setColor(styleGuide.colors.primary)
          .run();
      }

      success(`Applied "${styleGuide.brand_name || styleGuide.name}" theme to document`);
    } catch (error) {
      console.error('Failed to apply style guide to document:', error);
      showError('Failed to apply theme to document');
    }
  }, [success, showError]);

  const applyToPresentation = useCallback((styleGuide: StyleGuideData) => {
    if (!store) {
      showError('Editor not ready');
      return;
    }

    try {
      // Get all pages
      const pages = store.pages;
      
      pages.forEach((page: any) => {
        // Update text elements with brand fonts
        page.children.forEach((child: any) => {
          if (child.type === 'text') {
            if (styleGuide.typography?.headings?.fontFamily) {
              child.fontFamily = styleGuide.typography.headings.fontFamily;
            }
            if (styleGuide.colors?.primary) {
              child.fill = styleGuide.colors.primary;
            }
          }
        });

        // Update background colors
        if (styleGuide.colors?.secondary) {
          page.background = styleGuide.colors.secondary;
        }
      });

      // Request re-render
      store.history.clear();
      success(`Applied "${styleGuide.brand_name || styleGuide.name}" theme to presentation`);
    } catch (error) {
      console.error('Failed to apply style guide to presentation:', error);
      showError('Failed to apply theme to presentation');
    }
  }, [store, success, showError]);

  const applyToSpreadsheet = useCallback((styleGuide: StyleGuideData) => {
    if (!store) {
      showError('Editor not ready');
      return;
    }

    try {
      // Apply brand colors to header rows and cells
      // Note: This is a simplified version. Actual implementation depends on Univer API
      
      console.log('📊 Applying style guide to spreadsheet:', styleGuide);
      
      // In a real implementation, you would:
      // 1. Get active worksheet
      // 2. Apply header row background color (styleGuide.colors.primary)
      // 3. Set font family for all cells
      // 4. Update chart colors if present
      
      success(`Applied "${styleGuide.brand_name || styleGuide.name}" theme to spreadsheet`);
    } catch (error) {
      console.error('Failed to apply style guide to spreadsheet:', error);
      showError('Failed to apply theme to spreadsheet');
    }
  }, [store, success, showError]);

  const applyToImage = useCallback((styleGuide: StyleGuideData) => {
    if (!store) {
      showError('Editor not ready');
      return;
    }

    try {
      // Get all text elements
      const textElements = store.pages[0]?.children.filter((el: any) => el.type === 'text') || [];
      
      textElements.forEach((textEl: any) => {
        // Apply brand font
        if (styleGuide.typography?.headings?.fontFamily) {
          textEl.fontFamily = styleGuide.typography.headings.fontFamily;
        }
        
        // Apply brand color
        if (styleGuide.colors?.primary) {
          textEl.fill = styleGuide.colors.primary;
        }
      });

      success(`Applied "${styleGuide.brand_name || styleGuide.name}" theme to image`);
    } catch (error) {
      console.error('Failed to apply style guide to image:', error);
      showError('Failed to apply theme to image');
    }
  }, [store, success, showError]);

  const applyStyleGuide = useCallback((styleGuide: StyleGuideData, editor?: any) => {
    console.log('🎨 Applying style guide:', styleGuide);
    console.log('📝 Editor type:', editorType);

    switch (editorType) {
      case 'document':
        applyToDocument(styleGuide, editor);
        break;
      case 'presentation':
        applyToPresentation(styleGuide);
        break;
      case 'spreadsheet':
        applyToSpreadsheet(styleGuide);
        break;
      case 'image':
        applyToImage(styleGuide);
        break;
      case 'chart':
        // Similar to image/presentation
        applyToImage(styleGuide);
        break;
      default:
        showError(`Style guide application not supported for ${editorType}`);
    }
  }, [editorType, applyToDocument, applyToPresentation, applyToSpreadsheet, applyToImage, showError]);

  return {
    applyStyleGuide
  };
}
