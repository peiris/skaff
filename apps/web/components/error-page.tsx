import type { ReactNode } from 'react'
import Link from 'next/link'
import { SectionContainer } from '@/components/section-container'
import { Button } from '@/components/ui/button'

type ErrorPageProps = { code: string; title: string; description: string; children?: ReactNode }

export function ErrorPage({ code, title, description, children }: ErrorPageProps) {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-1 items-center py-24 md:py-32">
        <SectionContainer className="flex flex-col items-start gap-6">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-sm text-muted-foreground">{code}</p>
            <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              {title}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {children}
            <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
              Go home
            </Button>
          </div>
        </SectionContainer>
      </section>
    </main>
  )
}
