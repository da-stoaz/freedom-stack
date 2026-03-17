type RelationValue =
  | string
  | {
      id?: string
    }
  | null
  | undefined

const extractRelationID = (value: RelationValue) => {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    return value
  }

  return value.id ?? null
}

export const syncBookingSlot = async ({
  doc,
  previousDoc,
  req,
}: {
  doc: {
    status?: string
    time_slot_id?: RelationValue
  }
  previousDoc?: {
    status?: string
    time_slot_id?: RelationValue
  }
  req: {
    payload: {
      update: (args: {
        collection: string
        id: string
        data: Record<string, unknown>
        depth?: number
        overrideAccess?: boolean
      }) => Promise<unknown>
    }
  }
}) => {
  const nextStatus = doc.status
  const previousStatus = previousDoc?.status
  const nextSlotID = extractRelationID(doc.time_slot_id)
  const previousSlotID = extractRelationID(previousDoc?.time_slot_id)

  if (previousSlotID && previousSlotID !== nextSlotID) {
    await req.payload.update({
      collection: 'time-slots',
      id: previousSlotID,
      data: {
        is_available: true,
      },
      depth: 0,
      overrideAccess: true,
    })
  }

  if (!nextSlotID) {
    return doc
  }

  if (nextStatus === 'cancelled' && previousStatus !== 'cancelled') {
    await req.payload.update({
      collection: 'time-slots',
      id: nextSlotID,
      data: {
        is_available: true,
      },
      depth: 0,
      overrideAccess: true,
    })
  }

  if (nextStatus !== 'cancelled' && previousStatus === 'cancelled') {
    await req.payload.update({
      collection: 'time-slots',
      id: nextSlotID,
      data: {
        is_available: false,
      },
      depth: 0,
      overrideAccess: true,
    })
  }

  return doc
}

