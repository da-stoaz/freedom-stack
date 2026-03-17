export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value))

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-AT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))

export const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat('de-AT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))

export const formatTimeRange = (startsAt: string, endsAt: string) =>
  `${startsAt.slice(0, 5)} - ${endsAt.slice(0, 5)}`

