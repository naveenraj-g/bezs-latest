"use client";

import { useEffect, useState } from "react";
import { CreateAppModal } from "../modals/create-app-modal";

export const AdminModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateAppModal />
    </>
  );
};
