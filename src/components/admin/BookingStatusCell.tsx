import type { DefaultServerCellComponentProps } from 'payload'

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

export function BookingStatusCell({ cellData }: DefaultServerCellComponentProps) {
  const status = typeof cellData === 'string' && cellData in STATUS_META ? cellData : 'pending'
  const meta = STATUS_META[status as keyof typeof STATUS_META]

  return (
    <div className="booking-status-cell">
      <span className={`booking-status-pill booking-status-pill--${meta.tone}`}>{meta.label}</span>
      {meta.hint ? <span className="booking-status-cell__hint">{meta.hint}</span> : null}
    </div>
  )
}
