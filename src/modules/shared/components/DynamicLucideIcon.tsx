"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

type IconName = keyof typeof dynamicIconImports;

// cache per icon name so we only create each wrapper once
const iconCache: Partial<Record<IconName, ComponentType<LucideProps>>> = {};

export default function DynamicIcon({
  name,
  ...props
}: { name: IconName } & LucideProps) {
  const Icon =
    iconCache[name] ||
    (iconCache[name] = dynamic(dynamicIconImports[name], {
      ssr: false,
      loading: () => <div>...</div>,
    }));

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
}
