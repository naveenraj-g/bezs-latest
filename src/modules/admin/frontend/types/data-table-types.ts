import { App } from "../../../../../prisma/generated/main-database";

// App List Table
export type TAppDataType = App & {
  _count: {
    appMenuItems: number;
    appActions: number;
  };
};

export interface IManageAppsTableData {
  appDatas: TAppDataType[];
  total: number;
}
