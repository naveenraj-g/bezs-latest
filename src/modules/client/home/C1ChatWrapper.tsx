"use client";

import { C1Chat, ThemeProvider } from "@thesysai/genui-sdk";
import { themePresets } from "@crayonai/react-ui";
import "@crayonai/react-ui/styles/index.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import HomeChatNavBar from "./NavBar";

export function C1ChatWrapper({ session }: { session: any }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* <ThemeProvider
        theme={themePresets.carbon.theme}
        darkTheme={themePresets.carbon.darkTheme}
        mode={resolvedTheme?.includes("dark") ? "dark" : "light"}
      > */}
      <HomeChatNavBar session={session} />
      <C1Chat
        apiUrl="/api/chat"
        formFactor="full-page"
        agentName="DrGodly"
        logoUrl="/drgodly-logo.png"
        theme={{
          ...themePresets.carbon,
          mode: resolvedTheme?.includes("dark") ? "dark" : "light",
        }}
      />
      {/* </ThemeProvider> */}
    </div>
  );
}
