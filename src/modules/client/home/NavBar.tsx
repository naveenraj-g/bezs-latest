"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "@/i18n/navigation";
import { HomeNavUser } from "./components/HomeNavUser";

function HomeChatNavBar({ session }: { session: any }) {
  const router = useRouter();

  const user = {
    name: session?.user.name,
    email: session?.user.email,
    image: session?.user.image,
    username: session?.user.username,
    currentOrgId: session?.user.currentOrgId,
    role: session?.user.role,
  };

  console.log(session);

  const handleOpenApp = () => {
    if (session?.user) {
      const role = session.user.role;
      const roleBasedRedirectUrls = (session as any)?.user
        ?.roleBasedRedirectUrls;
      if (role && roleBasedRedirectUrls) {
        router.push(roleBasedRedirectUrls);
      } else {
        router.push("/bezs");
      }
    } else {
      router.push("/signin");
    }
  };

  return (
    <div className="flex items-center justify-end gap-4 px-4 py-2">
      {session && <HomeNavUser user={user} />}
      <Button onClick={handleOpenApp} size="sm" className="rounded-full px-6">
        {session?.user ? "Open App" : "Sign In"}
      </Button>
    </div>
  );
}

export default HomeChatNavBar;
