import type { FeatureGroup } from '@/types/feature-group'

type FeaturePillListProps = { group: FeatureGroup }

export function FeaturePillList({ group }: FeaturePillListProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">{group.label}</h3>
        <p className="text-sm text-muted-foreground">{group.summary}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {group.rows.map((row) => (
          <li
            key={row.title}
            className="flex items-center gap-2 rounded-full bg-card py-1.5 pr-4 pl-1.5 text-sm font-medium text-card-foreground shadow-sm ring-1 ring-foreground/5"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <row.icon className="size-3.5" aria-hidden="true" />
            </span>
            {row.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
