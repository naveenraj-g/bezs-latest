import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getServerSession } from "@/modules/auth/betterauth/auth-server";
// import { useSession } from "@/modules/auth/services/better-auth/auth-client";
// import { LangSwitcherBtn } from "@/shared/langSwitch/lang-switcher-btn";
// import { ThemeSwitcher } from "@/theme/theme-switcher";
// import { getTranslations } from "next-intl/server";
// import { useTranslations } from "next-intl";
import Link from "next/link";

const RootNavBarPage = async () => {
  const session = await getServerSession();

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-1.5 bg-white dark:bg-zinc-800/60 shadow-md">
        <div>
          <h1>
            <Link href="/">Bezs</Link>
          </h1>
        </div>
        <ul className="flex items-center gap-2">
          <li>{/* <LangSwitcherBtn /> */}</li>
          <li>{/* <ThemeSwitcher /> */}</li>
          <li className="flex items-center gap-2">
            {!session ? (
              <>
                <Link
                  href="signin"
                  className={cn(
                    "cursor-pointer",
                    buttonVariants({
                      variant: "link",
                      size: "sm",
                      className: "!no-underline",
                    })
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="signup"
                  className={cn(
                    "cursor-pointer",
                    buttonVariants({
                      variant: "default",
                      size: "sm",
                      className: "!no-underline",
                    })
                  )}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <Link
                href="/bezs"
                className={cn(
                  "cursor-pointer",
                  buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "!no-underline",
                  })
                )}
              >
                Open
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};

export default RootNavBarPage;
