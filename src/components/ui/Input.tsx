import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label?: string
}

export default function Input({ id, label, className = '', ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-caption font-medium text-slate-600">
          {label}
        </label>
      )}
      <input
        id={id}
        className={
          'w-full rounded-lg border border-slate-200 bg-field px-3.5 py-2.5 text-body text-dark ' +
          'placeholder:text-slate-400 outline-none ' +
          'focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10 ' +
          'transition-all duration-150 ' +
          className
        }
        {...rest}
      />
    </div>
  )
}
