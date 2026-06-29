import type { ReactNode } from 'react'

type Color = 'blue' | 'green' | 'amber' | 'red' | 'slate'

interface Props {
  color?: Color
  dot?: boolean
  children: ReactNode
}

const COLOR_MAP: Record<Color, string> = {
  blue:  'bg-blue-50 text-blue-700',
  green: 'bg-safe-muted text-safe',
  amber: 'bg-warn-muted text-warn',
  red:   'bg-danger-muted text-danger',
  slate: 'bg-slate-100 text-slate-500',
}

const DOT_MAP: Record<Color, string> = {
  blue:  'bg-blue-500',
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red:   'bg-red-500',
  slate: 'bg-slate-400',
}

export default function Badge({ color = 'slate', dot = false, children }: Props) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-hint font-semibold ${COLOR_MAP[color]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_MAP[color]}`} />}
      {children}
    </span>
  )
}
