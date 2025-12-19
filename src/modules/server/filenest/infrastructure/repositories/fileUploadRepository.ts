import { injectable } from "inversify";
import { IFileUploadRepository } from "../../application/repositories/fileUploadRepository.interface";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { prismaFilenest } from "../../../../server/prisma/prisma";
import { OperationError } from "../../../../shared/entities/errors/commonError";
import {
  FileUploadRequiredDataSchema,
  TFileDatasSchema,
  TFileUploadRequiredDataSchema,
  TGetFileUploadRequiredData,
} from "../../../../shared/entities/models/filenest/fileUpload";

injectable();
export class FileUploadRepository implements IFileUploadRepository {
  constructor() {}

  async getFileUploadRequiredData(
    getData: TGetFileUploadRequiredData
  ): Promise<TFileUploadRequiredDataSchema> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getFileUploadRequiredDataRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      const reqData = await prismaFilenest.$transaction(async (tx) => {
        const fileEntities = await tx.fileEntity.findMany({
          where: {
            orgId: getData.orgId,
            appId: getData.appId,
            appSlug: getData.appSlug,
            isActive: true,
          },
        });

        const appStorageSetting = await tx.appStorageSetting.findFirst({
          where: {
            orgId: getData.orgId,
            appId: getData.appId,
            appSlug: getData.appSlug,
          },
        });

        const data = {
          fileEntities,
          maxFileSize: appStorageSetting?.maxFileSize,
        };

        return data;
      });

      const data = await FileUploadRequiredDataSchema.parseAsync(reqData);

      logOperation("success", {
        name: "getFileUploadRequiredDataRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getFileUploadRequiredDataRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }

  async localUploadUserFile(
    payload: TFileDatasSchema
  ): Promise<{ success: boolean }> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "localUploadUserFileRepository",
      startTimeMs,
      context: { operationId },
    });

    try {
      await prismaFilenest.userFile.createMany({
        data: payload,
      });

      const data = { success: true };

      logOperation("success", {
        name: "localUploadUserFileRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "localUploadUserFileRepository",
        startTimeMs,
        err: error,
        errName: "UnknownRepositoryError",
        context: { operationId },
      });

      if (error instanceof Error) {
        throw new OperationError(error.message, { cause: error });
      }
      throw new OperationError("An unexpected error occurred", {
        cause: error,
      });
    }
  }
}
