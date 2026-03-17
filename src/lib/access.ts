import type { Access } from 'payload'

type AdminUser = {
  is_admin?: boolean
} | null

const getUser = (user: unknown): AdminUser => {
  if (!user || typeof user !== 'object') {
    return null
  }

  return user as AdminUser
}

export const adminsOnly: Access = ({ req }) => {
  const user = getUser(req.user)
  return Boolean(user?.is_admin)
}

export const publicRead: Access = () => true

