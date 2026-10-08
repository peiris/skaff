export type ProjectNode = {
  name: string
  tag: string | null
  children: ProjectNode[] | null
  defaultOpen: boolean
}
