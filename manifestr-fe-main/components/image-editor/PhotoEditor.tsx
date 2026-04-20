import React, { useEffect, useState } from "react";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import { SidePanel, DEFAULT_SECTIONS } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { observer } from "mobx-react-lite";

import { Button } from "@blueprintjs/core";

import EditorBottomToolbar from "../editor/EditorBottomToolbar";
import ToolPanel from "../editor/panels/image-editor/ToolPanel";

interface PhotoEditorProps {
  imageSrc?: string;
  onStoreReady?: (store: any) => void;
}

const sections = DEFAULT_SECTIONS.filter(
  (section) =>
    section.name !== "pages" &&
    section.name !== "templates" &&
    section.name !== "videos",
);

const EditorUI = observer(({ store }: { store: any }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#e7e7e7]">
      {/* TOP CENTER TOGGLE */}
      {/* <div className="flex justify-center pt-4">
        <div className="bg-white rounded-full shadow-sm p-1 flex gap-1">
          <button className="px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium">
            Image
          </button>
          <button className="px-4 py-1.5 rounded-full text-sm text-gray-500">
            Video
          </button>
        </div>
      </div> */}

      {/* CANVAS AREA */}
      <div className="flex-grow flex items-center justify-center relative  overflow-hidden">
        <Workspace store={store} pageControlsEnabled={false} />
      </div>
    </div>
  );
});

export default function PhotoEditor({
  imageSrc = "/assets/dummy/dummy-trainer.jpg",
  onStoreReady,
}: PhotoEditorProps) {
  const [store] = useState(() =>
    createStore({
      key: "ftRB7anj9zd88zwAlJKy",
      showCredit: false,
    }),
  );

  useEffect(() => {
    if (onStoreReady && store) {
      onStoreReady(store);
    }
  }, [store, onStoreReady]);

  useEffect(() => {
    console.log(
      "🖼️ PhotoEditor: Loading image:",
      imageSrc?.substring(0, 80) + "...",
    );

    // Ensure a page exists
    if (store.pages.length === 0) {
      store.addPage();
    }

    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Allow CORS for external images
      img.src = imageSrc;

      img.onload = () => {
        console.log(
          "✅ Image loaded successfully! Size:",
          img.width,
          "x",
          img.height,
        );

        // Set workspace size to match the image
        store.setSize(img.width, img.height);

        // Clear any existing elements on the active page
        const page = store.activePage;
        if (page) {
          // Clear all existing elements (Polotno stores children in a MobX array)
          page.set({ children: [] });

          // Add the image as a new element
          page.addElement({
            type: "image",
            src: imageSrc,
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
            selectable: true,
            draggable: true,
            alwaysOnTop: false,
            name: "base-image",
          });

          console.log(" Image added to Polotno canvas");
        }
      };

      img.onerror = (err) => {
        console.error(" Failed to load image:", imageSrc, err);
      };
    }
  }, [imageSrc, store]);

  const [activeTool, setActiveTool] = useState<
    | "ai_prompter"
    | "format"
    | "adjust"
    | "text"
    | "color"
    | "effects"
    | "filters"
    | "insert"
  >("insert");

  return (
    <div className="w-full h-full bg-[#f3f4f6] flex flex-col relative">
      <div className="flex-1 flex overflow-hidden">
        <EditorUI store={store} />
      </div>
      {/* BOTTOM TOOLBAR */}

      

      {/* TOP PANELS (except AI Prompter) */}
      {activeTool !== "ai_prompter" && (
        <ToolPanel activeTool={activeTool} store={store} />
      )}

      <EditorBottomToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        editorType="image"
      />

      {/* AI PROMPTER BELOW TOOLBAR */}
      {activeTool === "ai_prompter" && (
        <ToolPanel activeTool={activeTool} store={store} />
      )}
    </div>
  );
}
