import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import { navMain, navAnalysis } from '../constants/nav'
import { fetchMails } from '../lib/mailService'
import type { MailRecord, Page, SecurityLevel } from '../types'

type Tab = SecurityLevel

interface Props {
  onNavigate: (page: Page) => void
  activePage: Page
}

export default function SecurityCenterPage({ onNavigate, activePage }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('danger')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [mails, setMails] = useState<MailRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMails()
      .then(setMails)
      .catch(() => setError('메일을 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = mails.filter(m => m.security_level === activeTab)
  const selectedMail = filtered.find(m => m.id === selectedId) ?? null

  const counts: Record<Tab, number> = {
    danger: mails.filter(m => m.security_level === 'danger').length,
    warn:   mails.filter(m => m.security_level === 'warn').length,
    safe:   mails.filter(m => m.security_level === 'safe').length,
  }

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
          title="보안 센터"
          subtitle="분석된 메일의 보안 등급을 확인하세요"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-7 flex flex-col gap-4 md:gap-5">

          {/* Tab bar */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1.5 w-fit">
            {(['danger', 'warn', 'safe'] as Tab[]).map(tab => (
              <TabButton
                key={tab}
                tab={tab}
                count={counts[tab]}
                active={activeTab === tab}
                onClick={() => { setActiveTab(tab); setSelectedId(null) }}
              />
            ))}
          </div>

          {/* Loading / Error */}
          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}

          {/* Content */}
          {!loading && !error && (
            filtered.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start">
                {/* Mail list */}
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

                {/* Detail panel */}
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

const TAB_CFG: Record<Tab, { label: string; activeClass: string; countClass: string }> = {
  danger: { label: '위험', activeClass: 'bg-danger-muted text-danger', countClass: 'bg-red-200 text-danger' },
  warn:   { label: '주의', activeClass: 'bg-warn-muted text-warn',     countClass: 'bg-amber-200 text-warn' },
  safe:   { label: '안전', activeClass: 'bg-safe-muted text-safe',     countClass: 'bg-green-200 text-safe' },
}

function TabButton({ tab, count, active, onClick }: { tab: Tab; count: number; active: boolean; onClick: () => void }) {
  const cfg = TAB_CFG[tab]
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body font-medium transition-all duration-150
        ${active ? cfg.activeClass : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
    >
      {cfg.label}
      <span className={`text-hint font-semibold px-1.5 py-0.5 rounded-full transition-all duration-150
        ${active ? cfg.countClass : 'bg-slate-100 text-slate-400'}`}>
        {count}
      </span>
    </button>
  )
}

/* ── Mail Card ───────────────────────────────────────────── */

const LEVEL_BORDER: Record<SecurityLevel, string> = {
  danger: 'border-l-red-400',
  warn:   'border-l-amber-400',
  safe:   'border-l-green-400',
}
const LEVEL_DOT: Record<SecurityLevel, string> = {
  danger: 'bg-red-400',
  warn:   'bg-amber-400',
  safe:   'bg-green-400',
}
const LEVEL_LABEL: Record<SecurityLevel, string> = {
  danger: '위험', warn: '주의', safe: '안전',
}
const LEVEL_TEXT: Record<SecurityLevel, string> = {
  danger: 'text-danger', warn: 'text-warn', safe: 'text-safe',
}

function MailCard({ mail, selected, onClick }: { mail: MailRecord; selected: boolean; onClick: () => void }) {
  const level = mail.security_level
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-l-4 rounded-xl px-4 py-3.5 cursor-pointer transition-all duration-150
        ${LEVEL_BORDER[level]}
        ${selected
          ? 'border-slate-300 shadow-sm ring-1 ring-brand/20'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
        }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${LEVEL_DOT[level]}`} />
        <span className={`text-hint font-semibold uppercase tracking-wide ${LEVEL_TEXT[level]}`}>
          {LEVEL_LABEL[level]}
        </span>
        {mail.sender && <span className="text-hint text-slate-500 font-medium truncate">{mail.sender}</span>}
        <span className="ml-auto text-hint text-slate-400 shrink-0">{timeAgo(mail.created_at)}</span>
      </div>
      <p className="text-body text-dark font-medium line-clamp-1 leading-snug">{extractSubject(mail, true)}</p>
      <p className="text-caption text-slate-400 line-clamp-1 mt-0.5">{mail.content}</p>
    </div>
  )
}

/* ── Detail Panel ────────────────────────────────────────── */

const LEVEL_HEADER: Record<SecurityLevel, { bg: string; iconStroke: string; text: string; label: string }> = {
  danger: { bg: 'bg-danger-muted border-red-100',  iconStroke: '#b91c1c', text: 'text-danger', label: '위험 메일' },
  warn:   { bg: 'bg-warn-muted border-amber-100',  iconStroke: '#b45309', text: 'text-warn',   label: '주의 메일' },
  safe:   { bg: 'bg-safe-muted border-green-100',  iconStroke: '#15803d', text: 'text-safe',   label: '안전 메일' },
}

function DetailPanel({ mail }: { mail: MailRecord }) {
  const h = LEVEL_HEADER[mail.security_level]

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className={`border-b px-5 py-4 ${h.bg}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={h.iconStroke} strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p className={`text-body font-semibold ${h.text}`}>{h.label}</p>
            <p className="text-caption text-slate-400 mt-0.5">
              {mail.sender && <span className="text-slate-500 font-medium">{mail.sender} · </span>}
              {new Date(mail.created_at).toLocaleString('ko-KR')}
              {mail.is_dark && <span className="ml-2 text-warn font-medium">· 다크 데이터 포함</span>}
            </p>
          </div>
        </div>
        <p className="text-body font-semibold text-dark mt-3">{extractSubject(mail)}</p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Mail content */}
        <section>
          <p className="text-body font-semibold text-dark mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round">
                <line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="12" x2="3" y2="12" /><line x1="21" y1="18" x2="3" y2="18" />
              </svg>
            </span>
            메일 내용
          </p>
          <p className="text-body text-slate-700 leading-[1.8] bg-field rounded-lg px-4 py-3 border border-slate-200 whitespace-pre-wrap">
            {mail.content}
          </p>
        </section>

        {/* 보안 분석 이유: 위험/주의 메일만 표시 */}
        <section>
          <p className="text-body font-semibold text-dark mb-3 flex items-center gap-2">
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${mail.security_level === 'safe' ? 'bg-safe-muted' : 'bg-danger-muted'}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={mail.security_level === 'safe' ? '#15803d' : '#b91c1c'} strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            보안 분석 이유
          </p>
          {mail.security_level !== 'safe' && mail.dark_reason ? (
            /* 위험/주의: 보안 위협 이유 */
            <div className="flex flex-col gap-2">
              {mail.dark_reason.split('\n').map((line, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${mail.security_level === 'danger' ? 'bg-danger-muted' : 'bg-warn-muted'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={mail.security_level === 'danger' ? '#dc2626' : '#d97706'} strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-caption text-slate-600 leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
          ) : mail.security_level === 'safe' && mail.is_dark && mail.dark_reason ? (
            /* 안전이지만 다크 데이터 포함: 다크 데이터 감지 이유 표시 */
            <div className="flex flex-col gap-2">
              <p className="text-hint text-slate-400 mb-1">보안 위협은 없으나 아래 항목이 다크 데이터로 감지되었습니다.</p>
              {mail.dark_reason.split('\n').map((line, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-warn-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p className="text-caption text-slate-600 leading-relaxed">{line}</p>
                </div>
              ))}
            </div>
          ) : (
            /* 안전, 다크 데이터 없음 */
            <div className="flex items-start gap-3 p-3 rounded-lg bg-safe-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-caption text-slate-600 leading-relaxed">보안 위협이 감지되지 않았습니다.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

/* ── States ──────────────────────────────────────────────── */

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
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <p className="text-body font-medium text-slate-600">{TAB_CFG[tab].label} 메일 없음</p>
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
