import type { CollectionConfig } from 'payload'

import { adminsOnly, publicRead } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'CMS',
  },
  access: {
    read: publicRead,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}

