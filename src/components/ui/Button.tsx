import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'accent' | 'secondary'
    fullWidth?: boolean
  }
>

export function Button({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  ...props
}: Props) {
  return (
    <button
      className={cn('button', `button--${variant}`, fullWidth && 'button--full', className)}
      {...props}
    >
      {children}
    </button>
  )
}

