import { injectable } from "inversify";
import { IFilenestRepository } from "../../application/repositories/filenestRepository.interface";
import {
  TGetUserFilesPayload,
  TUserFiles,
  UserFilesSchema,
} from "../../../../shared/entities/models/filenest/filenest";
import { randomUUID } from "crypto";
import { logOperation } from "../../../../shared/utils/server-logger/log-operation";
import { prismaFilenest } from "../../../../server/prisma/prisma";
import { OperationError } from "../../../../shared/entities/errors/commonError";

injectable();
export class FilenestRepository implements IFilenestRepository {
  constructor() {}

  async getUserFiles(payload: TGetUserFilesPayload): Promise<TUserFiles> {
    const startTimeMs = Date.now();
    const operationId = randomUUID();

    logOperation("start", {
      name: "getUserFilesRepository",
      startTimeMs,
      context: { operationId },
    });

    const { appId, appSlug, orgId, userId } = payload;

    try {
      const userFiles = await prismaFilenest.userFile.findMany({
        where: {
          orgId,
          appId,
          userId,
          appSlug,
        },
        select: {
          id: true,
          userId: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          storageType: true,
          filePath: true,
          referenceType: true,
          referenceId: true,
          createdAt: true,
          updatedAt: true,
          fileEntityId: true,
          fileEntity: {
            select: {
              id: true,
              type: true,
              name: true,
              label: true,
              subFolder: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      const data = await UserFilesSchema.parseAsync(userFiles);

      logOperation("success", {
        name: "getUserFilesRepository",
        startTimeMs,
        context: { operationId },
      });

      return data;
    } catch (error) {
      logOperation("error", {
        name: "getUserFilesRepository",
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
