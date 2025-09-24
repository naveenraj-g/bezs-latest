import { IAppRepository } from "../repositories";

export class AppServices {
  private _appsRepository: IAppRepository;

  constructor(appsRepository: IAppRepository) {
    this._appsRepository = appsRepository;
  }

  async getApps() {
    const appDatas = await this._appsRepository.getApps();
    return appDatas;
  }
}
