import type {
  CredentialResponse,
  GsiButtonConfiguration,
  IdConfiguration,
} from "google-one-tap"
import { useAtomValue } from "jotai"
import { useEffect, useRef } from "react"
import { themeAtom } from "../../atoms/themeAtom"
import { supabase } from "../../lib/supabase"

// Extend the Window interface to include handleSignInWithGoogle and google
declare global {
  interface Window {
    handleSignInWithGoogle: (response: CredentialResponse) => Promise<void>
    google?: google.accounts
  }
}

async function handleSignInWithGoogle(response: CredentialResponse) {
  const { data: _data, error: _error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.credential,
  })
}

window.handleSignInWithGoogle = handleSignInWithGoogle

export function GoogleLogin() {
  const theme = useAtomValue(themeAtom)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google?.accounts?.id && buttonRef.current) {
        // Initialize Google Sign-In
        const config: IdConfiguration = {
          client_id:
            "90483529824-63c8lpst16tt136qm6j20gbk7f69mv4m.apps.googleusercontent.com",
          callback: handleSignInWithGoogle,
          auto_select: true,
          itp_support: true,
          use_fedcm_for_prompt: true,
        }
        window.google.accounts.id.initialize(config)

        // Render the button
        const buttonConfig: GsiButtonConfiguration = {
          type: "standard",
          shape: "rectangular",
          theme: theme === "dark" ? "filled_black" : "outline",
          text: "signin_with",
          size: "large",
          logo_alignment: "left",
        }
        window.google.accounts.id.renderButton(buttonRef.current, buttonConfig)
      }
    }

    // Check if Google library is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogleSignIn()
    } else {
      // Wait for the Google library to load
      const checkGoogleLoaded = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkGoogleLoaded)
          initializeGoogleSignIn()
        }
      }, 100)

      // Cleanup interval on unmount
      return () => clearInterval(checkGoogleLoaded)
    }
  }, [theme])

  return <div ref={buttonRef} className="w-full" />
}
