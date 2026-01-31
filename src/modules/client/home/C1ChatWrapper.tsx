"use client";

import "@crayonai/react-ui/styles/index.css";
import {
  C1Chat,
  useThreadListManager,
  useThreadManager,
} from "@thesysai/genui-sdk";
import { themePresets } from "@crayonai/react-ui";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import {
  addMessages,
  upsertMessage,
  createThread,
  deleteThread,
  deleteThreadsOlderThanOneDay,
  getThreadList,
  getUIThreadMessages,
  updateMessage,
  updateThread,
} from "./threadService";
import HomeChatNavBar from "./NavBar";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

export function C1ChatWrapper({ session }: { session: any }) {
  const { resolvedTheme } = useTheme();

  const searchParams = useSearchParams();
  const threadIdInUrl = searchParams?.get("threadId");
  const pathname = usePathname();
  const { replace } = useRouter();
  const persistedMessageIdsRef = useRef<Set<string>>(new Set());

  /**
   * 🔥 CLEANUP OLD THREADS ON LOAD
   */
  useEffect(() => {
    deleteThreadsOlderThanOneDay().catch(console.error);
  }, []);

  /**
   * THREAD LIST MANAGER (IndexedDB)
   */
  const threadListManager = useThreadListManager({
    fetchThreadList: async () => {
      const threads = await getThreadList();
      if (threadIdInUrl) {
        const threadExists = threads.some((t) => t.threadId === threadIdInUrl);
        if (!threadExists) replace(pathname);
      }
      return threads;
    },

    createThread: async (message) => {
      const newThread = await createThread(message.message!);
      return newThread;
    },

    deleteThread: async (threadId) => {
      if (threadId === threadIdInUrl) replace(pathname);
      await deleteThread(threadId);
    },

    updateThread: async (t) => {
      console.log({ t });
      const updatedThread = await updateThread({
        name: t.title,
        threadId: t.threadId,
      });
      return updatedThread;
    },

    onSwitchToNew: () => {
      replace(pathname);
    },

    onSelectThread: (threadId) => {
      replace(`${pathname}?threadId=${threadId}`);
    },
  });

  /**
   * THREAD MESSAGE MANAGER (IndexedDB)
   */
  const threadManager = useThreadManager({
    threadListManager,

    loadThread: async (threadId) => {
      const messages = await getUIThreadMessages(threadId);
      console.log(messages);
      return messages;
    },

    onUpdateMessage: async ({ message }) => {
      await updateMessage(threadListManager.selectedThreadId!, message);
    },
    onAction(event) {},
    customizeC1: {},
    apiUrl: "/api/chat",
  });

  /**
   * 🔄 RESTORE THREAD FROM URL
   */
  useEffect(() => {
    if (threadIdInUrl && threadListManager.selectedThreadId !== threadIdInUrl) {
      threadListManager.selectThread(threadIdInUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const threadId = threadListManager.selectedThreadId;
    if (!threadId) return;

    const persistMessages = async () => {
      for (const message of threadManager.messages) {
        if (!message.id) continue;

        // 🛑 Skip if already persisted
        if (persistedMessageIdsRef.current.has(message.id)) continue;

        // ✅ Persist (upsert, not add)
        await upsertMessage(threadId, message);

        // ✅ Mark as persisted
        persistedMessageIdsRef.current.add(message.id);
      }
    };

    persistMessages().catch(console.error);
  }, [threadManager.messages, threadListManager.selectedThreadId]);

  return (
    <div className="flex flex-col h-screen">
      <HomeChatNavBar session={session} />

      <C1Chat
        threadManager={threadManager}
        threadListManager={threadListManager}
        formFactor="full-page"
        agentName="DrGodly"
        logoUrl="/drgodly-logo.png"
        theme={{
          ...themePresets.carbon,
          mode: resolvedTheme?.includes("dark") ? "dark" : "light",
        }}
      />
    </div>
  );
}
