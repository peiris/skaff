import { ArrowUpIcon } from 'lucide-react'
import Link from 'next/link'
import { CommandSnippet } from '@/components/command-snippet'
import { SectionContainer } from '@/components/section-container'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/site'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'npm', href: site.npm }
    ]
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: site.repo },
      { label: 'Issues', href: `${site.repo}/issues` }
    ]
  },
  {
    title: 'Author',
    links: [{ label: site.author.name, href: site.author.url }]
  }
]

export function SiteFooter() {
  return (
    <footer className="pb-4">
      <SectionContainer>
        <div className="flex flex-col gap-12 overflow-hidden rounded-3xl bg-panel py-12 text-panel-foreground md:gap-16 md:py-16">
          <div className="grid gap-12 px-6 md:grid-cols-2 md:px-12">
            <div className="flex flex-col items-start gap-5">
              <p className="text-2xl font-medium tracking-tight">
                Skip the setup.
                <br />
                <span className="opacity-60">Start building.</span>
              </p>
              <CommandSnippet />
            </div>
            <nav aria-label="Footer" className="grid grid-cols-3 gap-6 text-sm">
              {columns.map((column) => (
                <div key={column.title} className="flex flex-col gap-3">
                  <p className="font-medium">{column.title}</p>
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="opacity-60 transition-opacity hover:opacity-100"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex items-center justify-between px-6 text-xs md:px-12">
            <p className="opacity-60">MIT License</p>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Back to top"
              nativeButton={false}
              render={<Link href="#top" />}
            >
              <ArrowUpIcon />
            </Button>
          </div>
        </div>
      </SectionContainer>
    </footer>
  )
}
