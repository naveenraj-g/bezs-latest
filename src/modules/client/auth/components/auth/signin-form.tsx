"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import OauthButton from "./oauth-button";
import Link from "next/link";
import { authClient } from "@/modules/client/auth/betterauth/auth-client";
import { useServerAction } from "zsa-react";
import { signIn } from "@/modules/client/auth/server-actions/auth-actions";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

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

const signInFormSchema = z.object({
  usernameOrEmail: usernameOrEmailSchema,
  password: z
    .string()
    .min(8, "Password must have atleast two characters")
    .max(16, "Password must have atmost 16 characters"),
});

type SignInForm = z.infer<typeof signInFormSchema>;

export function SignInForm() {
  const router = useRouter();
  const t = useTranslations("auth.signin");

  const [isForgetClick, setIsForgetClick] = useState(false);
  const [inputType, setInputType] = useState("password");

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { execute, isPending } = useServerAction(signIn, {
    onSuccess({ data }) {
      if (data.redirect) {
        toast.success("Signin Success!");
        router.push(data?.url ?? "/");
      }
    },
    onError({ err }) {
      toast.error("Error!", {
        description: err.message,
      });
    },
  });

  async function onSubmit(values: SignInForm) {
    const { usernameOrEmail, password } = values;
    await execute({ usernameOrEmail, password });
  }

  function handleInputTypeChange() {
    setInputType((prevState) =>
      prevState === "password" ? "text" : "password"
    );
  }

  return (
    <>
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle className="text-xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("form.fields.usernameOrEmail.label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          "form.fields.usernameOrEmail.placeholder"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.fields.password.label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={t("form.fields.password.placeholder")}
                          {...field}
                          type={inputType}
                          maxLength={16}
                          autoComplete="off"
                        />
                        {inputType === "password" ? (
                          <EyeOff
                            className="w-4 h-4 absolute top-[25%] right-3.5 cursor-pointer"
                            onClick={handleInputTypeChange}
                          />
                        ) : (
                          <Eye
                            className="w-4 h-4 absolute top-[25%] right-3.5 cursor-pointer"
                            onClick={handleInputTypeChange}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="flex items-center justify-end w-full h-fit">
                      <Button
                        variant="link"
                        type="button"
                        className="cursor-pointer text-zinc-500 dark:text-white/70 p-0 h-fit pr-1"
                        onClick={() => {
                          setIsForgetClick(true);
                        }}
                      >
                        {t("form.fields.password.forget")}
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full text-md cursor-pointer"
              >
                {isSubmitting || isPending ? (
                  <>
                    <Loader2 className="animate-spin" />{" "}
                    {t("form.button.loading")}
                  </>
                ) : (
                  t("form.button.default")
                )}
              </Button>
            </form>
          </Form>
          <div className="space-y-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="h-[1px] bg-white/20 w-full" />
              <p className="text-nowrap w-fit text-center text-sm text-zinc-500 dark:text-white/70">
                {t("oauth.continueWith")}
              </p>
              <div className="h-[1px] bg-white/20 w-full" />
            </div>
            <div className="flex gap-2 flex-wrap w-full">
              <OauthButton
                oauthName="google"
                label={t("oauth.google")}
                isFormSubmitting={isSubmitting || isPending}
              />
              <OauthButton
                oauthName="github"
                label={t("oauth.github")}
                isFormSubmitting={isSubmitting || isPending}
              />
            </div>
          </div>
          <p className="text-center mt-6 text-sm text-zinc-500 dark:text-white/70">
            {t("footer.noAccount")}{" "}
            <Link
              href="/signup"
              className="text-black dark:text-white underline-offset-4 underline"
            >
              {t("footer.signup")}
            </Link>
          </p>
        </CardContent>
      </Card>
      <ForgetPasswordAlert
        isForgetClick={isForgetClick}
        setIsForgetClick={setIsForgetClick}
      />
    </>
  );
}

//////////////////////////////////////////////////////////////////

const forgetPasswordAlertSchema = z.object({
  email: z.string().email(),
});

type ForgetPasswordForm = z.infer<typeof forgetPasswordAlertSchema>;

export function ForgetPasswordAlert({
  isForgetClick,
  setIsForgetClick,
}: {
  isForgetClick: boolean;
  setIsForgetClick: Dispatch<SetStateAction<boolean>>;
}) {
  const t = useTranslations("auth.signin.forgetDialog");

  const form = useForm<ForgetPasswordForm>({
    resolver: zodResolver(forgetPasswordAlertSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: ForgetPasswordForm) {
    const { email } = values;

    await authClient.requestPasswordReset(
      {
        email,
        redirectTo: "/reset-password",
      },
      {
        onSuccess() {
          toast("Success!", {
            description: "Check your mail to change password.",
          });
          form.reset();
          setIsForgetClick(false);
        },
        onError(ctx) {
          toast("An Error Occurred!", {
            description: <span className="">{ctx.error.message}</span>,
          });
        },
      }
    );
  }

  return (
    <Dialog open={isForgetClick} onOpenChange={setIsForgetClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">{t("title")}</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.email.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.email.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {" "}
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />{" "}
                    {t("form.submit.loading")}
                  </>
                ) : (
                  t("form.submit.default")
                )}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
