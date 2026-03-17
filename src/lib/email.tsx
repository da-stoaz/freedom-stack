import nodemailer from 'nodemailer'

import type { BookingInput, BookingSummary, BrandSettingsRecord } from './types'
import { formatCurrency, formatDate } from './utils'

let cachedTransport: nodemailer.Transporter | null | undefined

function getTransport() {
  if (cachedTransport !== undefined) {
    return cachedTransport
  }

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || '2525')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host) {
    cachedTransport = null
    return cachedTransport
  }

  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user ? { user, pass } : undefined,
  })

  return cachedTransport
}

export async function sendBookingEmails(args: {
  booking: BookingInput
  bookingSummary: BookingSummary
  brand: BrandSettingsRecord
}) {
  const transport = getTransport()

  if (!transport) {
    return
  }

  const fromName = process.env.SMTP_FROM_NAME || args.brand.name
  const fromEmail = process.env.SMTP_FROM_EMAIL || args.brand.email
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const confirmationHTML = `<!DOCTYPE html>
  <html lang="en">
    <body style="margin:0;padding:24px;background:#f8fafc;color:#0f172a;font-family:Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:20px 24px;background:${args.brand.colors.accent};color:#111827;">
            <h1 style="margin:0;font-size:24px;">${args.brand.name}</h1>
            <p style="margin:8px 0 0;">Appointment request received</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <p style="margin-top:0;">Hi ${args.booking.patient_name},</p>
            <p>Thanks for booking with us. Your request is now pending confirmation.</p>
            <h2 style="margin:24px 0 8px;font-size:18px;">Booking summary</h2>
            <p style="margin:0 0 8px;"><strong>Service:</strong> ${args.bookingSummary.service}</p>
            <p style="margin:0 0 8px;"><strong>Date:</strong> ${formatDate(args.bookingSummary.date)}</p>
            <p style="margin:0 0 8px;"><strong>Time:</strong> ${args.bookingSummary.time}</p>
            <p style="margin:0 0 16px;"><strong>Price:</strong> ${formatCurrency(args.bookingSummary.price)}</p>
            <p style="margin:0;">Need to reschedule? Contact us at <a href="mailto:${args.brand.email}">${args.brand.email}</a> or ${args.brand.phone}.</p>
          </td>
        </tr>
      </table>
    </body>
  </html>`

  const notificationHTML = `<!DOCTYPE html>
  <html lang="en">
    <body style="margin:0;padding:24px;background:#f8fafc;color:#0f172a;font-family:Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:20px 24px;background:${args.brand.colors.primary};color:#ffffff;">
            <h1 style="margin:0;font-size:24px;">New Booking Alert</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <p style="margin-top:0;">A new booking has been submitted.</p>
            <h2 style="margin:24px 0 8px;font-size:18px;">Patient details</h2>
            <p style="margin:0 0 8px;"><strong>Name:</strong> ${args.booking.patient_name}</p>
            <p style="margin:0 0 8px;"><strong>Email:</strong> ${args.booking.patient_email}</p>
            <p style="margin:0 0 8px;"><strong>Phone:</strong> ${args.booking.patient_phone || 'N/A'}</p>
            <p style="margin:0 0 16px;"><strong>Notes:</strong> ${args.booking.notes || 'N/A'}</p>
            <h2 style="margin:24px 0 8px;font-size:18px;">Appointment</h2>
            <p style="margin:0 0 8px;"><strong>Service:</strong> ${args.bookingSummary.service}</p>
            <p style="margin:0 0 8px;"><strong>Date:</strong> ${formatDate(args.bookingSummary.date)}</p>
            <p style="margin:0 0 16px;"><strong>Time:</strong> ${args.bookingSummary.time}</p>
            <a href="${siteURL.replace(/\/$/, '')}/admin" style="display:inline-block;padding:10px 16px;background:${args.brand.colors.accent};color:#111827;text-decoration:none;border-radius:8px;">Open Admin Panel</a>
          </td>
        </tr>
      </table>
    </body>
  </html>`

  await Promise.allSettled([
    transport.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: args.booking.patient_email,
      subject: `Booking received - ${args.brand.name}`,
      html: confirmationHTML,
    }),
    transport.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: args.brand.email,
      subject: `New booking received - ${args.booking.patient_name}`,
      html: notificationHTML,
    }),
  ])
}
