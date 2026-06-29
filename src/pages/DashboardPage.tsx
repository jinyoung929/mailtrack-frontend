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

export default function DashboardPage({ onNavigate, activePage }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mailInput, setMailInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultType | null>(null)
  const [stats, setStats] = useState(MOCK_STATS)

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
    } catch {
      alert('분석 중 오류가 발생했습니다. API 키를 확인해주세요.')
    } finally {
      setLoading(false)
    }
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
        />

        <div className="p-4 md:p-7 flex flex-col gap-4 md:gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <StatCard label="분석된 메일" value={stats.total} sub="총 누적" />
            <StatCard label="다크 데이터 발견" value={stats.dark} sub="이번 세션" accent="#b45309" />
            <StatCard label="보안 경고" value={stats.alerts} sub="이번 세션" accent="#b91c1c" />
          </div>

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
