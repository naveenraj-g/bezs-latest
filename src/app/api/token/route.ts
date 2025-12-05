import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  const { roomName, identity, name, isDoctor } = await req.json();

  if (!roomName || !identity || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY!;
  const apiSecret = process.env.LIVEKIT_API_SECRET!;
  const lkUrl = process.env.LIVEKIT_URL!;

  // Build access token with scoped permissions
  const at = new AccessToken(apiKey, apiSecret, {
    identity, // must be unique per participant in a room
    name, // display name shown to others
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    // optional: data/text stream permission (enabled by default in latest SDKs)
  });

  const jwt = await at.toJwt();

  return NextResponse.json({
    url: lkUrl,
    token: jwt,
    role: isDoctor ? "doctor" : "patient",
  });
}
