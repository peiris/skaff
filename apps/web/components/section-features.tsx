import { CommandSnippet } from '@/components/command-snippet'
import { FeaturePillList } from '@/components/feature-pill-list'
import { MotionReveal } from '@/components/motion-reveal'
import { SectionContainer } from '@/components/section-container'
import { Badge } from '@/components/ui/badge'
import { featureGroups } from '@/lib/feature-groups'

export function SectionFeatures() {
  return (
    <section id="features" className="scroll-mt-16 py-16 md:py-24">
      <SectionContainer className="grid items-start gap-12 lg:grid-cols-2">
        <MotionReveal className="flex flex-col items-center gap-5 text-center lg:sticky lg:top-24 lg:items-start lg:text-left">
          <Badge variant="secondary">What you can set up</Badge>
          <h2 className="font-heading text-4xl font-medium tracking-tight text-balance md:text-5xl">
            <span className="text-muted-foreground">Pick the pieces.</span>
            <br />
            Skip the wiring.
          </h2>
          <p className="max-w-sm text-balance text-muted-foreground">
            Every option is a question in the wizard. Only what you tick gets installed, and it is
            wired together before you open the editor.
          </p>
          <CommandSnippet />
        </MotionReveal>
        <MotionReveal className="flex flex-col gap-10" delay={0.1}>
          {featureGroups.map((group) => (
            <FeaturePillList key={group.value} group={group} />
          ))}
        </MotionReveal>
      </SectionContainer>
    </section>
  )
}
