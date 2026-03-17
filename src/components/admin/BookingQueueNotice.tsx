import type { BeforeListServerProps } from 'payload'

type BookingListItem = {
  status?: string | null
}

export function BookingQueueNotice({ data }: BeforeListServerProps) {
  const docs = Array.isArray(data?.docs) ? (data.docs as BookingListItem[]) : []
  const pendingCount = docs.filter((doc) => doc?.status === 'pending').length
  const hasPending = pendingCount > 0

  return (
    <div className={`booking-queue-notice ${hasPending ? 'is-pending' : 'is-clear'}`}>
      <div className="booking-queue-notice__icon" aria-hidden="true">
        {hasPending ? '!' : 'i'}
      </div>
      <div className="booking-queue-notice__content">
        <p className="booking-queue-notice__title">
          {hasPending
            ? `${pendingCount} booking${pendingCount === 1 ? '' : 's'} on this page still need confirmation.`
            : 'Bookings need a status decision after review.'}
        </p>
        <p className="booking-queue-notice__body">
          Open a booking and change <strong>Booking status</strong> to <strong>Confirmed</strong> or{' '}
          <strong>Cancelled</strong>. New requests always start as <strong>Needs confirmation</strong>.
        </p>
      </div>
    </div>
  )
}
