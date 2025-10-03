import { AppDTO } from "../dtos/app";

export interface IAppRepository {
  getApps(): Promise<AppDTO>;
  // createApp()
}
