import { getServerSession } from "@/modules/server/auth/betterauth/auth-server";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();

  return (
    <>
      <div className="relative min-h-screen overflow-x-hidden">
        <main>{children}</main>
      </div>
    </>
  );
};

export default HomeLayout;
