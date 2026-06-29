interface Props {
  value: string
  onChange: (v: string) => void
  onAnalyze: () => void
  loading: boolean
}

export default function MailInput({ value, onChange, onAnalyze, loading }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <p className="text-body font-semibold text-dark">메일 분석</p>
        <span className="text-hint text-slate-400 ml-auto">Gemini AI 분석</span>
      </div>

      {/* 텍스트 입력 */}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={"분석할 메일 내용을 여기에 붙여넣으세요.\n\n예시:\n발신: security@suspicious-bank.com\n제목: [긴급] 계좌 이상 거래 감지\n\n고객님의 계좌에서 이상 거래가 감지되었습니다. 즉시 아래 링크를 클릭하여 본인인증을 완료하세요."}
        rows={8}
        disabled={loading}
        className={
          'w-full px-5 py-4 text-body text-dark bg-transparent placeholder:text-slate-400 ' +
          'outline-none resize-none leading-[1.8] ' +
          'disabled:opacity-60 disabled:cursor-not-allowed'
        }
      />

      {/* 푸터 */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
        <p className="text-hint text-slate-400">
          {value.length > 0 ? `${value.length.toLocaleString()}자` : '텍스트를 붙여넣으세요'}
        </p>
        <button
          onClick={onAnalyze}
          disabled={!value.trim() || loading}
          className={
            'flex items-center gap-2 px-4 py-1.5 rounded-lg text-body font-medium text-white ' +
            'bg-dark hover:bg-slate-700 active:bg-slate-800 ' +
            'disabled:opacity-50 disabled:cursor-not-allowed ' +
            'transition-all duration-150'
          }
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              AI 분석 시작
            </>
          )}
        </button>
      </div>
    </div>
  )
}
