import type { FeatureGroup } from '@/types/feature-group'
import {
  BotIcon,
  BracesIcon,
  BrushIcon,
  CompassIcon,
  FileWarningIcon,
  GlobeIcon,
  KeyRoundIcon,
  LayersIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  ScrollTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SquareTerminalIcon,
  UserRoundCheckIcon,
  WandSparklesIcon
} from 'lucide-react'

export const featureGroups: FeatureGroup[] = [
  {
    value: 'stack',
    label: 'Stack',
    summary:
      'The App Router, Tailwind v4 tokens and every shadcn/ui component, themed for light and dark.',
    rows: [
      { icon: LayersIcon, title: 'Next.js', detail: 'App Router with TypeScript' },
      { icon: PaletteIcon, title: 'Tailwind CSS v4', detail: 'Tokens declared in @theme' },
      { icon: BrushIcon, title: 'shadcn/ui', detail: 'Every component, light and dark' },
      { icon: WandSparklesIcon, title: 'Motion', detail: 'Scroll-in reveals' }
    ]
  },
  {
    value: 'auth',
    label: 'Authentication',
    summary:
      'Google and GitHub authentication with a protected dashboard, working before you register a single OAuth app.',
    rows: [
      { icon: KeyRoundIcon, title: 'Better Auth', detail: 'Google and GitHub providers' },
      { icon: UserRoundCheckIcon, title: 'Emulated accounts', detail: 'No OAuth apps to set up' },
      { icon: LayoutDashboardIcon, title: '/dashboard', detail: 'Protected member page' },
      { icon: ShieldCheckIcon, title: 'proxy.ts', detail: 'Route guard before render' }
    ]
  },
  {
    value: 'agents',
    label: 'AI agents',
    summary:
      'Rules, skills and a real browser, so your coding agent follows the project conventions from the first prompt.',
    rows: [
      { icon: ScrollTextIcon, title: 'AGENTS.md', detail: 'Rules for coding agents' },
      { icon: SparklesIcon, title: 'Claude Code', detail: 'Skills and settings' },
      { icon: BotIcon, title: 'Codex', detail: 'Skills installed' },
      { icon: GlobeIcon, title: 'agent-browser', detail: 'A real browser to test in' }
    ]
  },
  {
    value: 'quality',
    label: 'Quality',
    summary:
      'Lint, format and typecheck scripts plus error pages, so the boring parts are done before you start.',
    rows: [
      { icon: CompassIcon, title: 'Oxlint', detail: 'Anti-slop rules' },
      { icon: BracesIcon, title: 'Oxfmt', detail: 'Formatting on save' },
      { icon: SquareTerminalIcon, title: 'typecheck', detail: 'A script for tsc' },
      { icon: FileWarningIcon, title: 'Error pages', detail: '404, 403, 401 and 500' }
    ]
  }
]
