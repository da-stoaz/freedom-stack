import type { BookingSummary, BrandSettingsRecord } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

type Props = {
  bookingSummary: BookingSummary
  brand: BrandSettingsRecord
  patientName: string
}

export function BookingConfirmationEmail({ bookingSummary, brand, patientName }: Props) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 24,
          background: '#f8fafc',
          color: '#0f172a',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <table
          role="presentation"
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{
            maxWidth: 640,
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding: '20px 24px',
                  background: brand.colors.accent,
                  color: '#111827',
                }}
              >
                <h1 style={{ margin: 0, fontSize: 24 }}>{brand.name}</h1>
                <p style={{ margin: '8px 0 0' }}>Appointment request received</p>
              </td>
            </tr>
            <tr>
              <td style={{ padding: 24 }}>
                <p style={{ marginTop: 0 }}>Hi {patientName},</p>
                <p>Thanks for booking with us. Your request is now pending confirmation.</p>
                <h2 style={{ margin: '24px 0 8px', fontSize: 18 }}>Booking summary</h2>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Service:</strong> {bookingSummary.service}
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Date:</strong> {formatDate(bookingSummary.date)}
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Time:</strong> {bookingSummary.time}
                </p>
                <p style={{ margin: '0 0 16px' }}>
                  <strong>Price:</strong> {formatCurrency(bookingSummary.price)}
                </p>
                <p style={{ margin: 0 }}>
                  Need to reschedule? Contact us at <a href={`mailto:${brand.email}`}>{brand.email}</a> or{' '}
                  {brand.phone}.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}

