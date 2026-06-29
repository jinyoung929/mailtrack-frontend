import { useState, useEffect } from 'react'
import type { NavItem, Page } from '../../types'

interface Props {
  mainNav: NavItem[]
  analysisNav: NavItem[]
  open: boolean
  onClose: () => void
  activePage?: Page
  onNavigate?: (page: Page) => void
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export default function Sidebar({ mainNav, analysisNav, open, onClose, activePage, onNavigate }: Props) {
  const [user, setUser] = useState<{ name?: string; email?: string; picture?: string } | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('gmail_connected') === 'true') {
      const cached = sessionStorage.getItem('user_info'); if (cached) { setUser(JSON.parse(cached)); return }; fetch(`${API_BASE}/auth/me`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setUser(data) })
        .catch(() => {})
    }
  }, [])

  const content = (
    <aside className="w-60 h-full flex flex-col px-3 py-5 overflow-y-auto bg-white"
      style={{ borderRight: '1px solid #e9e9e7' }}>
      {/* 브랜드 */}
      <div className="px-3 mb-6">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p className="text-[15px] font-bold text-dark tracking-tight">메일트랙</p>
        </div>
        <p className="text-hint text-slate-400 pl-8">AI 이메일 보안</p>
      </div>

      <NavSection label="메인" items={mainNav} activePage={activePage} onNavigate={onNavigate} onClose={onClose} />
      <div className="mt-4">
        <NavSection label="분석" items={analysisNav} activePage={activePage} onNavigate={onNavigate} onClose={onClose} />
      </div>

      <div className="mt-auto pt-4 mx-3" style={{ borderTop: '1px solid #e9e9e7' }}>
        <div className="flex items-center gap-2 py-2">
          {user?.picture ? (
            <img src={user.picture} className="w-6 h-6 rounded-full shrink-0" alt="프로필" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-caption font-medium text-dark truncate">
              {user?.name ?? '사용자'}
            </p>
            <p className="text-hint text-slate-400 truncate">
              {user?.email ?? 'Google로 로그인하세요'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      <div className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-60">
        {content}
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-60 h-full z-50">
            {content}
          </div>
        </div>
      )}
    </>
  )
}

function NavSection({ label, items, activePage, onNavigate, onClose }: {
  label: string
  items: NavItem[]
  activePage?: Page
  onNavigate?: (page: Page) => void
  onClose: () => void
}) {
  return (
    <div>
      <p className="text-hint font-semibold text-slate-400 uppercase tracking-widest mb-1 px-3">{label}</p>
      <nav className="flex flex-col gap-0.5">
        {items.map(item => {
          const active = activePage === item.page
          return (
            <button
              key={item.page}
              onClick={() => { onNavigate?.(item.page); onClose() }}
              className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-body transition-all duration-150 text-left"
              style={{
                background: active ? '#efefed' : 'transparent',
                color: active ? '#191919' : '#6b7280',
                fontWeight: active ? 500 : 400,
              }}
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
