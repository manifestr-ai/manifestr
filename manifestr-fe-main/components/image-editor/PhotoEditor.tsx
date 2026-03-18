import React, { useEffect, useState } from "react";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import { SidePanel, DEFAULT_SECTIONS } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { observer } from "mobx-react-lite";

import { Button } from "@blueprintjs/core";

interface PhotoEditorProps {
  imageSrc?: string;
}

const sections = DEFAULT_SECTIONS.filter(
  (section) =>
    section.name !== "pages" &&
    section.name !== "templates" &&
    section.name !== "videos",
);

const EditorUI = observer(({ store }: { store: any }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="h-auto">
        <Toolbar store={store} />
      </div>
      <div className="flex flex-row h-full w-full overflow-hidden">
        <div
          className="flex-none h-full"
          style={{ width: "400px", display: "flex", flexDirection: "column" }}
        >
          <SidePanel
            store={store}
            sections={sections}
            defaultSection="photos"
          />
        </div>
        <div className="flex-grow h-full relative relative-app-workspace bg-gray-100">
          <Workspace store={store} pageControlsEnabled={false} />
          <ZoomButtons store={store} />
          <div className="absolute top-4 right-20 z-10">
            <Button
              className="!bg-gray-900 !text-white !border-none hover:!bg-gray-800"
              onClick={() => {
                store.saveAsImage({ fileName: "manifestr-edit.png" });
              }}
            >
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function PhotoEditor({
  imageSrc = "/assets/dummy/dummy-trainer.jpg",
}: PhotoEditorProps) {
  const [store] = useState(() =>
    createStore({
      key: "ftRB7anj9zd88zwAlJKy",
      showCredit: false,
    }),
  );

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

  return (
    <div className="w-full h-full bg-white relative">
      <EditorUI store={store} />
    </div>
  );
}
