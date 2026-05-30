import { PATH } from '@/constants/path'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, getSessionClaims } from './auth'

/**
 * Redirects to `/login` if no JWT claims are present.
 * Returns the verified claims object for the caller.
 */
export async function requireSession(redirectTo = PATH.LOGIN) {
  const claims = await getSessionClaims()
  if (!claims) {
    redirect(redirectTo)
  }
  return claims
}

/**
 * Redirects to `/login` unless the request has a verified user (via Auth server).
 * Use this on security-critical routes.
 */
export async function requireUser(redirectTo = PATH.LOGIN) {
  const user = await getAuthenticatedUser()
  if (!user) {
    redirect(redirectTo)
  }
  return user
}
