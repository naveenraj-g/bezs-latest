"use server";

import z from "zod";
import { createServerAction, ZSAError } from "zsa";
import { signInWithEmailController } from "@/modules/server/auth/interface-adapters/controllers/auth/signInWithEmail.controller";
import { InputParseError } from "@/modules/shared/entities/errors/commonError";
import { AuthenticationError } from "@/modules/shared/entities/errors/authError";
import { redirect } from "@/i18n/navigation";
import { send2FaOTPController } from "../../../server/auth/interface-adapters/controllers/auth/send2FaOTP.controller";
import { signOutController } from "../../../server/auth/interface-adapters/controllers/auth/signOut.controller";
import { signInWithUsernameController } from "../../../server/auth/interface-adapters/controllers/auth/signInWithUsername.controller";
import { signInWithKeycloakGenericOAuthController } from "../../../server/auth/interface-adapters/controllers/auth/signInWithKeycloakGenericOAuth.controller";
import { signInController } from "../../../server/auth/interface-adapters/controllers/auth/signIn.controller";
import { getServerSession } from "../../../server/auth/betterauth/auth-server";
import { getLocale } from "next-intl/server";

const signInWithEmailSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must have atleast two characters")
    .max(16, "Password must have atmost 16 characters"),
});

const signInWithUsernameSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, "Password must have atleast two characters")
    .max(16, "Password must have atmost 16 characters"),
});

const usernameOrEmailSchema = z.string().refine(
  (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9._]{3,15}$/;
    return emailRegex.test(value) || usernameRegex.test(value);
  },
  {
    message: "Enter a valid username or email",
  }
);

const signInSchema = z.object({
  usernameOrEmail: usernameOrEmailSchema,
  password: z
    .string()
    .min(8, "Password must have atleast two characters")
    .max(16, "Password must have atmost 16 characters"),
});

export const signIn = createServerAction()
  .input(signInSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    const locale = await getLocale();
    let redirectUrl: string | null = null;

    try {
      const data = await signInController({
        usernameorEmail: input.usernameOrEmail,
        password: input.password,
      });

      if (data && data.redirect && data.url) {
        redirectUrl = data.url;
      }
    } catch (err) {
      if (err instanceof InputParseError) {
        throw new ZSAError("INPUT_PARSE_ERROR", "Invalid input");
      }

      if (err instanceof AuthenticationError) {
        throw new ZSAError("ERROR", err.message);
      }

      throw new ZSAError("ERROR", err);
    }

    if (redirectUrl) {
      redirect({ href: redirectUrl, locale });
    }
  });

export const signInWithEmail = createServerAction()
  .input(signInWithEmailSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    let redirectUrl: string | null = null;

    try {
      const data = await signInWithEmailController(input);
      if (data.type === "2fa" && data.twoFactorRedirect) {
        return {
          twoFa: true,
          redirectUrl: "/2fa-verification",
        };
      }

      if (data.type === "success" && data.redirect && data.url) {
        redirectUrl = data.url;
      }
    } catch (err) {
      if (err instanceof InputParseError) {
        throw new ZSAError("INPUT_PARSE_ERROR", "Invalid input");
      }

      if (err instanceof AuthenticationError) {
        throw new ZSAError("ERROR", err.message);
      }

      throw new ZSAError("ERROR", err);
    }

    if (redirectUrl) {
      redirect(redirectUrl);
    }
  });

export const signInWithUsername = createServerAction()
  .input(signInWithUsernameSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    let redirectUrl: string | null = null;

    try {
      const data = await signInWithUsernameController(input);
      if (data?.type === "2fa" && data?.twoFactorRedirect) {
        return {
          twoFa: true,
          redirectUrl: "/2fa-verification",
        };
      }

      if (data?.type === "success" && data.redirect && data.url) {
        redirectUrl = data.url;
      }
    } catch (err) {
      if (err instanceof InputParseError) {
        throw new ZSAError("INPUT_PARSE_ERROR", "Invalid input");
      }

      if (err instanceof AuthenticationError) {
        throw new ZSAError("ERROR", err.message);
      }

      throw new ZSAError("ERROR", err);
    }

    if (redirectUrl) {
      redirect(redirectUrl);
    }
  });

export const signOut = createServerAction().handler(async () => {
  const session = await getServerSession();

  try {
    if (!session || !session.keycloak || !session.keycloak.refreshToken) {
      throw new Error("Unauthenticated");
    }

    const data = await signOutController(session.keycloak.refreshToken);
    if (data.success) {
      return { success: true };
    }
  } catch (err) {
    console.log(err);
    if (err instanceof InputParseError) {
      throw new ZSAError("INPUT_PARSE_ERROR", "Invalid input");
    }

    if (err instanceof AuthenticationError) {
      throw new ZSAError("ERROR", err.message);
    }

    throw new ZSAError("ERROR", err);
  }

  // if (isSuccess) {
  //   redirect("/");
  // }
});

export const sendTwoFa = createServerAction().handler(async () => {
  try {
    await send2FaOTPController();
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new ZSAError("INPUT_PARSE_ERROR", "Invalid input");
    }

    if (err instanceof AuthenticationError) {
      throw new ZSAError("ERROR", err.message);
    }

    throw new ZSAError("ERROR", err);
  }
});

export const signInWithKeycloakGenericOAuth = createServerAction().handler(
  async () => {
    try {
      const data = await signInWithKeycloakGenericOAuthController();
      return data;
    } catch (err) {
      if (err instanceof InputParseError) {
        throw new ZSAError("INPUT_PARSE_ERROR", "Invalid input");
      }

      if (err instanceof AuthenticationError) {
        throw new ZSAError("ERROR", err.message);
      }

      throw new ZSAError("ERROR", err);
    }
  }
);
