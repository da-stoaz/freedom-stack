'use client'

import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import type { BrandSettingsRecord, ServiceRecord, TimeSlotRecord } from '@/lib/types'
import { formatCurrency, formatTimeRange } from '@/lib/utils'

type Props = {
  availableDates: string[]
  brand: BrandSettingsRecord
  preselectedServiceId?: string
  services: ServiceRecord[]
}

type FormState = {
  service_id: string
  time_slot_id: string
  patient_name: string
  patient_email: string
  patient_phone: string
  notes: string
}

const initialForm = (preselectedServiceId?: string): FormState => ({
  service_id: preselectedServiceId ?? '',
  time_slot_id: '',
  patient_name: '',
  patient_email: '',
  patient_phone: '',
  notes: '',
})

export function BookForm({ availableDates, brand, preselectedServiceId, services }: Props) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0] ?? '')
  const [slots, setSlots] = useState<TimeSlotRecord[]>([])
  const [form, setForm] = useState<FormState>(initialForm(preselectedServiceId))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedDate) {
      return
    }

    setIsLoadingSlots(true)
    setForm((current) => ({ ...current, time_slot_id: '' }))

    fetch(`/api/booking/slots?date=${encodeURIComponent(selectedDate)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load slots.')
        }

        return response.json()
      })
      .then((payload) => {
        setSlots(payload.data as TimeSlotRecord[])
      })
      .catch(() => {
        setSlots([])
      })
      .finally(() => {
        setIsLoadingSlots(false)
      })
  }, [selectedDate])

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.service_id),
    [form.service_id, services],
  )

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === form.time_slot_id),
    [form.time_slot_id, slots],
  )

  const canSubmit = Boolean(
    form.service_id && form.time_slot_id && form.patient_name.trim() && form.patient_email.trim(),
  )

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const payload = await response.json()

      if (!response.ok) {
        setErrors(payload.errors || {})
        setSubmitError(payload.message || 'We could not submit your booking.')
        return
      }

      router.push(payload.redirectUrl)
    } catch {
      setSubmitError(`We could not reach ${brand.name}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1.6fr,1fr]">
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold">1. Service</h3>
          <div className="mt-4 space-y-3">
            <Select value={form.service_id} onChange={(event) => setField('service_id', event.target.value)}>
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
            {selectedService ? (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Badge>{selectedService.duration_minutes} min</Badge>
                <span>{formatCurrency(selectedService.price)}</span>
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">2. Date</h3>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {availableDates.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  selectedDate === date
                    ? 'border-brand-primary bg-brand-secondary text-slate-900 dark:border-brand-primary dark:bg-slate-800 dark:text-white'
                    : 'border-slate-300 hover:border-brand-primary dark:border-slate-700'
                }`}
              >
                {new Date(date).toLocaleDateString()}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">3. Time Slot</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {isLoadingSlots ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">Loading available slots...</p>
            ) : null}
            {!isLoadingSlots && slots.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">No slots for this date yet.</p>
            ) : (
              slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setField('time_slot_id', slot.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    form.time_slot_id === slot.id
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-slate-300 hover:border-brand-primary dark:border-slate-700'
                  }`}
                >
                  {formatTimeRange(slot.starts_at, slot.ends_at)}
                </button>
              ))
            )}
          </div>
          {errors.time_slot_id ? <p className="mt-2 text-sm text-rose-600">{errors.time_slot_id}</p> : null}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">4. Patient details</h3>
          <div className="mt-4 grid gap-4">
            <div>
              <Input
                placeholder="Full name *"
                value={form.patient_name}
                onChange={(event) => setField('patient_name', event.target.value)}
              />
              {errors.patient_name ? <p className="mt-1 text-sm text-rose-600">{errors.patient_name}</p> : null}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email address *"
                value={form.patient_email}
                onChange={(event) => setField('patient_email', event.target.value)}
              />
              {errors.patient_email ? <p className="mt-1 text-sm text-rose-600">{errors.patient_email}</p> : null}
            </div>

            <Input
              placeholder="Phone number (optional)"
              value={form.patient_phone}
              onChange={(event) => setField('patient_phone', event.target.value)}
            />

            <textarea
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              rows={4}
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(event) => setField('notes', event.target.value)}
            />
          </div>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <p>
              <strong>Service:</strong> {selectedService?.name ?? 'Not selected'}
            </p>
            <p>
              <strong>Date:</strong> {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Not selected'}
            </p>
            <p>
              <strong>Time:</strong>{' '}
              {selectedSlot ? formatTimeRange(selectedSlot.starts_at, selectedSlot.ends_at) : 'Not selected'}
            </p>
            <p>
              <strong>Price:</strong> {selectedService ? formatCurrency(selectedService.price) : '-'}
            </p>
          </div>

          {submitError ? <p className="mt-4 text-sm text-rose-600">{submitError}</p> : null}

          <Button type="submit" variant="accent" fullWidth className="mt-6" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit booking'}
          </Button>
        </Card>
      </div>
    </form>
  )
}
