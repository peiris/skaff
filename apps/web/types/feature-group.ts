import type { LucideIcon } from 'lucide-react'

export type FeatureRow = {
  icon: LucideIcon
  title: string
  detail: string
}

export type FeatureGroup = {
  value: string
  label: string
  summary: string
  rows: FeatureRow[]
}
