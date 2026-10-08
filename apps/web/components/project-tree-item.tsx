import type { ProjectNode } from '@/types/project-tree'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils/cn'

type ProjectTreeItemProps = { node: ProjectNode; depth: number }

export function ProjectTreeItem({ node, depth }: ProjectTreeItemProps) {
  const row = cn('flex h-7 w-full items-center justify-between gap-4 pr-5', {
    'pl-5': depth === 0,
    'pl-9': depth === 1,
    'pl-13': depth === 2,
    'pl-17': depth === 3,
    'pl-21': depth >= 4
  })
  const tag = node.tag ? <span className="shrink-0 text-xs text-chart-1">{node.tag}</span> : null

  if (!node.children) {
    return (
      <li className={row}>
        <span className="flex min-w-0 items-center gap-2">
          <span aria-hidden="true" className="invisible w-2 shrink-0">
            ›
          </span>
          <span className="truncate">{node.name}</span>
        </span>
        {tag}
      </li>
    )
  }

  return (
    <li>
      <Collapsible defaultOpen={node.defaultOpen}>
        <CollapsibleTrigger className="group flex w-full text-left">
          <span
            className={cn(
              row,
              'transition-colors group-hover:bg-muted group-focus-visible:bg-muted'
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                className="w-2 shrink-0 text-center opacity-50 transition-transform group-data-panel-open:rotate-90"
              >
                ›
              </span>
              <span className="truncate">{node.name}</span>
            </span>
            {tag}
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul>
            {node.children.map((child) => (
              <ProjectTreeItem key={child.name} node={child} depth={depth + 1} />
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}
