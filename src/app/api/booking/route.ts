import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

import { createBooking, BookingError } from '@/lib/booking'
import { getBrandSettings } from '@/lib/content'
import { sendBookingEmails } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const input = await request.json()
    const { booking, bookingSummary } = await createBooking(input)
    const brand = await getBrandSettings()

    await sendBookingEmails({
      booking,
      bookingSummary,
      brand,
    })

    const redirectURL = new URL('/booking/confirmed', request.url)
    redirectURL.searchParams.set('service', bookingSummary.service)
    redirectURL.searchParams.set('date', bookingSummary.date)
    redirectURL.searchParams.set('time', bookingSummary.time)
    redirectURL.searchParams.set('price', String(bookingSummary.price))

    return NextResponse.json({
      redirectUrl: redirectURL.pathname + redirectURL.search,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = Object.fromEntries(
        error.issues.map((issue) => [String(issue.path[0] || 'form'), issue.message]),
      )

      return NextResponse.json(
        {
          message: 'Please fix the highlighted fields.',
          errors,
        },
        { status: 422 },
      )
    }

    if (error instanceof BookingError) {
      return NextResponse.json(
        {
          message: error.message,
          errors: {
            time_slot_id: error.message,
          },
        },
        { status: error.statusCode },
      )
    }

    console.error('Booking submission failed:', error)

    return NextResponse.json(
      {
        message: 'Something went wrong while submitting your booking.',
      },
      { status: 500 },
    )
  }
}
