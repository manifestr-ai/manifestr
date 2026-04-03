import React from 'react';
import Head from 'next/head';
import TopHeader from '../components/spreadsheet/TopHeader';
import BottomToolbar from '../components/spreadsheet/BottomToolbar';
import ChartViewer from '../components/chart-viewer/ChartViewer';

export default function ChartViewerPage() {
    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
            <Head>
                <title>Chart Viewer | Manifestr</title>
            </Head>

            {/* Top Section */}
            <div className="flex-none z-30">
                <TopHeader editorType="document" />
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex relative overflow-hidden bg-gray-100">
                <div className="flex-grow overflow-hidden relative z-10">
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
