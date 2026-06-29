import { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import { navMain, navAnalysis } from '../constants/nav'
import { fetchKeywords, addKeyword, toggleKeyword, deleteKeyword } from '../lib/keywordService'
import type { SpamKeyword, Page } from '../types'

interface Props {
  onNavigate: (page: Page) => void
  activePage: Page
}

export default function SmartFilterPage({ onNavigate, activePage }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [keywords, setKeywords] = useState<SpamKeyword[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [adding, setAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchKeywords()
      .then(setKeywords)
      .catch(() => setError('키워드를 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd() {
    if (adding) return
    const trimmed = input.trim()
    if (!trimmed) return
    if (keywords.some(k => k.keyword === trimmed)) {
      alert('이미 등록된 키워드입니다.')
      return
    }
    setAdding(true)
    try {
      const newKeyword = await addKeyword(trimmed)
      setKeywords(prev => [newKeyword, ...prev])
      setInput('')
      inputRef.current?.focus()
    } catch {
      alert('키워드 추가 중 오류가 발생했습니다.')
    } finally {
      setAdding(false)
    }
  }

  async function handleToggle(id: number, current: boolean) {
    setKeywords(prev => prev.map(k => k.id === id ? { ...k, is_active: !current } : k))
    try {
      await toggleKeyword(id, !current)
    } catch {
      setKeywords(prev => prev.map(k => k.id === id ? { ...k, is_active: current } : k))
    }
  }

  async function handleDelete(id: number) {
    setKeywords(prev => prev.filter(k => k.id !== id))
    try {
      await deleteKeyword(id)
    } catch {
      alert('삭제 중 오류가 발생했습니다.')
      fetchKeywords().then(setKeywords)
    }
  }

  const activeCount   = keywords.filter(k => k.is_active).length
  const inactiveCount = keywords.filter(k => !k.is_active).length

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar
        mainNav={navMain}
        analysisNav={navAnalysis}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={onNavigate}
      />
      <main className="lg:ml-60 flex-1 flex flex-col w-full">
        <Topbar
          title="스마트 필터"
          subtitle="스팸 키워드를 직접 관리하세요"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-7 flex flex-col gap-4 md:gap-5 max-w-2xl">

          {/* 통계 */}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-3">
              <StatChip
                label="활성 키워드"
                value={activeCount}
                color="text-brand"
                bg="bg-blue-50"
                iconStroke="#0ea5e9"
                icon="check"
              />
              <StatChip
                label="비활성 키워드"
                value={inactiveCount}
                color="text-slate-500"
                bg="bg-slate-100"
                iconStroke="#94a3b8"
                icon="x"
              />
            </div>
          )}

          {/* 키워드 추가 */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-4 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="차단할 키워드 입력 (예: 무료 수령, 긴급 처리)"
              className="flex-1 text-body text-dark placeholder-slate-400 bg-transparent outline-none"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim() || adding}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand text-white text-body font-medium
                disabled:opacity-60 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors duration-150 shrink-0"
            >
              {adding ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
              추가
            </button>
          </div>

          {/* 키워드 목록 */}
          {loading && <LoadingState />}
          {error   && <ErrorState message={error} />}

          {!loading && !error && (
            keywords.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* 활성 섹션 */}
                {keywords.filter(k => k.is_active).length > 0 && (
                  <KeywordSection
                    title="활성"
                    keywords={keywords.filter(k => k.is_active)}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                )}
                {/* 비활성 섹션 */}
                {keywords.filter(k => !k.is_active).length > 0 && (
                  <KeywordSection
                    title="비활성"
                    keywords={keywords.filter(k => !k.is_active)}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    dimmed
                  />
                )}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}

/* ── Keyword Section ─────────────────────────────────────── */

function KeywordSection({ title, keywords, onToggle, onDelete, dimmed }: {
  title: string
  keywords: SpamKeyword[]
  onToggle: (id: number, current: boolean) => void
  onDelete: (id: number) => void
  dimmed?: boolean
}) {
  return (
    <div>
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
        <p className="text-hint font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
      </div>
      {keywords.map((kw, i) => (
        <KeywordRow
          key={kw.id}
          keyword={kw}
          last={i === keywords.length - 1}
          dimmed={dimmed}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

/* ── Keyword Row ─────────────────────────────────────────── */

function KeywordRow({ keyword: kw, last, dimmed, onToggle, onDelete }: {
  keyword: SpamKeyword
  last: boolean
  dimmed?: boolean
  onToggle: (id: number, current: boolean) => void
  onDelete: (id: number) => void
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${!last ? 'border-b border-slate-100' : ''}`}>
      {/* 키워드 */}
      <div className={`w-2 h-2 rounded-full shrink-0 ${kw.is_active ? 'bg-brand' : 'bg-slate-300'}`} />
      <span className={`flex-1 text-body font-medium ${dimmed ? 'text-slate-400' : 'text-dark'}`}>{kw.keyword}</span>

      {/* 토글 */}
      <button
        onClick={() => onToggle(kw.id, kw.is_active)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 overflow-hidden
          ${kw.is_active ? 'bg-brand' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 left-0 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200
          ${kw.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
        />
      </button>

      {/* 삭제 */}
      <button
        onClick={() => onDelete(kw.id)}
        className="w-6 h-6 flex items-center justify-center rounded-md text-slate-300 hover:text-danger hover:bg-red-50 transition-colors duration-150 shrink-0"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  )
}

/* ── Stat Chip ───────────────────────────────────────────── */

function StatChip({ label, value, color, bg, iconStroke, icon }: {
  label: string; value: number; color: string; bg: string; iconStroke: string; icon: 'check' | 'x'
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
        {icon === 'check' ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>
      <div>
        <p className={`text-stat font-bold leading-none ${color}`}>{value}</p>
        <p className="text-caption text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

/* ── States ──────────────────────────────────────────────── */

function LoadingState() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-12 text-center">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-body text-slate-500">키워드를 불러오는 중...</p>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-white border border-red-200 rounded-xl px-6 py-12 text-center">
      <p className="text-body text-danger">{message}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </div>
      <p className="text-body font-medium text-slate-600">등록된 키워드 없음</p>
      <p className="text-caption text-slate-400 mt-1">위 입력창에서 차단할 키워드를 추가해보세요</p>
    </div>
  )
}
