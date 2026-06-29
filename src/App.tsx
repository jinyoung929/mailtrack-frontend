import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SecurityCenterPage from './pages/SecurityCenterPage'
import DarkDataPage from './pages/DarkDataPage'
import SmartFilterPage from './pages/SmartFilterPage'
import InboxPage from './pages/InboxPage'
import type { Page } from './types'

export default function App() {
  const [page, setPage] = useState<Page>('login')

  if (page === 'login')       return <LoginPage onLogin={() => setPage('dashboard')} />
  if (page === 'inbox')       return <InboxPage onNavigate={setPage} activePage={page} />
  if (page === 'security')    return <SecurityCenterPage onNavigate={setPage} activePage={page} />
  if (page === 'darkdata')    return <DarkDataPage onNavigate={setPage} activePage={page} />
  if (page === 'smartfilter') return <SmartFilterPage onNavigate={setPage} activePage={page} />
  return <DashboardPage onNavigate={setPage} activePage={page} />
}
