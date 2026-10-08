import type { Metadata } from 'next'
import { SectionRoadmap } from '@/components/section-roadmap'
import { SectionRoadmapHero } from '@/components/section-roadmap-hero'

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'What has shipped in Skaff, what is next and what is further out.'
}

export default function RoadmapPage() {
  return (
    <main className="flex flex-1 flex-col">
      <SectionRoadmapHero />
      <SectionRoadmap />
    </main>
  )
}
