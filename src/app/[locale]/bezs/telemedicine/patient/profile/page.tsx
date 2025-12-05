import { PatientProfilePersonalDetails } from "@/modules/client/telemedicine/components/patient/patientProfilePersonalDetails";
import {
  createPatientInitialProfile,
  getPatientWithPersonalProfile,
} from "@/modules/client/telemedicine/server-actions/patientProfile-actions";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";

async function PatientProfilePage() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const [patientWithPersonalProfileData, error] =
    await getPatientWithPersonalProfile({
      orgId: session.user.currentOrgId!,
      userId: session.user.id,
    });

  let createInitialProfileErrorMessage: string | undefined = undefined;

  if (!patientWithPersonalProfileData && !error) {
    const [_, error] = await createPatientInitialProfile({
      orgId: session.user.currentOrgId!,
      userId: session.user.id,
      isABHAPatientProfile: false,
      createdBy: session.user.id,
    });

    if (error) {
      createInitialProfileErrorMessage = error.message;
    }
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    currentOrgId: session.user.currentOrgId,
  };

  return (
    <div>
      <PatientProfilePersonalDetails
        user={user}
        data={patientWithPersonalProfileData}
        errorMessage={error?.message ?? createInitialProfileErrorMessage}
      />
    </div>
  );
}

export default PatientProfilePage;
