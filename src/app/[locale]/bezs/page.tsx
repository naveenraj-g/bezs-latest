import { redirect } from "@/i18n/navigation";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";
import { getLocale } from "next-intl/server";

const BezsPage = async () => {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session) {
    redirect({ href: "/signin", locale });
  }

  if (session?.user.roleBasedRedirectUrls) {
    if (session.user.roleBasedRedirectUrls !== "/bezs") {
      redirect({ href: session.user.roleBasedRedirectUrls, locale });
    }
  }

  return (
    <div className="h-full p-4">
      <h1>Bezs</h1>
    </div>
  );
};

export default BezsPage;
