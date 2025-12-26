import { getSharedInjection } from "../../../../shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TDeleteUserFilePermissionByOwner,
  TUserFilePermissionSchema,
} from "../../../../../shared/entities/models/filenest/userFilePermission";

export async function deleteUserFilePermissionByOwnerUseCase(
  deleteData: TDeleteUserFilePermissionByOwner
): Promise<TUserFilePermissionSchema> {
  const userRepository = getSharedInjection("IUserRepository");
  const userFilePermissionRepository = getFilenestInjection(
    "IUserFilePermissionRepository"
  );
  const filenestRepository = getFilenestInjection("IFilenestRepository");

  const { userId, orgId, id, userFileId } = deleteData;

  const isUserInOrg = await userRepository.isUserInOrg(userId, orgId);
  if (!isUserInOrg) {
    throw new Error("Access denied: user is not part of the organization");
  }

  const isFileOwner = await filenestRepository.checkFileOwnerByUserIdAndOrgId(
    userId,
    orgId,
    userFileId
  );

  if (!isFileOwner) {
    throw new Error("Access denied: user does not own the file");
  }

  return userFilePermissionRepository.deleteUserFilePermissionByOwner({
    id,
    orgId,
    userId,
    userFileId,
  });
}
