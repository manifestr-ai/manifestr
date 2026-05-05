import { observer } from "mobx-react-lite";
import { Popover, Position } from "@blueprintjs/core";

interface LayoutPanelProps {
  store: any;
}

export default observer(function LayoutPanel({ store }: LayoutPanelProps) {
  const page = store.activePage;

  if (!page) {
    return (
      <div className="h-[102px] flex items-center justify-center text-gray-400 text-sm">
        No slide selected
      </div>
    );
  }

  const clearPageElements = (targetPage: any) => {
    const children = targetPage?.children;
    if (!Array.isArray(children)) return;
    children.slice().forEach((el: any) => {
      if (typeof el?.remove === "function") el.remove();
    });
  };

  const promptForImage = (onPick: (src: string) => void) => {
    if (typeof window === "undefined") return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (src) onPick(src);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const setSlideSize = (newWidth: number, newHeight: number) => {
    const oldWidth = store.width;
    const oldHeight = store.height;
    if (
      typeof store.setSize !== "function" ||
      typeof oldWidth !== "number" ||
      typeof oldHeight !== "number" ||
      oldWidth <= 0 ||
      oldHeight <= 0
    ) {
      store.setSize?.(newWidth, newHeight);
      return;
    }

    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;
    const textScale = Math.min(scaleX, scaleY);

    (store.pages || []).forEach((p: any) => {
      const children = Array.isArray(p?.children) ? p.children : [];
      children.forEach((el: any) => {
        if (!el?.set) return;
        const next: any = {
          x: Math.round((el.x || 0) * scaleX),
          y: Math.round((el.y || 0) * scaleY),
          width: Math.round((el.width || 0) * scaleX),
          height: Math.round((el.height || 0) * scaleY),
        };
        if (el.type === "text") {
          if (typeof el.fontSize === "number") {
            next.fontSize = Math.max(8, Math.round(el.fontSize * textScale));
          }
          if (typeof el.strokeWidth === "number") {
            next.strokeWidth = el.strokeWidth * textScale;
          }
        }
        el.set(next);
      });
    });

    store.setSize(newWidth, newHeight);
  };

  const isLandscape =
    typeof store.width === "number" &&
    typeof store.height === "number" &&
    store.width >= store.height;

  const applyLayout = (layoutKey: string) => {
    const targetPage = store.activePage;
    if (!targetPage) return;

    const hasContent =
      Array.isArray(targetPage.children) && targetPage.children.length > 0;
    if (hasContent) {
      const shouldReplace = window.confirm(
        "Applying a layout will replace current slide contents. Continue?",
      );
      if (!shouldReplace) return;
    }

    clearPageElements(targetPage);
    if (targetPage.set) targetPage.set({ layout: layoutKey });

    const w = store.width || 1920;
    const h = store.height || 1080;
    const padX = Math.round(w * 0.1);

    if (layoutKey === "blank") return;

    if (layoutKey === "title") {
      targetPage.addElement({
        type: "text",
        text: "Title",
        x: padX,
        y: Math.round(h * 0.18),
        width: Math.round(w * 0.8),
        fontSize: 64,
        fontFamily: "Inter",
        fontWeight: "bold",
        fill: "#111827",
        align: "left",
      });
      targetPage.addElement({
        type: "text",
        text: "Subtitle",
        x: padX,
        y: Math.round(h * 0.32),
        width: Math.round(w * 0.8),
        fontSize: 28,
        fontFamily: "Inter",
        fontWeight: "400",
        fill: "#4B5563",
        align: "left",
      });
      return;
    }

    if (layoutKey === "title_tagline") {
      targetPage.addElement({
        type: "text",
        text: "Title",
        x: padX,
        y: Math.round(h * 0.18),
        width: Math.round(w * 0.8),
        fontSize: 60,
        fontFamily: "Inter",
        fontWeight: "bold",
        fill: "#111827",
      });
      targetPage.addElement({
        type: "text",
        text: "Tagline",
        x: padX,
        y: Math.round(h * 0.32),
        width: Math.round(w * 0.8),
        fontSize: 24,
        fontFamily: "Inter",
        fontWeight: "400",
        fill: "#6B7280",
      });
      return;
    }

    if (layoutKey === "title_content") {
      targetPage.addElement({
        type: "text",
        text: "Title",
        x: padX,
        y: Math.round(h * 0.10),
        width: Math.round(w * 0.8),
        fontSize: 52,
        fontFamily: "Inter",
        fontWeight: "bold",
        fill: "#111827",
      });
      targetPage.addElement({
        type: "text",
        text: "• Bullet 1\n• Bullet 2\n• Bullet 3",
        x: padX,
        y: Math.round(h * 0.26),
        width: Math.round(w * 0.55),
        fontSize: 28,
        fontFamily: "Inter",
        fontWeight: "400",
        fill: "#111827",
        lineHeight: 1.3,
      });
      return;
    }

    if (layoutKey === "title_image") {
      targetPage.addElement({
        type: "text",
        text: "Title",
        x: padX,
        y: Math.round(h * 0.10),
        width: Math.round(w * 0.8),
        fontSize: 52,
        fontFamily: "Inter",
        fontWeight: "bold",
        fill: "#111827",
      });
      const image = targetPage.addElement({
        type: "image",
        src: "https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749269/Frame_2147229988_oveeki.png",
        x: padX,
        y: Math.round(h * 0.24),
        width: Math.round(w * 0.8),
        height: Math.round(h * 0.60),
        name: "layout-image",
      });
      if (image?.set) {
        store.selectElements?.([image]);
        promptForImage((src) => image.set({ src }));
      }
      return;
    }

    if (layoutKey === "two_content") {
      const gap = Math.round(w * 0.04);
      const colW = Math.round((w - padX * 2 - gap) / 2);
      const topY = Math.round(h * 0.22);
      targetPage.addElement({
        type: "text",
        text: "Title",
        x: padX,
        y: Math.round(h * 0.10),
        width: Math.round(w * 0.8),
        fontSize: 52,
        fontFamily: "Inter",
        fontWeight: "bold",
        fill: "#111827",
      });

      targetPage.addElement({
        type: "text",
        text: "Content 1",
        x: padX,
        y: topY,
        width: colW,
        fontSize: 26,
        fontFamily: "Inter",
        fontWeight: "600",
        fill: "#111827",
      });
      targetPage.addElement({
        type: "text",
        text: "• Point 1\n• Point 2\n• Point 3",
        x: padX,
        y: topY + Math.round(h * 0.06),
        width: colW,
        fontSize: 24,
        fontFamily: "Inter",
        fontWeight: "400",
        fill: "#111827",
        lineHeight: 1.3,
      });

      targetPage.addElement({
        type: "text",
        text: "Content 2",
        x: padX + colW + gap,
        y: topY,
        width: colW,
        fontSize: 26,
        fontFamily: "Inter",
        fontWeight: "600",
        fill: "#111827",
      });
      targetPage.addElement({
        type: "text",
        text: "• Point 1\n• Point 2\n• Point 3",
        x: padX + colW + gap,
        y: topY + Math.round(h * 0.06),
        width: colW,
        fontSize: 24,
        fontFamily: "Inter",
        fontWeight: "400",
        fill: "#111827",
        lineHeight: 1.3,
      });
      return;
    }

    if (layoutKey === "comparison") {
      const gap = Math.round(w * 0.04);
      const colW = Math.round((w - padX * 2 - gap) / 2);
      const topY = Math.round(h * 0.22);
      targetPage.addElement({
        type: "text",
        text: "Title",
        x: padX,
        y: Math.round(h * 0.10),
        width: Math.round(w * 0.8),
        fontSize: 52,
        fontFamily: "Inter",
        fontWeight: "bold",
        fill: "#111827",
      });

      targetPage.addElement({
        type: "shape",
        shapeType: "rect",
        x: padX,
        y: topY,
        width: colW,
        height: Math.round(h * 0.62),
        fill: "#F8FAFC",
        stroke: "#E5E7EB",
        strokeWidth: 2,
      });
      targetPage.addElement({
        type: "shape",
        shapeType: "rect",
        x: padX + colW + gap,
        y: topY,
        width: colW,
        height: Math.round(h * 0.62),
        fill: "#F8FAFC",
        stroke: "#E5E7EB",
        strokeWidth: 2,
      });

      targetPage.addElement({
        type: "text",
        text: "Option A",
        x: padX + 18,
        y: topY + 14,
        width: colW - 36,
        fontSize: 26,
        fontFamily: "Inter",
        fontWeight: "700",
        fill: "#111827",
      });
      targetPage.addElement({
        type: "text",
        text: "• Pro 1\n• Pro 2\n• Pro 3",
        x: padX + 18,
        y: topY + 62,
        width: colW - 36,
        fontSize: 22,
        fontFamily: "Inter",
        fontWeight: "400",
        fill: "#111827",
        lineHeight: 1.3,
      });

      targetPage.addElement({
        type: "text",
        text: "Option B",
        x: padX + colW + gap + 18,
        y: topY + 14,
        width: colW - 36,
        fontSize: 26,
        fontFamily: "Inter",
        fontWeight: "700",
        fill: "#111827",
      });
      targetPage.addElement({
        type: "text",
        text: "• Pro 1\n• Pro 2\n• Pro 3",
        x: padX + colW + gap + 18,
        y: topY + 62,
        width: colW - 36,
        fontSize: 22,
        fontFamily: "Inter",
        fontWeight: "400",
        fill: "#111827",
        lineHeight: 1.3,
      });
      return;
    }

    if (layoutKey === "full_image") {
      const image = targetPage.addElement({
        type: "image",
        src: "https://res.cloudinary.com/dlifgfg6m/image/upload/v1777749876/The_Strageist_oghhch.png",
        x: 0,
        y: 0,
        width: w,
        height: h,
        name: "layout-image",
      });
      targetPage.addElement({
        type: "shape",
        shapeType: "rect",
        x: 0,
        y: 0,
        width: w,
        height: Math.round(h * 0.18),
        fill: "rgba(17,24,39,0.55)",
        strokeWidth: 0,
      });
      targetPage.addElement({
        type: "text",
        text: "Title",
        x: padX,
        y: Math.round(h * 0.06),
        width: Math.round(w * 0.8),
        fontSize: 52,
        fontFamily: "Inter",
        fontWeight: "700",
        fill: "#FFFFFF",
      });
      if (image?.set) {
        store.selectElements?.([image]);
        promptForImage((src) => image.set({ src }));
      }
      return;
    }

    if (layoutKey === "quote") {
      targetPage.addElement({
        type: "text",
        text: "“Your quote goes here.”",
        x: padX,
        y: Math.round(h * 0.30),
        width: Math.round(w * 0.8),
        fontSize: 54,
        fontFamily: "Inter",
        fontWeight: "600",
        fill: "#111827",
        align: "center",
        lineHeight: 1.15,
      });
      targetPage.addElement({
        type: "text",
        text: "— Name, Title",
        x: padX,
        y: Math.round(h * 0.62),
        width: Math.round(w * 0.8),
        fontSize: 26,
        fontFamily: "Inter",
        fontWeight: "400",
        fill: "#4B5563",
        align: "center",
      });
      return;
    }

    if (layoutKey === "timeline") {
      targetPage.addElement({
        type: "text",
        text: "Timeline / Process",
        x: padX,
        y: Math.round(h * 0.10),
        width: Math.round(w * 0.8),
        fontSize: 52,
        fontFamily: "Inter",
        fontWeight: "bold",
        fill: "#111827",
      });

      const steps = 4;
      const lineY = Math.round(h * 0.48);
      const startX = padX;
      const endX = w - padX;
      const span = endX - startX;

      targetPage.addElement({
        type: "shape",
        shapeType: "rect",
        x: startX,
        y: lineY,
        width: span,
        height: 4,
        fill: "#D1D5DB",
        strokeWidth: 0,
      });

      for (let i = 0; i < steps; i++) {
        const cx = Math.round(startX + (i / (steps - 1)) * span);
        targetPage.addElement({
          type: "shape",
          shapeType: "rect",
          x: cx - 10,
          y: lineY - 10,
          width: 20,
          height: 20,
          fill: i === 0 ? "#2563EB" : "#FFFFFF",
          stroke: "#2563EB",
          strokeWidth: 2,
        });
        targetPage.addElement({
          type: "text",
          text: `Step ${i + 1}`,
          x: cx - 90,
          y: lineY - 60,
          width: 180,
          fontSize: 20,
          fontFamily: "Inter",
          fontWeight: "700",
          fill: "#111827",
          align: "center",
        });
        targetPage.addElement({
          type: "text",
          text: "Description",
          x: cx - 110,
          y: lineY + 24,
          width: 220,
          fontSize: 18,
          fontFamily: "Inter",
          fontWeight: "400",
          fill: "#4B5563",
          align: "center",
          lineHeight: 1.2,
        });
      }
      return;
    }

    if (layoutKey === "summary") {
      targetPage.addElement({
        type: "text",
        text: "Summary / Recap",
        x: padX,
        y: Math.round(h * 0.10),
        width: Math.round(w * 0.8),
        fontSize: 52,
        fontFamily: "Inter",
        fontWeight: "bold",
        fill: "#111827",
      });

      const gap = Math.round(w * 0.03);
      const boxW = Math.round((w - padX * 2 - gap * 2) / 3);
      const boxY = Math.round(h * 0.28);
      const boxH = Math.round(h * 0.52);

      for (let i = 0; i < 3; i++) {
        const x = padX + i * (boxW + gap);
        targetPage.addElement({
          type: "shape",
          shapeType: "rect",
          x,
          y: boxY,
          width: boxW,
          height: boxH,
          fill: "#F8FAFC",
          stroke: "#E5E7EB",
          strokeWidth: 2,
        });
        targetPage.addElement({
          type: "text",
          text: `Point ${i + 1}`,
          x: x + 18,
          y: boxY + 18,
          width: boxW - 36,
          fontSize: 24,
          fontFamily: "Inter",
          fontWeight: "700",
          fill: "#111827",
        });
        targetPage.addElement({
          type: "text",
          text: "Short explanation here.",
          x: x + 18,
          y: boxY + 60,
          width: boxW - 36,
          fontSize: 18,
          fontFamily: "Inter",
          fontWeight: "400",
          fill: "#4B5563",
          lineHeight: 1.25,
        });
      }
      return;
    }
  };

  return (
    <div className="h-[102px] bg-white border-b flex items-center px-6 gap-10 overflow-x-auto">
      {/* Slide Size */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">Slide Layouts</span>

        <div className="flex gap-4">
          {/* Slide layouts as option buttons, styled like FormatPanel.tsx (see example at lines 213-258) */}
          {[
            {
              key: "title",
              label: "Title Slide",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388555" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388555)"
                  />
                  <path
                    d="M21.7487 10.1641H16.4987C16.1893 10.1641 15.8925 10.287 15.6737 10.5058C15.4549 10.7246 15.332 11.0213 15.332 11.3307V20.6641C15.332 20.9735 15.4549 21.2702 15.6737 21.489C15.8925 21.7078 16.1893 21.8307 16.4987 21.8307H23.4987C23.8081 21.8307 24.1049 21.7078 24.3237 21.489C24.5424 21.2702 24.6654 20.9735 24.6654 20.6641V13.0807L21.7487 10.1641Z"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21.168 10.1641V12.4974C21.168 12.8068 21.2909 13.1036 21.5097 13.3224C21.7285 13.5411 22.0252 13.6641 22.3346 13.6641H24.668"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.8346 14.25H17.668"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22.3346 16.5859H17.668"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22.3346 18.9141H17.668"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ),
            },
            {
              key: "title_tagline",
              label: "Title & Tagline",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388565" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388565)"
                  />
                  <path
                    d="M8 14C8 12.8954 8.89543 12 10 12H30C31.1046 12 32 12.8954 32 14C32 15.1046 31.1046 16 30 16H10C8.89543 16 8 15.1046 8 14Z"
                    fill="#99A1AF"
                  />
                  <path
                    d="M12 19C12 18.4477 12.4477 18 13 18H27C27.5523 18 28 18.4477 28 19C28 19.5523 27.5523 20 27 20H13C12.4477 20 12 19.5523 12 19Z"
                    fill="#D1D5DC"
                  />
                </svg>
              ),
            },
            {
              key: "title_image",
              label: "Title with Image",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388573" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388573)"
                  />
                  <path
                    d="M8 7C8 5.89543 8.89543 5 10 5H30C31.1046 5 32 5.89543 32 7C32 8.10457 31.1046 9 30 9H10C8.89543 9 8 8.10457 8 7Z"
                    fill="#99A1AF"
                  />
                  <path
                    d="M5 15C5 12.7909 6.79086 11 9 11H31C33.2091 11 35 12.7909 35 15V23C35 25.2091 33.2091 27 31 27H9C6.79086 27 5 25.2091 5 23V15Z"
                    fill="#E5E7EB"
                  />
                  <g clip-path="url(#clip0_10297_388573)">
                    <path
                      d="M22.9167 15.25H17.0833C16.6231 15.25 16.25 15.6231 16.25 16.0833V21.9167C16.25 22.3769 16.6231 22.75 17.0833 22.75H22.9167C23.3769 22.75 23.75 22.3769 23.75 21.9167V16.0833C23.75 15.6231 23.3769 15.25 22.9167 15.25Z"
                      stroke="#6A7282"
                      stroke-width="0.833333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.7513 18.5807C19.2115 18.5807 19.5846 18.2076 19.5846 17.7474C19.5846 17.2872 19.2115 16.9141 18.7513 16.9141C18.2911 16.9141 17.918 17.2872 17.918 17.7474C17.918 18.2076 18.2911 18.5807 18.7513 18.5807Z"
                      stroke="#6A7282"
                      stroke-width="0.833333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M23.75 20.2486L22.4642 18.9627C22.3079 18.8065 22.096 18.7188 21.875 18.7188C21.654 18.7188 21.4421 18.8065 21.2858 18.9627L17.5 22.7486"
                      stroke="#6A7282"
                      stroke-width="0.833333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10297_388573">
                      <rect
                        width="10"
                        height="10"
                        fill="white"
                        transform="translate(15 14)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              ),
            },
            {
              key: "title_content",
              label: "Title & Content",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388585" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388585)"
                  />
                  <path
                    d="M5 7C5 5.89543 5.89543 5 7 5H27C28.1046 5 29 5.89543 29 7C29 8.10457 28.1046 9 27 9H7C5.89543 9 5 8.10457 5 7Z"
                    fill="#99A1AF"
                  />
                  <path
                    d="M5 12C5 11.4477 5.44772 11 6 11H32C32.5523 11 33 11.4477 33 12C33 12.5523 32.5523 13 32 13H6C5.44771 13 5 12.5523 5 12Z"
                    fill="#D1D5DC"
                  />
                  <path
                    d="M5 16C5 15.4477 5.44772 15 6 15H32C32.5523 15 33 15.4477 33 16C33 16.5523 32.5523 17 32 17H6C5.44771 17 5 16.5523 5 16Z"
                    fill="#D1D5DC"
                  />
                  <path
                    d="M5 20C5 19.4477 5.44772 19 6 19H24C24.5523 19 25 19.4477 25 20C25 20.5523 24.5523 21 24 21H6C5.44772 21 5 20.5523 5 20Z"
                    fill="#D1D5DC"
                  />
                </svg>
              ),
            },
            {
              key: "two_content",
              label: "Two Content",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388596" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388596)"
                  />
                  <path
                    d="M5 7C5 5.89543 5.89543 5 7 5H27C28.1046 5 29 5.89543 29 7C29 8.10457 28.1046 9 27 9H7C5.89543 9 5 8.10457 5 7Z"
                    fill="#99A1AF"
                  />
                  <path
                    d="M5 15C5 12.7909 6.79086 11 9 11H15C17.2091 11 19 12.7909 19 15V23C19 25.2091 17.2091 27 15 27H9C6.79086 27 5 25.2091 5 23V15Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M21 15C21 12.7909 22.7909 11 25 11H31C33.2091 11 35 12.7909 35 15V23C35 25.2091 33.2091 27 31 27H25C22.7909 27 21 25.2091 21 23V15Z"
                    fill="#E5E7EB"
                  />
                </svg>
              ),
            },
            {
              key: "comparison",
              label: "Comparison",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388606" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388606)"
                  />
                  <path
                    d="M5 7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7C19 8.10457 18.1046 9 17 9H7C5.89543 9 5 8.10457 5 7Z"
                    fill="#99A1AF"
                  />
                  <path
                    d="M5 15C5 12.7909 6.79086 11 9 11H15C17.2091 11 19 12.7909 19 15V23C19 25.2091 17.2091 27 15 27H9C6.79086 27 5 25.2091 5 23V15Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M21 7C21 5.89543 21.8954 5 23 5H33C34.1046 5 35 5.89543 35 7C35 8.10457 34.1046 9 33 9H23C21.8954 9 21 8.10457 21 7Z"
                    fill="#99A1AF"
                  />
                  <path
                    d="M21 15C21 12.7909 22.7909 11 25 11H31C33.2091 11 35 12.7909 35 15V23C35 25.2091 33.2091 27 31 27H25C22.7909 27 21 25.2091 21 23V15Z"
                    fill="#E5E7EB"
                  />
                </svg>
              ),
            },
            {
              key: "full_image",
              label: "Full Image / Video",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388616" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388616)"
                  />
                  <path
                    d="M22.332 16.5811L25.3788 18.6123C25.4227 18.6415 25.4737 18.6583 25.5264 18.6608C25.5791 18.6633 25.6315 18.6515 25.678 18.6266C25.7245 18.6017 25.7634 18.5647 25.7905 18.5194C25.8177 18.4741 25.832 18.4224 25.832 18.3696V13.5886C25.832 13.5373 25.8185 13.4869 25.7928 13.4425C25.7671 13.3981 25.7302 13.3612 25.6857 13.3356C25.6412 13.3101 25.5907 13.2967 25.5394 13.2969C25.4881 13.2971 25.4377 13.3108 25.3934 13.3366L22.332 15.1228"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21.168 12.5H15.3346C14.6903 12.5 14.168 13.0223 14.168 13.6667V18.3333C14.168 18.9777 14.6903 19.5 15.3346 19.5H21.168C21.8123 19.5 22.3346 18.9777 22.3346 18.3333V13.6667C22.3346 13.0223 21.8123 12.5 21.168 12.5Z"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ),
            },
            {
              key: "quote",
              label: "Quote Slide",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388625" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388625)"
                  />
                  <path
                    d="M22.3346 10.75C22.0252 10.75 21.7285 10.8729 21.5097 11.0917C21.2909 11.3105 21.168 11.6072 21.168 11.9167V15.4167C21.168 15.7261 21.2909 16.0228 21.5097 16.2416C21.7285 16.4604 22.0252 16.5833 22.3346 16.5833C22.4893 16.5833 22.6377 16.6448 22.7471 16.7542C22.8565 16.8636 22.918 17.012 22.918 17.1667V17.75C22.918 18.0594 22.7951 18.3562 22.5763 18.575C22.3575 18.7937 22.0607 18.9167 21.7513 18.9167C21.5966 18.9167 21.4482 18.9781 21.3388 19.0875C21.2294 19.1969 21.168 19.3453 21.168 19.5V20.6667C21.168 20.8214 21.2294 20.9697 21.3388 21.0791C21.4482 21.1885 21.5966 21.25 21.7513 21.25C22.6796 21.25 23.5698 20.8813 24.2262 20.2249C24.8826 19.5685 25.2513 18.6783 25.2513 17.75V11.9167C25.2513 11.6072 25.1284 11.3105 24.9096 11.0917C24.6908 10.8729 24.3941 10.75 24.0846 10.75H22.3346Z"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.9167 10.75C15.6072 10.75 15.3105 10.8729 15.0917 11.0917C14.8729 11.3105 14.75 11.6072 14.75 11.9167V15.4167C14.75 15.7261 14.8729 16.0228 15.0917 16.2416C15.3105 16.4604 15.6072 16.5833 15.9167 16.5833C16.0714 16.5833 16.2197 16.6448 16.3291 16.7542C16.4385 16.8636 16.5 17.012 16.5 17.1667V17.75C16.5 18.0594 16.3771 18.3562 16.1583 18.575C15.9395 18.7937 15.6428 18.9167 15.3333 18.9167C15.1786 18.9167 15.0303 18.9781 14.9209 19.0875C14.8115 19.1969 14.75 19.3453 14.75 19.5V20.6667C14.75 20.8214 14.8115 20.9697 14.9209 21.0791C15.0303 21.1885 15.1786 21.25 15.3333 21.25C16.2616 21.25 17.1518 20.8813 17.8082 20.2249C18.4646 19.5685 18.8333 18.6783 18.8333 17.75V11.9167C18.8333 11.6072 18.7104 11.3105 18.4916 11.0917C18.2728 10.8729 17.9761 10.75 17.6667 10.75H15.9167Z"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ),
            },
            {
              key: "timeline",
              label: "Timeline / Process",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388632" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388632)"
                  />
                  <path
                    d="M17.668 10.1641V12.4974"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22.332 10.1641V12.4974"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24.0833 11.3359H15.9167C15.2723 11.3359 14.75 11.8583 14.75 12.5026V20.6693C14.75 21.3136 15.2723 21.8359 15.9167 21.8359H24.0833C24.7277 21.8359 25.25 21.3136 25.25 20.6693V12.5026C25.25 11.8583 24.7277 11.3359 24.0833 11.3359Z"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.75 14.8359H25.25"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.668 17.1641H17.6738"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20 17.1641H20.0058"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22.332 17.1641H22.3379"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.668 19.5H17.6738"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20 19.5H20.0058"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22.332 19.5H22.3379"
                    stroke="#4A5565"
                    stroke-width="1.16667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ),
            },
            {
              key: "summary",
              label: "Summary / Recap",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388649" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388649)"
                  />
                  <path
                    d="M5 7C5 5.89543 5.89543 5 7 5H23C24.1046 5 25 5.89543 25 7C25 8.10457 24.1046 9 23 9H7C5.89543 9 5 8.10457 5 7Z"
                    fill="#99A1AF"
                  />
                  <path
                    d="M5 12C5 11.4477 5.44772 11 6 11H32C32.5523 11 33 11.4477 33 12C33 12.5523 32.5523 13 32 13H6C5.44771 13 5 12.5523 5 12Z"
                    fill="#D1D5DC"
                  />
                  <path
                    d="M5 16C5 15.4477 5.44772 15 6 15H28C28.5523 15 29 15.4477 29 16C29 16.5523 28.5523 17 28 17H6C5.44772 17 5 16.5523 5 16Z"
                    fill="#D1D5DC"
                  />
                  <path
                    d="M5 20C5 19.4477 5.44772 19 6 19H32C32.5523 19 33 19.4477 33 20C33 20.5523 32.5523 21 32 21H6C5.44771 21 5 20.5523 5 20Z"
                    fill="#D1D5DC"
                  />
                </svg>
              ),
            },
            {
              key: "blank",
              label: "Blank Slide",
              icon: (
                <svg
                  width="40"
                  height="32"
                  viewBox="0 0 40 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_10297_388660" fill="white">
                    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z" />
                  </mask>
                  <path
                    d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V28C40 30.2091 38.2091 32 36 32H4C1.79086 32 0 30.2091 0 28V4Z"
                    fill="white"
                  />
                  <path
                    d="M4 0V1H36V0V-1H4V0ZM40 4H39V28H40H41V4H40ZM36 32V31H4V32V33H36V32ZM0 28H1V4H0H-1V28H0ZM4 32V31C2.34315 31 1 29.6569 1 28H0H-1C-1 30.7614 1.23858 33 4 33V32ZM40 28H39C39 29.6569 37.6569 31 36 31V32V33C38.7614 33 41 30.7614 41 28H40ZM36 0V1C37.6569 1 39 2.34315 39 4H40H41C41 1.23858 38.7614 -1 36 -1V0ZM4 0V-1C1.23858 -1 -1 1.23858 -1 4H0H1C1 2.34315 2.34315 1 4 1V0Z"
                    fill="#D1D5DC"
                    mask="url(#path-1-inside-1_10297_388660)"
                  />
                </svg>
              ),
            },
          ].map((layout) => (
            <button
              key={layout.key}
              onClick={() => applyLayout(layout.key)}
              className={`flex flex-col items-center justify-center rounded-md transition ${
                store.activePage?.layout === layout.key
                  ? "bg-[#E9EBF0]"
                  : "bg-transparent"
              } hover:bg-[#E9EBF0] py-2`}
              type="button"
              tabIndex={0}
              aria-label={layout.label}
            >
              <span className="w-8 h-8 flex items-center justify-center mb-1">
                {layout.icon}
              </span>
              <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1 text-center block w-full truncate">
                {layout.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className=" w-px h-[50px] bg-[#E3E4EA]" />

      {/* Page Setup */}
      <div className="flex flex-col items-center">
        <span
          className="text-center"
          style={{
            color: "#6A7282",
            fontFamily: "Inter",
            fontSize: "12px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "16px",
          }}
        >
          Page Setup
        </span>
   
        <div className="flex gap-2">
          {/* Orientation */}
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[220px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-500 mb-2">Orientation</div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    className={`px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left ${
                      isLandscape ? "bg-[#F8FAFC]" : ""
                    }`}
                    onClick={() => {
                      if (isLandscape) return;
                      const should = window.confirm(
                        "Change orientation and scale all slides?",
                      );
                      if (!should) return;
                      setSlideSize(store.height, store.width);
                    }}
                  >
                    Landscape
                  </button>
                  <button
                    type="button"
                    className={`px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left ${
                      !isLandscape ? "bg-[#F8FAFC]" : ""
                    }`}
                    onClick={() => {
                      if (!isLandscape) return;
                      const should = window.confirm(
                        "Change orientation and scale all slides?",
                      );
                      if (!should) return;
                      setSlideSize(store.height, store.width);
                    }}
                  >
                    Portrait
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[68px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              aria-label="Orientation"
              type="button"
            >
              <span className="text-[22px] text-[#364153] leading-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="31"
                  height="32"
                  viewBox="0 0 31 32"
                  fill="none"
                >
                  <path
                    d="M25.832 8H5.16536C3.73863 8 2.58203 9.19391 2.58203 10.6667V21.3333C2.58203 22.8061 3.73863 24 5.16536 24H25.832C27.2588 24 28.4154 22.8061 28.4154 21.3333V10.6667C28.4154 9.19391 27.2588 8 25.832 8Z"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span
                style={{
                  color: "#4A5565",
                  fontFamily: "Inter",
                  fontSize: "9px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "11.25px",
                  letterSpacing: "0.167px",
                  marginTop: "0.25rem",
                }}
              >
                Orientation
              </span>
            </button>
          </Popover>

          {/* Slide Size */}
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <div className="w-[240px] p-3 bg-white border rounded-md shadow-lg">
                <div className="text-xs text-gray-500 mb-2">Slide Size</div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                    onClick={() => {
                      const should = window.confirm(
                        "Change slide size and scale all slides?",
                      );
                      if (!should) return;
                      setSlideSize(1920, 1080);
                    }}
                  >
                    Widescreen (16:9)
                  </button>
                  <button
                    type="button"
                    className="px-2 py-2 text-xs rounded border border-[#E5E7EB] hover:bg-[#F8FAFC] text-left"
                    onClick={() => {
                      const should = window.confirm(
                        "Change slide size and scale all slides?",
                      );
                      if (!should) return;
                      setSlideSize(1024, 768);
                    }}
                  >
                    Standard (4:3)
                  </button>
                </div>
              </div>
            }
          >
            <button
              className="flex flex-col items-center justify-center w-[68px] rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
              aria-label="Slide Size"
              type="button"
            >
              <span className="text-[22px] text-[#364153] leading-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M8.66667 3.25H5.41667C4.84203 3.25 4.29093 3.47827 3.8846 3.8846C3.47827 4.29093 3.25 4.84203 3.25 5.41667V8.66667"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22.7487 8.66667V5.41667C22.7487 4.84203 22.5204 4.29093 22.1141 3.8846C21.7078 3.47827 21.1567 3.25 20.582 3.25H17.332"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.25 17.3359V20.5859C3.25 21.1606 3.47827 21.7117 3.8846 22.118C4.29093 22.5243 4.84203 22.7526 5.41667 22.7526H8.66667"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.332 22.7526H20.582C21.1567 22.7526 21.7078 22.5243 22.1141 22.118C22.5204 21.7117 22.7487 21.1606 22.7487 20.5859V17.3359"
                    stroke="#364153"
                    stroke-width="1.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span
                style={{
                  color: "#4A5565",
                  fontFamily: "Inter",
                  fontSize: "9px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "11.25px",
                  letterSpacing: "0.167px",
                  marginTop: "0.25rem",
                }}
              >
                Slide Size
              </span>
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
});
