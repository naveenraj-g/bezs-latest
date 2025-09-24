import { TAppData } from "../types/app-types";

export class AppDTO {
  constructor(private _appDatas: TAppData[], private _total: number) {}

  public get appDatas() {
    return this._appDatas;
  }

  public get total() {
    return this._total;
  }

  static getAppDatasFromDb(data: TAppData[], total: number) {
    return new AppDTO(data, total);
  }

  public appDatasToJSON() {
    return {
      appDatas: this._appDatas.map((app) => ({
        ...app,
      })),
      total: this._total,
    };
  }
}
