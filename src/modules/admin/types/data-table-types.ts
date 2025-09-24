import { AppType } from "../../../../prisma/generated/main-database";

// App List Table
export type TAppDataType = {
  _count: {
    appMenuItems: number;
    appActions: number;
  };
  type: AppType;
  name: string;
  id: string;
  createdAt: Date;
  slug: string;
  description: string;
};

export interface IManageAppsTableData {
  data: TAppDataType[];
  total: number;
}
