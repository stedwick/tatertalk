import {
  signInLoadingAtom,
  signUpLoadingAtom,
  userLoadingAtom,
} from "../atoms/authAtoms"
import store from "../atoms/store"
import { supabase } from "./supabase"
import { themedToastError, themedToastSuccess } from "./themedToast"

export const signIn = async (email: string, password: string) => {
  store.set(signInLoadingAtom, true)
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      themedToastError(error.message)
    }
    return { error }
  } finally {
    store.set(signInLoadingAtom, false)
  }
}

export const signUp = async (email: string, password: string) => {
  store.set(signUpLoadingAtom, true)
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      themedToastError(error.message)
    } else {
      themedToastSuccess("Check your email for the confirmation link!")
    }
    return { error }
  } finally {
    store.set(signUpLoadingAtom, false)
  }
}

export const signOut = async () => {
  store.set(userLoadingAtom, true)
  try {
    await supabase.auth.signOut({
      scope: "local",
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      themedToastError(error.message)
    } else {
      themedToastError("Unknown error")
    }
    console.error("Error signing out:", error)
  } finally {
    store.set(userLoadingAtom, false)
  }
}
