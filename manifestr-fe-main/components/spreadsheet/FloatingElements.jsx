import React from 'react';
import { Plus, PenLine } from 'lucide-react';

export function FloatingSheetTab() {
    return (
        <div className="absolute bottom-32 left-8 flex items-center bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-800 border-r border-gray-200">
                <PenLine size={14} />
                Sheet 1
            </button>
            <button className="p-2 hover:bg-gray-50 text-gray-600">
                <Plus size={16} />
            </button>
        </div>
    );
}

export function FloatingFAB() {
    return (
        <button className="absolute bottom-4 right-4 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-50 sm:right-6 sm:w-16 sm:h-16 lg:right-8">
            <span className="text-white text-2xl font-serif italic">M.</span>
        </button>
    );
}
