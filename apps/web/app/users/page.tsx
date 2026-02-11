"use client";

import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "../../components/admin/shell";
import { EmptyState } from "../../components/admin/empty-state";
import { SectionHeader } from "../../components/admin/section-header";
import { UsersDialogs, type UsersDialog } from "../../components/admin/users/users-dialogs";
import { UsersFilters } from "../../components/admin/users/users-filters";
import { UsersTable } from "../../components/admin/users/users-table";
import { UsersCards } from "../../components/admin/users/users-cards";
import { OnboardingQueue } from "../../components/admin/users/onboarding-queue";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";

const fallbackUsers = [
  {
    name: "Ava Patterson",
    tier: "Premium",
    status: "Active",
    lastActive: "Today",
    onboarding: "Complete",
  },
  {
    name: "Jordan Miles",
    tier: "Plus",
    status: "Active",
    lastActive: "Yesterday",
    onboarding: "Complete",
  },
  {
    name: "Liam Rivers",
    tier: "Plus",
    status: "Pending",
    lastActive: "2 days ago",
    onboarding: "Awaiting review",
  },
  {
    name: "Maya Chen",
    tier: "Program",
    status: "Active",
    lastActive: "3 days ago",
    onboarding: "Complete",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(fallbackUsers);
  const [isLoading, setIsLoading] = useState(false);
  const hasUsers = users.length > 0;
  const [activeDialog, setActiveDialog] = useState<UsersDialog>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState<string>("All");
  const chips = ["All", "Premium", "Plus", "Program", "Pending"];

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/backend/admin/users");
        if (!res.ok) return;
        const data = await res.json();
        const mapped = (data.users ?? []).map((user: any) => ({
          name: user.name ?? user.email,
          tier: user.role === "admin" || user.role === "superAdmin" ? "Admin" : "Program",
          status: "Active",
          lastActive: "Recently",
          onboarding: "Complete",
        }));
        if (mounted && mapped.length) setUsers(mapped);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    if (activeChip === "All") return users;
    if (activeChip === "Pending") {
      return users.filter((user) => user.onboarding !== "Complete");
    }
    return users.filter((user) => user.tier === activeChip);
  }, [activeChip]);

  const onboardingQueue = useMemo(
    () => users.filter((user) => user.onboarding !== "Complete"),
    []
  );

  return (
    <AdminShell
      title="Users"
      subtitle="Manage athletes, parents, and onboarding."
      actions={<Button onClick={() => setActiveDialog("new-user")}>New User</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <SectionHeader title="All Users" actionLabel="Export" />
          </CardHeader>
          <CardContent className="space-y-4">
            <UsersFilters chips={chips} onChipSelect={setActiveChip} />
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
                Loading users...
              </div>
            ) : hasUsers ? (
              <>
                <UsersTable users={filteredUsers} onSelect={setSelectedUser} />
                <UsersCards users={filteredUsers} onSelect={setSelectedUser} />
              </>
            ) : (
              <EmptyState
                title="No users yet"
                description="New athletes will appear once they onboard."
                actionLabel="Invite Athlete"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionHeader
              title="Onboarding Queue"
              description="Awaiting approvals and assignments."
            />
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
                Loading queue...
              </div>
            ) : (
              <OnboardingQueue
                items={onboardingQueue}
                onReview={(name) => {
                  setSelectedUser(name);
                  setActiveDialog("review-onboarding");
                }}
                onAssign={(name) => {
                  setSelectedUser(name);
                  setActiveDialog("assign-program");
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <UsersDialogs
        active={activeDialog}
        onClose={() => setActiveDialog(null)}
        selectedName={selectedUser}
      />
    </AdminShell>
  );
}
