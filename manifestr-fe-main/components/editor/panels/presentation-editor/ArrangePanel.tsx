import React from "react";

interface ArrangePanelProps {
  store: any;
}

export default function ArrangePanel({ store }: ArrangePanelProps) {
  const selected = store.selectedElements;
  const page = store.activePage;

  if (!selected || selected.length === 0) {
    return (
      <div className="h-[90px] flex items-center justify-center text-gray-400 text-sm">
        Select an element to arrange
      </div>
    );
  }

  // 🔥 LAYER CONTROLS (FIXED)
  const bringForward = () => {
    selected.forEach((el: any) => {
      if (el.moveUp) el.moveUp();
    });
  };
  
  const sendBackward = () => {
    selected.forEach((el: any) => {
      if (el.moveDown) el.moveDown();
    });
  };

  const bringToFront = () => {
    const newElements: any[] = [];
  
    selected.forEach((el: any) => {
      newElements.push(el.toJSON());
    });
  
    // delete old
    store.deleteElements(selected);
  
    // re-add (goes to top)
    newElements.forEach((json) => {
      store.activePage.addElement(json);
    });
  };

  const sendToBack = () => {
    const newElements: any[] = [];
  
    selected.forEach((el: any) => {
      newElements.push(el.toJSON());
    });
  
    // delete old
    store.deleteElements(selected);
  
    // re-add at beginning
    const existing = store.activePage.children.slice();
  
    store.activePage.set({
      children: [
        ...newElements.map((json) => store.activePage.addElement(json)),
        ...existing,
      ],
    });
  };
  // 🔥 ALIGNMENT (MULTI-SELECT SAFE)
  const align = (type: string) => {
    if (!page) return;

    const minX = Math.min(...selected.map((el: any) => el.x));
    const maxX = Math.max(...selected.map((el: any) => el.x + el.width));

    const minY = Math.min(...selected.map((el: any) => el.y));
    const maxY = Math.max(...selected.map((el: any) => el.y + el.height));

    selected.forEach((el: any) => {
      if (type === "left") el.set({ x: minX });
      if (type === "center")
        el.set({ x: (minX + maxX) / 2 - el.width / 2 });
      if (type === "right") el.set({ x: maxX - el.width });

      if (type === "top") el.set({ y: minY });
      if (type === "middle")
        el.set({ y: (minY + maxY) / 2 - el.height / 2 });
      if (type === "bottom") el.set({ y: maxY - el.height });
    });
  };

  return (
    <div className="h-[90px] bg-white border-b flex items-center px-6 gap-10">

      {/* Layer Controls */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Layer</span>

        <div className="flex gap-2">
          <button onClick={bringForward} className="px-2 py-1 border rounded">
            ↑
          </button>
          <button onClick={sendBackward} className="px-2 py-1 border rounded">
            ↓
          </button>
          <button onClick={bringToFront} className="px-2 py-1 border rounded">
            Top
          </button>
          <button onClick={sendToBack} className="px-2 py-1 border rounded">
            Bottom
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Horizontal Align */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Horizontal</span>

        <div className="flex gap-2">
          <button onClick={() => align("left")} className="px-2 py-1 border rounded">
            L
          </button>
          <button onClick={() => align("center")} className="px-2 py-1 border rounded">
            C
          </button>
          <button onClick={() => align("right")} className="px-2 py-1 border rounded">
            R
          </button>
        </div>
      </div>

      {/* Vertical Align */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Vertical</span>

        <div className="flex gap-2">
          <button onClick={() => align("top")} className="px-2 py-1 border rounded">
            T
          </button>
          <button onClick={() => align("middle")} className="px-2 py-1 border rounded">
            M
          </button>
          <button onClick={() => align("bottom")} className="px-2 py-1 border rounded">
            B
          </button>
        </div>
      </div>
    </div>
  );
}