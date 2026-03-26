import { Pool } from 'pg'

declare global {
  var freedomPool: Pool | undefined
}

const poolMax = Number(process.env.DATABASE_POOL_MAX || '2')

export const pool =
  globalThis.freedomPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number.isFinite(poolMax) && poolMax > 0 ? poolMax : 2,
    idleTimeoutMillis: 10_000,
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.freedomPool = pool
}
