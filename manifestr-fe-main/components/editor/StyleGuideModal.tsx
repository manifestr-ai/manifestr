import React, { useState, useEffect } from 'react';
import { X, Check, Palette } from 'lucide-react';
import { listStyleGuides, getStyleGuideDetails } from '../../services/style-guide';

interface StyleGuide {
  id: string;
  name: string;
  brand_name?: string;
  logo?: any;
  colors?: any;
  typography?: any;
  style?: any;
  thumbnail_url?: string;
  is_completed: boolean;
}

interface StyleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (styleGuide: any) => void;
  editorType: 'document' | 'presentation' | 'spreadsheet' | 'image' | 'chart';
}

export default function StyleGuideModal({ isOpen, onClose, onSelect, editorType }: StyleGuideModalProps) {
  const [styleGuides, setStyleGuides] = useState<StyleGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  // Same gradients as style guide page
  const gradients = [
    'linear-gradient(135deg, #DC2626 0%, #18181b 100%)',
    'linear-gradient(135deg, #16A34A 0%, #18181b 100%)',
    'linear-gradient(135deg, #2563EB 0%, #18181b 100%)',
    'linear-gradient(135deg, #9333EA 0%, #18181b 100%)',
    'linear-gradient(135deg, #EA580C 0%, #92400E 0%, #18181b 100%)',
    'linear-gradient(135deg, #EC4899 0%, #BE185D 0%, #18181b 100%)',
  ];

  useEffect(() => {
    if (isOpen) {
      fetchStyleGuides();
    }
  }, [isOpen]);

  const fetchStyleGuides = async () => {
    try {
      setIsLoading(true);
      const response = await listStyleGuides();
      setStyleGuides(response.data || []);
    } catch (error) {
      console.error('Failed to fetch style guides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGuide = async (guide: StyleGuide) => {
    try {
      setSelectedGuideId(guide.id);
      
      // Fetch full style guide details
      const response = await getStyleGuideDetails(guide.id);
      const fullGuide = response.data;
      
      // Pass to parent with full data
      onSelect(fullGuide);
      onClose();
    } catch (error) {
      console.error('Failed to fetch style guide details:', error);
      alert('Failed to load style guide. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Palette className="w-6 h-6 text-blue-600" />
              Insert Theme
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a style guide to regenerate your {editorType} with brand styling
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ⚡ This will regenerate the content using AI with your selected brand guidelines
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : styleGuides.length === 0 ? (
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Style Guides Yet</h3>
              <p className="text-gray-600 mb-4">Create your first style guide to get started</p>
              <button
                onClick={() => window.location.href = '/create-style-guide'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Style Guide
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {styleGuides.map((guide) => {
                const displayName = guide.brand_name || guide.name || 'Untitled Style Guide';
                const logoCount = (guide.logo?.logos || []).length;
                const colorCount = (guide.colors?.selected || []).length + (guide.colors?.custom || []).length;
                
                return (
                  <div
                    key={guide.id}
                    onClick={() => handleSelectGuide(guide)}
                    className={`
                      relative rounded-2xl cursor-pointer transition-all hover:shadow-2xl hover:scale-105
                      overflow-hidden h-[180px] p-6 flex flex-col justify-between
                      ${selectedGuideId === guide.id ? 'ring-4 ring-blue-500 ring-offset-2' : ''}
                    `}
                    style={{ 
                      background: gradients[styleGuides.indexOf(guide) % gradients.length]
                    }}
                  >
                    {/* Top Section */}
                    <div>
                      <p className="text-sm text-white/80 mb-2">
                        {guide.is_completed ? '✓ Completed' : 'In Progress'}
                      </p>
                      <h3 className="text-2xl font-bold text-white mb-1 truncate">
                        {displayName}
                      </h3>
                      <p className="text-sm text-white/90">
                        {[
                          logoCount > 0 && `${logoCount} Logo${logoCount !== 1 ? 's' : ''}`,
                          colorCount > 0 && `${colorCount} Color${colorCount !== 1 ? 's' : ''}`,
                          guide.typography && 'Typography'
                        ].filter(Boolean).join(' • ')}
                      </p>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-end justify-between">
                      <p className="text-xs text-white/70">
                        0 Projects
                      </p>
                      {selectedGuideId === guide.id && (
                        <div className="bg-white rounded-full p-1">
                          <Check className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => window.location.href = '/create-style-guide'}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Create New Style Guide
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
