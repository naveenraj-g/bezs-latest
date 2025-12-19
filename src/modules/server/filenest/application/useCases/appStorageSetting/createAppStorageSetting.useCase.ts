import { getSharedInjection } from "../../../../../server/shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TAppStorageSettingSchema,
  TCreateAppStorageSetting,
} from "../../../../../shared/entities/models/filenest/appStorageSettings";

export async function createAppStorageSettingUseCase(
  input: TCreateAppStorageSetting
): Promise<TAppStorageSettingSchema> {
  const userRepository = getSharedInjection("IUserRepository");
  const appStorageRepository = getFilenestInjection(
    "IAppStorageSettingRepository"
  );

  const isUserInOrg = await userRepository.isUserInOrg(
    input.userId,
    input.orgId
  );
  if (!isUserInOrg)
    throw new Error("Access denied: the user must be part of the organization");

  return appStorageRepository.createAppStorageSetting(input);
}
