'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import type { DefaultCellComponentProps } from 'payload'

const STATUS_META = {
  pending: {
    label: 'Needs confirmation',
    tone: 'pending',
    hint: 'Action needed',
  },
  confirmed: {
    label: 'Confirmed',
    tone: 'confirmed',
    hint: '',
  },
  cancelled: {
    label: 'Cancelled',
    tone: 'cancelled',
    hint: '',
  },
} as const

type BookingStatus = keyof typeof STATUS_META

const getStatus = (value: unknown): BookingStatus => {
  if (typeof value === 'string' && value in STATUS_META) {
    return value as BookingStatus
  }

  return 'pending'
}

export function BookingQuickActionsCell({
  cellData,
  linkURL,
  rowData,
}: DefaultCellComponentProps<never, BookingStatus>) {
  const router = useRouter()
  const [status, setStatus] = useState<BookingStatus>(getStatus(cellData))
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const bookingID = rowData?.id
  const meta = STATUS_META[status]

  const updateStatus = (nextStatus: BookingStatus) => {
    if (!bookingID || status === nextStatus || isPending) {
      return
    }

    startTransition(async () => {
      setError(null)

      try {
        const response = await fetch(`/api/bookings/${bookingID}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        setStatus(nextStatus)
        router.refresh()
      } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : 'Could not update the booking.'
        setError(message)
      }
    })
  }

  return (
    <div className="booking-status-cell">
      <div className="booking-status-cell__header">
        <span className={`booking-status-pill booking-status-pill--${meta.tone}`}>{meta.label}</span>
        {meta.hint ? <span className="booking-status-cell__hint">{meta.hint}</span> : null}
      </div>
      <div className="booking-status-actions">
        <button
          className="booking-status-actions__button booking-status-actions__button--confirm"
          disabled={isPending || status === 'confirmed'}
          onClick={() => updateStatus('confirmed')}
          type="button"
        >
          Confirm
        </button>
        <button
          className="booking-status-actions__button booking-status-actions__button--cancel"
          disabled={isPending || status === 'cancelled'}
          onClick={() => updateStatus('cancelled')}
          type="button"
        >
          Cancel
        </button>
        {linkURL ? (
          <a className="booking-status-actions__link" href={linkURL}>
            Open
          </a>
        ) : null}
      </div>
      {error ? <span className="booking-status-actions__error">{error}</span> : null}
    </div>
  )
}
