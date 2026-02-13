"use client";

import { useMemo, useState } from "react";
import { ParentShell } from "../../components/parent/shell";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";

type FieldType = "text" | "number" | "dropdown";

type FieldConfig = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
};

const initialFields: FieldConfig[] = [
  { id: "athleteName", label: "Athlete Name", type: "text", required: true },
  { id: "age", label: "Age", type: "number", required: true },
  { id: "team", label: "Team & Level", type: "text", required: true },
  { id: "trainingDays", label: "Training Days / Week", type: "number", required: true },
  { id: "injuries", label: "Injuries / History", type: "text", required: true },
  { id: "growthNotes", label: "Growth Notes", type: "text", required: false },
  { id: "performanceGoals", label: "Performance Goals", type: "text", required: true },
  { id: "equipmentAccess", label: "Equipment Access", type: "text", required: true },
  { id: "parentEmail", label: "Guardian Email", type: "text", required: true },
  { id: "parentPhone", label: "Guardian Phone", type: "text", required: false },
  { id: "relation", label: "Relation to Athlete", type: "dropdown", required: true, options: ["Parent", "Guardian", "Coach"] },
  { id: "programTier", label: "Program Tier Selection", type: "dropdown", required: true, options: ["PHP Program", "PHP Plus", "PHP Premium"] },
];

const documentRequirements = [
  { id: "consent", label: "Guardian Consent Form" },
  { id: "medical", label: "Medical Clearance" },
  { id: "injury", label: "Injury Report (if applicable)" },
  { id: "video", label: "Intro Training Video" },
];

