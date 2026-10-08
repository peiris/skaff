import type { Metadata } from 'next'
import { SectionFaq } from '@/components/section-faq'
import { SectionFeatures } from '@/components/section-features'
import { SectionHero } from '@/components/section-hero'
import { SectionShowcase } from '@/components/section-showcase'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: { absolute: `${site.name} · ${site.tagline}` }
}

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <SectionHero />
      <SectionFeatures />
      <SectionShowcase />
      <SectionFaq />
    </main>
  )
}
