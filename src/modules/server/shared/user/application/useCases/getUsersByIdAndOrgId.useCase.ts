import { getSharedInjection } from "../../../di/container";
import { TUser } from "../../entities/models/user";

export async function getUsersByIdAndOrgIdUseCase(
  userId: string,
  orgId: string
): Promise<TUser> {
  const userRepository = getSharedInjection("IUserRepository");

  const user = await userRepository.getUsersByIdAndOrgId(userId, orgId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
