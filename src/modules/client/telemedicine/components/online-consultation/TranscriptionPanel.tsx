"use client";

import { Room, RoomEvent } from "livekit-client";
import { useEffect, useState } from "react";

export function TranscriptPanel({ room }: { room: Room | null }) {
  const [lines, setLines] = useState<
    { speaker: string; text: string; ts: number }[]
  >([]);

  useEffect(() => {
    if (!room) return;

    const onText = (msg: any) => {
      try {
        // We’ll send JSON from the agent
        const payload = JSON.parse(new TextDecoder().decode(msg.message));
        if (payload?.type === "transcript") {
          setLines((prev) => [
            ...prev,
            {
              speaker: payload.speaker ?? "Unknown",
              text: payload.text ?? "",
              ts: Date.now(),
            },
          ]);
        }
      } catch {
        // ignore non-JSON messages
      }
    };

    room.on(RoomEvent.DataReceived, onText);
    return () => {
      room.off(RoomEvent.DataReceived, onText);
    };
  }, [room]);

  return (
    <div className="w-full md:w-80 h-72 md:h-full overflow-y-auto p-3 border rounded-lg">
      <div className="font-semibold mb-2">Live Transcription</div>
      <div className="space-y-2 text-sm">
        {lines.map((l, i) => (
          <div key={i}>
            <span className="font-medium">{l.speaker}:</span>{" "}
            <span>{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
