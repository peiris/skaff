import type { ProjectNode } from '@/types/project-tree'

export const projectTree: ProjectNode[] = [
  {
    name: '.agents',
    tag: 'Agent skills',
    defaultOpen: false,
    children: [
      {
        name: 'skills',
        tag: null,
        defaultOpen: false,
        children: [
          {
            name: 'agent-browser',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-cache-components-adoption',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-cache-components-optimizer',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-dev-loop',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-partial-prefetching-adoption',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-partial-prefetching-optimizer',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'shadcn',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'vercel-composition-patterns',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'vercel-react-best-practices',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          }
        ]
      }
    ]
  },
  {
    name: '.claude',
    tag: 'Claude settings + skills',
    defaultOpen: false,
    children: [
      {
        name: 'skills',
        tag: null,
        defaultOpen: false,
        children: [
          {
            name: 'agent-browser',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-cache-components-adoption',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-cache-components-optimizer',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-dev-loop',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-partial-prefetching-adoption',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'next-partial-prefetching-optimizer',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'shadcn',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'vercel-composition-patterns',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          },
          {
            name: 'vercel-react-best-practices',
            tag: null,
            defaultOpen: false,
            children: [{ name: 'SKILL.md', tag: null, children: null, defaultOpen: false }]
          }
        ]
      },
      { name: 'settings.json', tag: 'Pre-approved scripts', children: null, defaultOpen: false }
    ]
  },
  {
    name: 'app',
    tag: null,
    defaultOpen: true,
    children: [
      {
        name: '(auth)',
        tag: 'Authentication',
        defaultOpen: false,
        children: [
          {
            name: 'emulated-sign-in',
            tag: null,
            defaultOpen: false,
            children: [
              {
                name: '[provider]',
                tag: null,
                defaultOpen: false,
                children: [
                  { name: 'page.tsx', tag: 'Account picker', children: null, defaultOpen: false }
                ]
              }
            ]
          },
          {
            name: 'sign-in',
            tag: null,
            defaultOpen: false,
            children: [
              { name: 'page.tsx', tag: 'Sign-in page', children: null, defaultOpen: false }
            ]
          }
        ]
      },
      {
        name: '(dashboard)',
        tag: 'Member dashboard',
        defaultOpen: false,
        children: [
          {
            name: 'dashboard',
            tag: null,
            defaultOpen: false,
            children: [
              { name: 'page.tsx', tag: 'Protected member page', children: null, defaultOpen: false }
            ]
          }
        ]
      },
      {
        name: '(marketing)',
        tag: null,
        defaultOpen: false,
        children: [{ name: 'page.tsx', tag: 'Homepage', children: null, defaultOpen: false }]
      },
      {
        name: 'api',
        tag: 'Auth route handler',
        defaultOpen: false,
        children: [
          {
            name: 'auth',
            tag: null,
            defaultOpen: false,
            children: [
              {
                name: '[...all]',
                tag: null,
                defaultOpen: false,
                children: [
                  {
                    name: 'route.ts',
                    tag: 'Better Auth handler',
                    children: null,
                    defaultOpen: false
                  }
                ]
              }
            ]
          },
          {
            name: 'emulate',
            tag: null,
            defaultOpen: false,
            children: [
              {
                name: '[...path]',
                tag: null,
                defaultOpen: false,
                children: [
                  { name: 'route.ts', tag: 'OAuth emulators', children: null, defaultOpen: false }
                ]
              }
            ]
          }
        ]
      },
      { name: 'error.tsx', tag: 'Route error boundary', children: null, defaultOpen: false },
      { name: 'favicon.ico', tag: null, children: null, defaultOpen: false },
      { name: 'forbidden.tsx', tag: '403', children: null, defaultOpen: false },
      { name: 'global-error.tsx', tag: 'Root error boundary', children: null, defaultOpen: false },
      { name: 'globals.css', tag: '@theme tokens', children: null, defaultOpen: false },
      { name: 'layout.tsx', tag: 'Fonts, metadata, providers', children: null, defaultOpen: false },
      { name: 'not-found.tsx', tag: '404', children: null, defaultOpen: false },
      { name: 'unauthorized.tsx', tag: '401', children: null, defaultOpen: false }
    ]
  },
  {
    name: 'components',
    tag: null,
    defaultOpen: false,
    children: [
      {
        name: 'providers',
        tag: 'Theme + Query providers',
        defaultOpen: false,
        children: [
          { name: 'query-provider.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'theme-provider.tsx', tag: null, children: null, defaultOpen: false }
        ]
      },
      {
        name: 'ui',
        tag: 'shadcn/ui, all components',
        defaultOpen: false,
        children: [
          { name: 'accordion.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'alert-dialog.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'alert.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'aspect-ratio.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'attachment.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'avatar.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'badge.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'breadcrumb.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'bubble.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'button-group.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'button.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'calendar.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'card.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'carousel.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'chart.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'checkbox.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'collapsible.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'combobox.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'command.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'context-menu.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'dialog.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'direction.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'drawer.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'dropdown-menu.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'empty.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'field.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'hover-card.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'input-group.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'input-otp.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'input.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'item.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'kbd.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'label.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'marker.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'menubar.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'message-scroller.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'message.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'native-select.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'navigation-menu.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'pagination.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'popover.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'progress.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'questionnaire.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'radio-group.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'resizable.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'scroll-area.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'select.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'separator.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'sheet.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'sidebar.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'skeleton.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'slider.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'spinner.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'switch.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'table.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'tabs.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'textarea.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'toast.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'toggle-group.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'toggle.tsx', tag: null, children: null, defaultOpen: false },
          { name: 'tooltip.tsx', tag: null, children: null, defaultOpen: false }
        ]
      },
      { name: 'auth-sign-in-buttons.tsx', tag: null, children: null, defaultOpen: false },
      { name: 'auth-sign-out-button.tsx', tag: null, children: null, defaultOpen: false },
      { name: 'auth-signed-in-redirect.tsx', tag: null, children: null, defaultOpen: false },
      { name: 'dashboard-welcome.tsx', tag: null, children: null, defaultOpen: false },
      { name: 'emulated-account-picker.tsx', tag: null, children: null, defaultOpen: false },
      { name: 'error-page.tsx', tag: 'Shared error layout', children: null, defaultOpen: false },
      { name: 'motion-reveal.tsx', tag: 'Scroll-in reveal', children: null, defaultOpen: false },
      {
        name: 'section-container.tsx',
        tag: 'Width and gutters',
        children: null,
        defaultOpen: false
      }
    ]
  },
  {
    name: 'lib',
    tag: null,
    defaultOpen: false,
    children: [
      {
        name: 'actions',
        tag: null,
        defaultOpen: false,
        children: [{ name: '.gitkeep', tag: null, children: null, defaultOpen: false }]
      },
      {
        name: 'auth',
        tag: 'Better Auth',
        defaultOpen: false,
        children: [
          { name: 'client.ts', tag: null, children: null, defaultOpen: false },
          { name: 'emulated-accounts.ts', tag: null, children: null, defaultOpen: false },
          { name: 'emulated-providers.ts', tag: null, children: null, defaultOpen: false },
          { name: 'server.ts', tag: null, children: null, defaultOpen: false }
        ]
      },
      {
        name: 'hooks',
        tag: null,
        defaultOpen: false,
        children: [{ name: 'use-mobile.ts', tag: null, children: null, defaultOpen: false }]
      },
      {
        name: 'utils',
        tag: null,
        defaultOpen: false,
        children: [{ name: 'cn.ts', tag: null, children: null, defaultOpen: false }]
      },
      { name: 'site.ts', tag: 'Site metadata', children: null, defaultOpen: false }
    ]
  },
  {
    name: 'public',
    tag: null,
    defaultOpen: false,
    children: [{ name: '.gitkeep', tag: null, children: null, defaultOpen: false }]
  },
  {
    name: 'types',
    tag: null,
    defaultOpen: false,
    children: [{ name: '.gitkeep', tag: null, children: null, defaultOpen: false }]
  },
  { name: '.env.local', tag: 'Emulated authentication', children: null, defaultOpen: false },
  { name: '.gitignore', tag: null, children: null, defaultOpen: false },
  { name: 'AGENTS.md', tag: 'Rules for coding agents', children: null, defaultOpen: false },
  { name: 'CLAUDE.md', tag: null, children: null, defaultOpen: false },
  { name: 'components.json', tag: null, children: null, defaultOpen: false },
  { name: 'next-env.d.ts', tag: null, children: null, defaultOpen: false },
  { name: 'next.config.ts', tag: null, children: null, defaultOpen: false },
  { name: 'oxfmt.config.ts', tag: 'Oxfmt', children: null, defaultOpen: false },
  { name: 'oxlint.config.ts', tag: 'Oxlint + anti-slop', children: null, defaultOpen: false },
  { name: 'package.json', tag: null, children: null, defaultOpen: false },
  { name: 'pnpm-lock.yaml', tag: null, children: null, defaultOpen: false },
  { name: 'pnpm-workspace.yaml', tag: null, children: null, defaultOpen: false },
  { name: 'postcss.config.mjs', tag: null, children: null, defaultOpen: false },
  { name: 'proxy.ts', tag: 'Route guard', children: null, defaultOpen: false },
  { name: 'README.md', tag: 'What’s inside', children: null, defaultOpen: false },
  { name: 'skills-lock.json', tag: null, children: null, defaultOpen: false },
  { name: 'sqlite.db', tag: null, children: null, defaultOpen: false },
  { name: 'tsconfig.json', tag: null, children: null, defaultOpen: false }
]
