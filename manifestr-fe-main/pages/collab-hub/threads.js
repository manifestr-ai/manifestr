import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppHeader from '../../components/layout/AppHeader'
import SidebarLayout from '../../components/layout/SidebarLayout'
import ThreadsPanel from '../../components/threads/ThreadsPanel'
import ThreadDetailPanel from '../../components/threads/ThreadDetailPanel'

export default function ThreadsPage() {
  const [showDetail, setShowDetail] = useState(false)
  const [selectedThread, setSelectedThread] = useState(null)

  const handleThreadClick = (thread) => {
    setSelectedThread(thread)
    setShowDetail(true)
  }

  const handleBack = () => {
    setShowDetail(false)
    setSelectedThread(null)
  }

  const handleClose = () => {
    // Navigate back or close
    window.history.back()
  }

  const handleSave = (data) => {
    // Handle save logic
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AppHeader />
      <SidebarLayout>
        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {!showDetail ? (
              <ThreadsPanel
                key="list"
                onClose={handleClose}
                onThreadClick={handleThreadClick}
              />
            ) : (
              <ThreadDetailPanel
                key="detail"
                thread={selectedThread}
                onBack={handleBack}
                onClose={handleClose}
                onSave={handleSave}
              />
            )}
          </AnimatePresence>
        </div>
      </SidebarLayout>
    </div>
  )
}




