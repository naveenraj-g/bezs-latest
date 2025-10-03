"use server";

import { ServiceLocator } from "../../backend/services/serviceLocator";
import { ZSAError } from "zsa";
import { adminAuthenticatedProcedure } from "./admin-zsa-procedures";
import { AppDTO } from "../../backend/dtos/app";

export const getAllAppsData = adminAuthenticatedProcedure
  .createServerAction()
  .handler(async () => {
    const appServices = ServiceLocator.getService("AppService");

    let appDatas: AppDTO;

    try {
      appDatas = await appServices.getApps();
    } catch (err) {
      throw new ZSAError("ERROR", err);
    }

    return appDatas.appDatasToPlainObject();
  });
