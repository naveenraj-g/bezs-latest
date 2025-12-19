import { getSharedInjection } from "../../../../../server/shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TAppStorageSettingSchema,
  TDeleteAppStorageSetting,
} from "../../../../../shared/entities/models/filenest/appStorageSettings";

export async function deleteAppStorageSettingUseCase(
  input: TDeleteAppStorageSetting & { userId: string }
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

  return appStorageRepository.deleteAppStorageSetting({
    id: input.id,
    orgId: input.orgId,
  });
}
