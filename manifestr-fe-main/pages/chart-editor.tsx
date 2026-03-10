import React, { useRef, useState } from 'react';
import Head from 'next/head';
import TopHeader from '../components/spreadsheet/TopHeader';
import BottomToolbar from '../components/spreadsheet/BottomToolbar';
import { FloatingSheetTab, FloatingFAB } from '../components/spreadsheet/FloatingElements';
import ChartEditor from '../components/chart-editor/ChartEditor';

export default function ChartEditorPage() {
    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
            <Head>
                <title>Chart Editor | Manifestr</title>
            </Head>

            {/* Top Section */}
            <div className="flex-none z-30">
                <TopHeader editorType="document" />
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex relative overflow-hidden bg-gray-100">
                {/* Grid Container (Full Size) */}
                <div className="flex-grow overflow-hidden relative z-10">
                    <ChartEditor />
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
