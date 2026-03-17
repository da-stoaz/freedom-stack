'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'

type Theme = 'light' | 'dark'

const detectTheme = (): Theme => {
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const current = detectTheme()
    setTheme(current)
    document.documentElement.classList.toggle('dark', current === 'dark')
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    window.localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <Button variant="ghost" type="button" onClick={toggle} className="rounded-full px-3 py-2 text-xs">
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </Button>
  )
}
