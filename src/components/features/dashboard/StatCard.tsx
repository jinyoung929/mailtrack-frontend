interface Props {
  label: string
  value: number
  sub?: string
  accent?: string
}

export default function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div className="bg-white rounded-xl px-5 py-4 flex flex-col gap-1"
      style={{ border: '1px solid #e9e9e7' }}>
      <p className="text-hint font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-stat font-bold leading-none" style={{ color: accent ?? '#6366f1' }}>
        {value.toLocaleString()}
      </p>
      {sub && <p className="text-hint text-slate-400">{sub}</p>}
    </div>
  )
}
