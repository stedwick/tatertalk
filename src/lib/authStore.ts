import { create } from 'zustand'
import { produce } from 'immer'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  setUser: (user) => set(produce((state) => {
    state.user = user
  })),
  setSession: (session) => set(produce((state) => {
    state.session = session
  })),
  setLoading: (loading) => set(produce((state) => {
    state.loading = loading
  })),
  setError: (error) => set(produce((state) => {
    state.error = error
  })),
  clearError: () => set(produce((state) => {
    state.error = null
  })),
})) 