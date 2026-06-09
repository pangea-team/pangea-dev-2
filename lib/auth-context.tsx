'use client'

import { createClient } from '@/lib/supabase/client'
import type { User } from '@/lib/types'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

const STORAGE_KEY_PROFILE = 'pangea_user_profile_v2'
const STORAGE_KEY_PROFILE_LEGACY = 'pangea_user_profile'

export function loadProfileFromStorage(): User | null {
  if (typeof window === 'undefined') return null

  let raw = localStorage.getItem(STORAGE_KEY_PROFILE)
  if (!raw) {
    const legacy = localStorage.getItem(STORAGE_KEY_PROFILE_LEGACY)
    if (legacy) {
      localStorage.removeItem(STORAGE_KEY_PROFILE_LEGACY)
      raw = legacy
    }
  }

  if (!raw) return null
  try {
    const p = JSON.parse(raw)
    // 구 포맷(displayName/username) → nickname 마이그레이션
    if (!p?.nickname && (p?.displayName || p?.username)) {
      p.nickname = p.displayName ?? p.username
    }
    if (!p?.nickname) {
      localStorage.removeItem(STORAGE_KEY_PROFILE)
      return null
    }
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(p))
    return { ...p, createdAt: new Date(p.createdAt) } as User
  } catch {
    localStorage.removeItem(STORAGE_KEY_PROFILE)
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
  completeProfile: (nickname: string, bio: string) => Promise<void>
}

export function isProfileComplete(profile: User | null | undefined): boolean {
  return Boolean(profile?.nickname?.trim() && profile?.bio?.trim())
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const sessionUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const hydrate = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        sessionUserIdRef.current = session.user.id
        setIsLoggedIn(true)

        const cached = loadProfileFromStorage()
        if (cached) {
          setUser(cached)
        } else {
          const { data: row } = await supabase
            .from('profiles')
            .select('id, nickname, avatar_url, bio, created_at')
            .eq('id', session.user.id)
            .single()
          if (row?.nickname) {
            const profile: User = {
              id: row.id,
              nickname: row.nickname,
              avatarUrl: row.avatar_url ?? undefined,
              bio: row.bio ?? undefined,
              createdAt: new Date(row.created_at),
            }
            localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile))
            setUser(profile)
          }
        }
      }

      setIsHydrated(true)
    }

    hydrate()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // INITIAL_SESSION은 hydrate()에서 처리하므로 건너뜀
      if (event === 'INITIAL_SESSION') return

      if (!session) {
        sessionUserIdRef.current = null
        setIsLoggedIn(false)
        setUser(null)
        localStorage.removeItem(STORAGE_KEY_PROFILE)
      } else {
        sessionUserIdRef.current = session.user.id
        setIsLoggedIn(true)
      }
    })

    return () => subscription.unsubscribe()
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
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    sessionUserIdRef.current = null
    localStorage.removeItem(STORAGE_KEY_PROFILE)
    localStorage.removeItem(STORAGE_KEY_PROFILE_LEGACY)
    setIsLoggedIn(false)
    setUser(null)
  }, [])

  const completeProfile = useCallback(
    async (nickname: string, bio: string) => {
      const userId = sessionUserIdRef.current ?? user?.id
      if (!userId) throw new Error('로그인 세션이 없습니다.')

      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ nickname: nickname.trim(), bio: bio.trim() })
        .eq('id', userId)
      if (error) throw new Error(error.message)

      const profile: User = {
        id: userId,
        nickname: nickname.trim(),
        bio: bio.trim(),
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