export default function ParentDashboardPage() {
  const [activeFields, setActiveFields] = useState<string[]>([
    "athleteName",
    "age",
    "team",
    "trainingDays",
    "injuries",
    "performanceGoals",
    "equipmentAccess",
    "parentEmail",
    "relation",
  ]);
  const [requiredDocs, setRequiredDocs] = useState<string[]>(["consent"]);
  const [fields, setFields] = useState<FieldConfig[]>(initialFields);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newFieldOption, setNewFieldOption] = useState("");
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [editFieldId, setEditFieldId] = useState<string | null>(null);

  const toggleListItem = (list: string[], setList: (next: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
      return;
    }
    setList([...list, value]);
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    const id = `${newFieldLabel.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const options =
      newFieldType === "dropdown" && newFieldOption.trim()
        ? [newFieldOption.trim()]
        : undefined;

    setFields((prev) => [
      ...prev,
      {
        id,
        label: newFieldLabel.trim(),
        type: newFieldType,
        required: newFieldRequired,
        options,
      },
    ]);
    setActiveFields((prev) => [...prev, id]);
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldRequired(true);
    setNewFieldOption("");
  };

  const activeField = useMemo(
    () => fields.find((field) => field.id === activeFieldId) ?? null,
    [fields, activeFieldId]
  );
  const editField = useMemo(
    () => fields.find((field) => field.id === editFieldId) ?? null,
    [fields, editFieldId]
  );

  return (
    <ParentShell
      title="Parent Portal Configuration"
      subtitle="Admin control for parent onboarding and settings."
      actions={<Button>Publish Changes</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Form Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Required Fields</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className={cn(
                      "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-left text-xs text-foreground transition",
                      activeFieldId === field.id ? "ring-2 ring-primary/60" : "opacity-80"
                    )}
                  >
                    <button
                      type="button"
                      className="flex-1 text-left"
                      onClick={() => setActiveFieldId(field.id)}
                    >
                      {field.label}
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {field.type}
                      </span>
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditFieldId(field.id)}
                    >
                      Edit Field
                    </Button>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={activeFields.includes(field.id)}
                        onChange={() => toggleListItem(activeFields, setActiveFields, field.id)}
                        className="h-4 w-4 accent-primary"
                      />
                      Show
                    </label>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={() => {
                          setFields((prev) =>
                            prev.map((item) =>
                              item.id === field.id ? { ...item, required: !item.required } : item
                            )
                          );
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                      Required
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFields((prev) => prev.filter((item) => item.id !== field.id));
                        setActiveFields((prev) => prev.filter((item) => item !== field.id));
                        if (activeFieldId === field.id) {
                          setActiveFieldId(null);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-secondary/30 p-4">
              <p className="mb-3 font-medium text-foreground">Add New Field</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Field label"
                  value={newFieldLabel}
                  onChange={(event) => setNewFieldLabel(event.target.value)}
                />
                <Select
                  value={newFieldType}
                  onChange={(event) => setNewFieldType(event.target.value as FieldType)}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="dropdown">Dropdown</option>
                </Select>
              </div>
              {newFieldType === "dropdown" ? (
                <div className="mt-3 flex items-center gap-3">
                  <Input
                    placeholder="Add dropdown option"
                    value={newFieldOption}
                    onChange={(event) => setNewFieldOption(event.target.value)}
                  />
                </div>
              ) : null}
              <div className="mt-3 flex items-center gap-3">
                <input
                  id="new-field-required"
                  type="checkbox"
                  checked={newFieldRequired}
                  onChange={() => setNewFieldRequired((prev) => !prev)}
                  className="h-4 w-4 accent-primary"
                />
                <label htmlFor="new-field-required" className="text-xs text-foreground">
                  Required field
                </label>
                <Button className="ml-auto" variant="outline" onClick={handleAddField}>
                  Add Field
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-medium text-foreground">Default Program Tier</p>
                <Select>
                  <option>PHP Program</option>
                  <option>PHP Plus</option>
                  <option>PHP Premium</option>
                </Select>
              </div>
              <div>
                <p className="mb-2 font-medium text-foreground">Approval Workflow</p>
                <Select>
                  <option>Manual review by coach</option>
                  <option>Auto-approve standard entries</option>
                </Select>
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium text-foreground">Onboarding Notes (internal)</p>
              <Textarea placeholder="Add internal guidance for coaches reviewing onboarding." />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Field Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {activeField ? (
                <>
                  <div>
                    <p className="mb-2 font-medium text-foreground">Field Name</p>
                    <Input
                      value={activeField.label}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFields((prev) =>
                          prev.map((item) =>
                            item.id === activeField.id ? { ...item, label: value } : item
                          )
                        );
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-foreground">Field Type</p>
                    <Select
                      value={activeField.type}
                      onChange={(event) => {
                        const value = event.target.value as FieldType;
                        setFields((prev) =>
                          prev.map((item) =>
                            item.id === activeField.id ? { ...item, type: value } : item
                          )
                        );
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="dropdown">Dropdown</option>
                    </Select>
                  </div>
                  {activeField.type === "dropdown" ? (
                    <div>
                      <p className="mb-2 font-medium text-foreground">Dropdown Options</p>
                      <Input
                        value={activeField.options?.join(", ") ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          const options = value
                            .split(",")
                            .map((option) => option.trim())
                            .filter(Boolean);
                          setFields((prev) =>
                            prev.map((item) =>
                              item.id === activeField.id ? { ...item, options } : item
                            )
                          );
                        }}
                        placeholder="Option 1, Option 2"
                      />
                    </div>
                  ) : null}
                  <label className="flex items-center gap-3 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={activeFields.includes(activeField.id)}
                      onChange={() => toggleListItem(activeFields, setActiveFields, activeField.id)}
                      className="h-4 w-4 accent-primary"
                    />
                    Show this field
                  </label>
                  <label className="flex items-center gap-3 text-xs text-foreground">
                    <input
                      type="checkbox"
                      checked={activeField.required}
                      onChange={() => {
                        setFields((prev) =>
                          prev.map((item) =>
                            item.id === activeField.id
                              ? { ...item, required: !item.required }
                              : item
                          )
                        );
                      }}
                      className="h-4 w-4 accent-primary"
                    />
                    Required field
                  </label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setFields((prev) => prev.filter((item) => item.id !== activeField.id));
                      setActiveFields((prev) => prev.filter((item) => item !== activeField.id));
                      setActiveFieldId(null);
                    }}
                  >
                    Delete Field
                  </Button>
                </>
              ) : (
                <p>Select a field to edit its settings.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {documentRequirements.map((doc) => (
                <label
                  key={doc.id}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-xs text-foreground transition",
                    requiredDocs.includes(doc.id) ? "ring-1 ring-primary/50" : "opacity-80"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={requiredDocs.includes(doc.id)}
                    onChange={() => toggleListItem(requiredDocs, setRequiredDocs, doc.id)}
                    className="h-4 w-4 accent-primary"
                  />
                  {doc.label}
                </label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parent Portal Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="mb-2 font-medium text-foreground">Welcome Message</p>
                <Input placeholder="Welcome to PH Performance, here’s what to expect..." />
              </div>
              <div>
                <p className="mb-2 font-medium text-foreground">Coach Contact Message</p>
                <Textarea placeholder="Share how parents can reach their coach." />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={!!editField} onOpenChange={(open) => setEditFieldId(open ? editFieldId : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>Update the field label, type, and options.</DialogDescription>
          </DialogHeader>
          {editField ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 font-medium text-foreground">Field Name</p>
                <Input
                  value={editField.label}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFields((prev) =>
                      prev.map((item) =>
                        item.id === editField.id ? { ...item, label: value } : item
                      )
                    );
                  }}
                />
              </div>
              <div>
                <p className="mb-2 font-medium text-foreground">Field Type</p>
                <Select
                  value={editField.type}
                  onChange={(event) => {
                    const value = event.target.value as FieldType;
                    setFields((prev) =>
                      prev.map((item) =>
                        item.id === editField.id ? { ...item, type: value } : item
                      )
                    );
                  }}
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="dropdown">Dropdown</option>
                </Select>
              </div>
              {editField.type === "dropdown" ? (
                <div className="space-y-3">
                  <p className="font-medium text-foreground">Dropdown Options</p>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add an option"
                      value={newFieldOption}
                      onChange={(event) => setNewFieldOption(event.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (!newFieldOption.trim()) return;
                        const nextOption = newFieldOption.trim();
                        setFields((prev) =>
                          prev.map((item) =>
                            item.id === editField.id
                              ? {
                                  ...item,
                                  options: item.options
                                    ? [...item.options, nextOption]
                                    : [nextOption],
                                }
                              : item
                          )
                        );
                        setNewFieldOption("");
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(editField.options ?? []).map((option) => (
                      <div
                        key={option}
                        className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-foreground"
                      >
                        {option}
                        <button
                          type="button"
                          className="text-muted-foreground"
                          onClick={() => {
                            setFields((prev) =>
                              prev.map((item) =>
                                item.id === editField.id
                                  ? {
                                      ...item,
                                      options: (item.options ?? []).filter(
                                        (value) => value !== option
                                      ),
                                    }
                                  : item
                              )
                            );
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setEditFieldId(null)}>
                  Done
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </ParentShell>
  );
}
