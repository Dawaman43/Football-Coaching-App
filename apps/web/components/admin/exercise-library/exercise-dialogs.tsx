"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select } from "../../ui/select";
import { Textarea } from "../../ui/textarea";

export type ExerciseDialog = null | "add" | "edit";

type ExerciseDialogsProps = {
  active: ExerciseDialog;
  onClose: () => void;
  selectedExercise?: {
    name: string;
    category: string;
    sets: string;
    reps: string;
    time?: string;
    rest?: string;
    video: string;
    notes?: string;
    howTo?: string;
    progression?: string;
    regression?: string;
  } | null;
};

export function ExerciseDialogs({ active, onClose, selectedExercise }: ExerciseDialogsProps) {
  return (
    <Dialog open={active !== null} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {active === "add" && "Add Exercise"}
            {active === "edit" && `Edit ${selectedExercise?.name ?? "Exercise"}`}
          </DialogTitle>
          <DialogDescription>UI-only for now.</DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <Input placeholder="Exercise name" defaultValue={selectedExercise?.name} />
          <Select defaultValue={selectedExercise?.category}>
            <option>Category</option>
            <option>Power</option>
            <option>Speed</option>
            <option>Recovery</option>
          </Select>
          <div className="grid gap-3 sm:grid-cols-4">
            <Input placeholder="Sets" defaultValue={selectedExercise?.sets} />
            <Input placeholder="Reps" defaultValue={selectedExercise?.reps} />
            <Input placeholder="Time" defaultValue={selectedExercise?.time} />
            <Input placeholder="Rest" defaultValue={selectedExercise?.rest} />
          </div>
          <Input placeholder="Video URL (Vimeo/YouTube)" defaultValue={selectedExercise?.video} />
          <div className="space-y-2">
            <Label className="text-xs">Coaching Notes (Cues)</Label>
            <Textarea placeholder="Core tight, drive through heel..." defaultValue={selectedExercise?.notes} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">How To Tips</Label>
            <Textarea placeholder="Setup instructions..." defaultValue={selectedExercise?.howTo} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs">Progression</Label>
              <Input placeholder="Harder version..." defaultValue={selectedExercise?.progression} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Regression</Label>
              <Input placeholder="Easier version..." defaultValue={selectedExercise?.regression} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>{active === "add" ? "Create Exercise" : "Save Changes"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
