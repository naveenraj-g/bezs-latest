"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { createMessageProcessor } from "../a2ui/rendering/processor";
import { Renderer } from "../a2ui/rendering/renderer";
import type { AnyComponentNode } from "../a2ui/types";
import { DefaultChatTransport } from "ai";

const processor = createMessageProcessor();

export default function Chat() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, status, sendMessage, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/a2ui",
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseUI = (text: string): AnyComponentNode | null => {
    try {
      return JSON.parse(text) as AnyComponentNode;
    } catch {
      return null;
    }
  };

  return (
    <div className="h-[calc(100vh-162px)] flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                msg.role === "user" && "bg-blue-500 text-white rounded-br-none"
              }`}
            >
              {msg.parts.map((part, index) => {
                if (part.type !== "text") return null;

                if (msg.role === "user") {
                  return (
                    <p
                      key={`${msg.id}-${index}`}
                      className="whitespace-pre-wrap"
                    >
                      {part.text}
                    </p>
                  );
                }

                const ui = parseUI(part.text);
                console.log({ ui });

                return (
                  <div key={`${msg.id}-${index}`} className="my-2">
                    {ui ? (
                      <Renderer
                        processor={processor}
                        surfaceId={`chat-surface-${msg.id}-${index}`}
                        component={ui}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Streaming indicator */}
        {status === "streaming" && (
          <div className="flex justify-start">
            <div className="bg-white border p-4 rounded-lg rounded-bl-none">
              <span className="text-sm text-gray-500 animate-pulse">
                Generating UI…
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the UI you want to generate..."
            className="flex-1 px-4 py-2 border text-black rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={status === "streaming"}
          />
          {status === "streaming" ? (
            <button
              type="button"
              onClick={stop}
              className="px-6 py-2 bg-red-500 text-white rounded-lg"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Generate
            </button>
          )}
        </form>

        <div className="text-xs text-gray-500 text-center mt-2">
          Example: &quot;Create a login form with email and password
          fields&quot;
        </div>
      </div>
    </div>
  );
}
