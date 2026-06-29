/**
 * 광고 배너 컴포넌트
 * README의 "광고 수익 모델" — 스폰서 배너 수수료 기반 수익 모델 시연용
 */
export default function AdBanner() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-blue-600 flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-caption font-semibold text-dark">기업용 이메일 보안 솔루션</p>
          <span className="text-hint text-slate-400 px-1.5 py-0.5 rounded bg-slate-100">광고</span>
        </div>
        <p className="text-hint text-slate-400">엔터프라이즈 메일 보안 강화 — 무료 체험 시작하기</p>
      </div>
      <button className="shrink-0 text-hint font-semibold text-brand hover:text-brand-dark transition-colors">
        자세히 보기 →
      </button>
    </div>
  )
}
