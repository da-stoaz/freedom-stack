import type { CollectionConfig } from 'payload'

import { adminsOnly } from '@/lib/access'
import { createdAtField, updatedAtField, uuidField, withTimestamps } from '@/lib/collection-helpers'
import { syncBookingSlot } from '@/hooks/sync-booking-slot'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  dbName: 'bookings',
  timestamps: false,
  defaultSort: '-created_at',
  admin: {
    group: 'Clinic',
    useAsTitle: 'patient_name',
    description: 'Review incoming requests, confirm or cancel them from the list, or open the full booking details.',
    defaultColumns: ['patient_name', 'status', 'patient_email', 'service_id', 'time_slot_id', 'created_at'],
    components: {
      beforeList: ['@/components/admin/BookingQueueNotice#BookingQueueNotice'],
    },
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
      admin: {
        components: {
          Cell: '@/components/admin/BookingPatientCell#BookingPatientCell',
        },
      },
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
      label: 'Booking status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
        description:
          'Every new booking starts as Needs confirmation. Switch this to Confirmed or Cancelled after reviewing it.',
        components: {
          Cell: '@/components/admin/BookingQuickActionsCell#BookingQuickActionsCell',
        },
      },
      options: [
        {
          label: 'Needs confirmation',
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
