import React, { useState } from "react";
import { Palette, Sparkles, Upload, FileText } from "lucide-react";
import StyleGuideModal from "../../StyleGuideModal";
import { EditorType } from "../../../../hooks/useStyleGuideApplier";
import { useToast } from "../../../ui/Toast";
import api from "../../../../lib/api";

interface InsertThemePanelProps {
  editorType: EditorType;
  store?: any;
  editor?: any;
}

export default function InsertThemePanel({
  editorType,
  store,
  editor,
}: InsertThemePanelProps) {
  const [showStyleGuideModal, setShowStyleGuideModal] = useState(false);
  const { success } = useToast();

  const handleSelectStyleGuide = async (styleGuide: any) => {
    console.log(" Regenerating content with style guide:", styleGuide);

    const brandName = styleGuide.brand_name || styleGuide.name;

    try {
      setShowStyleGuideModal(false);
      success(
        `Preparing to apply "${brandName}" theme to your ${editorType}...`,
      );

      // Different API endpoints for different editor types
      let endpoint = "";
      let payload: any = {
        styleGuideId: styleGuide.id,
        styleGuide: {
          colors: styleGuide.colors,
          typography: styleGuide.typography,
          brandName: brandName,
          logo: styleGuide.logo,
        },
        meta: {
          editorType,
          applyStyleGuide: true,
        },
      };

      if (editorType === "document") {
        success(`Capturing current document content...`);
        endpoint = "/document-generator/modify";
        payload.prompt = `Redesign this document with brand style guide: ${brandName}`;
        payload.documentData =
          editor?.getHTML() || "<p>Professional Document</p>";
      } else if (editorType === "image") {
        success(`Capturing current image...`);
        endpoint = "/image-generator/modify";
        payload.prompt = `Apply brand style guide: ${brandName}`;
        // toDataURL returns a Promise, so we need to await it
        payload.imageUrl = store?.toDataURL ? await store.toDataURL() : "";
      }

      if (endpoint) {
        success(`Regenerating ${editorType} with "${brandName}" theme... Please wait, this may take a moment.`);
        const response = await api.post(endpoint, payload);

        if (response.data?.data) {
          console.log(" Content regenerated, reloading...");
          success(`Applying new theme to your ${editorType}...`);

          if (
            editorType === "document" &&
            response.data.data.documentData &&
            editor
          ) {
            editor.commands.setContent(response.data.data.documentData);
            success(
              `Document regenerated with "${brandName}" theme successfully!`,
            );
          } else if (
            editorType === "image" &&
            response.data.data.imageUrl &&
            store
          ) {
            // Load new image into Polotno
            const img = store.pages[0].children.find(
              (c: any) => c.type === "image",
            );
            if (img) {
              img.src = response.data.data.imageUrl;
            }
            success(
              `Image regenerated with "${brandName}" theme successfully!`,
            );
          } else {
            success(`${editorType.charAt(0).toUpperCase() + editorType.slice(1)} regenerated successfully!`);
            // Force page reload
            setTimeout(() => window.location.reload(), 1000);
          }
        }
      } else {
        success(
          `Style guide "${brandName}" selected. Full regeneration coming soon!`,
        );
      }
    } catch (error: any) {
      console.error("❌ Failed to regenerate:", error);
      success(
        `Failed to apply style guide: ${error?.response?.data?.message || error?.message || "Unknown error"}`,
      );
    }
  };

  const handleOpenStyleGuides = () => {
    setShowStyleGuideModal(true);
  };

  const handleCreateStyleGuide = () => {
    window.open("/create-style-guide", "_blank");
  };

  const handleBrowseStyleGuides = () => {
    window.open("/style-guide", "_blank");
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Insert Theme
          </h2>
          <p className="text-sm text-gray-600">
            Apply your brand style guide to this {editorType}
          </p>
        </div>

        {/* Main Actions */}
        <div className="space-y-4">
          {/* Apply Existing Style Guide */}
          <button
            onClick={handleOpenStyleGuides}
            className="w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 rounded-xl transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Apply Style Guide
                </h3>
                <p className="text-sm text-gray-600">
                  Choose from your saved brand style guides to instantly theme
                  your content
                </p>
              </div>
            </div>
          </button>

          {/* Create New Style Guide */}
          <button
            onClick={handleCreateStyleGuide}
            className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 rounded-xl transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Create New Style Guide
                </h3>
                <p className="text-sm text-gray-600">
                  Build a new brand style guide with colors, fonts, and logos
                </p>
              </div>
            </div>
          </button>

          {/* Browse All Style Guides */}
          <button
            onClick={handleBrowseStyleGuides}
            className="w-full p-6 bg-gradient-to-br from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-2 border-gray-200 rounded-xl transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-600 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Manage Style Guides
                </h3>
                <p className="text-sm text-gray-600">
                  View, edit, and organize all your brand style guides
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            What's a Style Guide?
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            A style guide defines your brand's visual identity including:
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>• Color palettes and brand colors</li>
            <li>• Typography and font families</li>
            <li>• Logos and visual assets</li>
            <li>• Brand tone and messaging style</li>
          </ul>
          <p className="text-sm text-gray-700 mt-3">
            Apply a style guide to ensure all your content stays on-brand!
          </p>
        </div>
      </div>

      {/* Style Guide Selection Modal */}
      <StyleGuideModal
        isOpen={showStyleGuideModal}
        onClose={() => setShowStyleGuideModal(false)}
        onSelect={handleSelectStyleGuide}
        editorType={editorType}
      />
    </div>
  );
}
