import { redirect } from 'next/navigation'

import { LoginForm } from '@/components/auth/LoginForm'
import { getCurrentAdminUser } from '@/lib/auth'

export default async function LoginPage() {
  const currentAdmin = await getCurrentAdminUser()

  if (currentAdmin) {
    redirect('/admin')
  }

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <LoginForm />
    </section>
  )
}
