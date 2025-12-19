import z from "zod";
import { FileEntitiesSchema } from "./fileEntity";

const IdsSchema = z.object({
  id: z.bigint().positive().min(BigInt(1), "ID is required"),
  orgId: z.string().min(1, "Org ID is required"),
  userId: z.string().min(1, "User ID is required"),
});
type TIdsSchema = z.infer<typeof IdsSchema>;

const RequiredFieldsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetFileUploadRequiredData = {
  appId: string;
  orgId: string;
  appSlug: string;
};

export const FileUploadRequiredDataSchema = z.object({
  fileEntities: FileEntitiesSchema,
  maxFileSize: z.number().optional(),
});
export type TFileUploadRequiredDataSchema = z.infer<
  typeof FileUploadRequiredDataSchema
>;

export const FileDataSchema = z.object({
  fileId: z.string(), // or z.string() if you control it
  fileName: z.string(), // usually string
  fileType: z.string(), // usually string (mime)
  fileSize: z.bigint(), // number (bytes)
  filePath: z.string(), // string
  userId: z.string(),
  orgId: z.string(),
  appId: z.string(),
  appSlug: z.string(),
  fileEntityId: z.bigint(),
  storageType: z.enum(["LOCAL", "CLOUD"]),
  appStorageSettingId: z.bigint(),
  createdBy: z.string(),
  updatedBy: z.string(),
});
export type TFileDataSchema = z.infer<typeof FileDataSchema>;

export const FileDatasSchema = z.array(FileDataSchema);
export type TFileDatasSchema = z.infer<typeof FileDatasSchema>;
