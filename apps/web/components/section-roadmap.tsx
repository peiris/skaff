import { CheckIcon, CircleDashedIcon } from 'lucide-react'
import { MotionReveal } from '@/components/motion-reveal'
import { SectionContainer } from '@/components/section-container'
import { Badge } from '@/components/ui/badge'
import { roadmap } from '@/lib/roadmap'

export function SectionRoadmap() {
  return (
    <section className="py-8 md:py-10">
      <SectionContainer>
        <MotionReveal className="grid items-start gap-6 lg:grid-cols-3">
          {roadmap.map((group) => (
            <div key={group.status} className="flex flex-col gap-4 rounded-md bg-card p-4 md:p-6">
              <div className="flex items-center justify-between px-2 pt-2">
                <h2 className="font-heading text-2xl font-medium tracking-tight">{group.label}</h2>
                <Badge variant={group.status === 'shipped' ? 'default' : 'secondary'}>
                  {group.items.length}
                </Badge>
              </div>
              <ol className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item.title} className="flex gap-3 rounded-lg bg-muted p-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-card">
                      {group.status === 'shipped' ? (
                        <CheckIcon className="size-4" />
                      ) : (
                        <CircleDashedIcon className="size-4" />
                      )}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {item.date ? (
                        <time className="text-xs text-muted-foreground">{item.date}</time>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </MotionReveal>
      </SectionContainer>
    </section>
  )
}
