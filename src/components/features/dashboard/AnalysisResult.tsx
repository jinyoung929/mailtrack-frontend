import type { AnalysisResult as ResultType, SecurityLevel } from '../../../types'

interface Props {
  result: ResultType
}

const LEVEL_CFG: Record<SecurityLevel, { label: string; bg: string; text: string; border: string; iconStroke: string }> = {
  safe:   { label: '안전',  bg: 'bg-safe-muted',   text: 'text-safe',   border: 'border-green-100', iconStroke: '#15803d' },
  warn:   { label: '주의',  bg: 'bg-warn-muted',   text: 'text-warn',   border: 'border-amber-100', iconStroke: '#b45309' },
  danger: { label: '위험',  bg: 'bg-danger-muted', text: 'text-danger', border: 'border-red-100',   iconStroke: '#b91c1c' },
}

export default function AnalysisResult({ result }: Props) {
  const cfg = LEVEL_CFG[result.security.level]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

      {/* 요약 카드 */}
      <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden fade-in">
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
  )
}
