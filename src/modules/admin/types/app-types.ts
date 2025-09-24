import { App } from "../../../../prisma/generated/main-database";

export type TApp = Pick<
  App,
  "id" | "description" | "name" | "slug" | "createdAt" | "type"
>;

export type TAppData = TApp & {
  _count: {
    appMenuItems: number;
    appActions: number;
  };
};
