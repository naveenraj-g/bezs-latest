"use client";

import DataTable from "@/modules/shared/components/table/data-table";
import { EmptyState } from "@/modules/shared/components/EmptyState";
import { AlertCircle, FolderOpen, Upload } from "lucide-react";
import FileUpload from "@/modules/client/shared/components/FileUpload";
import { IFileUploadProps } from "@/modules/client/shared/types/file-upload";
import { ZSAError } from "zsa";
import { useFileUploadStore } from "@/modules/client/shared/store/file-upload-store";
import { TGetUserFilesControllerOutput } from "@/modules/server/filenest/interface-adapters/controllers/filenest";
import { listFileTableColumn } from "./listFileTableColumn";
import { useSearchParams } from "next/navigation";

interface IListFileTableProps {
  filesData?: TGetUserFilesControllerOutput | null;
  error?: ZSAError | null;
  isLoading: boolean;
}

function ListFileTable({
  user,
  fileUploadData,
  modalError,
  filesData,
  error,
  isLoading,
}: IListFileTableProps & IFileUploadProps) {
  const searchParams = useSearchParams();
  const appSlug = searchParams?.get("app") as string;
  const openModal = useFileUploadStore((state) => state.onOpen);

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle />}
        title="Error"
        description="Something went wrong. Please try again later."
        buttonLabel="Reload"
        error={error}
      />
    );
  }

  if (!filesData || filesData?.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen />}
        title="No files yet"
        description="You haven’t uploaded any files for this app. Upload files to get started."
        buttonLabel="Upload files"
        buttonIcon={<Upload />}
        ButtonEle={() => (
          <FileUpload
            fileUploadData={fileUploadData}
            user={user}
            modalError={modalError}
            queryKey={["filesData", user.orgId, appSlug]}
          />
        )}
      />
    );
  }

  const filterData = fileUploadData?.fileEntities.map((entity) => entity.label);

  return (
    <DataTable
      isLoading={isLoading}
      columns={listFileTableColumn()}
      data={filesData ?? []}
      dataSize={filesData?.length ?? 0}
      label={"Your Files"}
      AddButtonIcon={<Upload />}
      addLabelName="Upload Files"
      filterField="fileEntityLabel"
      filterFieldLabel="File category"
      filterValues={filterData}
      fallbackText={(filesData?.length === 0 && "No Files Found") || "No Files"}
      openModal={() => {
        openModal({
          type: "fileUpload",
          error: modalError,
          fileUploadData,
          queryKey: ["filesData", user.orgId, appSlug],
        });
      }}
    />
  );
}

export default ListFileTable;
