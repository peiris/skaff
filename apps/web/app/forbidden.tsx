import { ErrorPage } from '@/components/error-page'

export default function Forbidden() {
  return (
    <ErrorPage
      code="403"
      title="Access denied"
      description="You do not have permission to view this page."
    />
  )
}
