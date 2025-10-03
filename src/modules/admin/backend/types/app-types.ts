import { App } from "../../../../../prisma/generated/main-database";

export type TApp = App;

export type TAppData = TApp & {
  _count: {
    appMenuItems: number;
    appActions: number;
  };
};
