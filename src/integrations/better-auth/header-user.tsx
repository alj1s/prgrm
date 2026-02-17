import { authClient } from '#/lib/auth-client'
import { Link } from '@tanstack/react-router'

export default function BetterAuthHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="h-8 w-8 bg-slate-700 animate-pulse rounded" />
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
          <span className="text-xs font-medium text-cyan-300">
            {session.user.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <button
          onClick={() => void authClient.signOut()}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Link
      to="/sign-in"
      className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
    >
      Sign in
    </Link>
  )
}
