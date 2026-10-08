import { ArrowUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import { CommandSnippet } from '@/components/command-snippet'
import { MotionReveal } from '@/components/motion-reveal'
import { SectionContainer } from '@/components/section-container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/site'

export function SectionHero() {
  return (
    <section className="pt-2 pb-16 md:pt-4 md:pb-24">
      <SectionContainer>
        <div className="flex flex-col items-center gap-12 overflow-hidden rounded-3xl bg-card px-4 pt-16 pb-4 text-center md:gap-16 md:px-20 md:pt-24 md:pb-8">
          <MotionReveal className="flex flex-col items-center gap-6">
            <Badge
              variant="secondary"
              render={<Link href={site.repo} target="_blank" rel="noopener" />}
            >
              Free and open source
              <ArrowUpRightIcon data-icon="inline-end" />
            </Badge>
            <h1 className="font-heading text-5xl font-medium tracking-tight text-balance md:text-7xl">
              <span className="text-muted-foreground">Skip the setup.</span>
              <br />
              Start building.
            </h1>
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <CommandSnippet />
              <Button
                variant="default"
                size="lg"
                nativeButton={false}
                render={<Link href={site.repo} target="_blank" rel="noopener" />}
              >
                Star on GitHub
              </Button>
            </div>
          </MotionReveal>
          <MotionReveal className="flex w-full justify-center" delay={0.1}>
            <video
              src="/hero-demo.mp4"
              poster="/hero-demo-poster.jpg"
              width={1600}
              height={1000}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Running npx create-skaff@latest: the wizard asks a few questions and sets up the project, then the new project opens in the editor"
              className="h-auto w-full max-w-5xl rounded-xl ring-1 ring-foreground/10"
            />
          </MotionReveal>
        </div>
      </SectionContainer>
    </section>
  )
}
