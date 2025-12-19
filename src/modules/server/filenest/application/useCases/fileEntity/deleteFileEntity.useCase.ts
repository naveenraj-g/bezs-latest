import { getSharedInjection } from "../../../../../server/shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TFileEntitySchema,
  TDeleteFileEntity,
} from "../../../../../shared/entities/models/filenest/fileEntity";

export async function deleteFileEntityUseCase(
  input: TDeleteFileEntity & { userId: string }
): Promise<TFileEntitySchema> {
  const userRepository = getSharedInjection("IUserRepository");
  const repo = getFilenestInjection("IFileEntityRepository");

  const ok = await userRepository.isUserInOrg(input.userId, input.orgId);
  if (!ok)
    throw new Error("Access denied: the user must be part of the organization");

  return repo.deleteFileEntity({ id: input.id, orgId: input.orgId });
}
