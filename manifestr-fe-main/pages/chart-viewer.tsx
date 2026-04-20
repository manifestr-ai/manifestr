import React from 'react';
import Head from 'next/head';
import TopHeader from '../components/spreadsheet/TopHeader';
import BottomToolbar from '../components/spreadsheet/BottomToolbar';
import ChartViewer from '../components/chart-viewer/ChartViewer';

export default function ChartViewerPage() {
    return (
        <div className="flex flex-col h-screen bg-white font-sans">
            <Head>
                <title>Chart Viewer | Manifestr</title>
            </Head>

            {/* Top Section */}
            <div className="flex-none z-30">
                <TopHeader editorType="document" />
            </div>

            {/* Main Content Area - SCROLLABLE */}
            <div className="flex-grow flex relative bg-gray-100 overflow-y-auto">
                <div className="flex-grow relative z-10">
                    <ChartViewer />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex-none z-30">
                <BottomToolbar />
            </div>
        </div>
    );
}
