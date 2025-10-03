"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { appsListTableColumn } from "./apps-list-table-column";
import { useAdminModalStore } from "@/modules/admin/frontend/stores/admin-modal-store";
import { IManageAppsTableData } from "../../../types/data-table-types";
import type { ZSAError } from "zsa";

type TAppsListTable = {
  appDatas: IManageAppsTableData | null;
  error: ZSAError | null;
};

export const AppsListTable = ({ appDatas, error }: TAppsListTable) => {
  const openModal = useAdminModalStore((state) => state.onOpen);

  const typeFilteredData = ["platform", "custom"];

  return (
    <>
      <div className="space-y-8 mx-auto w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Manage Apps</h1>
          <p className="text-sm">Manage Apps and its functionality.</p>
        </div>
        <DataTable
          columns={appsListTableColumn}
          data={appDatas?.appDatas ?? []}
          dataSize={appDatas?.total}
          label="All Apps"
          addLabelName="Add App"
          searchField="name"
          error={(!appDatas && error?.message) || null}
          fallbackText={
            (error && error.message) ||
            (appDatas?.appDatas?.length === 0 && "No Apps") ||
            undefined
          }
          filterField="type"
          filterValues={typeFilteredData}
          openModal={() =>
            openModal({
              type: "addApp",
            })
          }
        />
      </div>
    </>
  );
};
