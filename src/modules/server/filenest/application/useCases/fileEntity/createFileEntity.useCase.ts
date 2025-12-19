import { getSharedInjection } from "../../../../../server/shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TFileEntitySchema,
  TCreateFileEntity,
} from "../../../../../shared/entities/models/filenest/fileEntity";

export async function createFileEntityUseCase(
  input: TCreateFileEntity
): Promise<TFileEntitySchema> {
  const userRepository = getSharedInjection("IUserRepository");
  const repo = getFilenestInjection("IFileEntityRepository");

  const ok = await userRepository.isUserInOrg(input.userId, input.orgId);
  if (!ok)
    throw new Error("Access denied: the user must be part of the organization");

  return repo.createFileEntity(input);
}
