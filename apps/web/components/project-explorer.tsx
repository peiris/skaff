import { ProjectTreeItem } from '@/components/project-tree-item'
import { projectTree } from '@/lib/project-tree'

export function ProjectExplorer() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-md border bg-card font-mono text-card-foreground">
      <div className="flex h-10 items-center gap-2 border-b px-4">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
      </div>
      <p className="flex h-10 items-center border-b px-5 text-xs tracking-widest uppercase">
        my-app
      </p>
      <ul
        aria-label="Project structure of a new Skaff app"
        className="max-h-160 overflow-y-auto py-2 text-xs md:text-sm"
      >
        {projectTree.map((node) => (
          <ProjectTreeItem key={node.name} node={node} depth={0} />
        ))}
      </ul>
    </div>
  )
}
