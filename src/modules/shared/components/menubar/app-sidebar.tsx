"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "../nav-user";
import { AppTitle } from "./app-title";
import { usePathname } from "@/i18n/navigation";
import { OrgSwitcher } from "./org-switcher";
import { homeSidebarData } from "./menu-datas";
import { useSession } from "@/modules/client/auth/betterauth/auth-client";
import { useEffect, useState } from "react";
import { getRolewiseAppMenuItems } from "./utils";
import { Loader2 } from "lucide-react";

type TUser = {
  name: string;
  email: string;
  image?: string | null;
  username?: string | null;
  currentOrgId?: string | null;
};

type TOrgs = {
  name: string;
  id: string;
  metadata: string | null;
  slug: string;
  logo: string | null;
}[];

const MENU_ITEMS = {
  navGroups: [
    {
      title: "Menu Items",
      items: [],
    },
  ],
};

const LOADING_ITEMS = {
  navGroups: [
    {
      title: "Loading Menu Items...",
      items: [
        {
          title: "Loading...",
          icon: "loader-circle",
          isLoading: true,
        },
      ],
    },
  ],
};

const roleBasedApps = ["telemedicine", "admin", "filenest", "aihub"];

export function AppSidebar({ user, orgs }: { user: TUser; orgs: TOrgs }) {
  const pathname = usePathname();
  const { data, isPending } = useSession();

  const [menuItems, setMenuItems] = useState<any>(MENU_ITEMS);
  const [error, setError] = useState<string | null>(null);

  const segments = pathname.split("/").filter(Boolean);
  const appSlug = segments[1] ?? "";
  const isHome =
    pathname === "/bezs" ||
    pathname === "/bezs/" ||
    !roleBasedApps.includes(appSlug);

  useEffect(() => {
    if (isHome) {
      setError(null);
      setMenuItems(homeSidebarData);
      return;
    }

    if (isPending) {
      setMenuItems(MENU_ITEMS);
      return;
    }

    const rolewiseAppMenus = getRolewiseAppMenuItems(data?.userRBAC, appSlug);

    if (!rolewiseAppMenus || rolewiseAppMenus.length === 0) {
      setError("Failed to get menu data");
      setMenuItems({
        navGroups: [{ title: "Menu Items", items: [] }],
      });
      return;
    }

    const items = {
      navGroups: [
        {
          title: "Menu Items",
          items: rolewiseAppMenus
            .map((item) => {
              if (item.icon === "" || !item.icon) {
                return null;
              }
              return {
                title: item.name,
                url: item.slug,
                icon: item.icon,
              };
            })
            .filter((i) => Boolean(i)),
        },
      ],
    };

    setMenuItems(items);
    setError(null);
  }, [appSlug, isHome, isPending, data?.userRBAC]);

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader>
        {orgs.length > 0 ? (
          <OrgSwitcher orgs={orgs} currentOrgId={user?.currentOrgId} />
        ) : (
          <AppTitle />
        )}
      </SidebarHeader>
      <SidebarContent>
        {!error &&
          !isPending &&
          menuItems.navGroups.map((props: any) => (
            <NavGroup key={props.title} {...props} />
          ))}
        {error && <div className="px-4 text-sm">{error}</div>}
        {!isHome &&
          !error &&
          isPending &&
          // <div className="flex items-center gap-2 px-4 text-sm">
          //   <Loader2 className="animate-spin size-4" /> Loading...
          // </div>
          LOADING_ITEMS.navGroups.map((props: any) => (
            <NavGroup key={props.title} {...props} />
          ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} isSidebar />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
