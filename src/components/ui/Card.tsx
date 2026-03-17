import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        'surface-card rounded-3xl border border-slate-200/60 bg-white/95 shadow-sm dark:border-slate-800 dark:bg-slate-900/80',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
