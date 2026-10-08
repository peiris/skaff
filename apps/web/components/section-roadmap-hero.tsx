import Link from 'next/link'
import { MotionReveal } from '@/components/motion-reveal'
import { SectionContainer } from '@/components/section-container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/site'

export function SectionRoadmapHero() {
  return (
    <section className="py-8 md:py-10">
      <SectionContainer>
        <MotionReveal className="flex flex-col items-center gap-6 rounded-3xl bg-card px-6 py-16 text-center md:py-24">
          <Badge variant="secondary">Built in the open</Badge>
          <h1 className="font-heading text-5xl font-medium tracking-tight md:text-7xl">
            <span className="text-muted-foreground">The</span> Roadmap
          </h1>
          <p className="max-w-lg text-lg text-balance text-muted-foreground">
            What has shipped, what is next and what is further out.
          </p>
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={`${site.repo}/issues`} target="_blank" rel="noopener" />}
          >
            Suggest something
          </Button>
        </MotionReveal>
      </SectionContainer>
    </section>
  )
}
