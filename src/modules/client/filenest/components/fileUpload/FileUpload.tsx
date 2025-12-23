"use client";

import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { getFileUploadRequiredDataWithAppSlug } from "@/modules/client/shared/server-actions/file-upload-action";
import { TSharedUser } from "@/modules/shared/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";

interface IFileUploadProps {
  user: TSharedUser;
}

function FileUpload({ user }: IFileUploadProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appSlug = searchParams?.get("app") as string;
  const session = useSession();

  const {
    data: fileUploadData,
    error: fileUploadDataError,
    isPending: fileUploadDataIsPending,
    isFetching: fileUploadDataIsFetching,
  } = useQuery({
    queryKey: ["fileUploadEntitiesData", user.orgId, appSlug],
    enabled: !!appSlug, // 👈 wait until param exists
    queryFn: async () =>
      await getFileUploadRequiredDataWithAppSlug({
        orgId: user.orgId,
        userId: user.id,
        appSlug: appSlug,
      }),
  });

  console.log(fileUploadData);

  return <div>FileUpload</div>;
}

export default FileUpload;
