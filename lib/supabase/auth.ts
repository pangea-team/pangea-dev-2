import { createClient } from './server'

/**
 * Fast session check using JWT claims.
 * Use this for non-security-critical pages where claim freshness is enough.
 */
export async function getSessionClaims() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    return null
  }

  return data.claims
}

/**
 * Returns the authenticated user verified by the Supabase Auth server.
 * Use this for security-critical pages.
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return null
  }

  return data.user
}
