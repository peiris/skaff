import type { RoadmapGroup } from '@/types/roadmap'

export const roadmap: RoadmapGroup[] = [
  {
    status: 'shipped',
    label: 'Shipped',
    items: [
      {
        title: 'Interactive terminal wizard',
        description:
          'Pick a package manager, icons, font, extras and a shadcn/ui preset, then watch every step install and wire itself up.',
        date: 'Sep 23, 2026'
      },
      {
        title: 'Authentication without OAuth apps',
        description:
          'Better Auth ships with emulated Google and GitHub accounts, so authentication works the moment the dev server starts.',
        date: 'Sep 23, 2026'
      },
      {
        title: 'Ultracite linting',
        description:
          'Oxlint and Oxfmt with anti-slop rules, a typecheck script and VS Code settings.',
        date: 'Sep 23, 2026'
      },
      {
        title: 'Project overview page',
        description:
          'Every new app opens on a page listing what is installed, where it lives and what to do next.',
        date: 'Sep 23, 2026'
      },
      {
        title: 'agent-browser',
        description:
          'Installed with its browser downloaded, so coding agents can load and test pages on their own.',
        date: 'Sep 24, 2026'
      }
    ]
  },
  {
    status: 'next',
    label: 'Next',
    items: [
      {
        title: 'Database with Drizzle',
        description: 'An optional Drizzle ORM setup with migrations, alongside Better Auth.',
        date: null
      },
      {
        title: 'Non-interactive mode',
        description:
          'Flags for every prompt, so CI jobs and coding agents can scaffold without the terminal UI.',
        date: null
      }
    ]
  },
  {
    status: 'later',
    label: 'Later',
    items: [
      {
        title: 'More authentication providers',
        description: 'Pick providers beyond Google and GitHub from the wizard.',
        date: null
      },
      {
        title: 'Deploy targets',
        description: 'One-step configuration for Vercel and Cloudflare.',
        date: null
      }
    ]
  }
]
