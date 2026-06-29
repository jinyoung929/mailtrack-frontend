import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  loading = false,
  children,
  className = '',
  disabled,
  ...rest
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg text-body font-medium ' +
    'transition-all duration-150 px-4 py-2 select-none ' +
    'disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-dark text-white hover:bg-slate-700 active:bg-slate-800',
    secondary: 'bg-white text-dark border border-slate-200 hover:bg-slate-50 active:bg-slate-100',
    ghost:     'bg-transparent text-slate-500 hover:bg-slate-100 active:bg-slate-200',
  }

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {children}
    </button>
  )
}
