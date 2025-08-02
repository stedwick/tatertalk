import {
  sessionAtom,
  signInLoadingAtom,
  signUpLoadingAtom,
  userAtom,
  userLoadingAtom,
} from "../atoms/authAtoms"
import store from "../atoms/store"
import { supabase } from "./supabase"
import { themedToastError, themedToastSuccess } from "./themedToast"

export const signIn = async (email: string, password: string) => {
  store.set(signInLoadingAtom, true)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) {
    themedToastError(error.message)
  }
  store.set(signInLoadingAtom, false)
}

export const signUp = async (email: string, password: string) => {
  store.set(signUpLoadingAtom, true)
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) {
    themedToastError(error.message)
  } else {
    themedToastSuccess("Check your email for the confirmation link!")
  }
  store.set(signUpLoadingAtom, false)
}

export const signOut = async () => {
  store.set(userLoadingAtom, true)
  console.log("signing out")
  const { error } = await supabase.auth.signOut({
    scope: "local",
  })
  if (error) {
    localStorage.removeItem(`sb-${import.meta.env.VITE_SUPABASE_ID}-auth-token`)
    store.set(userAtom, null)
    store.set(sessionAtom, null)
  }
  store.set(userLoadingAtom, false)
}
