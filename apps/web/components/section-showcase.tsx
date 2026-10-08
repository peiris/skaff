import { MotionReveal } from '@/components/motion-reveal'
import { ProjectExplorer } from '@/components/project-explorer'
import { SectionContainer } from '@/components/section-container'
import { Badge } from '@/components/ui/badge'

export function SectionShowcase() {
  return (
    <section id="structure" className="scroll-mt-16 py-16 md:py-24">
      <SectionContainer>
        <MotionReveal className="grid items-start gap-12 rounded-3xl bg-card p-6 text-card-foreground md:p-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-5 lg:sticky lg:top-24">
            <Badge variant="secondary">Project structure</Badge>
            <h2 className="font-heading text-4xl font-medium tracking-tight md:text-5xl">
              <span className="text-muted-foreground">Everything</span>
              <br />
              already wired.
            </h2>
            <p className="max-w-sm text-muted-foreground">
              Routes, components, authentication, linting and rules for your coding agent, each in a
              predictable place. Open a folder to look inside.
            </p>
          </div>
          <ProjectExplorer />
        </MotionReveal>
      </SectionContainer>
    </section>
  )
}
