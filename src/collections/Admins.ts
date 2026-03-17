import type { CollectionConfig } from 'payload'

import { adminsOnly } from '@/lib/access'

export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'is_admin'],
  },
  auth: true,
  access: {
    read: adminsOnly,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'is_admin',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
  ],
}

