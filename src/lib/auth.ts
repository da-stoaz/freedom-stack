import { headers } from 'next/headers'

import { getPayloadClient } from './get-payload'

export async function getCurrentAdminUser() {
  const payload = await getPayloadClient()
  const requestHeaders = await headers()
  const result = await payload.auth({
    headers: requestHeaders,
  })

  if (!result.user || typeof result.user !== 'object') {
    return null
  }

  return result.user
}
