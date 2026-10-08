'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils/cn'

type CommandSnippetProps = { className?: string }

export function CommandSnippet({ className }: CommandSnippetProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(site.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'flex w-full max-w-sm items-center gap-3 rounded-full bg-muted py-1 pr-1 pl-5 text-foreground',
        className
      )}
    >
      <code className="flex-1 truncate text-left font-mono text-sm">{site.command}</code>
      <Button size="icon-sm" aria-label={copied ? 'Copied' : 'Copy command'} onClick={copy}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}
