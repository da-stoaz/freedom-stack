import Link from 'next/link'

import { Card } from '@/components/ui/Card'
import { formatCurrency, formatShortDate } from '@/lib/utils'

type Props = {
  searchParams: Promise<{
    service?: string
    date?: string
    time?: string
    price?: string
  }>
}

export default async function BookingConfirmedPage({ searchParams }: Props) {
  const summary = await searchParams

  return (
    <section className="section">
      <div className="container container--narrow">
        <Card className="card--centered">
          <div className="confirmation-mark">OK</div>
          <h1>Your booking request is in</h1>
          <p className="muted">A confirmation email has been sent with your appointment details.</p>

          {summary.service ? (
            <div className="summary-box">
              <p>
                <strong>Service:</strong> {summary.service}
              </p>
              <p>
                <strong>Date:</strong> {summary.date ? formatShortDate(summary.date) : '-'}
              </p>
              <p>
                <strong>Time:</strong> {summary.time || '-'}
              </p>
              <p>
                <strong>Price:</strong> {summary.price ? formatCurrency(summary.price) : '-'}
              </p>
            </div>
          ) : null}

          <div className="cta-row">
            <Link href="/" className="button-link button-link--primary">
              Return home
            </Link>
          </div>
        </Card>
      </div>
    </section>
  )
}

