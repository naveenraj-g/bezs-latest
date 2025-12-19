import { redirect } from "@/i18n/navigation";
import FileUpload from "@/modules/client/shared/components/FileUpload";
import { getFileUploadRequiredData } from "@/modules/client/shared/server-actions/file-upload-action";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";
import { getLocale } from "next-intl/server";

async function FilenestPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session || !session.user.currentOrgId) {
    redirect({ href: "/signin", locale });
    return;
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    orgId: session.user.currentOrgId,
  };

  const [fileUploadData, error] = await getFileUploadRequiredData({
    orgId: user.orgId,
    userId: user.id,
  });

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm">Manage your health records securely</p>
      </div>
      <FileUpload
        fileUploadData={fileUploadData}
        user={user}
        modalError={error}
      />
    </div>
  );
}

export default FilenestPage;
