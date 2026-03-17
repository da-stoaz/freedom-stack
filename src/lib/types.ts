import type { BrandSettingsShape } from './default-brand'

export type ServiceRecord = {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  is_active: boolean
  sort_order: number
}

export type TimeSlotRecord = {
  id: string
  date: string
  starts_at: string
  ends_at: string
  is_available: boolean
}

export type TestimonialRecord = {
  id: string
  author_name: string
  body: string
  rating: number
  is_visible: boolean
  sort_order: number
}

export type BookingSummary = {
  service: string
  date: string
  time: string
  price: number
}

export type BookingInput = {
  service_id: string
  time_slot_id: string
  patient_name: string
  patient_email: string
  patient_phone?: string
  notes?: string
}

export type BookingRecord = BookingInput & {
  id: string
  status: 'pending' | 'confirmed' | 'cancelled'
  confirmation_token: string
}

export type BrandSettingsRecord = BrandSettingsShape

