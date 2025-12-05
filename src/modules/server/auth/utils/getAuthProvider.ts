import bezsConfig from "../../../../../bezs.json";

export function getAuthProvider() {
  const mode =
    (bezsConfig?.authProvider as "betterauth" | "keycloak") || "betterauth";

  const isKeycloak = mode === "keycloak";

  return {
    provider: mode,
    isKeycloak,
  };
}
