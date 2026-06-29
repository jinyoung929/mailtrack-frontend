import type { NavItem, Page } from '../../types'

interface Props {
  mainNav: NavItem[]
  analysisNav: NavItem[]
  open: boolean
  onClose: () => void
  activePage?: Page
  onNavigate?: (page: Page) => void
}

export default function Sidebar({ mainNav, analysisNav, open, onClose, activePage, onNavigate }: Props) {
  const content = (
    <aside className="w-60 h-full bg-dark flex flex-col px-5 py-7 overflow-y-auto">
      {/* 브랜드 */}
      <div className="mb-8">
        <p className="font-serif text-[18px] font-bold text-white tracking-tight leading-none">메일트랙</p>
        <p className="text-hint text-white/30 mt-1.5 leading-relaxed">AI 이메일 보안 센티널</p>
      </div>

      {/* 메인 네비 */}
      <NavSection label="메인" items={mainNav} activePage={activePage} onNavigate={onNavigate} onClose={onClose} />

      {/* 분석 네비 */}
      <div className="mt-6">
        <NavSection label="분석" items={analysisNav} activePage={activePage} onNavigate={onNavigate} onClose={onClose} />
      </div>

      {/* 하단 유저 */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p className="text-caption font-medium text-white/80">사용자</p>
            <p className="text-hint text-white/30">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* 데스크탑: fixed sidebar */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-60">
        {content}
      </div>

      {/* 모바일: overlay drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-60 h-full z-50">
            {content}
          </div>
        </div>
      )}
    </>
  )
}

/* ── Nav Section ─────────────────────────────────────────── */

function NavSection({ label, items, activePage, onNavigate, onClose }: {
  label: string
  items: NavItem[]
  activePage?: Page
  onNavigate?: (page: Page) => void
  onClose: () => void
}) {
  return (
    <div>
      <p className="text-hint font-semibold text-white/25 uppercase tracking-widest mb-2 px-2">{label}</p>
      <nav className="flex flex-col gap-0.5">
        {items.map(item => {
          const active = activePage === item.page
          return (
            <button
              key={item.page}
              onClick={() => { onNavigate?.(item.page); onClose() }}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-body transition-all duration-150 text-left
                ${active
                  ? 'bg-brand/10 text-brand-pale font-medium'
                  : 'text-white/45 hover:bg-white/5 hover:text-white/70'
                }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
