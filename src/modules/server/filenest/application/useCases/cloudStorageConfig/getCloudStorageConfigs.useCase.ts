import { getSharedInjection } from "../../../../shared/di/container";
import {
  TCloudStorageConfigsSchema,
  TGetCloudStorageConfig,
} from "../../../../../shared/entities/models/filenest/cloudStorage";
import { getFilenestInjection } from "../../../di/container";

export async function getCloudStorageConfigsUseCase({
  userId,
  orgId,
}: TGetCloudStorageConfig & {
  userId: string;
}): Promise<TCloudStorageConfigsSchema> {
  const userRepository = getSharedInjection("IUserRepository");
  const cloudStorageRepository = getFilenestInjection(
    "ICloudStorageRepository"
  );

  const isUserInOrg = await userRepository.isUserInOrg(userId, orgId);

  if (!isUserInOrg) {
    throw new Error("Access denied: the user must be part of the organization");
  }

  const data = cloudStorageRepository.getCloudStorageConfigs({ orgId });
  return data;
}
