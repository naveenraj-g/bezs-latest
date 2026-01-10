import { C1ChatWrapper } from "@/modules/client/home/C1ChatWrapper";
import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";

async function ChatPage() {
  const session = await getServerSession();

  return <C1ChatWrapper session={session} />;
}

export default ChatPage;
