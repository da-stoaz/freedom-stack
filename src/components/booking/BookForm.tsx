'use client'

import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { BrandSettingsRecord, ServiceRecord, TimeSlotRecord } from '@/lib/types'
import { formatCurrency, formatShortDate, formatTimeRange } from '@/lib/utils'

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
    <form onSubmit={submit} className="two-column-grid">
      <div className="stack-lg">
        <Card>
          <h3>1. Service</h3>
          <div className="stack-sm">
            <Select value={form.service_id} onChange={(event) => setField('service_id', event.target.value)}>
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
            {selectedService ? (
              <div className="inline-meta">
                <span className="badge">{selectedService.duration_minutes} min</span>
                <span>{formatCurrency(selectedService.price)}</span>
              </div>
            ) : null}
          </div>
        </Card>

        <Card>
          <h3>2. Date</h3>
          <div className="date-grid">
            {availableDates.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={selectedDate === date ? 'pill is-active' : 'pill'}
              >
                {formatShortDate(date)}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3>3. Time slot</h3>
          {isLoadingSlots ? <p className="muted">Loading available slots...</p> : null}
          {!isLoadingSlots && slots.length === 0 ? <p className="muted">No slots for this date yet.</p> : null}
          <div className="date-grid">
            {slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setField('time_slot_id', slot.id)}
                className={form.time_slot_id === slot.id ? 'pill is-active' : 'pill'}
              >
                {formatTimeRange(slot.starts_at, slot.ends_at)}
              </button>
            ))}
          </div>
          {errors.time_slot_id ? <p className="error-text">{errors.time_slot_id}</p> : null}
        </Card>

        <Card>
          <h3>4. Patient details</h3>
          <div className="stack-sm">
            <div>
              <Input
                placeholder="Full name *"
                value={form.patient_name}
                onChange={(event) => setField('patient_name', event.target.value)}
              />
              {errors.patient_name ? <p className="error-text">{errors.patient_name}</p> : null}
            </div>

            <div>
              <Input
                type="email"
                placeholder="Email address *"
                value={form.patient_email}
                onChange={(event) => setField('patient_email', event.target.value)}
              />
              {errors.patient_email ? <p className="error-text">{errors.patient_email}</p> : null}
            </div>

            <Input
              placeholder="Phone number (optional)"
              value={form.patient_phone}
              onChange={(event) => setField('patient_phone', event.target.value)}
            />

            <textarea
              className="input textarea"
              rows={4}
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(event) => setField('notes', event.target.value)}
            />
          </div>
        </Card>
      </div>

      <div>
        <Card className="sticky-card">
          <h3>Summary</h3>
          <div className="stack-xs">
            <p>
              <strong>Service:</strong> {selectedService?.name ?? 'Not selected'}
            </p>
            <p>
              <strong>Date:</strong> {selectedDate ? formatShortDate(selectedDate) : 'Not selected'}
            </p>
            <p>
              <strong>Time:</strong>{' '}
              {selectedSlot ? formatTimeRange(selectedSlot.starts_at, selectedSlot.ends_at) : 'Not selected'}
            </p>
            <p>
              <strong>Price:</strong> {selectedService ? formatCurrency(selectedService.price) : '-'}
            </p>
          </div>

          {submitError ? <p className="error-box">{submitError}</p> : null}

          <Button type="submit" variant="accent" fullWidth disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit booking'}
          </Button>
        </Card>
      </div>
    </form>
  )
}
