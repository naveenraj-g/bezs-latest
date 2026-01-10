import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { transformStream } from "@crayonai/stream";
import { DBMessage, getMessageStore } from "./messageStore";
import { telemedicineTools } from "./telemedicine-tools";
import { tools } from "./tools";
import { telemedicineSystemPrompt } from "./prompt";

export async function POST(req: NextRequest) {
  try {
    const { prompt, threadId, responseId } = (await req.json()) as {
      prompt: DBMessage;
      threadId: string;
      responseId: string;
    };

    const client = new OpenAI({
      baseURL: "https://api.thesys.dev/v1/embed/",
      apiKey: process.env.THESYS_API_KEY,
    });

    const messageStore = getMessageStore(threadId);

    // ✅ Add system prompt ONCE when new thread starts
    // if (messageStore.getOpenAICompatibleMessageList().length === 0) {
    //   messageStore.addMessage({
    //     role: "system",
    //     content: telemedicineSystemPrompt,
    //   });
    // }

    messageStore.addMessage(prompt);

    const llmStream = await client.chat.completions.runTools({
      model: "c1/anthropic/claude-sonnet-4/v-20250617",
      messages: [
        { role: "system", content: telemedicineSystemPrompt },
        ...messageStore.getOpenAICompatibleMessageList(),
      ],
      tools,
      tool_choice: "auto",
      stream: true,
    });

    const responseStream = transformStream(
      llmStream,
      (chunk) => {
        // const delta = chunk?.choices?.[0]?.delta;
        // return delta.content;
        return chunk.choices[0]?.delta?.content || "";
      },
      {
        onEnd: ({ accumulated }) => {
          const message = accumulated.filter((message) => message).join("");
          messageStore.addMessage({
            role: "assistant",
            content: message,
            id: responseId,
          });
        },
      }
    ) as ReadableStream;

    return new NextResponse(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.log({ err });
  }
}
