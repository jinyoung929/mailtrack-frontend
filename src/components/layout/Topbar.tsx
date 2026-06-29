interface Props {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export default function Topbar({ title, subtitle, onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-7 py-3.5 flex items-center gap-3">
      {/* 모바일 햄버거 */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-subhead font-semibold text-dark leading-none">{title}</p>
        {subtitle && (
          <p className="text-hint text-slate-400 mt-0.5 leading-none">{subtitle}</p>
        )}
      </div>

      {/* 보안 상태 뱃지 */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-safe-muted shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-hint font-semibold text-safe">보안 강화 모드</span>
      </div>
    </header>
  )
}
