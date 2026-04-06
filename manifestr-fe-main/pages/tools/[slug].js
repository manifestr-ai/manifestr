import Head from 'next/head'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import TOOL_DETAILS, { ALL_TOOL_SLUGS, getToolBySlug } from '../../data/toolDetails'

import ToolHero           from '../../components/tool-detail/ToolHero'
import ToolFeatures       from '../../components/tool-detail/ToolFeatures'
import ToolDocuments      from '../../components/tool-detail/ToolDocuments'
import ToolWorkingStyles  from '../../components/tool-detail/ToolWorkingStyles'
import ToolOutput         from '../../components/tool-detail/ToolOutput'
import ToolElevated       from '../../components/tool-detail/ToolElevated'
import ToolWhyManifest    from '../../components/tool-detail/ToolWhyManifest'
import ToolConnectedSystem from '../../components/tool-detail/ToolConnectedSystem'
import ToolDiscover       from '../../components/tool-detail/ToolDiscover'
import ToolCTA            from '../../components/tool-detail/ToolCTA'

export async function getStaticPaths() {
  return {
    paths: ALL_TOOL_SLUGS.map((slug) => ({ params: { slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const tool = getToolBySlug(params.slug)
  if (!tool) return { notFound: true }

  const relatedTools = tool.relatedTools
    .map((s) => TOOL_DETAILS[s])
    .filter(Boolean)

  return { props: { tool, relatedTools } }
}

export default function ToolDetailPage({ tool, relatedTools }) {
  if (!tool) return null

  return (
    <>
      <Head>
        <title>{tool.prefix} {tool.name} — MANIFESTR</title>
        <meta name="description" content={tool.tagline.replace(/\n/g, ' ')} />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        <Header />

        <main className="flex-1 pt-[76px]">
          <ToolHero tool={tool} />

          <ToolFeatures tool={tool} />

          <ToolDocuments tool={tool} />

          <ToolWorkingStyles tool={tool} />

          <ToolOutput tool={tool} />

          <ToolElevated tool={tool} />

          <ToolWhyManifest />

          <ToolConnectedSystem />

          <ToolDiscover relatedTools={relatedTools} />

          <ToolCTA />
        </main>

        <Footer />
      </div>
    </>
  )
}
