import { useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import FeatureItem from '../components/features/auth/FeatureItem'

interface Props {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="flex w-full max-w-2xl rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(14,165,233,0.15),0_8px_40px_rgba(0,0,0,0.12)] border border-black/5">

        {/* Left panel — hidden on mobile */}
        <div className="hidden md:flex w-2/5 shrink-0 flex-col px-8 py-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #0a0f1a 0%, #0c1e3e 45%, #0a1a30 100%)' }}>
          {/* 글로우 장식 */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />
          <div className="absolute bottom-10 left-0 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />

          <div className="mb-auto relative">
            <p className="font-serif text-hero font-bold text-white tracking-tight leading-tight">
              매일메일
            </p>
            <p className="text-caption text-white/35 mt-3 leading-relaxed">
              AI 기반 스마트<br />이메일 센티널
            </p>
          </div>
          <div className="flex flex-col gap-6 mt-12">
            <FeatureItem icon={<ShieldIcon />} title="보안 강화 모드" desc="256-bit 엔드투엔드 암호화" />
            <FeatureItem icon={<ScanIcon />} title="AI 필터링" desc="스팸 · 피싱 실시간 차단" />
            <FeatureItem icon={<LayersIcon />} title="스마트 분류" desc="중요 메일 자동 정리" />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white flex flex-col justify-center px-7 py-10 md:px-12 md:py-12">

          {/* Brand — mobile only (left panel hidden) */}
          <div className="md:hidden mb-8">
            <p className="font-serif text-hero font-bold text-dark tracking-tight">매일메일</p>
            <p className="text-xs text-slate-500 mt-1.5">AI 기반 스마트 이메일 센티널</p>
          </div>

          <div className="max-w-xs w-full mx-auto">
            <p className="text-xl font-semibold text-dark mb-2">로그인</p>
            <p className="text-body text-slate-500 mb-8">계정에 접속하세요</p>

            <div className="flex flex-col gap-5 mb-5">
              <Input
                id="email"
                label="이메일"
                type="email"
                placeholder="example@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                id="password"
                label="비밀번호"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end mb-7">
              <a href="#" className="text-xs text-brand hover:text-brand-dark transition-colors">
                비밀번호를 잊으셨나요?
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <Button className="w-full py-3" onClick={onLogin}>
                로그인
              </Button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-caption text-slate-400">또는</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <Button variant="ghost" className="w-full py-3 border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50" onClick={onLogin}>
                🗂 로그인 없이 둘러보기 (포트폴리오용)
              </Button>

              <Button variant="secondary" className="w-full py-3" onClick={onLogin}>
                <GoogleIcon />
                🔍 Google로 계속하기
              </Button>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-caption text-slate-400">
                <ShieldSmIcon />
                256-bit 암호화
              </div>
              <Button variant="ghost" className="w-full py-3 border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50" onClick={onLogin}>
                🗂 로그인 없이 둘러보기 (포트폴리오용)
              </Button>
              <p className="text-xs text-slate-500">
                계정이 없으신가요?{' '}
                <a href="#" className="text-brand hover:text-brand-dark font-medium transition-colors">
                  회원가입
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function ScanIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93A10 10 0 0 0 2 12h2" />
      <path d="M21.17 8C21.71 9.28 22 10.61 22 12a10 10 0 0 1-5.93 9.07" />
    </svg>
  )
}
function LayersIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" /><path d="M9 21V9" />
    </svg>
  )
}
function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
function ShieldSmIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
