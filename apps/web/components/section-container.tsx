import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type SectionContainerProps = { children: ReactNode; className?: string }

export function SectionContainer({ children, className }: SectionContainerProps) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 md:px-6', className)}>{children}</div>
}
