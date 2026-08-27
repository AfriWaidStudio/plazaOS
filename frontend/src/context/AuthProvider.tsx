import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { api, clearToken, getToken, setToken } from '../lib/api'
import { AuthContext, type AuthContextValue, type AuthUser, type Role } from './AuthContext'

interface LoginResponse {
  token: string
  user: AuthUser
}

const USER_KEY = 'plaza_os_user'

const MOCK_USERS: Record<Role, AuthUser> = {
  admin: { id: 'dev-admin', name: 'Dev Admin', email: 'admin@plaza.test', role: 'admin' },
  tenant: { id: 'dev-tenant', name: 'Dev Tenant', email: 'tenant@plaza.test', role: 'tenant', mustChangePassword: true },
}

export { AuthContext }

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}



export function AuthProvider({ children }: { children?: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', { email, password })
      setToken(response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
      setTokenState(response.token)
      setUser(response.user)
      return response.user
    } catch (err: unknown) {
      throw err
    }
  }, [])

  const loginAsMock = useCallback((role: Role) => {
    const mockUser = MOCK_USERS[role]
    const mockToken = `dev-mock-token-${role}`
    setToken(mockToken)
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser))
    setTokenState(mockToken)
    setUser(mockUser)
    return mockUser
  }, [])

  const completePasswordSetup = useCallback((updatedUser?: AuthUser) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser
      const nextUser = { ...currentUser, ...updatedUser, mustChangePassword: false }
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      return nextUser
    })
  }, [])

  const logout = useCallback(() => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    setTokenState(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      role: user?.role ?? null,
      isAuthenticated: Boolean(token && user),
      login,
      loginAsMock,
      completePasswordSetup,
      logout,
    }),
    [user, token, login, loginAsMock, completePasswordSetup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
