import type { CollectionConfig, PayloadRequest } from 'payload'

import { adminsOnly } from '@/lib/access'

type ForceAdminUserArgs = {
  data?: Record<string, unknown>
  operation: 'create' | 'update'
  req: PayloadRequest
}

const forceAdminUser = async ({
  data,
  operation,
  req,
}: ForceAdminUserArgs) => {
  if (operation !== 'create' && operation !== 'update') {
    return data
  }

  return {
    ...(data ?? {}),
    is_admin: true,
  }
}

export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name'],
  },
  auth: true,
  access: {
    read: adminsOnly,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  hooks: {
    beforeValidate: [forceAdminUser],
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
      admin: {
        hidden: true,
        disableListColumn: true,
      },
    },
  ],
}
