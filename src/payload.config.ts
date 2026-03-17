import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

import { Admins } from './collections/Admins'
import { Bookings } from './collections/Bookings'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { TimeSlots } from './collections/TimeSlots'
import { BrandSettings } from './globals/BrandSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Admins, Media, Services, TimeSlots, Testimonials, Bookings],
  editor: lexicalEditor(),
  globals: [BrandSettings],
  secret: process.env.PAYLOAD_SECRET || 'payload-local-dev-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
})
