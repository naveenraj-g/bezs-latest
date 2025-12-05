"use client";

import { useEffect, useState } from "react";
import { DoctorReviewModal, BookAppointmentModal } from "../modals/patient";

export const PatientModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <DoctorReviewModal />
      <BookAppointmentModal />
    </>
  );
};
