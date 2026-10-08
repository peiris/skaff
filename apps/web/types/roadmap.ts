export type RoadmapStatus = 'shipped' | 'next' | 'later'

export type RoadmapItem = {
  title: string
  description: string
  date: string | null
}

export type RoadmapGroup = {
  status: RoadmapStatus
  label: string
  items: RoadmapItem[]
}
