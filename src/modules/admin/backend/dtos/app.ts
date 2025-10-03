import { TAppData } from "../types/app-types";

export class AppDTO {
  constructor(private _appDatas: TAppData[], private _total: number) {}

  public toJSON() {
    return JSON.stringify({
      appDatas: this._appDatas?.map((app) => ({
        ...app,
      })),
      total: this._total,
    });
  }

  public get appDatas() {
    return this._appDatas;
  }

  public get total() {
    return this._total;
  }

  static getAppDatasFromDb(data: TAppData[], total: number) {
    return new AppDTO(data, total);
  }

  public appDatasToPlainObject() {
    return {
      appDatas: this._appDatas?.map((app) => ({
        ...app,
      })),
      total: this._total,
    };
  }
}
