"use server";

import {
  getFileUploadRequiredDataController,
  localUploadUserFileController,
  TGetFileUploadRequiredDataControllerOutput,
  TLocalUploadUserFileControllerOutput,
} from "@/modules/server/filenest/interface-adapters/controllers/fileUpload";
import { GetFileEntitiesByAppIdValidationSchema } from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
import { FileUploadValidationSchema } from "@/modules/shared/schemas/filenest/fileUploadValidationSchema";
import { getAppSlugServerOnly } from "@/modules/shared/utils/getAppSlugServerOnly";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getFileUploadRequiredData = createServerAction()
  .input(GetFileEntitiesByAppIdValidationSchema.omit({ appSlug: true }), {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    const { appSlug } = await getAppSlugServerOnly();
    const data = {
      ...input,
      appSlug,
    };

    return await withMonitoring<TGetFileUploadRequiredDataControllerOutput>(
      "getFileUploadRequiredData",
      () => getFileUploadRequiredDataController(data),
      {
        operationErrorMessage: "Failed to get file upload datas.",
      }
    );
  });

export const localUploadUserFile = createServerAction()
  .input(FileUploadValidationSchema, { skipInputParsing: true })
  .handler(async ({ input }) => {
    return await withMonitoring<TLocalUploadUserFileControllerOutput>(
      "localUploadUserFile",
      () => localUploadUserFileController(input),
      {
        operationErrorMessage: "Failed to upload file.",
      }
    );
  });
