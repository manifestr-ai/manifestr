import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AppHeader from '../../components/layout/AppHeader'
import { getStyleGuideDetails } from '../../services/style-guide'
import { Loader } from 'lucide-react'

export default function StyleGuideDetail() {
  const router = useRouter()
  const { id } = router.query
  const [styleGuide, setStyleGuide] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchStyleGuide = async () => {
      try {
        setIsLoading(true)
        const response = await getStyleGuideDetails(id)
        setStyleGuide(response.data)
      } catch (err) {
        console.error('Failed to fetch style guide:', err)
        setError('Failed to load style guide')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStyleGuide()
  }, [id])

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Loading Style Guide - Manifestr</title>
        </Head>
        <div className="bg-white min-h-screen w-full flex flex-col">
          <AppHeader showRightActions={true} />
          <div className="h-[72px]" />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader className="w-8 h-8 animate-spin text-[#18181b]" />
              <p className="text-[16px] text-[#71717a]">Loading style guide...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !styleGuide) {
    return (
      <>
        <Head>
          <title>Style Guide Not Found - Manifestr</title>
        </Head>
        <div className="bg-white min-h-screen w-full flex flex-col">
          <AppHeader showRightActions={true} />
          <div className="h-[72px]" />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center px-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-[32px]">❌</span>
              </div>
              <h1 className="text-[24px] font-bold text-[#18181b]">Style Guide Not Found</h1>
              <p className="text-[16px] text-[#71717a] max-w-md">
                The style guide you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <button
                onClick={() => router.push('/style-guide')}
                className="mt-4 px-6 py-3 bg-[#18181b] text-white rounded-lg hover:bg-[#27272a] transition-colors"
              >
                Back to Style Guides
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{styleGuide.brand_name || styleGuide.name || 'Style Guide'} - Manifestr</title>
        <meta name="description" content={`View and manage ${styleGuide.brand_name || 'your'} style guide`} />
      </Head>

      <div className="bg-white min-h-screen w-full flex flex-col">
        <AppHeader showRightActions={true} />
        <div className="h-[72px]" />

        {/* Hero Section */}
        <div className="border-b border-[#e4e4e7] bg-gradient-to-br from-white to-[#f4f4f5] py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => router.push('/style-guide')}
                  className="text-[14px] text-[#71717a] hover:text-[#18181b] mb-4 flex items-center gap-2"
                >
                  ← Back to Style Guides
                </button>
                <h1 className="text-[40px] md:text-[56px] font-bold leading-[1.1] text-[#18181b] mb-2">
                  {styleGuide.brand_name || 'Untitled Brand'}
                </h1>
                <p className="text-[18px] text-[#71717a]">
                  {styleGuide.name || 'Brand Style Guide'}
                </p>
              </div>
              <button
                onClick={() => router.push(`/create-style-guide?id=${id}`)}
                className="px-6 py-3 bg-[#18181b] text-white rounded-lg hover:bg-[#27272a] transition-colors"
              >
                Edit Style Guide
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 bg-[#f4f4f5]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Brand Colors */}
              {styleGuide.config?.colors?.selected && styleGuide.config.colors.selected.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-[#e4e4e7]">
                  <h2 className="text-[20px] font-semibold text-[#18181b] mb-4">Brand Colors</h2>
                  <div className="flex flex-wrap gap-2">
                    {styleGuide.config.colors.selected.map((color, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 rounded-lg border border-[#e4e4e7]"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Typography */}
              {styleGuide.config?.typography && (
                <div className="bg-white rounded-xl p-6 border border-[#e4e4e7]">
                  <h2 className="text-[20px] font-semibold text-[#18181b] mb-4">Typography</h2>
                  <div className="space-y-3">
                    {styleGuide.config.typography.headings && (
                      <div>
                        <p className="text-[12px] text-[#71717a] mb-1">Headings</p>
                        <p className="text-[16px] font-semibold text-[#18181b]">
                          {styleGuide.config.typography.headings.family} - {styleGuide.config.typography.headings.weight}
                        </p>
                      </div>
                    )}
                    {styleGuide.config.typography.body && (
                      <div>
                        <p className="text-[12px] text-[#71717a] mb-1">Body</p>
                        <p className="text-[16px] text-[#18181b]">
                          {styleGuide.config.typography.body.family} - {styleGuide.config.typography.body.weight}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Logos */}
              {styleGuide.config?.logos && styleGuide.config.logos.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-[#e4e4e7]">
                  <h2 className="text-[20px] font-semibold text-[#18181b] mb-4">Logos</h2>
                  <div className="space-y-3">
                    {styleGuide.config.logos.map((logo, index) => (
                      <div key={index} className="border border-[#e4e4e7] rounded-lg p-4">
                        <img
                          src={logo.url}
                          alt={logo.type || 'Logo'}
                          className="max-h-20 mx-auto"
                        />
                        <p className="text-[12px] text-[#71717a] text-center mt-2">
                          {logo.type || 'Primary Logo'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Style */}
              {styleGuide.config?.style && (
                <div className="bg-white rounded-xl p-6 border border-[#e4e4e7] md:col-span-2">
                  <h2 className="text-[20px] font-semibold text-[#18181b] mb-4">Brand Style</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {styleGuide.config.style.toneDescriptors && styleGuide.config.style.toneDescriptors.length > 0 && (
                      <div>
                        <p className="text-[14px] font-medium text-[#71717a] mb-2">Tone</p>
                        <div className="flex flex-wrap gap-2">
                          {styleGuide.config.style.toneDescriptors.map((tone, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#f4f4f5] border border-[#e4e4e7] rounded-full text-[14px] text-[#18181b]"
                            >
                              {tone}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {styleGuide.config.style.audience && styleGuide.config.style.audience.length > 0 && (
                      <div>
                        <p className="text-[14px] font-medium text-[#71717a] mb-2">Audience</p>
                        <div className="flex flex-wrap gap-2">
                          {styleGuide.config.style.audience.map((aud, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#f4f4f5] border border-[#e4e4e7] rounded-full text-[14px] text-[#18181b]"
                            >
                              {aud}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {styleGuide.config.style.personality && (
                    <div className="mt-4">
                      <p className="text-[14px] font-medium text-[#71717a] mb-2">Brand Personality</p>
                      <p className="text-[16px] text-[#18181b]">
                        {styleGuide.config.style.personality}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* General Info */}
              <div className="bg-white rounded-xl p-6 border border-[#e4e4e7]">
                <h2 className="text-[20px] font-semibold text-[#18181b] mb-4">Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-[12px] text-[#71717a] mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-[14px] ${
                      styleGuide.is_completed 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {styleGuide.is_completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#71717a] mb-1">Last Updated</p>
                    <p className="text-[16px] text-[#18181b]">
                      {new Date(styleGuide.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
