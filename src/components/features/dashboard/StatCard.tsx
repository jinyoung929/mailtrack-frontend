interface Props {
  label: string
  value: number
  sub?: string
  accent?: string   // 숫자 색상 커스텀 (기본: dark)
}

export default function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col gap-1">
      <p className="text-hint font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-stat font-bold leading-none" style={{ color: accent ?? '#0f172a' }}>
        {value.toLocaleString()}
      </p>
      {sub && <p className="text-hint text-slate-400">{sub}</p>}
    </div>
  )
}
