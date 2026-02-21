import { createFileRoute } from '@tanstack/react-router'
import { SignInForm } from '#/components/SignInForm'

export const Route = createFileRoute('/sign-in')({
  component: SignInForm,
})
