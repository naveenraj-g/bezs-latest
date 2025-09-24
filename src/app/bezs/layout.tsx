import { getServerSession } from "@/modules/auth/betterauth/auth-server";
import AppNavbar from "@/modules/shared/components/navbar/app-navbar";
import { redirect } from "next/navigation";

const AppListingLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <>
      <AppNavbar session={session} />
      {/* <BreadCrumb /> */}
      <main>{children}</main>
    </>
  );
};

export default AppListingLayout;
