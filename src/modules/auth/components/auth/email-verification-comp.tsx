"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { authClient } from "../../betterauth/auth-client";

const EmailVerificationComp = ({ email }: { email: string }) => {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          We’ve sent a verification link to your email. Please check your inbox
          and verify your email address. Once verified, refresh this page to
          continue. If email not received then{" "}
          <span
            className="link cursor-pointer underline"
            onClick={async () => {
              try {
                await authClient.sendVerificationEmail({
                  email,
                  callbackURL: "/bezs",
                });

                toast("Success!");
              } catch (error) {
                toast("Error!", {
                  description: `${error}`,
                });
              }
            }}
          >
            request again
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationComp;
