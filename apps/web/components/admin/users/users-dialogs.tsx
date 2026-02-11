"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { Textarea } from "../../ui/textarea";

export type UsersDialog =
  | null
  | "new-user"
  | "review-onboarding"
  | "assign-program";

type UsersDialogsProps = {
  active: UsersDialog;
  onClose: () => void;
  selectedUserId?: number | null;
};

export function UsersDialogs({ active, onClose, selectedUserId }: UsersDialogsProps) {
  const [onboarding, setOnboarding] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [programTier, setProgramTier] = useState("PHP");

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!selectedUserId || (active !== "review-onboarding" && active !== "assign-program")) return;
      const res = await fetch(`/api/backend/admin/users/${selectedUserId}/onboarding`);
      if (!res.ok) return;
      const data = await res.json();
      if (mounted) setOnboarding(data);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [selectedUserId, active]);
  return (
    <Dialog open={active !== null} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {active === "new-user" && "Create New User"}
            {active === "review-onboarding" && "Review Onboarding"}
            {active === "assign-program" && "Assign Program"}
          </DialogTitle>
          <DialogDescription>
            {selectedUserId ? `Selected user #${selectedUserId}` : "Select a user."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          {active === "new-user" ? (
            <>
              <Input placeholder="Athlete name" />
              <Input placeholder="Parent email" />
              <Select>
                <option>Program tier</option>
                <option>PHP Program</option>
                <option>PHP Plus</option>
                <option>PHP Premium</option>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onClose}>Create</Button>
              </div>
            </>
          ) : null}
          {active === "review-onboarding" ? (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-2xl border border-border bg-secondary/20 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age / Team:</span>
                  <span className="font-medium">
                    {onboarding?.athlete?.age ?? "--"} / {onboarding?.athlete?.team ?? "--"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Training Days:</span>
                  <span className="font-medium">
                    {onboarding?.athlete?.trainingPerWeek ?? "--"} days/week
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Injuries:</span>
                  <span className="font-medium">
                    {onboarding?.athlete?.injuries ? JSON.stringify(onboarding.athlete.injuries) : "None"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goals:</span>
                  <span className="font-medium">
                    {onboarding?.athlete?.performanceGoals ?? "--"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Equipment:</span>
                  <span className="font-medium">
                    {onboarding?.athlete?.equipmentAccess ?? "--"}
                  </span>
                </div>
              </div>
              <Textarea placeholder="Coach feedback or notes" />
              <Select value={programTier} onChange={(e) => setProgramTier(e.target.value)}>
                <option value="PHP">Approve & Assign PHP</option>
                <option value="PHP_Plus">Approve & Assign PHP Plus</option>
                <option value="PHP_Premium">Approve & Assign Premium</option>
              </Select>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedUserId) return;
                    setError(null);
                    const res = await fetch(`/api/backend/admin/users/program-tier`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ athleteId: onboarding?.athlete?.id, programTier }),
                    });
                    if (!res.ok) {
                      setError("Failed to update tier");
                      return;
                    }
                    onClose();
                  }}
                >
                  Finalize Review
                </Button>
              </div>
            </div>
          ) : null}
          {active === "assign-program" ? (
            <>
              <Select value={programTier} onChange={(e) => setProgramTier(e.target.value)}>
                <option value="PHP">PHP Program</option>
                <option value="PHP_Plus">PHP Plus</option>
                <option value="PHP_Premium">PHP Premium</option>
              </Select>
              <Textarea placeholder="Assignment notes" />
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedUserId) return;
                    setError(null);
                    const res = await fetch(`/api/backend/admin/enrollments`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ athleteId: onboarding?.athlete?.id, programType: programTier }),
                    });
                    if (!res.ok) {
                      setError("Failed to assign program");
                      return;
                    }
                    onClose();
                  }}
                >
                  Assign
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
