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

const QUICK_KEYWORDS = [
  '무료 수령', '긴급 처리', '계좌 정지', '본인인증',
  '당첨', '무심사 대출', '개인정보', '비밀번호 변경',
  '즉시 클릭', '한정 혜택', '이벤트 당첨', '보안 경고',
]

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

  async function handleAdd(keyword?: string) {
    if (adding) return
    const trimmed = (keyword ?? input).trim()
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
  const registeredKeywords = keywords.map(k => k.keyword)

  return (
    <div className="flex min-h-screen" style={{ background: '#f7f7f5' }}>
      <Sidebar
        mainNav={navMain}
        analysisNav={navAnalysis}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={onNavigate}
      />
      <main className="lg:ml-60 flex-1 flex flex-col w-full min-w-0">
        <Topbar
          title="스마트 필터"
          subtitle="스팸 키워드를 직접 관리하세요"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-7 flex flex-col gap-4 md:gap-5">

          {/* 통계 */}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl px-4 py-3.5 flex items-center gap-3"
                style={{ border: '1px solid #e9e9e7' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#eeecfb' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-stat font-bold leading-none text-dark">{activeCount}</p>
                  <p className="text-caption text-slate-400 mt-0.5">활성 키워드</p>
                </div>
              </div>
              <div className="bg-white rounded-xl px-4 py-3.5 flex items-center gap-3"
                style={{ border: '1px solid #e9e9e7' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <div>
                  <p className="text-stat font-bold leading-none text-slate-400">{inactiveCount}</p>
                  <p className="text-caption text-slate-400 mt-0.5">비활성 키워드</p>
                </div>
              </div>
            </div>
          )}

          {/* 키워드 추가 */}
          <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #e9e9e7' }}>
            {/* 입력창 */}
            <div className="px-4 py-4 flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="차단할 키워드 직접 입력 (예: 무료 수령)"
                className="flex-1 text-body text-dark placeholder-slate-300 bg-transparent outline-none"
              />
              <button
                onClick={() => handleAdd()}
                disabled={!input.trim() || adding}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-body font-medium transition-all duration-150 shrink-0 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
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

            {/* 자주 쓰는 키워드 */}
            <div className="px-4 pb-4" style={{ borderTop: '1px solid #f1f1ef', paddingTop: '12px' }}>
              <p className="text-hint text-slate-400 mb-2">자주 차단하는 키워드</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_KEYWORDS.map(kw => {
                  const isAdded = registeredKeywords.includes(kw)
                  return (
                    <button
                      key={kw}
                      onClick={() => !isAdded && handleAdd(kw)}
                      disabled={isAdded || adding}
                      className="px-3 py-1 rounded-full text-caption font-medium transition-all duration-150"
                      style={{
                        background: isAdded ? '#f0fdf4' : '#f5f3ff',
                        color: isAdded ? '#16a34a' : '#6366f1',
                        border: isAdded ? '1px solid #bbf7d0' : '1px solid #ddd6fe',
                        cursor: isAdded ? 'default' : 'pointer',
                      }}
                    >
                      {isAdded ? '✓ ' : '+ '}{kw}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 키워드 목록 */}
          {loading && (
            <div className="bg-white rounded-xl px-6 py-12 text-center" style={{ border: '1px solid #e9e9e7' }}>
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
                style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }} />
              <p className="text-body text-slate-400">키워드를 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-xl px-6 py-12 text-center" style={{ border: '1px solid #fecaca' }}>
              <p className="text-body text-danger">{error}</p>
            </div>
          )}

          {!loading && !error && (
            keywords.length === 0 ? (
              <div className="bg-white rounded-xl px-6 py-12 text-center" style={{ border: '1px solid #e9e9e7' }}>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </div>
                <p className="text-body font-medium text-slate-600">등록된 키워드 없음</p>
                <p className="text-caption text-slate-400 mt-1">위에서 키워드를 추가해보세요</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #e9e9e7' }}>
                {keywords.filter(k => k.is_active).length > 0 && (
                  <KeywordSection
                    title="활성"
                    keywords={keywords.filter(k => k.is_active)}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                )}
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

function KeywordSection({ title, keywords, onToggle, onDelete, dimmed }: {
  title: string
  keywords: SpamKeyword[]
  onToggle: (id: number, current: boolean) => void
  onDelete: (id: number) => void
  dimmed?: boolean
}) {
  return (
    <div>
      <div className="px-4 py-2 bg-slate-50" style={{ borderBottom: '1px solid #f1f1ef' }}>
        <p className="text-hint font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
      </div>
      {keywords.map((kw, i) => (
        <div key={kw.id}
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: i < keywords.length - 1 ? '1px solid #f1f1ef' : 'none' }}>
          <div className={`w-2 h-2 rounded-full shrink-0 ${kw.is_active ? 'bg-brand' : 'bg-slate-300'}`} />
          <span className={`flex-1 text-body font-medium ${dimmed ? 'text-slate-400' : 'text-dark'}`}>
            {kw.keyword}
          </span>
          <button
            onClick={() => onToggle(kw.id, kw.is_active)}
            className="relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0"
            style={{ background: kw.is_active ? '#6366f1' : '#e2e8f0' }}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200
              ${kw.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
          </button>
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
      ))}
    </div>
  )
}
