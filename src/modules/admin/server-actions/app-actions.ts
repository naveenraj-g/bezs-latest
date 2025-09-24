"use server";

import { getServerSession } from "@/modules/auth/betterauth/auth-server";
import { ServiceLocator } from "../services/serviceLocator";

export async function getAllAppsData() {
  const session = await getServerSession();

  if (!session || session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const appServices = ServiceLocator.getService("AppServices");

  let appDatas;

  try {
    appDatas = await appServices.getApps();
  } catch (err) {
    throw new Error((err as Error).message);
  }

  return appDatas.appDatasToJSON();
}
