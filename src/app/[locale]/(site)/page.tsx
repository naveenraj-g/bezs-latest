// import { redirect } from "@/i18n/navigation";
import { C1ChatWrapper } from "@/modules/client/home/C1ChatWrapper";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";
// import { prismaTelemedicine } from "@/modules/server/prisma/prisma";
// import { getLocale } from "next-intl/server";

async function ChatPage() {
  const session = await getServerSession();
  // const locale = await getLocale();

  // if (session) {
  //   const user = {
  //     id: session.user.id,
  //     name: session.user.name,
  //     username: session.user.username,
  //     email: session.user.email,
  //     orgId: session.user.currentOrgId,
  //   };

  //   if (session.user.role === "patient" && user.orgId) {
  //     const patient = await prismaTelemedicine.patient.findUnique({
  //       where: {
  //         orgId_userId: {
  //           orgId: user.orgId,
  //           userId: user.id,
  //         },
  //       },
  //       include: {
  //         personal: true,
  //       },
  //     });

  //     // TODO: instead of redirect render patient profile here
  //     if (!patient || !patient.personal) {
  //       redirect({
  //         href: "/bezs/telemedicine/patient/profile?redirect=/",
  //         locale,
  //       });
  //       return;
  //     }
  //   }
  // }

  return <C1ChatWrapper session={session} />;
}

export default ChatPage;
