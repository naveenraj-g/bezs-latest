import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";

const BezsPage = async () => {
  const session = await getServerSession();
  // console.log(session);

  return (
    <div className="h-full p-4">
      <h1>Bezs</h1>
    </div>
  );
};

export default BezsPage;
