import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SecurityCenterPage from './pages/SecurityCenterPage'
import DarkDataPage from './pages/DarkDataPage'
import SmartFilterPage from './pages/SmartFilterPage'
import InboxPage from './pages/InboxPage'
import type { Page } from './types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export default function App() {
  const [page, setPage] = useState<Page>('login')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth') === 'success') {
      setPage('dashboard')
      window.history.replaceState({}, '', '/')
      sessionStorage.setItem('gmail_connected', 'true')
      // 로그인 성공 시 사용자 정보 가져와서 저장
      fetch(`${API_BASE}/auth/me`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) sessionStorage.setItem('user_info', JSON.stringify(data))
        })
        .catch(() => {})
    }
  }, [])

  if (page === 'login')       return <LoginPage onLogin={() => setPage('dashboard')} />
  if (page === 'inbox')       return <InboxPage onNavigate={setPage} activePage={page} />
  if (page === 'security')    return <SecurityCenterPage onNavigate={setPage} activePage={page} />
  if (page === 'darkdata')    return <DarkDataPage onNavigate={setPage} activePage={page} />
  if (page === 'smartfilter') return <SmartFilterPage onNavigate={setPage} activePage={page} />
  return <DashboardPage onNavigate={setPage} activePage={page} />
}
