import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";
// import { MediaRoom } from "@/modules/telemedicine/ui/video/media-room";
import { redirect } from "@/i18n/navigation";
import { getAppointmentForOnlineConsultation } from "@/modules/client/telemedicine/server-actions/appointment-action";
import { getLocale } from "next-intl/server";
import Consult from "@/modules/client/telemedicine/components/patient/online-consultation/Consult";

const PatientOnlineConsultationPage = async (
  props: PageProps<"/[locale]/bezs/telemedicine/patient/appointments/online-consultation">
) => {
  const session = await getServerSession();
  const locale = await getLocale();
  const params = await props.searchParams;

  const appointmentId = params.appointmentId as string;

  if (!session || !session.user.currentOrgId) {
    redirect({ href: "/", locale });
    return;
  }

  const [data, error] = await getAppointmentForOnlineConsultation({
    appointmentId,
    orgId: session?.user.currentOrgId,
    userId: session?.user.id,
  });

  if (!data && error) {
    return (
      <div>
        <h1>Appointment not found</h1>
      </div>
    );
  }

  const participant = {
    name: `${data?.patient.personal?.name} (Patient)` || "Patient",
  };

  const details = {
    doctor: {
      name: data.doctor.personal?.fullName,
      speciality: "unknown",
    },
    patient: {
      name: data.patient.personal?.name,
    },
  };

  return (
    <>
      <div>
        <Consult
          participant={participant}
          roomId={data.virtualRoomId!}
          details={details}
        />
      </div>
    </>
  );
};

export default PatientOnlineConsultationPage;
