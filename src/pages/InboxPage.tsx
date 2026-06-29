import { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import { navMain, navAnalysis } from '../constants/nav'
import { fetchMails } from '../lib/mailService'
import type { MailRecord, Page } from '../types'

type SecurityLevel = 'safe' | 'warn' | 'danger'

interface Props {
  onNavigate: (page: Page) => void
  activePage: Page
}

export default function InboxPage({ onNavigate, activePage }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mails, setMails] = useState<MailRecord[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const selectedMail = mails.find(m => m.id === selectedId) ?? null

  useEffect(() => {
    fetchMails()
      .then(setMails)
      .catch(() => setError('메일을 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false))
  }, [])

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
          title="받은 메일함"
          subtitle={!loading && !error ? `${mails.length}개 메일` : '메일을 불러오는 중...'}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="p-4 md:p-7 flex flex-col gap-4 md:gap-5">

          {loading && <LoadingState />}
          {error   && <ErrorState message={error} />}

          {!loading && !error && (
            mails.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start">
                <div className="w-full md:w-72 lg:w-80 shrink-0 bg-white border border-slate-200 rounded-xl overflow-hidden">
                  {mails.map((mail, i) => (
                    <MailRow
                      key={mail.id}
                      mail={mail}
                      selected={selectedMail?.id === mail.id}
                      last={i === mails.length - 1}
                      onClick={() => setSelectedId(prev => prev === mail.id ? null : mail.id)}
                    />
                  ))}
                </div>

                {selectedMail && (
                  <div className="flex-1 min-w-0 fade-in">
                    <MailDetail mail={selectedMail} />
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

/* ── Mail Row ────────────────────────────────────────────── */

const LEVEL_BADGE: Record<SecurityLevel, string> = {
  danger: 'bg-danger-muted text-danger',
  warn:   'bg-warn-muted text-warn',
  safe:   'bg-safe-muted text-safe',
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

function MailRow({ mail, selected, last, onClick }: {
  mail: MailRecord; selected: boolean; last: boolean; onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-100
        ${!last ? 'border-b border-slate-100' : ''}
        ${selected ? 'bg-brand/5' : 'hover:bg-slate-50'}`}
    >
      {/* 보안 등급 dot */}
      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${LEVEL_DOT[mail.security_level]}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-hint font-semibold ${LEVEL_TEXT[mail.security_level]}`}>
            {LEVEL_LABEL[mail.security_level]}
          </span>
          {mail.is_dark && (
            <span className="text-hint text-slate-400">· 다크 데이터</span>
          )}
          {mail.sender && <span className="text-hint text-slate-500 font-medium truncate">{mail.sender}</span>}
          <span className="ml-auto text-hint text-slate-400 shrink-0">{timeAgo(mail.created_at)}</span>
        </div>
        <p className="text-body text-dark font-medium line-clamp-1 leading-snug">{extractSubject(mail, true)}</p>
        <p className="text-caption text-slate-400 line-clamp-1 mt-0.5">{mail.content}</p>
      </div>
    </div>
  )
}

/* ── Mail Detail ─────────────────────────────────────────── */

function MailDetail({ mail }: { mail: MailRecord }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`text-hint font-semibold px-1.5 py-0.5 rounded-full ${LEVEL_BADGE[mail.security_level]}`}>
              {LEVEL_LABEL[mail.security_level]}
            </span>
            {mail.is_dark && (
              <span className="text-hint font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">다크 데이터</span>
            )}
          </div>
          <p className="text-caption text-slate-400 mt-0.5">
            {mail.sender && <span className="text-slate-500 font-medium">{mail.sender} · </span>}
            {new Date(mail.created_at).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>
      <div className="px-5 py-4 border-b border-slate-100">
        <p className="text-body font-semibold text-dark">{extractSubject(mail)}</p>
      </div>
      <div className="px-5 py-5">
        <p className="text-body text-slate-700 leading-[1.8] whitespace-pre-wrap">{mail.content}</p>
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

function EmptyState() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>
      <p className="text-body font-medium text-slate-600">받은 메일이 없습니다</p>
      <p className="text-caption text-slate-400 mt-1">메일함이 비어있습니다</p>
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
