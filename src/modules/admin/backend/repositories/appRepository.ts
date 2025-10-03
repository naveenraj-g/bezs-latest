import { prismaMain } from "@/lib/prisma";
import { IAppRepository } from ".";
import { AppDTO } from "../dtos/app";

export class AppRepository implements IAppRepository {
  constructor() {}

  async getApps() {
    try {
      const appsData = await prismaMain.app.findMany({
        include: {
          _count: {
            select: {
              appMenuItems: true,
              appActions: true,
            },
          },
        },
      });

      const total = await prismaMain.app.count();

      const data = AppDTO.getAppDatasFromDb(appsData, total);
      return data;
    } catch (err) {
      throw new Error("Failed to get apps", { cause: err });
    }
  }
}
