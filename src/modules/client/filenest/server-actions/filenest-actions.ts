"use server";

import {
  getUserFilesController,
  TGetUserFilesControllerOutput,
} from "@/modules/server/filenest/interface-adapters/controllers/filenest";
import { GetUserFilePayloadSchema } from "@/modules/shared/schemas/filenest/filenestSchema";
import { withMonitoring } from "@/modules/shared/utils/serverActionWithMonitoring";
import { createServerAction } from "zsa";

export const getUserFiles = createServerAction()
  .input(GetUserFilePayloadSchema, {
    skipInputParsing: true,
  })
  .handler(async ({ input }) => {
    return await withMonitoring<TGetUserFilesControllerOutput>(
      "getUserFiles",
      () => getUserFilesController(input),
      {
        operationErrorMessage: "Failed to get user files.",
      }
    );
  });
