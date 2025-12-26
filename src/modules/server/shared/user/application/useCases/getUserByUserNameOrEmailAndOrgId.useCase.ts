import { IsEmailSchema } from "@/modules/shared/schemas/shared";
import { getSharedInjection } from "../../../di/container";
import {
  TGetUserByUserNameOrEmailAndOrgId,
  TUser,
} from "../../entities/models/user";

export async function getUserByUserNameOrEmailAndOrgIdUseCase(
  payload: TGetUserByUserNameOrEmailAndOrgId
): Promise<TUser> {
  const userRepository = getSharedInjection("IUserRepository");

  const isEmail = IsEmailSchema.safeParse(payload.emailOrUsername);

  const email = isEmail.success ? payload.emailOrUsername : undefined;
  const username = !isEmail.success ? payload.emailOrUsername : undefined;

  const user = await userRepository.getUserByUserNameOrEmailAndOrgId({
    email,
    username,
    orgId: payload.orgId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
