import { randomUUID } from 'node:crypto'

import type { Field } from 'payload'

export const datePattern = /^\d{4}-\d{2}-\d{2}$/
export const timePattern = /^\d{2}:\d{2}(:\d{2})?$/

export const uuidField: Field = {
  name: 'id',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    readOnly: true,
  },
  hooks: {
    beforeValidate: [
      ({ value }) => {
        if (typeof value === 'string' && value.length > 0) {
          return value
        }

        return randomUUID()
      },
    ],
  },
}

export const createdAtField: Field = {
  name: 'created_at',
  type: 'date',
  admin: {
    position: 'sidebar',
    readOnly: true,
  },
}

export const updatedAtField: Field = {
  name: 'updated_at',
  type: 'date',
  admin: {
    position: 'sidebar',
    readOnly: true,
  },
}

export const withTimestamps = ({
  data,
  operation,
  originalDoc,
}: {
  data?: Record<string, unknown>
  operation: string
  originalDoc?: Record<string, unknown>
}) => {
  const now = new Date().toISOString()

  return {
    ...data,
    created_at:
      operation === 'create'
        ? data?.created_at ?? now
        : data?.created_at ?? originalDoc?.created_at ?? now,
    updated_at: now,
  }
}

export const validateDateString = (value: string | null | undefined) => {
  if (!value || datePattern.test(value)) {
    return true
  }

  return 'Use YYYY-MM-DD.'
}

export const validateTimeString = (value: string | null | undefined) => {
  if (!value || timePattern.test(value)) {
    return true
  }

  return 'Use HH:MM or HH:MM:SS.'
}
