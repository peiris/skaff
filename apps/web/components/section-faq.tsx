import Link from 'next/link'
import { MotionReveal } from '@/components/motion-reveal'
import { SectionContainer } from '@/components/section-container'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { faqs } from '@/lib/faqs'
import { site } from '@/lib/site'

export function SectionFaq() {
  return (
    <section id="faq" className="scroll-mt-16 py-16 md:py-24">
      <SectionContainer className="grid items-start gap-12 lg:grid-cols-2">
        <MotionReveal className="flex flex-col items-start gap-5 lg:sticky lg:top-24">
          <Badge variant="secondary">FAQ</Badge>
          <h2 className="font-heading text-4xl font-medium tracking-tight md:text-5xl">
            <span className="text-muted-foreground">Before</span>
            <br />
            you run it.
          </h2>
          <p className="max-w-sm text-muted-foreground">
            Something else on your mind?{' '}
            <Link
              href={`${site.repo}/issues`}
              target="_blank"
              rel="noopener"
              className="text-foreground underline underline-offset-4"
            >
              Open an issue
            </Link>
            .
          </p>
        </MotionReveal>
        <MotionReveal className="rounded-3xl bg-card text-card-foreground" delay={0.1}>
          <Accordion>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </MotionReveal>
      </SectionContainer>
    </section>
  )
}
