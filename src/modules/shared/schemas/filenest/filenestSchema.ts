import z from "zod";

export const GetUserFilePayloadSchema = z.object({
  userId: z.string().min(1),
  orgId: z.string().min(1),
  appSlug: z.string().min(1),
});
export type TGetUserFilePayload = z.infer<typeof GetUserFilePayloadSchema>;
