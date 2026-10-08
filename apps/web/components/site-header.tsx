import Link from 'next/link'
import { SectionContainer } from '@/components/section-container'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/site'

export function SiteHeader() {
  return (
    <header id="top" className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <SectionContainer className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          <span className="text-muted-foreground">Sk</span>aff
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            className="hidden md:inline-flex"
            nativeButton={false}
            render={<Link href="/#features" />}
          >
            Features
          </Button>
          <Button
            variant="ghost"
            className="hidden md:inline-flex"
            nativeButton={false}
            render={<Link href="/#faq" />}
          >
            FAQ
          </Button>
          <Button variant="ghost" nativeButton={false} render={<Link href="/roadmap" />}>
            Roadmap
          </Button>
          <ThemeToggle />
          <Button
            nativeButton={false}
            render={<Link href={site.repo} target="_blank" rel="noopener" />}
          >
            GitHub
          </Button>
        </nav>
      </SectionContainer>
    </header>
  )
}
