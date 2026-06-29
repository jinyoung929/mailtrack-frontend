import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  desc: string
}

export default function FeatureItem({ icon, title, desc }: Props) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-caption font-semibold text-white/80">{title}</p>
        <p className="text-hint text-white/35 mt-0.5">{desc}</p>
      </div>
    </div>
  )
}
