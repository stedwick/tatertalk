import { useEffect, useRef } from "react"
import { supabase } from "../../lib/supabase"
import { themeAtom } from "../../atoms/themeAtom"
import { useAtomValue } from "jotai"

// Define Google Sign-In types
interface GoogleSignInConfig {
  client_id: string
  callback: (response: { credential: string }) => Promise<void>
  auto_select?: boolean
  itp_support?: boolean
  use_fedcm_for_prompt?: boolean
}

interface GoogleButtonConfig {
  type?: string
  shape?: string
  theme?: string
  text?: string
  size?: string
  logo_alignment?: string
}

// Extend the Window interface to include handleSignInWithGoogle and google
declare global {
  interface Window {
    handleSignInWithGoogle: (response: { credential: string }) => Promise<void>
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleSignInConfig) => void
          renderButton: (
            element: HTMLElement,
            config: GoogleButtonConfig,
          ) => void
          prompt: () => void
        }
      }
    }
  }
}

async function handleSignInWithGoogle(response: { credential: string }) {
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
        window.google.accounts.id.initialize({
          client_id:
            "90483529824-63c8lpst16tt136qm6j20gbk7f69mv4m.apps.googleusercontent.com",
          callback: handleSignInWithGoogle,
          auto_select: true,
          itp_support: true,
          use_fedcm_for_prompt: true,
        })

        // Render the button
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          shape: "rectangular",
          theme: theme === "dark" ? "filled_black" : "filled_white",
          text: "signin_with",
          size: "large",
          logo_alignment: "left",
        })
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
