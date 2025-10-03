import { prismaMain } from "@/lib/prisma";
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

export const auth = betterAuth({
  database: prismaAdapter(prismaMain, {
    provider: "postgresql",
  }),
  rateLimit: {
    window: 10,
    max: 100,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        await axios.post(`${process.env.APP_URL}/api/send-email`, {
          to: user.email,
          subject: "Reset your password",
          text: `Click the link to reset your password: ${url}`,
        });
      } catch (error: any) {
        throw new error(error);
      }
    },
  },
  trustedOrigins: ["http://localhost:5000"],
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
    sendOnSignUp: false,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        await axios.post(`${process.env.APP_URL}/api/send-email`, {
          to: user.email,
          subject: "Verify your email address",
          text: `Click the link to verify your email: ${url}`,
        });
      } catch (error: any) {
        throw new error(error);
      }
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request
      ) => {
        try {
          await axios.post(`${process.env.APP_URL}/api/send-email`, {
            to: user.email,
            subject: "Approve email change",
            text: `Click the link to approve the change: ${url}`,
          });
        } catch (error: any) {
          throw new error(error);
        }
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url, token }, request) => {
        try {
          await axios.post(`${process.env.APP_URL}/api/send-email`, {
            to: user.email,
            subject: "Confirm your account delection",
            text: `Click the link to approve your account delection: ${url}`,
          });
        } catch (error: any) {
          throw new error(error);
        }
      },
    },
  },

  appName: "Bezs",

  plugins: [
    openAPI(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }, request) {
          try {
            await axios.post(`${process.env.APP_URL}/api/send-email`, {
              to: user.email,
              subject: "2 FA OTP",
              text: `Your 2 FA OTP: ${otp}`,
            });
          } catch (error: any) {
            throw new error(error);
          }
        },
      },
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
      const providers = await prismaMain.account.findMany({
        where: { userId },
        select: { providerId: true, accountId: true },
      });
      const role = await prismaMain.user.findUnique({
        where: { id: userId },
        select: {
          role: true,
        },
      });

      return {
        session,
        user: {
          role: role?.role,
          accountDetails: providers,
          ...user,
        },
      };
    }),
    username(),
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: process.env.KEYCLOAK_CLIENT_ID!,
          discoveryUrl: `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/.well-known/openid-configuration`,
          scopes: ["openid", "email", "profile", "roles"],
          pkce: true,
        },
      ],
    }),
    oidcProvider({
      loginPage: "/signin",
      allowDynamicClientRegistration: true,
      trustedClients: [
        {
          clientId: "AeIBMpjAgdncCzAeCIPsKrQbZkLqcUsc",
          clientSecret: "IlMAAPugFnegukmlIlXazdcWrkBbywDq",
          name: "Test client app",
          type: "web",
          redirectURLs: ["http://localhost:5000"],
          disabled: false,
          skipConsent: true,
          metadata: { internal: true },
        },
      ],
    }),
    nextCookies(),
  ],
});
