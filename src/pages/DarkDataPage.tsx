import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import { navMain, navAnalysis } from '../constants/nav'
import { fetchProblematicMails } from '../lib/mailService'
import type { MailRecord, Page } from '../types'

type Tab = 'all' | 'phishing' | 'dark'

interface Props {
  onNavigate: (page: Page) => void
  activePage: Page
}

export default function DarkDataPage({ onNavigate, activePage }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mails, setMails] = useState<MailRecord[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProblematicMails()
      .then(setMails)
      .catch(() => setError('메일을 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const isPhishing = (m: MailRecord) => m.security_level === 'danger' || m.security_level === 'warn'
  const isDarkOnly  = (m: MailRecord) => m.is_dark && m.security_level === 'safe'

  const filtered = {
    all:      mails,
    phishing: mails.filter(isPhishing),
    dark:     mails.filter(isDarkOnly),
  }[activeTab]

  const counts = {
    all:      mails.length,
    phishing: mails.filter(isPhishing).length,
    dark:     mails.filter(isDarkOnly).length,
  }

  const selectedMail = filtered.find(m => m.id === selectedId) ?? null

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
          title="다크 데이터"
          subtitle="피싱·스팸·불필요 데이터가 포함된 메일을 확인하세요"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-7 flex flex-col gap-4 md:gap-5">

          {/* 탭 */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1.5 w-fit">
            <TabButton tab="all"      label="전체"         count={counts.all}      active={activeTab === 'all'}      onClick={() => { setActiveTab('all');      setSelectedId(null) }} />
            <TabButton tab="phishing" label="피싱/스팸"    count={counts.phishing} active={activeTab === 'phishing'} onClick={() => { setActiveTab('phishing'); setSelectedId(null) }} />
            <TabButton tab="dark"     label="불필요 데이터" count={counts.dark}    active={activeTab === 'dark'}     onClick={() => { setActiveTab('dark');     setSelectedId(null) }} />
          </div>

          {loading && <LoadingState />}
          {error   && <ErrorState message={error} />}

          {!loading && !error && (
            filtered.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start">
                {/* 메일 목록 */}
                <div className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-2">
                  {filtered.map(mail => (
                    <MailCard
                      key={mail.id}
                      mail={mail}
                      selected={selectedMail?.id === mail.id}
                      onClick={() => setSelectedId(prev => prev === mail.id ? null : mail.id)}
                    />
                  ))}
                </div>

                {/* 상세 패널 */}
                {selectedMail && (
                  <div className="flex-1 min-w-0 fade-in">
                    <DetailPanel mail={selectedMail} />
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}

/* ── Tab Button ──────────────────────────────────────────── */

function TabButton({ tab, label, count, active, onClick }: {
  tab: Tab; label: string; count: number; active: boolean; onClick: () => void
}) {
  const activeClass = {
    all:      'bg-slate-100 text-slate-700',
    phishing: 'bg-danger-muted text-danger',
    dark:     'bg-warn-muted text-warn',
  }[tab]
  const countClass = {
    all:      'bg-slate-200 text-slate-500',
    phishing: 'bg-red-200 text-danger',
    dark:     'bg-amber-200 text-warn',
  }[tab]

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body font-medium transition-all duration-150
        ${active ? activeClass : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
    >
      {label}
      <span className={`text-hint font-semibold px-1.5 py-0.5 rounded-full transition-all duration-150
        ${active ? countClass : 'bg-slate-100 text-slate-400'}`}>
        {count}
      </span>
    </button>
  )
}

/* ── Mail Card ───────────────────────────────────────────── */

function MailCard({ mail, selected, onClick }: { mail: MailRecord; selected: boolean; onClick: () => void }) {
  const phishing = mail.security_level === 'danger' || mail.security_level === 'warn'
  const darkOnly  = mail.is_dark && mail.security_level === 'safe'
  const borderColor = mail.security_level === 'danger' ? 'border-l-red-400'
    : mail.security_level === 'warn' ? 'border-l-amber-400'
    : 'border-l-slate-300'

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-l-4 ${borderColor} rounded-xl px-4 py-3.5 cursor-pointer transition-all duration-150
        ${selected
          ? 'border-slate-300 shadow-sm ring-1 ring-brand/20'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
        }`}
    >
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        {phishing && (
          <span className={`text-hint font-semibold px-1.5 py-0.5 rounded-full
            ${mail.security_level === 'danger' ? 'bg-danger-muted text-danger' : 'bg-warn-muted text-warn'}`}>
            {mail.security_level === 'danger' ? '피싱' : '스팸'}
          </span>
        )}
        {darkOnly && (
          <span className="text-hint font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
            불필요 데이터
          </span>
        )}
        {mail.sender && <span className="text-hint text-slate-500 font-medium truncate">{mail.sender}</span>}
        <span className="ml-auto text-hint text-slate-400 shrink-0">{timeAgo(mail.created_at)}</span>
      </div>
      <p className="text-body text-dark font-medium line-clamp-1 leading-snug">{extractSubject(mail, true)}</p>
      <p className="text-caption text-slate-400 line-clamp-1 mt-0.5">{mail.content}</p>
    </div>
  )
}

/* ── Detail Panel ────────────────────────────────────────── */

function DetailPanel({ mail }: { mail: MailRecord }) {
  const isPhishing = mail.security_level === 'danger' || mail.security_level === 'warn'
  const isDarkOnly  = mail.is_dark && mail.security_level === 'safe'
  const reasons = mail.dark_reason?.split('\n').filter(Boolean) ?? []

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-body font-semibold text-dark">상세 분석</p>
              {isPhishing && (
                <span className={`text-hint font-semibold px-1.5 py-0.5 rounded-full
                  ${mail.security_level === 'danger' ? 'bg-danger-muted text-danger' : 'bg-warn-muted text-warn'}`}>
                  {mail.security_level === 'danger' ? '피싱' : '스팸'}
                </span>
              )}
              {isDarkOnly && (
                <span className="text-hint font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  불필요 데이터
                </span>
              )}
            </div>
            <p className="text-caption text-slate-400 mt-0.5">
              {mail.sender && <span className="text-slate-500 font-medium">{mail.sender} · </span>}
              {new Date(mail.created_at).toLocaleString('ko-KR')}
            </p>
          </div>
        </div>
        <p className="text-body font-semibold text-dark mt-3">{extractSubject(mail)}</p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* 메일 내용 */}
        <section>
          <SectionLabel icon="mail" title="메일 내용" />
          <p className="text-body text-slate-700 leading-[1.8] bg-field rounded-lg px-4 py-3 border border-slate-200 whitespace-pre-wrap mt-3">
            {mail.content}
          </p>
        </section>

        {/* 피싱/스팸 이유 */}
        {isPhishing && reasons.length > 0 && (
          <section>
            <SectionLabel icon="shield" title="피싱/스팸 탐지 이유" />
            <div className="space-y-2 mt-3">
              {reasons.map((line, i) => {
                const colonIdx = line.indexOf(':')
                const label = colonIdx > -1 ? line.slice(0, colonIdx).trim() : null
                const desc  = colonIdx > -1 ? line.slice(colonIdx + 1).trim() : line
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg
                    ${mail.security_level === 'danger' ? 'bg-danger-muted' : 'bg-orange-100'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={mail.security_level === 'danger' ? '#dc2626' : '#c2410c'}
                      strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <div>
                      {label && <p className={`text-xs font-semibold ${mail.security_level === 'danger' ? 'text-danger' : 'text-orange-700'}`}>{label}</p>}
                      <p className="text-caption text-slate-600 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 불필요 데이터 이유 */}
        {isDarkOnly && reasons.length > 0 && (
          <section>
            <SectionLabel icon="search" title="불필요 데이터 감지 항목" />
            <div className="space-y-2 mt-3">
              {reasons.map((line, i) => {
                const colonIdx = line.indexOf(':')
                const label = colonIdx > -1 ? line.slice(0, colonIdx).trim() : null
                const desc  = colonIdx > -1 ? line.slice(colonIdx + 1).trim() : line
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-warn-muted">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <div>
                      {label && <p className="text-xs font-semibold text-warn">{label}</p>}
                      <p className="text-caption text-slate-600 leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 이유 없는 경우 */}
        {reasons.length === 0 && (
          <p className="text-body text-slate-400 text-center py-4">상세 이유가 없습니다</p>
        )}
      </div>
    </div>
  )
}

/* ── Section Label ───────────────────────────────────────── */

function SectionLabel({ icon, title }: { icon: 'mail' | 'shield' | 'search'; title: string }) {
  const cfg = {
    mail: {
      bg: 'bg-blue-50',
      svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="12" x2="3" y2="12" /><line x1="21" y1="18" x2="3" y2="18" /></svg>,
    },
    shield: {
      bg: 'bg-danger-muted',
      svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    },
    search: {
      bg: 'bg-warn-muted',
      svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    },
  }
  const { bg, svg } = cfg[icon]
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>{svg}</div>
      <p className="text-body font-semibold text-dark">{title}</p>
    </div>
  )
}

/* ── States ──────────────────────────────────────────────── */

const EMPTY_MSG: Record<Tab, string> = {
  all:      '문제가 감지된 메일이 없습니다',
  phishing: '피싱/스팸 메일이 없습니다',
  dark:     '불필요 데이터가 감지된 메일이 없습니다',
}

function LoadingState() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-12 text-center">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-body text-slate-500">메일을 불러오는 중...</p>
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

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <p className="text-body font-medium text-slate-600">{EMPTY_MSG[tab]}</p>
      <p className="text-caption text-slate-400 mt-1">대시보드에서 메일을 분석하면 여기에 표시됩니다</p>
    </div>
  )
}

/* ── Utils ───────────────────────────────────────────────── */

function extractSubject(mail: MailRecord, truncate = false): string {
  if (mail.subject) return mail.subject
  const content = mail.content
  const bracketMatch = content.match(/^\[([^\]]+)\]\s*(.*)/)
  if (bracketMatch) {
    const tag = bracketMatch[1]
    const rest = bracketMatch[2].split(/[.。]/)[0].trim()
    const full = rest ? `[${tag}] ${rest}` : `[${tag}]`
    if (!truncate) return full
    return rest.length > 15 ? `[${tag}] ${rest.slice(0, 15)}…` : full
  }
  const cleaned = content.replace(/^안녕하세요[,!.]?\s*/i, '').trim()
  const first = cleaned.split(/[.!?。\n]/)[0].trim()
  if (!truncate) return first
  return first.length > 20 ? first.slice(0, 20) + '…' : first
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60000)
  const hr   = Math.floor(diff / 3600000)
  const day  = Math.floor(diff / 86400000)
  if (min < 1)  return '방금 전'
  if (min < 60) return `${min}분 전`
  if (hr < 24)  return `${hr}시간 전`
  return `${day}일 전`
}
