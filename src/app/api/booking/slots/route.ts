import { NextResponse } from 'next/server'

import { getAvailableSlotsForDate } from '@/lib/booking'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const date = url.searchParams.get('date')

  if (!date) {
    return NextResponse.json(
      {
        message: 'Missing date parameter.',
      },
      { status: 400 },
    )
  }

  const data = await getAvailableSlotsForDate(date)
  return NextResponse.json({ data })
}

