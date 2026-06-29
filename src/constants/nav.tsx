import type { NavItem } from '../types'

// SVG 아이콘을 인라인으로 정의 (외부 라이브러리 의존성 제거)
const icon = (path: React.ReactNode) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
)

export const navMain: NavItem[] = [
  {
    label: '대시보드',
    page: 'dashboard',
    icon: icon(<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>),
  },
  {
    label: '받은 메일함',
    page: 'inbox',
    icon: icon(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>),
  },
]

export const navAnalysis: NavItem[] = [
  {
    label: '보안 센터',
    page: 'security',
    icon: icon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />),
  },
  {
    label: '다크 데이터',
    page: 'darkdata',
    icon: icon(<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>),
  },
  {
    label: '스마트 필터',
    page: 'smartfilter',
    icon: icon(<><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></>),
  },
]
