import {
  twoFactorClient,
  customSessionClient,
  usernameClient,
  genericOAuthClient,
  oidcClient,
  adminClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    twoFactorClient(),
    adminClient(),
    usernameClient(),
    organizationClient(),
    customSessionClient(),
    genericOAuthClient(),
    oidcClient(),
  ],
});

export const { useSession } = authClient;
