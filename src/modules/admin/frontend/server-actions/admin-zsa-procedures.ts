import { getServerSession } from "@/modules/auth/betterauth/auth-server";
import { redirect } from "next/navigation";
import { createServerActionProcedure } from "zsa";

export const adminAuthenticatedProcedure =
  createServerActionProcedure().handler(async () => {
    const session = await getServerSession();

    if (!session) {
      redirect("/signin");
    }

    if (session.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return session.user;
  });
