import { redirect } from "next/navigation";
import { auth } from "./betterauth/auth";

export async function checkAuthProvider() {
  const mode =
    (process.env.AUTH_MODE as "better-auth" | "keycloak") || "better-auth";

  if (mode === "keycloak") {
    const data = await auth.api.signInWithOAuth2({
      body: {
        providerId: "keycloak",
        callbackURL: "http://localhost:3000/bezs",
      },
    });

    redirect(data.url);
  }
}
