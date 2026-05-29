'use client'

import type { User } from '@/lib/types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY_LOGGED_IN = 'pangea_auth_logged_in'
const STORAGE_KEY_PROFILE = 'pangea_user_profile'

function generateUsername(displayName: string): string {
  const base = displayName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_가-힣]/g, '')
  const suffix = Math.random().toString(36).slice(2, 6)
  return base ? `${base}_${suffix}` : `reader_${suffix}`
}

export function loadProfileFromStorage(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE)
    if (!raw) return null
    const parsed = JSON.parse(raw) as User
    return { ...parsed, createdAt: new Date(parsed.createdAt) }
  } catch {
    return null
  }
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  hasCompletedProfile: boolean
  isHydrated: boolean
  login: () => void
  logout: () => void
  completeProfile: (displayName: string, bio: string) => void
}

export function isProfileComplete(profile: User | null | undefined): boolean {
  return Boolean(profile?.displayName?.trim() && profile?.bio?.trim())
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem(STORAGE_KEY_LOGGED_IN) === 'true'
    const profile = loadProfileFromStorage()
    setIsLoggedIn(loggedIn)
    setUser(profile)
    setIsHydrated(true)
  }, [])

  const persistProfile = useCallback((profile: User | null) => {
    if (profile) {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile))
    } else {
      localStorage.removeItem(STORAGE_KEY_PROFILE)
    }
    setUser(profile)
  }, [])

  const login = useCallback(() => {
    localStorage.setItem(STORAGE_KEY_LOGGED_IN, 'true')
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_LOGGED_IN)
    localStorage.removeItem(STORAGE_KEY_PROFILE)
    setIsLoggedIn(false)
    setUser(null)
  }, [])

  const completeProfile = useCallback(
    (displayName: string, bio: string) => {
      const trimmedName = displayName.trim()
      const trimmedBio = bio.trim()
      const profile: User = {
        id: user?.id ?? `user-${Date.now()}`,
        displayName: trimmedName,
        bio: trimmedBio,
        username: user?.username ?? generateUsername(trimmedName),
        avatarUrl: user?.avatarUrl,
        createdAt: user?.createdAt ?? new Date(),
      }
      persistProfile(profile)
    },
    [user, persistProfile],
  )

  const hasCompletedProfile = isProfileComplete(user)

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        hasCompletedProfile,
        isHydrated,
        login,
        logout,
        completeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
