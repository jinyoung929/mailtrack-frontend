import { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import StatCard from '../components/features/dashboard/StatCard'
import MailInput from '../components/features/dashboard/MailInput'
import AnalysisResult from '../components/features/dashboard/AnalysisResult'
import { navMain, navAnalysis } from '../constants/nav'
import { analyzeMail } from '../lib/api'
import { MOCK_STATS } from '../lib/mockData'
import AdBanner from '../components/features/dashboard/AdBanner'
import type { AnalysisResult as ResultType, Page } from '../types'

interface Props {
  onNavigate?: (page: Page) => void
  activePage?: Page
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export default function DashboardPage({ onNavigate, activePage }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mailInput, setMailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [gmailLoading, setGmailLoading] = useState(false)
  const [result, setResult] = useState<ResultType | null>(null)
  const [stats, setStats] = useState(MOCK_STATS)
  const [gmailMails, setGmailMails] = useState<any[]>([])
  const [selectedGmail, setSelectedGmail] = useState<any | null>(null)

  const gmailConnected = gmailMails.length > 0 || sessionStorage.getItem('gmail_connected') === 'true'

  async function handleAnalyze() {
    const text = mailInput.trim()
    if (!text) { alert('메일 내용을 입력해주세요.'); return }
    setLoading(true)
    setResult(null)
    try {
      const parsed = await analyzeMail(text)
      setResult(parsed)
      setStats(prev => ({
        total: prev.total + 1,
        dark: prev.dark + (parsed.darkdata?.length ?? 0),
        alerts: prev.alerts + (parsed.security?.level === 'danger' ? 1 : 0),
      }))
      // API 한도 초과면 저장 안 함
      if (parsed.subject !== 'API 한도 초과') {
        const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
        await fetch(`${API_BASE}/api/mails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: text,
            subject: parsed.subject,
            is_dark: parsed.darkdata.length > 0,
            dark_reason: parsed.darkdata.map(d => d.reason).join('\n') || null,
            security_level: parsed.security.level,
          }),
        })
      }
    } catch {
      alert('분석 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function handleFetchGmail() {
    setGmailLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/gmail?max_results=5`)
      if (res.status === 401) {
        alert('Gmail 로그인이 필요합니다.')
        return
      }
      const mails = await res.json()
      setGmailMails(mails)
      sessionStorage.setItem('gmail_connected', 'true')
    } catch {
      alert('Gmail 불러오기 중 오류가 발생했습니다.')
    } finally {
      setGmailLoading(false)
    }
  }

  // 클릭하면 내용만 입력창에 넣음 — 분석은 안 함
  function handleSelectGmail(mail: any) {
    setSelectedGmail(mail)
    setMailInput(mail.content)
    setResult(null)
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
          title="대시보드"
          subtitle="메일을 붙여넣고 AI 분석을 시작하세요"
          onMenuClick={() => setSidebarOpen(true)}
          gmailConnected={gmailConnected}
        />

        <div className="p-4 md:p-7 flex flex-col gap-4 md:gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <StatCard label="분석된 메일" value={stats.total} sub="총 누적" />
            <StatCard label="다크 데이터 발견" value={stats.dark} sub="이번 세션" accent="#d97706" />
            <StatCard label="보안 경고" value={stats.alerts} sub="이번 세션" accent="#dc2626" />
          </div>

          {/* Gmail 불러오기 */}
          <div className="bg-white rounded-xl px-5 py-4 flex items-center gap-4"
            style={{ border: '1px solid #e9e9e7' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: '#fef2f2' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-body font-semibold text-dark">Gmail 연동</p>
              <p className="text-hint text-slate-400">최근 5개 메일을 가져옵니다. 클릭 후 분석 버튼을 눌러주세요.</p>
            </div>
            <button
              onClick={handleFetchGmail}
              disabled={gmailLoading}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-body font-medium text-white transition-all duration-150 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {gmailLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.18" />
                </svg>
              )}
              {gmailLoading ? '불러오는 중...' : 'Gmail 불러오기'}
            </button>
          </div>

          {/* Gmail 메일 목록 */}
          {gmailMails.length > 0 && (
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #e9e9e7' }}>
              <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid #e9e9e7' }}>
                <p className="text-body font-semibold text-dark">Gmail 받은 메일함</p>
                <span className="text-hint text-slate-400 ml-2">메일 클릭 → 분석 버튼으로 분석하세요</span>
                <span className="text-hint font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 ml-auto">
                  {gmailMails.length}개
                </span>
              </div>
              {gmailMails.map((mail, i) => (
                <div
                  key={mail.id}
                  onClick={() => handleSelectGmail(mail)}
                  className="flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-colors"
                  style={{
                    borderBottom: i < gmailMails.length - 1 ? '1px solid #f1f1ef' : 'none',
                    background: selectedGmail?.id === mail.id ? '#f5f3ff' : 'white',
                  }}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-hint font-bold text-slate-500">
                      {mail.sender?.charAt(0)?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-body font-medium text-dark truncate">{mail.subject}</p>
                      <span className="text-hint text-slate-400 shrink-0 ml-auto">{mail.date?.slice(0, 11)}</span>
                    </div>
                    <p className="text-caption text-slate-400 truncate mt-0.5">{mail.sender}</p>
                  </div>
                  {selectedGmail?.id === mail.id && (
                    <span className="text-hint font-semibold text-brand shrink-0 mt-1">선택됨</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <MailInput
            value={mailInput}
            onChange={setMailInput}
            onAnalyze={handleAnalyze}
            loading={loading}
          />

          {result && !loading && <AnalysisResult result={result} />}

          <AdBanner />
        </div>
      </main>
    </div>
  )
}
