import type { GlobalConfig } from 'payload'

import { adminsOnly, publicRead } from '@/lib/access'
import { defaultBrandSettings } from '@/lib/default-brand'

export const BrandSettings: GlobalConfig = {
  slug: 'brand-settings',
  label: 'Brand settings',
  access: {
    read: publicRead,
    update: adminsOnly,
  },
  admin: {
    group: 'CMS',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: defaultBrandSettings.name,
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: defaultBrandSettings.tagline,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: defaultBrandSettings.description,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      defaultValue: defaultBrandSettings.email,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      defaultValue: defaultBrandSettings.phone,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      defaultValue: defaultBrandSettings.address,
    },
    {
      name: 'logo_url',
      label: 'Logo URL',
      type: 'text',
      required: true,
      defaultValue: defaultBrandSettings.logo_url,
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          defaultValue: defaultBrandSettings.socials.instagram,
        },
        {
          name: 'facebook',
          type: 'text',
          defaultValue: defaultBrandSettings.socials.facebook,
        },
      ],
    },
    {
      name: 'colors',
      type: 'group',
      fields: [
        {
          name: 'primary',
          type: 'text',
          defaultValue: defaultBrandSettings.colors.primary,
        },
        {
          name: 'secondary',
          type: 'text',
          defaultValue: defaultBrandSettings.colors.secondary,
        },
        {
          name: 'accent',
          type: 'text',
          defaultValue: defaultBrandSettings.colors.accent,
        },
      ],
    },
    {
      name: 'fonts',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: defaultBrandSettings.fonts.heading,
        },
        {
          name: 'body',
          type: 'text',
          defaultValue: defaultBrandSettings.fonts.body,
        },
      ],
    },
  ],
}

