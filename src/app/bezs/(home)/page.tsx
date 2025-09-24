"use client";

import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/modules/auth/betterauth/auth-client";

const BezsPage = () => {
  const { data } = useSession();
  console.log(data?.user);

  async function createNewOauth2Client() {
    const { data } = await authClient.oauth2.register({
      redirect_uris: ["http://localhost:3001"],
      client_name: "Test client app",
      client_uri: "http://localhost:3001",
      grant_types: ["authorization_code"],
      response_types: ["code"],
      scope: "profile email password",
    });
    console.log(data);
  }
  return (
    <div>
      <h1>Bezs Page</h1>
      <Button onClick={createNewOauth2Client}>Register Oauth2 Client</Button>
    </div>
  );
};

export default BezsPage;
