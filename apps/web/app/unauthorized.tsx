import { ErrorPage } from '@/components/error-page'

export default function Unauthorized() {
  return (
    <ErrorPage
      code="401"
      title="Sign in required"
      description="You need to be signed in to view this page."
    />
  )
}
