'use client'

import { Geist } from 'next/font/google'
import { useEffect } from 'react'
import { ErrorPage } from '@/components/error-page'
import { Button } from '@/components/ui/button'
import './globals.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans' })

export default function GlobalError({
  error,
  retry
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" className={`h-full font-sans antialiased ${sans.variable}`}>
      <body className="flex min-h-full flex-col">
        <title>Something went wrong</title>
        <ErrorPage
          code="500"
          title="Something went wrong"
          description="An unexpected error occurred. Try again, or head back home."
        >
          <Button onClick={retry}>Try again</Button>
        </ErrorPage>
      </body>
    </html>
  )
}
