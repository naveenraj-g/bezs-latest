import AiIntake from "@/modules/client/telemedicine/components/patient/AiIntake";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";
import { preIntakeAppointmentPrompt } from "../../../data/prompt";

async function PatintAskAIPage() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };

  const appointmentData = {
    assistant: {
      voiceId: "will",
      agentPrompt: preIntakeAppointmentPrompt,
    },
    patient: {
      name: session.user.name,
      age: "23",
    },
  };

  return (
    <>
      <AiIntake user={user} appointmentData={appointmentData} />
    </>
  );
}

export default PatintAskAIPage;
