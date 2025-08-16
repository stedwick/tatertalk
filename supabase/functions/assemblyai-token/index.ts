// @deno-types="npm:@types/node"

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "npm:@supabase/supabase-js@2"
import { AssemblyAI } from "npm:assemblyai@4"

console.log('Function "assemblyai-token" up and running!')

const corsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// Function to get appropriate CORS origin
// ex: curl -i --request OPTIONS 'https://jgulmfdsurvjqzzxeent.supabase.co/functions/v1/assemblyai-token' -H "Origin: https://azure--tatertalk.netlify.app"
function getCorsOrigin(request: Request): string {
  const prodHost = "https://tatertalk.app"

  const origin = request.headers.get("Origin")
  if (!origin) return prodHost

  // Allow production domain
  if (origin === prodHost) return origin

  // Allow Netlify preview URLs (pattern: https://xxx--tatertalk.netlify.app)
  if (origin.match(/^https:\/\/[a-zA-Z0-9-]+--tatertalk\.netlify\.app$/))
    return origin

  // v2: Allow Netlify preview URLs (pattern: https://xxx--tatertalk.netlify.app)
  if (origin.match(/^https:\/\/[a-zA-Z0-9-]+--tatertalkv2\.netlify\.app$/))
    return origin

  // Allow localhost for development
  if (origin.match(/^https?:\/\/localhost(:\d+)?$/)) return origin

  return prodHost
}

// ex: curl -L -X POST 'https://jgulmfdsurvjqzzxeent.supabase.co/functions/v1/assemblyai-token' \
// -H 'Authorization: Bearer long__JWT__' \
// --data '{"apiKey":"assemblyai_api_key"}'
Deno.serve(async (req: Request) => {
  // Get dynamic CORS headers based on request origin
  const dynamicCorsHeaders = {
    ...corsHeaders,
    "Access-Control-Allow-Origin": getCorsOrigin(req),
  }

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: dynamicCorsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    // Get the authorization key from request headers
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      throw new Error("Missing Authorization header")
    }

    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: authHeader },
        },
      },
    )

    // Get the user from the Authorization header
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      const message = userError?.message ?? "Unauthorized"
      throw new Error(message)
    }

    // Ensure this is not an anonymous user
    const isAnonymous =
      user.is_anonymous === true ||
      (user.identities ?? []).some((id) => id.provider === "anonymous")

    if (isAnonymous) {
      throw new Error("Anonymous users not allowed")
    }

    // Parse request body
    const { apiKey, expires_in = 480 } = await req.json()

    if (!apiKey) {
      throw new Error("Missing AssemblyAI API key in request body")
    }

    // Generate temporary AssemblyAI token
    const client = new AssemblyAI({ apiKey })
    const token = await client.realtime.createTemporaryToken({
      expires_in,
    })

    return new Response(JSON.stringify({ token }), {
      headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...dynamicCorsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
