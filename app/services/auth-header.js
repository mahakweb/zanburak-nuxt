import { getAuthTokenSync } from '@/utils/authToken'

export default function authHeader() {
  const token = getAuthTokenSync()
  return token ? { Authorization: `Bearer ${token}` } : {}
}