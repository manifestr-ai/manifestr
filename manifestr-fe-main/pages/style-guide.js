import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Search, Mic, ChevronDown, Clock, Grid3x3, List, MoreVertical, Plus } from 'lucide-react'
import AppHeader from '../components/layout/AppHeader'
import Button from '../components/ui/Button'
import StyleGuideCard from '../components/style-guide/StyleGuideCard'

export default function StyleGuide() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const [styleGuides, setStyleGuides] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStyleGuides = async () => {
      try {
        setIsLoading(true)
        const { listStyleGuides } = await import('../services/style-guide')
        // const response = await listStyleGuides({ project_id: '...' }) // Filter if needed
        const response = await listStyleGuides()

        // Map API response to UI props
        // API returns: { id, name, brand_name, type, config: { colors, ... }, created_at, ... }
        const mappedGuides = (response.data || []).map((guide, index) => {
          // Generate a deterministic gradient based on index or ID if not stored
          const gradients = [
            'linear-gradient(135deg, #DC2626 0%, #18181b 100%)',
            'linear-gradient(135deg, #16A34A 0%, #18181b 100%)',
            'linear-gradient(135deg, #2563EB 0%, #18181b 100%)',
            'linear-gradient(135deg, #9333EA 0%, #18181b 100%)',
            'linear-gradient(135deg, #EA580C 0%, #92400E 0%, #18181b 100%)',
            'linear-gradient(135deg, #EC4899 0%, #BE185D 0%, #18181b 100%)',
          ]
          const gradient = gradients[index % gradients.length]

          return {
            id: guide.id,
            category: guide.name || 'Untitled Guide', // Keeping category/title mapping flexible
            title: guide.brand_name || 'Brand Name',
            subtitle: 'Brand Style Guide', // Static for now or derive
            projectCount: 0, // Not in API yet
            gradient: gradient,
          }
        })
        setStyleGuides(mappedGuides)
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    fetchStyleGuides()
  }, []) // Remove router dependency to avoid re-running loop if router changes, though router.push is safe.

  const handleCreateNew = () => {
    router.push('/create-style-guide')
  }

  // Effect to redirect if loaded and empty. 
  // Doing it here to avoid race conditions in the fetch function or loop issues.
  useEffect(() => {
    if (!isLoading && styleGuides.length === 0) {
      router.replace('/create-style-guide')
    }
  }, [isLoading, styleGuides.length, router])

  return (
    <>
      <Head>
        <title>Style Guide - Manifestr</title>
        <meta name="description" content="Manage and organize your brand style guides and design systems" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white min-h-screen w-full flex flex-col">
        <AppHeader showRightActions={true} />
        <div className="h-[72px]" />

        {/* Hero Section */}
        <div className="relative w-full h-auto min-h-[280px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/assets/banners/abstract-white-wave.png"
              alt="Background"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-8 h-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            <div className="text-center md:text-left">
              <h1 className="text-[40px] md:text-[64px] font-bold leading-[1.1] md:leading-[72px] tracking-[-1.28px] text-[#18181b] mb-3">
                STYLE <span className="italic font-normal">guide</span>
              </h1>
              <p className="text-[16px] md:text-[18px] leading-[28px] text-[#18181b]">
                Manage and organize your brand style guides and design systems.
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl text-[16px] font-medium text-[#18181b] hover:bg-[#f4f4f5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:ring-offset-2"
            >
              <Plus className="w-5 h-5 text-[#18181b]" />
              New Style Guide
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border-b border-[#e4e4e7]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="w-full md:flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#71717a]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search style guides..."
                  className="w-full pl-12 pr-12 py-3 bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18181b] focus:border-transparent text-[16px] leading-[24px] text-[#18181b]"
                />
                <Mic className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#71717a] cursor-pointer hover:text-[#18181b] transition-colors" />
              </div>

              {/* Filters */}
              <div className="w-full md:w-auto flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-[#e4e4e7] rounded-lg hover:bg-[#f4f4f5] transition-colors">
                  <span className="text-[14px] leading-[20px] text-[#18181b]">All status</span>
                  <ChevronDown className="w-4 h-4 text-[#71717a]" />
                </button>
                <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white border border-[#e4e4e7] rounded-lg hover:bg-[#f4f4f5] transition-colors">
                  <Clock className="w-4 h-4 text-[#71717a]" />
                  <span className="text-[14px] leading-[20px] text-[#18181b]">Recents</span>
                  <ChevronDown className="w-4 h-4 text-[#71717a]" />
                </button>
                <button className="flex-shrink-0 px-4 py-2 text-[14px] leading-[20px] text-[#71717a] hover:text-[#18181b] transition-colors">
                  Reset Filters
                </button>
                <div className="flex-shrink-0 flex items-center border border-[#e4e4e7] rounded-lg overflow-hidden ml-auto md:ml-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-[#18181b] text-white' : 'bg-white text-[#71717a] hover:bg-[#f4f4f5]'} transition-colors`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-[#18181b] text-white' : 'bg-white text-[#71717a] hover:bg-[#f4f4f5]'} transition-colors`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-[#f4f4f5]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {styleGuides.map((guide, index) => (
                  <StyleGuideCard
                    key={guide.id}
                    category={guide.category}
                    title={guide.title}
                    subtitle={guide.subtitle}
                    projectCount={guide.projectCount}
                    gradient={guide.gradient}
                    index={index}
                    onClick={() => {
                      // Handle card click
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {styleGuides.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition-shadow cursor-pointer gap-4 md:gap-0"
                    onClick={() => {
                      // Handle card click
                    }}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 flex-1 w-full md:w-auto">
                      <div
                        className="w-full md:w-20 h-20 rounded-lg flex-shrink-0"
                        style={{ background: guide.gradient }}
                      />
                      <div className="flex-1 w-full md:w-auto">
                        <p className="text-[14px] leading-[20px] text-[#71717a] mb-1">
                          {guide.category}
                        </p>
                        <h3 className="text-[20px] font-semibold leading-[28px] text-[#18181b] mb-1">
                          {guide.title}
                        </h3>
                        <p className="text-[16px] leading-[24px] text-[#71717a]">
                          {guide.subtitle}
                        </p>
                      </div>
                      <div className="text-[14px] leading-[20px] text-[#71717a]">
                        {guide.projectCount} Projects
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle menu click
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f4f4f5] transition-colors absolute top-4 right-4 md:relative md:top-auto md:right-auto"
                    >
                      <MoreVertical className="w-5 h-5 text-[#71717a]" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-[#18181b] rounded-full flex items-center justify-center text-white text-[18px] font-semibold shadow-lg hover:shadow-xl transition-shadow z-50"
        >
          M.
        </motion.button>
      </div>
    </>
  )
}
