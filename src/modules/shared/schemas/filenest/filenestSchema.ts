import z from "zod";

// Payload for getting a user's files
export const GetUserFilePayloadSchema = z.object({
  userId: z.string().min(1),
  orgId: z.string().min(1),
  appSlug: z.string().min(1),
});
export type TGetUserFilePayload = z.infer<typeof GetUserFilePayloadSchema>;

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

export const GetUserByUserNameOrEmailAndOrgIdValidationSchema = z.object({
  shareWith: usernameOrEmailSchema,
  orgId: z.string().min(1),
});
export type TGetUserByUserNameOrEmailAndOrgIdValidationSchema = z.infer<
  typeof GetUserByUserNameOrEmailAndOrgIdValidationSchema
>;
