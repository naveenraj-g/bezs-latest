import { redirect } from "@/i18n/navigation";
import Chat from "@/modules/client/aihub/components/Chat";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";
import { getLocale } from "next-intl/server";

async function ChatPage() {
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

  return (
    <div>
      <Chat />
    </div>
  );
}

export default ChatPage;
