import type { CollectionConfig } from 'payload'

import { adminsOnly, publicRead } from '@/lib/access'
import { createdAtField, updatedAtField, uuidField, withTimestamps } from '@/lib/collection-helpers'

export const Services: CollectionConfig = {
  slug: 'services',
  dbName: 'services',
  timestamps: false,
  admin: {
    group: 'Clinic',
    useAsTitle: 'name',
    defaultColumns: ['name', 'duration_minutes', 'price', 'is_active', 'sort_order'],
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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        rows: 4,
      },
    },
    {
      name: 'duration_minutes',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        step: 1,
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    {
      name: 'sort_order',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        step: 1,
      },
    },
    createdAtField,
    updatedAtField,
  ],
}
