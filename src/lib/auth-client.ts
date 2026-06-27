import { apiKeyClient } from "@better-auth/api-key/client"
import { passkeyClient } from "@better-auth/passkey/client"
import { magicLinkClient, multiSessionClient, organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    organizationClient(),
    multiSessionClient(),
    magicLinkClient(),
    passkeyClient(),
    apiKeyClient(),
  ],
})

export type Session = typeof authClient.$Infer.Session
