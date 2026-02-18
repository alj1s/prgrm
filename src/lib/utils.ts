import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const inputCls =
  'h-9 rounded-lg border border-slate-600 bg-slate-700/50 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors'
