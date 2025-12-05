import { prismaMain } from "../../prisma/prisma";
import axios from "axios";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  customSession,
  genericOAuth,
  oidcProvider,
  openAPI,
  twoFactor,
  username,
  organization,
} from "better-auth/plugins";
import { decodeJwt } from "jose";
import { getRBAC } from "../utils/getRBAC";

export const auth = betterAuth({
  database: prismaAdapter(prismaMain, {
    provider: "postgresql",
  }),
  rateLimit: {
    window: 10,
    max: 100,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 2,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      try {
        await axios.post(
          `${
            (process.env.NODE_ENV === "development" &&
              process.env.DEV_APP_URL) ||
            (process.env.NODE_ENV === "production" && process.env.PROD_APP_URL)
          }/api/send-email`,
          {
            to: user.email,
            subject: "Reset your password",
            text: `Click the link to reset your password: ${url}`,
          }
        );
      } catch (error: any) {
        throw new error(error);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await axios.post(
          `${
            (process.env.NODE_ENV === "development" &&
              process.env.DEV_APP_URL) ||
            (process.env.NODE_ENV === "production" && process.env.PROD_APP_URL)
          }/api/send-email`,
          {
            to: user.email,
            subject: "Verify your email address",
            text: `Click the link to verify your email: ${url}`,
          }
        );
      } catch (error: any) {
        throw new error(error);
      }
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url }) => {
        try {
          await axios.post(
            `${
              (process.env.NODE_ENV === "development" &&
                process.env.DEV_APP_URL) ||
              (process.env.NODE_ENV === "production" &&
                process.env.PROD_APP_URL)
            }/api/send-email`,
            {
              to: user.email,
              subject: "Approve email change",
              text: `Click the link to approve the change: ${url}`,
            }
          );
        } catch (error: any) {
          throw new error(error);
        }
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        try {
          await axios.post(
            `${
              (process.env.NODE_ENV === "development" &&
                process.env.DEV_APP_URL) ||
              (process.env.NODE_ENV === "production" &&
                process.env.PROD_APP_URL)
            }/api/send-email`,
            {
              to: user.email,
              subject: "Confirm your account delection",
              text: `Click the link to approve your account delection: ${url}`,
            }
          );
        } catch (error: any) {
          throw new error(error);
        }
      },
    },
    additionalFields: {
      keycloakUserid: {
        type: "string",
        required: false,
      },
      currentOrgId: {
        type: "string",
        required: false,
      },
    },
  },

  appName: "Bezs",

  plugins: [
    openAPI(),
    // keycloakProvider({
    //   appUrl:
    //     process.env.NODE_ENV === "production"
    //       ? process.env.PROD_APP_URL!
    //       : process.env.DEV_APP_URL!,
    //   baseUrl: process.env.KEYCLOAK_BASE_URL!,
    //   clientId: process.env.KEYCLOAK_CLIENT_ID!,
    //   clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
    //   realm: process.env.KEYCLOAK_REALM!,
    //   emailUser: process.env.SMTP_EMAIL!,
    //   emailPass: process.env.SMTP_PASS!,
    // }),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          try {
            await axios.post(
              `${
                (process.env.NODE_ENV === "development" &&
                  process.env.DEV_APP_URL) ||
                (process.env.NODE_ENV === "production" &&
                  process.env.PROD_APP_URL)
              }/api/send-email`,
              {
                to: user.email,
                subject: "2 FA OTP",
                text: `Your 2 FA OTP: ${otp}`,
              }
            );
          } catch (error: any) {
            throw new error(error);
          }
        },
      },
      skipVerificationOnEnable: true,
    }),
    admin({
      defaultRole: "guest",
      adminRoles: ["admin"],
    }),
    organization({
      allowUserToCreateOrganization: async (user) => {
        const adminUser = await prismaMain.user.findFirst({
          where: {
            id: user.id,
          },
          select: {
            role: true,
          },
        });

        return adminUser?.role === "admin";
      },
    }),
    customSession(async ({ session, user }) => {
      const userId = user.id;
      const providers = await prismaMain.account.findFirst({
        where: { userId, providerId: "keycloak" },
        select: {
          providerId: true,
          accountId: true,
          accessToken: true,
          refreshToken: true,
        },
      });

      const userData = await prismaMain.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          username: true,
          currentOrgId: true,
          keycloakUserid: true,
        },
      });

      let userPreferences;

      userPreferences = await prismaMain.userPreference.findUnique({
        where: {
          userId,
        },
      });

      if (!userPreferences) {
        const preferenceTemplate =
          await prismaMain.preferenceTemplate.findFirst({
            where: {
              scope: "GLOBAL",
            },
            omit: {
              id: true,
              scope: true,
              createdAt: true,
              updatedAt: true,
            },
          });

        if (preferenceTemplate) {
          userPreferences = await prismaMain.userPreference.create({
            data: {
              userId,
              ...preferenceTemplate,
            },
          });
        } else {
          userPreferences = await prismaMain.userPreference.create({
            data: {
              userId,
            },
          });
        }
      }

      /*
      const userDetails = await prismaMain.user.findUnique({
        where: { id: userId },
        select: {
          role: true,
          username: true,
        },
      });

      let keycloakSession: unknown = null;

      if (
        providers?.accessToken &&
        providers?.refreshToken &&
        providers.providerId === "keycloak"
      ) {
        const claims: any = decodeJwt(providers?.accessToken);

        keycloakSession = {
          id: claims?.sub,
          name: claims?.name,
          email: claims?.email,
          username: claims?.preferred_username,
          emailVerified: claims.email_verified,
          roles: {
            realmAccess: claims?.realm_access?.roles ?? [],
            resourceAccess: claims?.resource_access?.account?.roles ?? [],
          },
        };
      }
        */

      const { roles, organizations, userRBAC } = await getRBAC(user.id);

      const updatedUser = userData;
      if (
        userData &&
        !userData?.currentOrgId &&
        organizations &&
        organizations.length > 0
      ) {
        const updatedUserData = await prismaMain.user.update({
          where: {
            id: user.id,
          },
          data: {
            currentOrgId: organizations[0].id,
          },
        });

        updatedUser!.currentOrgId = updatedUserData!.currentOrgId;
      }

      return {
        session,
        // user: {
        //   role: userDetails?.role,
        //   username: userDetails?.username,
        //   accountDetails: {
        //     providerId: providers?.providerId,
        //     accountId: providers?.accountId,
        //   },
        //   ...user,
        //   keycloakSession,
        // },
        user: {
          ...user,
          ...updatedUser,
        },
        keycloak: {
          refreshToken: providers?.refreshToken ?? null,
          accessToken: providers?.accessToken ?? null,
        },
        userPreferences,
        roles,
        userRBAC,
        organizations,
      };
    }),
    username(),
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: process.env.KEYCLOAK_CLIENT_ID!,
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
          discoveryUrl: `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/.well-known/openid-configuration`,
          scopes: ["openid", "email", "profile", "roles"],
          pkce: true,
          async getUserInfo(tokens): Promise<any> {
            console.log("----------- getUserInfo executing ----------");
            let keycloakSession = null;
            if (tokens?.accessToken) {
              const claims: any = decodeJwt(tokens.accessToken);
              keycloakSession = {
                id: claims?.sub,
                name: claims?.name,
                email: claims?.email,
                username: claims?.preferred_username,
                emailVerified: claims.email_verified,
                roles: {
                  realmAccess: claims?.realm_access?.roles ?? [],
                  resourceAccess: claims?.resource_access?.account?.roles ?? [],
                },
              };
            }

            if (keycloakSession) {
              return {
                id: keycloakSession.id,
                email: keycloakSession.email,
                name: keycloakSession.name,
                emailVerified: keycloakSession.emailVerified,
                username: keycloakSession.username,
                keycloakUserid: keycloakSession.id,
              };
            }

            return null;
          },
          mapProfileToUser(profile) {
            console.log("----------- mapProfileToUser executing ----------");
            return {
              id: profile?.id ?? profile?.keycloakUserid ?? undefined,
              email: profile?.email ?? undefined,
              name: profile?.name ?? undefined,
              emailVerified:
                typeof profile?.emailVerified === "boolean"
                  ? profile.emailVerified
                  : undefined,
              image: profile?.image ?? undefined,
              username: profile?.username ?? undefined,
              keycloakUserid:
                profile?.id ?? profile?.keycloakUserid ?? undefined,
            };
          },
        },
      ],
    }),
    oidcProvider({
      loginPage: "/signin",
      allowDynamicClientRegistration: true,
      trustedClients: [],
    }),
    nextCookies(),
  ],
});
