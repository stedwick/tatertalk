import type { Session, User } from "@supabase/supabase-js"
import { atom } from "jotai"

// User and session atoms
export const userAtom = atom<User | null>(null)
export const sessionAtom = atom<Session | null>(null)

// Loading states
export const userLoadingAtom = atom<boolean>(true)
export const signInLoadingAtom = atom<boolean>(false)
export const signUpLoadingAtom = atom<boolean>(false)
