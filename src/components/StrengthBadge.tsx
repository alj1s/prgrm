import { cn } from '#/lib/utils'
import { strengthLevelBadge } from '#/lib/strength-standards'
import type { StrengthLevel } from '#/lib/strength-standards'

export function StrengthBadge({ level }: { level: StrengthLevel }) {
  return (
    <span
      className={cn(
        'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border',
        strengthLevelBadge[level],
      )}
    >
      {level}
    </span>
  )
}
