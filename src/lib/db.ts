import { Pool } from 'pg'

declare global {
  var freedomPool: Pool | undefined
}

export const pool =
  globalThis.freedomPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.freedomPool = pool
}
