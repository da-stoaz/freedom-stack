'use client'

import { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

type FormData = {
  email: string
  password: string
}

export function LoginForm() {
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setMessage(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admins/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const payload = (await response.json()) as {
        errors?: Array<{ data?: { field?: string; message?: string } }>
        message?: string
      }

      if (!response.ok) {
        const nextErrors: Partial<Record<keyof FormData, string>> = {}
        for (const error of payload.errors ?? []) {
          const field = error.data?.field
          if (field === 'email' || field === 'password') {
            nextErrors[field] = error.data?.message || 'Please check this field.'
          }
        }

        setErrors(nextErrors)
        setMessage(payload.message || 'Sign in failed.')
        return
      }

      window.location.href = '/admin'
    } catch {
      setMessage('Sign in failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <form onSubmit={submit} className="mt-6 space-y-4" aria-busy={isSubmitting}>
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            disabled={isSubmitting}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          {errors.email ? <p className="mt-1 text-sm text-rose-600">{errors.email}</p> : null}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            disabled={isSubmitting}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          {errors.password ? <p className="mt-1 text-sm text-rose-600">{errors.password}</p> : null}
        </div>

        {isSubmitting ? <p className="text-sm text-slate-500 dark:text-slate-400">Signing you in...</p> : null}
        {message ? <p className="text-sm text-rose-600">{message}</p> : null}

        <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg
                viewBox="0 0 24 24"
                className="mr-2 h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </Card>
  )
}
