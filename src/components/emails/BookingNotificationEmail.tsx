import type { BookingInput, BookingSummary, BrandSettingsRecord } from '@/lib/types'
import { formatDate } from '@/lib/utils'

type Props = {
  booking: BookingInput
  bookingSummary: BookingSummary
  brand: BrandSettingsRecord
  adminURL: string
}

export function BookingNotificationEmail({ booking, bookingSummary, brand, adminURL }: Props) {
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
                  background: brand.colors.primary,
                  color: '#ffffff',
                }}
              >
                <h1 style={{ margin: 0, fontSize: 24 }}>New Booking Alert</h1>
              </td>
            </tr>
            <tr>
              <td style={{ padding: 24 }}>
                <p style={{ marginTop: 0 }}>A new booking has been submitted.</p>

                <h2 style={{ margin: '24px 0 8px', fontSize: 18 }}>Patient details</h2>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Name:</strong> {booking.patient_name}
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Email:</strong> {booking.patient_email}
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Phone:</strong> {booking.patient_phone || 'N/A'}
                </p>
                <p style={{ margin: '0 0 16px' }}>
                  <strong>Notes:</strong> {booking.notes || 'N/A'}
                </p>

                <h2 style={{ margin: '24px 0 8px', fontSize: 18 }}>Appointment</h2>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Service:</strong> {bookingSummary.service}
                </p>
                <p style={{ margin: '0 0 8px' }}>
                  <strong>Date:</strong> {formatDate(bookingSummary.date)}
                </p>
                <p style={{ margin: '0 0 16px' }}>
                  <strong>Time:</strong> {bookingSummary.time}
                </p>

                <a
                  href={adminURL}
                  style={{
                    display: 'inline-block',
                    padding: '10px 16px',
                    background: brand.colors.accent,
                    color: '#111827',
                    textDecoration: 'none',
                    borderRadius: 8,
                  }}
                >
                  Open Admin Panel
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}

