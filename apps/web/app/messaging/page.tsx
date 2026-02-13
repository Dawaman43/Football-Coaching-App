"use client";

import { useEffect, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

import { AdminShell } from "../../components/admin/shell";
import { SectionHeader } from "../../components/admin/section-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { InboxList } from "../../components/admin/messaging/inbox-list";
import { ConversationPanel } from "../../components/admin/messaging/conversation-panel";
import { MessageDialogs, type MessagingDialog } from "../../components/admin/messaging/message-dialogs";
import { useGetMessagesQuery, useGetThreadsQuery, useSendMessageMutation } from "../../lib/apiSlice";

type ThreadItem = {
  userId: number;
  name: string;
  preview: string;
  time: string;
  priority: boolean;
  unread?: number;
  pinned?: boolean;
};

type MessageItem = {
  author: string;
  time: string;
  text: string;
  status?: "sent" | "delivered" | "read";
};

export default function MessagingPage() {
  const [activeDialog, setActiveDialog] = useState<MessagingDialog>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const { data: threadsData } = useGetThreadsQuery();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const threads = useMemo<ThreadItem[]>(() => {
    const source = threadsData?.threads ?? [];
    return source.map((thread: any) => ({
      userId: thread.userId,
      name: thread.name,
      preview: thread.preview ?? "",
      time: thread.time ? new Date(thread.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
      priority: (thread.unread ?? 0) > 0,
      unread: thread.unread ?? 0,
    }));
  }, [threadsData]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.userId === selectedUserId) ?? null,
    [threads, selectedUserId]
  );

  useEffect(() => {
    if (!selectedUserId && threads.length) {
      setSelectedUserId(threads[0].userId);
    }
  }, [selectedUserId, threads]);

  const {
    data: messagesData,
    refetch: refetchMessages,
  } = useGetMessagesQuery(selectedUserId ?? skipToken);

  const messages = useMemo<MessageItem[]>(() => {
    if (!selectedThread) return [];
    const source = messagesData?.messages ?? [];
    return source.map((msg: any) => ({
      author: msg.senderId === selectedUserId ? selectedThread.name : "Coach",
      time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
      text: msg.content,
      status: msg.read ? "read" : "delivered",
    }));
  }, [messagesData, selectedThread, selectedUserId]);

  const filteredThreads = useMemo(() => {
    if (activeFilter === "All") return threads;
    if (activeFilter === "Premium") return threads.filter((thread) => thread.priority);
    return threads;
  }, [activeFilter, threads]);

  return (
    <AdminShell
      title="Messaging"
      subtitle="Priority inbox and coach responses."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="h-full">
          <CardHeader>
            <SectionHeader title="Inbox" description="Priority messages are pinned." />
          </CardHeader>
          <CardContent>
            <InboxList
              threads={filteredThreads}
              selected={selectedUserId}
              onSelect={setSelectedUserId}
              onFilterSelect={setActiveFilter}
            />
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <SectionHeader
              title={selectedThread?.name ?? "Conversation"}
              description={selectedThread ? "Active" : "Select a thread"}
            />
          </CardHeader>
          <CardContent>
            <ConversationPanel
              name={selectedThread?.name ?? null}
              messages={messages}
              profile={null}
              onSend={async (text) => {
                if (!selectedUserId) return;
                if (isSending) return;
                await sendMessage({ userId: selectedUserId, content: text }).unwrap();
                refetchMessages();
              }}
            />
          </CardContent>
        </Card>
      </div>

      <MessageDialogs active={activeDialog} onClose={() => setActiveDialog(null)} />
    </AdminShell>
  );
}
