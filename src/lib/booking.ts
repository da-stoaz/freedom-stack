import { randomBytes, randomUUID } from 'node:crypto'

import { z } from 'zod'

import { pool } from './db'
import type { BookingInput, BookingSummary, TimeSlotRecord } from './types'
import { formatTimeRange } from './utils'

const bookingSchema = z.object({
  service_id: z.string().uuid(),
  time_slot_id: z.string().uuid(),
  patient_name: z.string().min(1).max(255),
  patient_email: z.string().email().max(255),
  patient_phone: z.string().max(50).optional().or(z.literal('')),
  notes: z.string().max(2000).optional().or(z.literal('')),
})

export class BookingError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}

export async function getAvailableSlotsForDate(date: string): Promise<TimeSlotRecord[]> {
  const result = await pool.query(
    `
      select id, date, starts_at, ends_at, is_available
      from time_slots
      where date = $1
        and is_available = true
      order by starts_at asc
    `,
    [date],
  )

  return result.rows.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    date: String(row.date),
    starts_at: String(row.starts_at),
    ends_at: String(row.ends_at),
    is_available: Boolean(row.is_available),
  }))
}

export async function createBooking(rawInput: unknown): Promise<{
  booking: BookingInput & { id: string; confirmation_token: string }
  bookingSummary: BookingSummary
}> {
  const input = bookingSchema.parse(rawInput)
  const client = await pool.connect()

  try {
    await client.query('begin')

    const serviceResult = await client.query(
      `
        select id, name, price
        from services
        where id = $1
          and is_active = true
        limit 1
      `,
      [input.service_id],
    )

    if (serviceResult.rowCount !== 1) {
      throw new BookingError('The selected service is not available.')
    }

    const slotResult = await client.query(
      `
        select id, date, starts_at, ends_at, is_available
        from time_slots
        where id = $1
        for update
      `,
      [input.time_slot_id],
    )

    if (slotResult.rowCount !== 1) {
      throw new BookingError('The selected time slot does not exist.')
    }

    const slot = slotResult.rows[0]
    const slotDate = String(slot.date)
    if (!slot.is_available || slotDate < new Date().toISOString().slice(0, 10)) {
      throw new BookingError('This time slot is no longer available.')
    }

    await client.query(
      `
        update time_slots
        set is_available = false,
            updated_at = $2
        where id = $1
      `,
      [input.time_slot_id, new Date().toISOString()],
    )

    const id = randomUUID()
    const confirmationToken = randomBytes(32).toString('hex')
    const now = new Date().toISOString()

    await client.query(
      `
        insert into bookings (
          id,
          service_id,
          time_slot_id,
          patient_name,
          patient_email,
          patient_phone,
          notes,
          status,
          confirmation_token,
          created_at,
          updated_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, $9, $10)
      `,
      [
        id,
        input.service_id,
        input.time_slot_id,
        input.patient_name,
        input.patient_email,
        input.patient_phone || null,
        input.notes || null,
        confirmationToken,
        now,
        now,
      ],
    )

    await client.query('commit')

    const service = serviceResult.rows[0]
    const bookingSummary: BookingSummary = {
      service: String(service.name),
      date: slotDate,
      time: formatTimeRange(String(slot.starts_at), String(slot.ends_at)),
      price: Number(service.price),
    }

    return {
      booking: {
        ...input,
        patient_phone: input.patient_phone || '',
        notes: input.notes || '',
        id,
        confirmation_token: confirmationToken,
      },
      bookingSummary,
    }
  } catch (error) {
    await client.query('rollback')
    throw error
  } finally {
    client.release()
  }
}
