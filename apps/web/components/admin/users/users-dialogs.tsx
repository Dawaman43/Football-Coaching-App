"use client";

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
  selectedName?: string | null;
};

export function UsersDialogs({ active, onClose, selectedName }: UsersDialogsProps) {
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
            {selectedName ? `Selected: ${selectedName}` : "UI-only for now."}
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
                  <span className="text-muted-foreground">Age / Level:</span>
                  <span className="font-medium">14 / U15 Academy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Training Days:</span>
                  <span className="font-medium">4 days/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Injuries:</span>
                  <span className="font-medium text-destructive">Osgood-Schlatter (Left Knee)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goals:</span>
                  <span className="font-medium">Improve explosiveness & speed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Equipment:</span>
                  <span className="font-medium">Full gym access</span>
                </div>
              </div>
              <Textarea placeholder="Coach feedback or notes" />
              <Select>
                <option>Approve or request changes</option>
                <option>Approve & Assign Tier</option>
                <option>Request Clarification</option>
                <option>Deny</option>
              </Select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onClose}>Finalize Review</Button>
              </div>
            </div>
          ) : null}
          {active === "assign-program" ? (
            <>
              <Select>
                <option>Assign template</option>
                <option>PHP Program Week 1</option>
                <option>PHP Plus Week 1</option>
                <option>PHP Premium Custom</option>
              </Select>
              <Textarea placeholder="Assignment notes" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onClose}>Assign</Button>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
