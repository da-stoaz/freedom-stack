import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost'

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    fullWidth?: boolean
  }
>

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-primary text-white hover:opacity-95 dark:bg-brand-primary dark:text-white',
  accent: 'bg-brand-accent text-slate-900 hover:opacity-95 dark:bg-brand-accent dark:text-slate-900',
  secondary:
    'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
}

export function getButtonClassName({
  className,
  fullWidth = false,
  variant = 'primary',
}: {
  className?: string
  fullWidth?: boolean
  variant?: ButtonVariant
}) {
  return cn(
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    fullWidth && 'w-full',
    className,
  )
}

export function Button({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  ...props
}: Props) {
  return (
    <button className={getButtonClassName({ className, fullWidth, variant })} {...props}>
      {children}
    </button>
  )
}
