import type { SessionStats } from '../types'

/**
 * 대시보드 세션 통계 초기값
 * 백엔드 연동 시에도 세션 단위 카운팅은 프론트에서 관리
 */
export const MOCK_STATS: SessionStats = {
  total: 0,
  dark: 0,
  alerts: 0,
}
