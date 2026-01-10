import { injectable } from "inversify";
import { IAuthenticationService } from "../../application/services/authenticationService.interface";
import { auth } from "@/modules/server/auth/betterauth/auth";
import { UnauthenticatedError } from "@/modules/shared/entities/errors/authError";
import {
  TEmailAuthRes,
  TResetPassword,
  TSignInWithEmail,
  TSignInWithUsername,
  TSignUp,
  T2Fa,
  TUpdatePassword,
  TSuccessRes,
  TUsernameAuthRes,
  TAuthEmailSuccessRes,
  TAuthUsernameSuccessRes,
} from "../../entities/models/auth";
import { headers } from "next/headers";

@injectable()
export class BetterauthAuthenticationService implements IAuthenticationService {
  private _providers = ["github", "google"];

  constructor() {}

  async signInWithProvider(provider: string): Promise<void> {
    if (!this._providers.some((p) => p === provider)) {
      // TODO: move provider validation in Controller
      throw new Error("Provider not supported");
    }

    try {
      await auth.api.signInSocial({
        body: {
          provider,
          callbackURL: "/",
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthenticatedError(error.message, { cause: error });
      }

      throw new UnauthenticatedError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async signInWithEmail({
    email,
    password,
  }: TSignInWithEmail): Promise<TAuthEmailSuccessRes> {
    try {
      const response = await auth.api.signInEmail({
        body: {
          email,
          password,
          rememberMe: false,
          callbackURL: "/",
        },
      });

      // if ((response as any)?.twoFactorRedirect) {
      //   return {
      //     type: "2fa",
      //     twoFactorRedirect: true,
      //     ...response,
      //   };
      // }

      return {
        redirect: response.redirect,
        url: response.user.roleBasedRedirectUrls ?? response.url,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthenticatedError(error.message, { cause: error });
      }

      throw new UnauthenticatedError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async signInWithUsername({
    username,
    password,
  }: TSignInWithUsername): Promise<TAuthUsernameSuccessRes | null> {
    try {
      const response = await auth.api.signInUsername({
        body: {
          username,
          password,
          rememberMe: false,
          callbackURL: "/",
        },
      });

      // console.log({ response });

      // if ((response as any)?.twoFactorRedirect) {
      //   return {
      //     type: "2fa",
      //     twoFactorRedirect: true,
      //     ...response,
      //   };
      // }

      if (response) {
        return {
          redirect: true,
          url: "/",
        };
      }

      return null;
    } catch (error) {
      console.log({ error });
      if (error instanceof Error) {
        throw new UnauthenticatedError(error.message, { cause: error });
      }

      throw new UnauthenticatedError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async signUp({
    email,
    name,
    password,
    username,
  }: TSignUp): Promise<{ success: boolean; redirectUrl: string }> {
    try {
      const data = await auth.api.signUpEmail({
        body: {
          username,
          name,
          email,
          password,
          callbackURL: "/",
        },
      });

      return {
        success: true,
        redirectUrl: "/",
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthenticatedError(error.message, { cause: error });
      }

      throw new UnauthenticatedError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async signOut(): Promise<TSuccessRes> {
    try {
      const data = await auth.api.signOut({
        headers: await headers(),
      });

      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthenticatedError(error.message, { cause: error });
      }

      throw new UnauthenticatedError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async resetPassword({ newPassword, token }: TResetPassword): Promise<void> {
    try {
      await auth.api.resetPassword({
        body: {
          newPassword,
          token,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthenticatedError(error.message, { cause: error });
      }

      throw new UnauthenticatedError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async updatePassword({
    currentPassword,
    newPassword,
  }: TUpdatePassword): Promise<void> {
    try {
      await auth.api.changePassword({
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        },
        headers: await headers(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthenticatedError(error.message, { cause: error });
      }

      throw new UnauthenticatedError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async send2FaOTP(): Promise<T2Fa> {
    try {
      const data = await auth.api.sendTwoFactorOTP({
        body: {
          trustDevice: true,
        },
        headers: await headers(),
      });
      return data;
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        throw new UnauthenticatedError(error.message, { cause: error });
      }

      throw new UnauthenticatedError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async requestPasswordReset(data: TResetPassword): Promise<void> {}
}
