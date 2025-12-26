import { redirect } from "@/i18n/navigation";
import PatientDashboard from "@/modules/client/telemedicine/components/patient/dashboard/PatientDashboard";
import { getDashboardAppointmentsDataAction } from "@/modules/client/telemedicine/server-actions/dashboard-actions";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";
import { getLocale } from "next-intl/server";

async function PatientDashboardPage() {
  const session = await getServerSession();
  const locale = await getLocale();

  if (!session || !session.user.currentOrgId) {
    redirect({ href: "/signin", locale });
    return;
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    orgId: session.user.currentOrgId,
  };

  const [data, error] = await getDashboardAppointmentsDataAction({
    orgId: user.orgId,
    userId: user.id,
  });

  return (
    <div>
      <PatientDashboard dashboardData={data} error={error} user={user} />
    </div>
  );
}

export default PatientDashboardPage;
