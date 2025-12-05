import { BookAppointment } from "@/modules/client/telemedicine/components/patient/appointments/bookAppointment/book-appointment";
import { getDoctorsByOrg } from "@/modules/client/telemedicine/server-actions/doctor-action";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";
import React from "react";

async function BookAppointmentPage() {
  const session = await getServerSession();

  if (!session || !session.user.currentOrgId) {
    throw new Error("UNAUTHORIZED");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    orgId: session.user?.currentOrgId,
  };

  const [data, error] = await getDoctorsByOrg({ orgId: user.orgId });

  return (
    <>
      <BookAppointment doctorsData={data} error={error} user={user} />
    </>
  );
}

export default BookAppointmentPage;
