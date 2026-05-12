import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

type Heading = { id: string; level: number; text: string };

type Section = {
  id: string;
  title: string;
  items: Heading[];
};

const SIDEBAR_WIDTH_CLASS = "w-[215px]";

function scrollToHeading(id: string) {
  // Try multiple selectors to find the heading
  let element: HTMLElement | null = document.getElementById(id);
  if (!element) {
    element = document.querySelector(`[data-id="${id}"]`);
  }
  if (!element) {
    element = document.querySelector(
      `h1[id="${id}"], h2[id="${id}"], h3[id="${id}"], h4[id="${id}"], h5[id="${id}"], h6[id="${id}"]`,
    );
  }

  if (element) {
    const scrollContainer =
      element.closest(".simple-editor-wrapper") ||
      element.closest(".simple-editor-content") ||
      element.closest(".ProseMirror") ||
      document.querySelector(".simple-editor-wrapper");

    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = (scrollContainer as HTMLElement).scrollTop;
      const offset = elementRect.top - containerRect.top + scrollTop - 20;

      (scrollContainer as HTMLElement).scrollTo({
        top: offset,
        behavior: "smooth",
      });
    } else {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function buildSections(headings: Heading[] | undefined | null): Section[] {
  const safe = Array.isArray(headings) ? headings : [];
  const sections: Section[] = [];
  let current: Section | null = null;

  safe.forEach((h) => {
    const text = (h.text || "").trim();
    if (!text) return;

    if (h.level === 1) {
      current = { id: h.id, title: text, items: [] };
      sections.push(current);
      return;
    }

    if (!current) {
      current = { id: "section-root", title: "Outline", items: [] };
      sections.push(current);
    }

    current.items.push(h);
  });

  return sections;
}

export default function DocumentOutline({ headings }: { headings: Heading[] }) {
  const sections = useMemo(() => buildSections(headings), [headings]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const first = sections[0]?.id;
    return first ? { [first]: true } : {};
  });
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    sections[0]?.id ?? null,
  );

  const toggleSection = (sectionId: string) => {
    setExpanded((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <div
      className={`${SIDEBAR_WIDTH_CLASS} bg-white border-r border-gray-200 flex flex-col h-full`}
    >
      <div className="flex-1 min-h-0 overflow-y-auto pt-[6px]">
        <div className="px-[6px] flex flex-col gap-[4px]">
          {sections.map((section) => {
            const isActive = activeSectionId === section.id;
            const isExpanded = expanded[section.id] ?? false;

            return (
              <div key={section.id} className="w-full">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSectionId(section.id);
                    toggleSection(section.id);
                    scrollToHeading(section.id);
                  }}
                  className={[
                    "w-[199px] h-[28px] rounded-[8px] px-[10px] flex items-center gap-[8px] ml-[6px]",
                    isActive
                      ? "bg-[#18181b] text-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
                      : "bg-transparent text-[#364153] hover:bg-gray-50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "rounded-full",
                      isActive ? "bg-white size-[4px]" : "bg-[#99a1af] size-[4px]",
                    ].join(" ")}
                  />
                  <span className="flex-1 text-[12px] leading-4 font-normal text-left truncate">
                    {section.title}
                  </span>
                  <ChevronDown
                    size={12}
                    className={isActive ? "text-white" : "text-[#4a5565]"}
                  />
                </button>

                {isExpanded && section.items.length > 0 && (
                  <div className="pl-[16px] pt-[2px]">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToHeading(item.id)}
                        className="w-[199px] h-[24px] rounded-[8px] flex items-center gap-[8px] pl-[10px] text-[#4a5565] hover:bg-gray-50"
                      >
                        <span className="bg-[#d1d5dc] rounded-full size-[2px]" />
                        <span className="text-[12px] leading-4 font-normal text-left truncate">
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
