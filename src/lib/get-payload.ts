import { getPayload } from 'payload'

import configPromise from '@/payload.config'

let cachedPayload: Awaited<ReturnType<typeof getPayload>> | null = null

export async function getPayloadClient() {
  if (!cachedPayload) {
    const config = await configPromise
    cachedPayload = await getPayload({ config })
  }

  return cachedPayload
}

