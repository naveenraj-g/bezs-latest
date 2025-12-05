import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";
// import { MediaRoom } from "@/modules/telemedicine/ui/video/media-room";
import { redirect } from "@/i18n/navigation";
import { getAppointmentForOnlineConsultation } from "@/modules/client/telemedicine/server-actions/appointment-action";
import { getLocale } from "next-intl/server";

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

  console.log(data, error);

  return (
    <>
      <div className="h-[500px]">
        {/* <MediaRoom
            chatId={params.roomId}
            name={appointmentData?.patient.name || ""}
            audio={true}
            video={true}
          /> */}
        <h1>Media Room</h1>
      </div>
    </>
  );
};

export default PatientOnlineConsultationPage;
