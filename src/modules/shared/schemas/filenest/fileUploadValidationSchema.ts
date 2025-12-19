import z from "zod";

export const FileUploadValidationSchema = z.object({
  fileEntityId: z.bigint().positive(),
  files: z.array(z.instanceof(File)),
  userId: z.string().min(1),
  orgId: z.string().min(1),
  appSlug: z.string().min(1),
});
export type TFileUploadValidationSchema = z.infer<
  typeof FileUploadValidationSchema
>;
