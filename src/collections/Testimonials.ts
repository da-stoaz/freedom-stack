import type { CollectionConfig } from 'payload'

import { adminsOnly, publicRead } from '@/lib/access'
import { createdAtField, updatedAtField, uuidField, withTimestamps } from '@/lib/collection-helpers'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  dbName: 'testimonials',
  timestamps: false,
  admin: {
    group: 'Clinic',
    useAsTitle: 'author_name',
    defaultColumns: ['author_name', 'rating', 'is_visible', 'sort_order'],
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
      name: 'author_name',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: {
        rows: 4,
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        step: 1,
      },
    },
    {
      name: 'is_visible',
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
