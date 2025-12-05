import DoctorProfileAndRegister from "@/modules/client/telemedicine/components/step-form/doctor/step-form";
import { getDoctorDataByUserId } from "@/modules/client/telemedicine/server-actions/doctorProfile-actions";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";

async function DoctorProfilePage() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    currentOrgId: session.user.currentOrgId,
  };

  const [data, error] = await getDoctorDataByUserId({
    userId: session.user.id,
    orgId: session.user.currentOrgId || "",
  });

  if (!data) {
    throw new Error("UNAUTHORIZED");
  }

  return (
    <div>
      <DoctorProfileAndRegister
        doctorData={data}
        id={data.id}
        user={user}
        isUpdate
      />
    </div>
  );
}

export default DoctorProfilePage;

/* 
id: string;
    name: string;
    username?: string | null;
    currentOrgId?: string | null;
*/
