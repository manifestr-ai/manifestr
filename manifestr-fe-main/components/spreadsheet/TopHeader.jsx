import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
    Home,
    ChevronDown,
    Undo2,
    Redo2,
    History,
    Share,
    Plus,
    Download
} from 'lucide-react';

// Dynamically import ShareModal to avoid SSR issues
const ShareModal = dynamic(() => import('../collaboration/ShareModal'), { ssr: false });

export default function TopHeader({ onDownload = () => { }, editorType = 'spreadsheet', documentId = null, documentTitle = 'Untitled document', enableCollaboration = false }) {
    const router = useRouter();
    const [status, setStatus] = useState('In Progress');
    const [mode, setMode] = useState('Editing');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showModeDropdown, setShowModeDropdown] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Dynamic download button text based on editor type
    const getDownloadText = () => {
        switch (editorType) {
            case 'document':
                return 'Download DOC';
            case 'spreadsheet':
                return 'Download XLSX';
            case 'presentation':
                return 'Download PPTX';
            default:
                return 'Download';
        }
    };

    const statusDropdownRef = useRef(null);
    const modeDropdownRef = useRef(null);

    const handleLogoClick = () => {
        router.push('/home');
    };

    const statuses = ['In Progress', 'Draft', 'Final', 'Archived'];
    const modes = ['Editing', 'Suggesting', 'Viewing'];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setShowStatusDropdown(false);
            }
            if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target)) {
                setShowModeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>
                    <img src="/assets/logos/text-logo.svg" alt="Manifestr Logo" className="h-6" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{documentTitle}</span>
                    <div className="flex items-center gap-2 ml-4">
                        {/* Status Dropdown */}
                        <div className="relative" ref={statusDropdownRef}>
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700"
                            >
                                <span className="w-4 h-4 rounded-full border border-dashed border-gray-400 animate-spin-slow mr-1"></span>
                                {status}
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>

                            {showStatusDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    {statuses.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setStatus(s);
                                                setShowStatusDropdown(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${status === s ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mode Dropdown */}
                        <div className="relative" ref={modeDropdownRef}>
                            <button
                                onClick={() => setShowModeDropdown(!showModeDropdown)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700"
                            >
                                {mode}
                                <ChevronDown size={14} className="text-gray-400" />
                            </button>

                            {showModeDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                    {modes.map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => {
                                                setMode(m);
                                                setShowModeDropdown(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${mode === m ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-3">
                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                            <Undo2 size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                            <Redo2 size={16} />
                        </button>
                    </div>
                    <span className="text-xs text-gray-400 ml-2">v1.1</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                    <History size={18} />
                </button> */}
                {/* <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                    </div>
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                        <Plus size={16} className="text-gray-600" />
                    </button>
                </div> */}
                {/* Download Button - Only for document editor */}
                {editorType === 'document' && onDownload && (
                    <button 
                        onClick={onDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                    >
                        <Download size={16} />
                        Download DOCX
                    </button>
                )}
                {/* Share Button - Opens collaboration modal if enabled */}
                <button
                    onClick={() => enableCollaboration && setShowShareModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!enableCollaboration}
                >
                    <Share size={16} />
                    Share
                </button>
            </div>

            {/* Share Modal - Only render if collaboration enabled */}
            {enableCollaboration && documentId && (
                <ShareModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                    documentId={documentId}
                    documentTitle={documentTitle}
                />
            )}
        </div>
    );
}
