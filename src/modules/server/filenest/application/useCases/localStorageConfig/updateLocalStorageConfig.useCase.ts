import { getSharedInjection } from "../../../../../server/shared/di/container";
import {
  TLocalStorageConfigSchema,
  TUpdateLocalStorage,
} from "../../../../../shared/entities/models/filenest/localStorage";
import { getFilenestInjection } from "../../../di/container";

export async function updateLocalStorageConfigUseCase(
  updateData: TUpdateLocalStorage
): Promise<TLocalStorageConfigSchema> {
  const userRepository = getSharedInjection("IUserRepository");
  const localStorageRepository = getFilenestInjection(
    "ILocalStorageRepository"
  );

  const isUserInOrg = await userRepository.isUserInOrg(
    updateData.userId,
    updateData.orgId
  );
  if (!isUserInOrg) {
    throw new Error("Access denied: the user must be part of the organization");
  }

  const data = localStorageRepository.updateLocalStorageConfig(updateData);
  return data;
}
