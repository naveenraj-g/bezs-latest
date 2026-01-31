import { get, set, del, keys, createStore } from "idb-keyval";
import { Thread } from "@crayonai/react-core";
import type { ChatCompletionMessageParam } from "openai/resources.mjs";

/**
 * Custom IndexedDB store
 */
const threadStore = createStore("chat-db", "threads");

export type Message = ChatCompletionMessageParam & {
  id: string;
};

type StoredThread = {
  id: string;
  name: string;
  createdAt: Date;
  messages: Message[];
};

export const createThread = async (name: string): Promise<Thread> => {
  const id = crypto.randomUUID();

  const thread: StoredThread = {
    id,
    name,
    createdAt: new Date(),
    messages: [],
  };

  await set(id, thread, threadStore);

  return {
    threadId: thread.id,
    title: thread.name,
    createdAt: thread.createdAt,
  };
};

export const getThreadList = async (): Promise<Thread[]> => {
  const threadIds = await keys(threadStore);

  const threads = await Promise.all(
    threadIds.map(async (id) => get<StoredThread>(id as string, threadStore)),
  );

  return threads.filter(Boolean).map((thread) => ({
    threadId: thread!.id,
    title: thread!.name,
    createdAt: thread!.createdAt,
  }));
};

export const addMessages = async (threadId: string, ...messages: Message[]) => {
  const thread = await get<StoredThread>(threadId, threadStore);

  if (!thread) throw new Error("Thread not found");

  thread.messages = [...(thread.messages ?? []), ...messages];

  await set(threadId, thread, threadStore);
};

export const upsertMessage = async (threadId: string, message: Message) => {
  const thread = await get<StoredThread>(threadId, threadStore);
  if (!thread) return;

  const messages = thread.messages ?? [];

  const index = messages.findIndex((m) => m.id === message.id);

  if (index === -1) {
    // 🆕 First time assistant message
    messages.push(message);
  } else {
    // 🔄 Streaming update
    messages[index] = message;
  }

  await set(threadId, { ...thread, messages }, threadStore);
};

export const getUIThreadMessages = async (
  threadId: string,
): Promise<Message[]> => {
  const thread = await get<StoredThread>(threadId, threadStore);

  if (!thread) throw new Error("Thread not found");

  const uiMessages = (thread.messages ?? []).filter(
    (msg) =>
      !(msg.role === "tool" || (msg.role === "assistant" && msg.tool_calls)),
  );

  return uiMessages;
};

export const getLLMThreadMessages = async (
  threadId: string,
): Promise<ChatCompletionMessageParam[]> => {
  const thread = await get<StoredThread>(threadId, threadStore);

  if (!thread) throw new Error("Thread not found");

  return (thread.messages ?? []).map(({ id, ...msg }) => msg);
};

export const updateMessage = async (
  threadId: string,
  updatedMessage: Message,
): Promise<void> => {
  const thread = await get<StoredThread>(threadId, threadStore);

  if (!thread) throw new Error("Thread not found");

  const index = thread.messages.findIndex(
    (msg) => msg.id === updatedMessage.id,
  );

  if (index === -1) {
    console.warn(`Message ${updatedMessage.id} not found`);
    return;
  }

  thread.messages[index] = updatedMessage;

  await set(threadId, thread, threadStore);
};

export const updateThread = async (thread: {
  threadId: string;
  name: string;
}): Promise<Thread> => {
  const stored = await get<StoredThread>(thread.threadId, threadStore);

  if (!stored) throw new Error("Thread not found");

  stored.name = thread.name;

  await set(thread.threadId, stored, threadStore);

  return {
    threadId: stored.id,
    title: stored.name,
    createdAt: stored.createdAt,
  };
};

export const deleteThread = async (threadId: string): Promise<void> => {
  await del(threadId, threadStore);
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const deleteThreadsOlderThanOneDay = async (): Promise<number> => {
  const now = Date.now();
  const threadIds = await keys(threadStore);

  let deletedCount = 0;

  for (const id of threadIds) {
    const thread = await get<StoredThread>(id as string, threadStore);

    if (!thread) continue;

    const createdAt =
      thread.createdAt instanceof Date
        ? thread.createdAt.getTime()
        : new Date(thread.createdAt).getTime();

    if (now - createdAt > ONE_DAY_MS) {
      await del(id as string, threadStore);
      deletedCount++;
    }
  }

  return deletedCount;
};
