import type { CollectionConfig } from 'payload'

import { adminsOnly } from '@/lib/access'
import { createdAtField, updatedAtField, uuidField, withTimestamps } from '@/lib/collection-helpers'
import { syncBookingSlot } from '@/hooks/sync-booking-slot'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  dbName: 'bookings',
  timestamps: false,
  admin: {
    group: 'Clinic',
    useAsTitle: 'patient_name',
    defaultColumns: ['patient_name', 'service_id', 'time_slot_id', 'status', 'created_at'],
  },
  access: {
    read: adminsOnly,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  hooks: {
    beforeChange: [withTimestamps],
    afterChange: [syncBookingSlot],
  },
  fields: [
    uuidField,
    {
      name: 'service_id',
      label: 'Service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      hasMany: false,
    },
    {
      name: 'time_slot_id',
      label: 'Time slot',
      type: 'relationship',
      relationTo: 'time-slots',
      required: true,
      hasMany: false,
      unique: true,
    },
    {
      name: 'patient_name',
      type: 'text',
      required: true,
    },
    {
      name: 'patient_email',
      type: 'email',
      required: true,
    },
    {
      name: 'patient_phone',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        rows: 5,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
    },
    {
      name: 'confirmation_token',
      type: 'text',
      required: true,
      unique: true,
    },
    createdAtField,
    updatedAtField,
  ],
}
