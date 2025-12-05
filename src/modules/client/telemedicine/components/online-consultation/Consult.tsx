"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  ControlBar,
} from "@livekit/components-react";
import { Room } from "livekit-client";
import { TranscriptPanel } from "./TranscriptionPanel";

export default function ConsultPage({
  roomId,
  participant,
}: {
  roomId: string;
  participant: { name?: string; role?: "doctor" | "patient" };
}) {
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [roomObj, setRoomObj] = useState<Room | null>(null);

  const identity = useMemo(
    () =>
      `${participant?.role ?? "patient"}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    [participant?.role]
  );

  useEffect(() => {
    const join = async () => {
      const res = await fetch("/api/token", {
        method: "POST",
        body: JSON.stringify({
          roomName: roomId,
          identity,
          name:
            participant?.name ??
            (participant?.role === "doctor" ? "Doctor" : "Patient"),
          isDoctor: participant?.role === "doctor",
        }),
      });
      const json = await res.json();
      setToken(json.token);
      setUrl(json.url);
    };
    join();
  }, [roomId, identity, participant?.name, participant?.role]);

  if (!token || !url) return <div className="p-6">Connecting…</div>;

  return (
    <div className="h-screen w-full flex">
      <div className="flex-1 flex flex-col">
        <LiveKitRoom
          token={token}
          serverUrl={url}
          connect={true}
          onConnected={(room) => setRoomObj(room)}
          audio={true}
          video={true}
        >
          <div className="flex-1 p-3">
            <GridLayout
              tracks={"camera"}
              style={{ height: "calc(100vh - 140px)" }}
            >
              <ParticipantTile />
            </GridLayout>
          </div>
          <div className="p-3">
            <ControlBar />
          </div>
        </LiveKitRoom>
      </div>

      <div className="hidden md:block w-96 p-3">
        <TranscriptPanel room={roomObj} />
      </div>
    </div>
  );
}
