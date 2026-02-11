"use client";

import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "../../components/admin/shell";
import { SectionHeader } from "../../components/admin/section-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { InboxList } from "../../components/admin/messaging/inbox-list";
import { ConversationPanel } from "../../components/admin/messaging/conversation-panel";
import { MessageDialogs, type MessagingDialog } from "../../components/admin/messaging/message-dialogs";

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

const fallbackThreads: ThreadItem[] = [
  {
    userId: 1,
    name: "Ava Patterson",
    preview: "Knee is sore after practice",
    time: "2m",
    priority: true,
    unread: 2,
    pinned: true,
  },
];

export default function MessagingPage() {
  const [activeDialog, setActiveDialog] = useState<MessagingDialog>(null);
  const [threads, setThreads] = useState<ThreadItem[]>(fallbackThreads);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(fallbackThreads[0]?.userId ?? null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.userId === selectedUserId) ?? null,
    [threads, selectedUserId]
  );

  useEffect(() => {
    let mounted = true;
    async function loadThreads() {
      const res = await fetch("/api/backend/admin/messages/threads");
      if (!res.ok) return;
      const data = await res.json();
      const mapped = (data.threads ?? []).map((thread: any) => ({
        userId: thread.userId,
        name: thread.name,
        preview: thread.preview ?? "",
        time: thread.time ? new Date(thread.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
        priority: (thread.unread ?? 0) > 0,
        unread: thread.unread ?? 0,
      }));
      if (mounted && mapped.length) {
        setThreads(mapped);
        if (!selectedUserId) setSelectedUserId(mapped[0].userId);
      }
    }
    loadThreads();
    return () => {
      mounted = false;
    };
  }, [selectedUserId]);

  useEffect(() => {
    let mounted = true;
    async function loadMessages() {
      if (!selectedUserId || !selectedThread) return;
      const res = await fetch(`/api/backend/admin/messages/${selectedUserId}`);
      if (!res.ok) return;
      const data = await res.json();
      const mapped = (data.messages ?? []).map((msg: any) => ({
        author: msg.senderId === selectedUserId ? selectedThread.name : "Coach",
        time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
        text: msg.content,
        status: msg.read ? "read" : "delivered",
      }));
      if (mounted) setMessages(mapped);
    }
    loadMessages();
    return () => {
      mounted = false;
    };
  }, [selectedUserId, selectedThread]);

  const filteredThreads = useMemo(() => {
    if (activeFilter === "All") return threads;
    if (activeFilter === "Premium") return threads.filter((thread) => thread.priority);
    return threads;
  }, [activeFilter, threads]);

  return (
    <AdminShell
      title="Messaging"
      subtitle="Priority inbox and coach responses."
      actions={<Button onClick={() => setActiveDialog("new-message")}>New Message</Button>}
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
                await fetch(`/api/backend/admin/messages/${selectedUserId}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ content: text }),
                });
                setMessages((prev) => [
                  ...prev,
                  { author: "Coach", time: "Now", text, status: "sent" },
                ]);
              }}
            />
          </CardContent>
        </Card>
      </div>

      <MessageDialogs active={activeDialog} onClose={() => setActiveDialog(null)} />
    </AdminShell>
  );
}
