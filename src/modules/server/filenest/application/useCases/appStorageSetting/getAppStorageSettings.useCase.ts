import { getSharedInjection } from "../../../../../server/shared/di/container";
import { getFilenestInjection } from "../../../di/container";
import {
  TAppStorageSettingsSchema,
  TGetAppStorageSettings,
} from "../../../../../shared/entities/models/filenest/appStorageSettings";

export async function getAppStorageSettingsUseCase(
  input: TGetAppStorageSettings & { userId: string }
): Promise<TAppStorageSettingsSchema> {
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

  return appStorageRepository.getAppStorageSettings({
    orgId: input.orgId,
  });
}
