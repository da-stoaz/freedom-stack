import type { CollectionConfig } from 'payload'

import { adminsOnly, publicRead } from '@/lib/access'
import {
  createdAtField,
  updatedAtField,
  uuidField,
  validateDateString,
  validateTimeString,
  withTimestamps,
} from '@/lib/collection-helpers'

export const TimeSlots: CollectionConfig = {
  slug: 'time-slots',
  dbName: 'time_slots',
  timestamps: false,
  admin: {
    group: 'Clinic',
    useAsTitle: 'date',
    defaultColumns: ['date', 'starts_at', 'ends_at', 'is_available'],
  },
  access: {
    read: publicRead,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  hooks: {
    beforeChange: [withTimestamps],
  },
  fields: [
    uuidField,
    {
      name: 'date',
      label: 'Date',
      type: 'text',
      required: true,
      validate: validateDateString,
      admin: {
        description: 'Use YYYY-MM-DD.',
      },
    },
    {
      name: 'starts_at',
      label: 'Start time',
      type: 'text',
      required: true,
      validate: validateTimeString,
      admin: {
        description: 'Use HH:MM:SS.',
      },
    },
    {
      name: 'ends_at',
      label: 'End time',
      type: 'text',
      required: true,
      validate: validateTimeString,
      admin: {
        description: 'Use HH:MM:SS.',
      },
    },
    {
      name: 'is_available',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    createdAtField,
    updatedAtField,
  ],
}
