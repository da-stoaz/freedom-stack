process.loadEnvFile?.('.env')

import { getPayload } from 'payload'

import configPromise from '@/payload.config'
import { defaultBrandSettings } from '@/lib/default-brand'

const formatDate = (value: Date) => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

async function main() {
  const config = await configPromise
  const payload = await getPayload({ config })

  try {
    const emailDomain = defaultBrandSettings.email.split('@')[1] || 'primacura.at'
    const adminEmail = process.env.SEED_ADMIN_EMAIL || `admin@${emailDomain}`
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'password'

    const existingAdmins = await payload.find({
      collection: 'admins',
      where: {
        email: {
          equals: adminEmail,
        },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existingAdmins.docs.length === 0) {
      await payload.create({
        collection: 'admins',
        overrideAccess: true,
        data: {
          email: adminEmail,
          password: adminPassword,
          name: `${defaultBrandSettings.name} Admin`,
          is_admin: true,
        },
      })
    }

    await payload.updateGlobal({
      slug: 'brand-settings',
      overrideAccess: true,
      data: defaultBrandSettings,
    })

    const services = [
      {
        name: 'Initial Assessment',
        description: 'Comprehensive first consultation with movement screening and a tailored treatment plan.',
        duration_minutes: 60,
        price: 95,
        sort_order: 1,
      },
      {
        name: 'Sports Massage',
        description: 'Deep tissue and recovery-focused massage for athletic performance and injury prevention.',
        duration_minutes: 45,
        price: 80,
        sort_order: 2,
      },
      {
        name: 'Manual Therapy',
        description: 'Hands-on mobilisation techniques to restore range of motion and reduce pain.',
        duration_minutes: 45,
        price: 85,
        sort_order: 3,
      },
      {
        name: 'Dry Needling',
        description: 'Targeted trigger-point therapy to release muscle tension and improve function.',
        duration_minutes: 30,
        price: 70,
        sort_order: 4,
      },
      {
        name: 'Posture Analysis',
        description: 'Detailed postural and ergonomic assessment with practical correction guidance.',
        duration_minutes: 40,
        price: 75,
        sort_order: 5,
      },
    ]

    const existingServices = await payload.find({
      collection: 'services',
      limit: 100,
      overrideAccess: true,
    })
    const existingServiceNames = new Set(existingServices.docs.map((service) => String(service.name)))

    for (const service of services) {
      if (existingServiceNames.has(service.name)) {
        continue
      }

      await payload.create({
        collection: 'services',
        overrideAccess: true,
        data: {
          ...service,
          is_active: true,
        },
      })
    }

    const existingTestimonials = await payload.find({
      collection: 'testimonials',
      limit: 100,
      overrideAccess: true,
    })
    const existingTestimonialAuthors = new Set(existingTestimonials.docs.map((item) => String(item.author_name)))

    const testimonials = [
      {
        author_name: 'Sophie K.',
        body: 'After three sessions my shoulder pain finally eased and I can train again.',
        rating: 5,
        sort_order: 1,
      },
      {
        author_name: 'Markus L.',
        body: 'Clear explanations, precise treatment, and a very calming atmosphere.',
        rating: 5,
        sort_order: 2,
      },
      {
        author_name: 'Julia W.',
        body: 'The posture plan changed my workday comfort in less than two weeks.',
        rating: 5,
        sort_order: 3,
      },
      {
        author_name: 'Thomas R.',
        body: 'Professional and friendly from booking to treatment follow-up.',
        rating: 4,
        sort_order: 4,
      },
      {
        author_name: 'Nina B.',
        body: 'I appreciated the practical exercises I could use at home immediately.',
        rating: 5,
        sort_order: 5,
      },
      {
        author_name: 'Daniel M.',
        body: 'Sports massage sessions helped me recover faster between races.',
        rating: 5,
        sort_order: 6,
      },
    ]

    for (const testimonial of testimonials) {
      if (existingTestimonialAuthors.has(testimonial.author_name)) {
        continue
      }

      await payload.create({
        collection: 'testimonials',
        overrideAccess: true,
        data: {
          ...testimonial,
          is_visible: true,
        },
      })
    }

    const existingSlots = await payload.find({
      collection: 'time-slots',
      limit: 500,
      overrideAccess: true,
    })
    const existingSlotKeys = new Set(
      existingSlots.docs.map((slot) => `${String(slot.date)}::${String(slot.starts_at)}`),
    )

    const slotTimes = ['09:00:00', '10:00:00', '11:00:00', '14:00:00', '15:00:00', '16:00:00']

    for (let i = 0; i < 30; i += 1) {
      const date = new Date()
      date.setDate(date.getDate() + i)

      const weekday = date.getDay()
      if (weekday === 0 || weekday === 6) {
        continue
      }

      const dateString = formatDate(date)

      for (const starts_at of slotTimes) {
        const slotKey = `${dateString}::${starts_at}`
        if (existingSlotKeys.has(slotKey)) {
          continue
        }

        const [hours, minutes] = starts_at.split(':')
        const endsAtDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          Number(hours),
          Number(minutes),
          0,
        )
        endsAtDate.setHours(endsAtDate.getHours() + 1)

        await payload.create({
          collection: 'time-slots',
          overrideAccess: true,
          data: {
            date: dateString,
            starts_at,
            ends_at: endsAtDate.toTimeString().slice(0, 8),
            is_available: true,
          },
        })
      }
    }

    console.log('Seed complete.')
  } finally {
    await payload.destroy()
  }
}

void main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
