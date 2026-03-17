import { defaultBrandSettings } from './default-brand'
import { getPayloadClient } from './get-payload'
import type {
  BrandSettingsRecord,
  ServiceRecord,
  TestimonialRecord,
  TimeSlotRecord,
} from './types'

const coerceNumber = (value: unknown) => Number(value || 0)
const coerceOptionalString = (value: unknown) => (typeof value === 'string' ? value : undefined)
const coerceString = (value: unknown, fallback: string) => (typeof value === 'string' ? value : fallback)

export async function getBrandSettings(): Promise<BrandSettingsRecord> {
  const payload = await getPayloadClient()
  const global = await payload.findGlobal({
    slug: 'brand-settings',
  })

  return {
    ...defaultBrandSettings,
    ...global,
    socials: {
      ...defaultBrandSettings.socials,
      instagram: coerceOptionalString(global?.socials?.instagram) ?? defaultBrandSettings.socials.instagram,
      facebook: coerceOptionalString(global?.socials?.facebook) ?? defaultBrandSettings.socials.facebook,
    },
    colors: {
      primary: coerceString(global?.colors?.primary, defaultBrandSettings.colors.primary),
      secondary: coerceString(global?.colors?.secondary, defaultBrandSettings.colors.secondary),
      accent: coerceString(global?.colors?.accent, defaultBrandSettings.colors.accent),
    },
    fonts: {
      heading: coerceString(global?.fonts?.heading, defaultBrandSettings.fonts.heading),
      body: coerceString(global?.fonts?.body, defaultBrandSettings.fonts.body),
    },
  }
}

export async function getPublicServices(limit?: number): Promise<ServiceRecord[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: {
      is_active: {
        equals: true,
      },
    },
    sort: 'sort_order',
    limit: limit ?? 100,
    depth: 0,
  })

  return result.docs.map((doc) => ({
    id: String(doc.id),
    name: String(doc.name),
    description: String(doc.description),
    duration_minutes: coerceNumber(doc.duration_minutes),
    price: coerceNumber(doc.price),
    is_active: Boolean(doc.is_active),
    sort_order: coerceNumber(doc.sort_order),
  }))
}

export async function getVisibleTestimonials(): Promise<TestimonialRecord[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'testimonials',
    where: {
      is_visible: {
        equals: true,
      },
    },
    sort: 'sort_order',
    limit: 100,
    depth: 0,
  })

  return result.docs.map((doc) => ({
    id: String(doc.id),
    author_name: String(doc.author_name),
    body: String(doc.body),
    rating: coerceNumber(doc.rating),
    is_visible: Boolean(doc.is_visible),
    sort_order: coerceNumber(doc.sort_order),
  }))
}

export async function getAvailableDates(): Promise<string[]> {
  const payload = await getPayloadClient()
  const today = new Date().toISOString().slice(0, 10)
  const result = await payload.find({
    collection: 'time-slots',
    where: {
      and: [
        {
          is_available: {
            equals: true,
          },
        },
        {
          date: {
            greater_than_equal: today,
          },
        },
      ],
    },
    sort: 'date',
    limit: 1000,
    depth: 0,
  })

  return Array.from(new Set(result.docs.map((doc) => String(doc.date)))).sort()
}

export async function getAvailableSlotsByDate(date: string): Promise<TimeSlotRecord[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'time-slots',
    where: {
      and: [
        {
          date: {
            equals: date,
          },
        },
        {
          is_available: {
            equals: true,
          },
        },
      ],
    },
    sort: 'starts_at',
    limit: 100,
    depth: 0,
  })

  return result.docs.map((doc) => ({
    id: String(doc.id),
    date: String(doc.date),
    starts_at: String(doc.starts_at),
    ends_at: String(doc.ends_at),
    is_available: Boolean(doc.is_available),
  }))
}
