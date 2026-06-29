interface Props {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  gmailConnected?: boolean
}

export default function Topbar({ title, subtitle, onMenuClick, gmailConnected }: Props) {
  const connected = gmailConnected ?? sessionStorage.getItem('gmail_connected') === 'true'

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-4 md:px-7 py-3.5 flex items-center gap-3"
      style={{ borderBottom: '1px solid #e9e9e7' }}>
      <button
        onClick={onMenuClick}
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
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

      {connected ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
          style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-hint font-semibold text-green-700">Gmail 연동됨</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="text-hint font-semibold text-slate-400">Gmail 미연동</span>
        </div>
      )}
    </header>
  )
}
