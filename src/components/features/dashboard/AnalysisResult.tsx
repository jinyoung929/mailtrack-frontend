import type { AnalysisResult as ResultType, SecurityLevel } from '../../../types'

interface Props {
  result: ResultType
}

const LEVEL_CFG: Record<SecurityLevel, { label: string; bg: string; text: string; border: string; iconStroke: string }> = {
  safe:   { label: '안전',  bg: 'bg-safe-muted',   text: 'text-safe',   border: 'border-green-100', iconStroke: '#15803d' },
  warn:   { label: '주의',  bg: 'bg-warn-muted',   text: 'text-warn',   border: 'border-amber-100', iconStroke: '#b45309' },
  danger: { label: '위험',  bg: 'bg-danger-muted', text: 'text-danger', border: 'border-red-100',   iconStroke: '#b91c1c' },
}

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']

export default function AnalysisResult({ result }: Props) {
  const cfg = LEVEL_CFG[result.security.level]
  const hasCalendar = result.calendar && result.calendar.length > 0

  return (
    <div className="flex flex-col gap-4 md:gap-5">

      {/* 요약 카드 */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden fade-in">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round">
              <line x1="21" y1="6" x2="3" y2="6" /><line x1="15" y1="12" x2="3" y2="12" /><line x1="21" y1="18" x2="3" y2="18" />
            </svg>
          </div>
          <p className="text-body font-semibold text-dark">분석 요약</p>
          <span className={`ml-auto text-hint font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
        </div>
        <div className="px-5 py-4">
          <p className="text-body font-semibold text-dark mb-2">{result.subject}</p>
          <p className="text-body text-slate-600 leading-[1.8]">{result.summary}</p>
        </div>
      </div>

      {/* 캘린더 카드 — 일정 있을 때만 */}
      {hasCalendar && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden fade-in" style={{ animationDelay: '40ms' }}>
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-body font-semibold text-dark">일정 감지</p>
            <span className="ml-auto text-hint font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {result.calendar.length}개
            </span>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            {result.calendar.map((event, i) => {
              const d = new Date(event.date)
              const isValid = !isNaN(d.getTime())
              const month = isValid ? d.getMonth() + 1 : null
              const day = isValid ? d.getDate() : null
              const weekday = isValid ? WEEKDAY[d.getDay()] : null

              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  {/* 날짜 박스 */}
                  <div className="w-12 shrink-0 bg-white rounded-lg border border-blue-200 flex flex-col items-center py-1.5">
                    <p className="text-hint font-semibold text-blue-400">{month}월</p>
                    <p className="text-stat font-bold text-dark leading-none">{day}</p>
                    <p className="text-hint text-blue-400">{weekday}요일</p>
                  </div>
                  {/* 일정 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-semibold text-dark">{event.title}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {event.time && (
                        <span className="flex items-center gap-1 text-hint text-slate-500">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                          {event.time}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1 text-hint text-slate-500">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 보안 분석 + 다크 데이터 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

        {/* 보안 분석 카드 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden fade-in" style={{ animationDelay: '60ms' }}>
          <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${cfg.border} ${cfg.bg}`}>
            <div className="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={cfg.iconStroke} strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className={`text-body font-semibold ${cfg.text}`}>보안 분석</p>
          </div>
          <div className="px-5 py-4 flex flex-col gap-2.5">
            {result.security.issues.length === 0 ? (
              <p className="text-body text-slate-400">보안 위협이 감지되지 않았습니다.</p>
            ) : (
              result.security.issues.map((issue, i) => {
                const c = LEVEL_CFG[issue.type]
                return (
                  <div key={i} className={`rounded-lg p-3 ${c.bg}`}>
                    <p className={`text-caption font-semibold ${c.text}`}>{issue.title}</p>
                    <p className="text-caption text-slate-600 mt-0.5 leading-relaxed">{issue.desc}</p>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 다크 데이터 카드 */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden fade-in" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-warn-muted flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-body font-semibold text-dark">다크 데이터</p>
            {result.darkdata.length > 0 && (
              <span className="ml-auto text-hint font-semibold px-2 py-0.5 rounded-full bg-warn-muted text-warn">
                {result.darkdata.length}개 발견
              </span>
            )}
          </div>
          <div className="px-5 py-4 flex flex-col gap-2.5">
            {result.darkdata.length === 0 ? (
              <p className="text-body text-slate-400">다크 데이터가 감지되지 않았습니다.</p>
            ) : (
              result.darkdata.map((item, i) => (
                <div key={i} className="rounded-lg p-3 bg-warn-muted">
                  <p className="text-caption font-semibold text-warn">{item.label}</p>
                  <p className="text-caption text-slate-600 mt-0.5 leading-relaxed">{item.reason}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
