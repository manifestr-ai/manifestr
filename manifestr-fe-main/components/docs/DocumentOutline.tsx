import React from 'react';
import { FileText } from 'lucide-react';

export default function DocumentOutline({ headings }) {
    const scrollToHeading = (id) => {
        console.log('🔍 Scrolling to heading:', id);
        
        // Try multiple selectors to find the heading
        let element = document.getElementById(id);
        if (!element) {
            element = document.querySelector(`[data-id="${id}"]`);
        }
        if (!element) {
            element = document.querySelector(`h1[id="${id}"], h2[id="${id}"], h3[id="${id}"], h4[id="${id}"], h5[id="${id}"], h6[id="${id}"]`);
        }
        
        console.log('🔍 Found element:', element);
        
        if (element) {
            // Find the scroll container (TipTap's editor wrapper)
            const scrollContainer = element.closest('.simple-editor-wrapper') || 
                                   element.closest('.simple-editor-content') ||
                                   element.closest('.ProseMirror') || 
                                   document.querySelector('.simple-editor-wrapper');
            
            console.log('🔍 Scroll container:', scrollContainer);
            
            if (scrollContainer) {
                // Calculate position relative to scroll container
                const containerRect = scrollContainer.getBoundingClientRect();
                const elementRect = element.getBoundingClientRect();
                const scrollTop = scrollContainer.scrollTop;
                const offset = elementRect.top - containerRect.top + scrollTop - 20; // 20px padding
                
                console.log('🔍 Scrolling to offset:', offset);
                
                scrollContainer.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            } else {
                // Fallback to regular scroll
                console.log('🔍 Using fallback scrollIntoView');
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            console.error('❌ Element not found with id:', id);
            
            // Debug: Show what's available
            const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            console.error('❌ Available headings in DOM:', Array.from(allHeadings).map(el => ({
                tag: el.tagName,
                id: el.id,
                dataId: el.getAttribute('data-id'),
                text: el.textContent?.substring(0, 30)
            })));
        }
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#f3f4f6] bg-gradient-to-b from-white to-[rgba(249,250,251,0.3)]">
                <FileText size={14} className="text-[#364153]" />
                <h3 className="font-inter font-normal text-xs text-[#364153]">Document Outline</h3>
            </div>

            <div className="flex-grow overflow-y-auto pt-1.5 px-1.5 pb-4">
                {headings && headings.length > 0 ? (
                    <div className="flex flex-col gap-1">
                        {headings.map((heading, index) => {
                            const isTopLevel = heading.level === 1;
                            const isSecondLevel = heading.level === 2;
                            
                            if (isTopLevel) {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => scrollToHeading(heading.id)}
                                        className="w-full h-7 px-2.5 rounded-lg flex items-center gap-2 bg-[#18181b] text-white shadow-sm hover:bg-[#27272a] transition-colors"
                                    >
                                        <div className="size-1 rounded-full bg-white shrink-0" />
                                        <span className="flex-1 text-xs font-inter font-normal text-left truncate">
                                            {heading.text}
                                        </span>
                                    </button>
                                );
                            } else if (isSecondLevel) {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => scrollToHeading(heading.id)}
                                        className="w-full h-6 pl-6 pr-2 rounded-lg flex items-center gap-2 text-[#4a5565] hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="size-0.5 rounded-full bg-[#d1d5dc] shrink-0" />
                                        <span className="text-xs font-inter font-normal text-left truncate">
                                            {heading.text}
                                        </span>
                                    </button>
                                );
                            } else {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => scrollToHeading(heading.id)}
                                        className="w-full h-6 pl-10 pr-2 rounded-lg flex items-center gap-2 text-[#4a5565] hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="size-0.5 rounded-full bg-[#d1d5dc] shrink-0" />
                                        <span className="text-xs font-inter font-normal text-left truncate">
                                            {heading.text}
                                        </span>
                                    </button>
                                );
                            }
                        })}
                    </div>
                ) : (
                    <div className="text-center text-[#99a1af] text-xs mt-8 px-4">
                        <p>No headings yet</p>
                        <p className="mt-2">Add headings to see document outline</p>
                    </div>
                )}
            </div>

            <div className="border-t border-[#f3f4f6] p-4">
                <div className="text-xs text-[#99a1af] font-inter">
                    <p>{headings ? headings.length : 0} headings</p>
                </div>
            </div>
        </div>
    );
}
