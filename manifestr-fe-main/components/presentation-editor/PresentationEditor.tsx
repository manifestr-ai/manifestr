import React, { useState, useEffect } from "react";
import { createStore } from "polotno/model/store";
import { Workspace } from "polotno/canvas/workspace";
import { SidePanel } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { PagesTimeline } from "polotno/pages-timeline";
import { observer } from "mobx-react-lite";
import { Button, Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import pptxgen from "pptxgenjs";
import api from "../../lib/api";
import deck1 from "../../assets/decks/Deck.1.polotno.json";
import deck2 from "../../assets/decks/Deck.2.polotno.json";
import deck5 from "../../assets/decks/Deck.5.poltno.json";
import deck6 from "../../assets/decks/Deck.6.polotno.json";
import deck7 from "../../assets/decks/Deck.7.poltno.json";
import deck8 from "../../assets/decks/Deck.8.polotno.json";
import deck11 from "../../assets/decks/Deck.11.poltno.json";
import deck15 from "../../assets/decks/Deck.15.polotno.json";

// Must match the order in PresentationEngine.ts on the backend
const ALL_DECKS = [deck1, deck2, deck5, deck6, deck7, deck8, deck11, deck15];

// Same deterministic hash as the backend so previewing without AI content
// always shows the same template as the backend would pick.
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickFallbackDeck(): any {
  // Use the URL query param (project id) as the seed so the same project
  // always shows the same placeholder template — no randomness ever.
  const seed =
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("id")) ||
    "default";
  return ALL_DECKS[hashString(seed) % ALL_DECKS.length];
}

const EditorUI = observer(({ store }: { store: any }) => {
  
  const handleDownloadPPTX = async () => {
    try {
        const pptx = new pptxgen();
        
        // Define Layout based on Polotno size (px -> inches)
        // 96 DPI is standard for web, PPTX defaults to inches
        const widthInch = store.width / 96;
        const heightInch = store.height / 96;
        
        pptx.defineLayout({ name: 'CUSTOM', width: widthInch, height: heightInch });
        pptx.layout = 'CUSTOM';

        // Iterate Pages - Render each as an image to preserve 100% visual fidelity
        // This ensures all styling, fonts, shadows, and complex layouts match the PDF exactly.
        for (const page of store.pages) {
            const slide = pptx.addSlide();
            
            // Generate High-Res Image of the slide
            // pixelRatio: 2 ensures text stays crisp
            const dataUrl = await store.toDataURL({ pageId: page.id, pixelRatio: 2 });
            
            slide.addImage({
                data: dataUrl,
                x: 0,
                y: 0,
                w: widthInch,
                h: heightInch
            });
        }

        pptx.writeFile({ fileName: "presentation.pptx" });
    } catch (err) {
        console.error("Failed to generate PPTX:", err);
        alert("Failed to generate PowerPoint. Please try PDF instead.");
    }
  };

  const downloadMenu = (
    <Menu>
        <MenuItem 
            icon="document" 
            text="Download PDF" 
            onClick={() => store.saveAsPDF({ fileName: "presentation.pdf" })} 
        />
        <MenuItem 
            icon="presentation" 
            text="Download PPTX (Beta)" 
            onClick={handleDownloadPPTX} 
        />
    </Menu>
  );

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
          <SidePanel store={store} />
        </div>
        <div className="flex-grow h-full relative relative-app-workspace bg-gray-100 flex flex-col">
          <Workspace store={store} />
          <ZoomButtons store={store} />
          <div className="absolute top-4 right-20 z-10">
            <Popover content={downloadMenu} position={Position.BOTTOM_RIGHT}>
                <Button
                    className="!bg-gray-900 !text-white !border-none hover:!bg-gray-800"
                    rightIcon="caret-down"
                >
                    Download
                </Button>
            </Popover>
          </div>
        </div>
      </div>
      {/* Pages Timeline at the bottom for multi-page navigation */}
      <div className="h-auto bg-white border-t border-gray-200">
        <PagesTimeline store={store} />
      </div>
    </div>
  );
});

export default function PresentationEditor({
  data,
  generationId,
  onStoreReady,
  onActiveToolChange,
}: {
  data?: any;
  generationId?: string;
  onStoreReady?: (store: any) => void;
  onActiveToolChange?: (tool: string | null) => void;
}) {
  const [store] = useState(() => {
    const s = createStore({
      key: "ftRB7anj9zd88zwAlJKy",
      showCredit: false,
    });

    // AI-generated content → load it exactly as-is.
    // No data → pick the deterministic fallback for this project ID.
    const deck =
      data && Array.isArray(data.pages) && data.pages.length > 0
        ? data
        : pickFallbackDeck();

    try {
      s.loadJSON(deck);
    } catch {
      s.addPage();
    }

    return s;
  });

  useEffect(() => {
    onStoreReady?.(store);
  }, [store, onStoreReady]);

  // Auto-save Logic
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");

  useEffect(() => {
    if (!generationId) return;

    let timeout: any;

    const save = async () => {
      setSaveStatus("saving");
      try {
        const json = store.toJSON();
        await api.patch(`/ai/generation/${generationId}`, { content: json });
        setSaveStatus("saved");
        console.log("Auto-saved presentation");
      } catch (e) {
        console.error("Auto-save failed:", e);
        setSaveStatus("error");
      }
    };

    const unsubscribe = store.on("change", () => {
      if (timeout) clearTimeout(timeout);
      setSaveStatus("saving"); // Show saving immediately on change
      timeout = setTimeout(save, 2000); // 2 seconds debounce
    });

    return () => {
      unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, [store, generationId]);

  return (
    <div className="w-full h-full bg-white relative">
      <div className="absolute top-4 right-[200px] z-10 flex gap-2">
        <div className="pointer-events-none flex items-center">
            {saveStatus === "saving" && <span className="text-gray-500 text-sm bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-gray-200 font-medium">Saving...</span>}
            {saveStatus === "saved" && <span className="text-green-600 text-sm bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-gray-200 font-medium flex items-center gap-1">✓ Saved</span>}
            {saveStatus === "error" && <span className="text-red-500 text-sm bg-white/90 px-3 py-1.5 rounded-md shadow-sm border border-gray-200 font-medium">Save Failed</span>}
        </div>
      </div>
      <EditorUI store={store} />
    </div>
  );
}
