import React, { useRef, useState } from 'react';
import Head from 'next/head';
import TopHeader from '../components/spreadsheet/TopHeader';
import RightSidebar from '../components/spreadsheet/RightSidebar';
import BottomToolbar from '../components/spreadsheet/BottomToolbar';
import dynamic from 'next/dynamic';
import { FloatingSheetTab, FloatingFAB } from '../components/spreadsheet/FloatingElements';

const PhotoEditor = dynamic(() => import('../components/image-editor/PhotoEditor'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center">Loading editor...</div>
});

export default function ImageEditor() {
    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
            <Head>
                <title>Image Editor | Manifestr</title>
            </Head>

            {/* Top Section */}
            <div className="flex-none z-30">
                <TopHeader editorType="document" />
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex relative overflow-hidden bg-gray-100">
                {/* Grid Container (Full Size) */}
                <div className="flex-grow overflow-hidden relative z-10">
                    <PhotoEditor />
                </div>

                {/* Right Sidebar (Floating over grid on the right) */}
                <div className="absolute right-[-12px] top-0 bottom-0 flex items-center z-20 pointer-events-none">
                    <div className="pointer-events-auto">
                        <RightSidebar />
                    </div>
                </div>

                {/* Floating Elements */}
                <FloatingSheetTab />
                <FloatingFAB />
            </div>

            {/* Bottom Section */}
            <div className="flex-none z-30">
                <BottomToolbar />
            </div>
        </div>
    );
}
