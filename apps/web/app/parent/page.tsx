"use client";

import { useEffect, useMemo, useState } from "react";
import { ParentShell } from "../../components/parent/shell";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { cn } from "../../lib/utils";
import {
  useGetOnboardingConfigQuery,
  useGetUserOnboardingQuery,
  useGetUsersQuery,
  useUpdateOnboardingConfigMutation,
} from "../../lib/apiSlice";

type FieldType = "text" | "number" | "dropdown";

type FieldConfig = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  visible: boolean;
  options?: string[];
  optionsByTeam?: Record<string, string[]>;
};

type DocumentConfig = {
  id: string;
  label: string;
  required: boolean;
};

const initialFields: FieldConfig[] = [
  { id: "athleteName", label: "Athlete Name", type: "text", required: true, visible: true },
  { id: "age", label: "Age", type: "number", required: true, visible: true },
  { id: "team", label: "Team", type: "dropdown", required: true, visible: true, options: ["Team A", "Team B"] },
  {
    id: "level",
    label: "Level",
    type: "dropdown",
    required: true,
    visible: true,
    options: ["U12", "U14", "U16", "U18"],
    optionsByTeam: {
      "Team A": ["U12", "U14"],
      "Team B": ["U16", "U18"],
    },
  },
  { id: "trainingPerWeek", label: "Training Days / Week", type: "number", required: true, visible: true },
  { id: "injuries", label: "Injuries / History", type: "text", required: true, visible: true },
  { id: "growthNotes", label: "Growth Notes", type: "text", required: false, visible: true },
  { id: "performanceGoals", label: "Performance Goals", type: "text", required: true, visible: true },
  { id: "equipmentAccess", label: "Equipment Access", type: "text", required: true, visible: true },
  { id: "parentEmail", label: "Guardian Email", type: "text", required: true, visible: true },
  { id: "parentPhone", label: "Guardian Phone", type: "text", required: false, visible: true },
  {
    id: "relationToAthlete",
    label: "Relation to Athlete",
    type: "dropdown",
    required: true,
    visible: true,
    options: ["Parent", "Guardian", "Coach"],
  },
  {
    id: "desiredProgramType",
    label: "Program Tier Selection",
    type: "dropdown",
    required: true,
    visible: true,
    options: ["PHP", "PHP_Plus", "PHP_Premium"],
  },
];

const documentRequirements: DocumentConfig[] = [
  { id: "consent", label: "Guardian Consent Form", required: true },
  { id: "medical", label: "Medical Clearance", required: false },
  { id: "injury", label: "Injury Report (if applicable)", required: false },
  { id: "video", label: "Intro Training Video", required: false },
];

export default function ParentDashboardPage() {
  const { data } = useGetOnboardingConfigQuery();
  const { data: usersData } = useGetUsersQuery();
  const [updateConfig, { isLoading: isSaving }] = useUpdateOnboardingConfigMutation();
  const [fields, setFields] = useState<FieldConfig[]>(initialFields);
  const [docs, setDocs] = useState<DocumentConfig[]>(documentRequirements);
  const [defaultProgramTier, setDefaultProgramTier] = useState("PHP");
  const [approvalWorkflow, setApprovalWorkflow] = useState("manual");
  const [notes, setNotes] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [coachMessage, setCoachMessage] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("text");
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newDocLabel, setNewDocLabel] = useState("");
  const [newFieldOption, setNewFieldOption] = useState("");
  const [newTeamOption, setNewTeamOption] = useState("");
  const [editTeamOption, setEditTeamOption] = useState<string | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [newLevelOption, setNewLevelOption] = useState("");
  const [editLevelOption, setEditLevelOption] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { data: onboardingData } = useGetUserOnboardingQuery(selectedUserId ?? 0, {
    skip: !selectedUserId,
  });

  const completedGuardians = useMemo(() => {
    const users = usersData?.users ?? [];
    return users.filter((user) => user.onboardingCompleted);
  }, [usersData]);

  const selectedGuardian = completedGuardians.find((user) => user.id === selectedUserId);
  const extraResponses = onboardingData?.athlete?.extraResponses ?? {};
  const extraLevel =
    typeof extraResponses === "object" && extraResponses !== null
      ? (extraResponses as Record<string, any>)["level"]
      : null;
  const extraEntries =
    typeof extraResponses === "object" && extraResponses !== null
      ? Object.entries(extraResponses as Record<string, any>)
          .filter(([key]) => key !== "level")
          .map(([key, value]) => `${key}: ${value}`)
      : [];

  const upsertField = (payload: FieldConfig) => {
    setFields((prev) => {
      const existing = prev.find((item) => item.id === payload.id);
      if (!existing) {
        return [...prev, payload];
      }
      return prev.map((item) => (item.id === payload.id ? { ...item, ...payload } : item));
    });
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
        visible: true,
        options,
      },
    ]);
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldRequired(true);
    setNewFieldOption("");
  };

  const handleAddTeamLevel = () => {
    upsertField({
      id: "team",
      label: "Team",
      type: "dropdown",
      required: true,
      visible: true,
      options: ["Team A", "Team B", "Team C"],
    });
    if (!fields.some((field) => field.id === "level")) {
      upsertField({
        id: "level",
        label: "Level",
        type: "dropdown",
        required: true,
        visible: true,
        options: ["U12", "U14", "U16", "U18"],
        optionsByTeam: {
          "Team A": ["U12", "U14"],
          "Team B": ["U16", "U18"],
          "Team C": ["U12"],
        },
      });
    }
  };

  useEffect(() => {
    if (!data?.config) return;
    const config = data.config as any;
    const normalizedFields: FieldConfig[] = (config.fields ?? initialFields).map((field: any) => ({
      id: field.id,
      label: field.label,
      type: field.type as FieldType,
      required: Boolean(field.required),
      visible: field.visible !== false,
      options: field.options ?? undefined,
      optionsByTeam: field.optionsByTeam ?? undefined,
    }));
    setFields(normalizedFields);
    const normalizedDocs: DocumentConfig[] = (config.requiredDocuments ?? documentRequirements).map(
      (doc: any) => ({
        id: doc.id,
        label: doc.label,
        required: Boolean(doc.required),
      })
    );
    setDocs(normalizedDocs);
    setDefaultProgramTier(config.defaultProgramTier ?? "PHP");
    setApprovalWorkflow(config.approvalWorkflow ?? "manual");
    setNotes(config.notes ?? "");
    setWelcomeMessage(config.welcomeMessage ?? "");
    setCoachMessage(config.coachMessage ?? "");
  }, [data]);

  const handleSave = async () => {
    const hasTeam = fields.some((field) => field.id === "team");
    const hasLevel = fields.some((field) => field.id === "level");
    const normalizedFields = [
      ...fields.map((field) =>
        field.id === "level"
          ? {
              ...field,
              optionsByTeam: field.optionsByTeam ?? {},
            }
          : field
      ),
      ...(hasTeam && !hasLevel
        ? [
            {
              id: "level",
              label: "Level",
              type: "dropdown" as FieldType,
              required: true,
              visible: true,
              options: ["U12", "U14", "U16", "U18"],
              optionsByTeam: {},
            },
          ]
        : []),
    ].map((field) => ({
      ...field,
      visible: field.visible,
    }));
    const normalizedDocs = docs.map((doc) => ({
      ...doc,
      required: doc.required,
    }));
    try {
      await updateConfig({
        version: 1,
        fields: normalizedFields,
        requiredDocuments: normalizedDocs,
        welcomeMessage,
        coachMessage,
        defaultProgramTier,
        approvalWorkflow,
        notes,
      }).unwrap();
      setSaveStatus({ type: "success", message: "Onboarding configuration saved." });
    } catch (error: any) {
      setSaveStatus({
        type: "error",
        message: error?.data?.error || error?.message || "Failed to save configuration.",
      });
    } finally {
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <ParentShell
      title="Parent Portal Configuration"
      subtitle="Admin control for parent onboarding and settings."
    >
      {saveStatus ? (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            saveStatus.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          )}
        >
          {saveStatus.message}
        </div>
      ) : null}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {fields.map((field) => {
              if (field.id === "level") {
                return null;
              }
              if (field.id === "team") {
                const levelField = fields.find((item) => item.id === "level");
                const teamOptions = field.options ?? [];
                return (
                  <div key={field.id} className="rounded-2xl border border-border bg-secondary/40 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="mb-2 font-medium text-foreground">Team</p>
                        <div className="flex flex-wrap gap-2">
                          {teamOptions.map((option) => (
                            <div
                              key={`team-${option}`}
                              className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground"
                            >
                              <button
                                type="button"
                                className="text-xs text-foreground"
                                onClick={() => {
                                  setEditTeamOption(option);
                                  setNewTeamOption(option);
                                }}
                              >
                                {option}
                              </button>
                              <button
                                type="button"
                                className="text-muted-foreground"
                                onClick={() => {
                                  setFields((prev) =>
                                    prev.map((item) => {
                                      if (item.id === "team") {
                                        return {
                                          ...item,
                                          options: (item.options ?? []).filter(
                                            (value) => value !== option
                                          ),
                                        };
                                      }
                                      if (item.id === "level") {
                                        const current = item.optionsByTeam ?? {};
                                        const { [option]: _, ...rest } = current;
                                        return { ...item, optionsByTeam: rest };
                                      }
                                      return item;
                                    })
                                  );
                                  if (selectedTeam === option) {
                                    setSelectedTeam(teamOptions.filter((team) => team !== option)[0] ?? null);
                                  }
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Input
                            placeholder="Add team"
                            value={newTeamOption}
                            onChange={(event) => setNewTeamOption(event.target.value)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!newTeamOption.trim()) return;
                              const next = newTeamOption.trim();
                              setFields((prev) =>
                                prev.map((item) => {
                                  if (item.id === "team") {
                                    const updatedOptions = editTeamOption
                                      ? (item.options ?? []).map((value) =>
                                          value === editTeamOption ? next : value
                                        )
                                      : item.options
                                      ? [...item.options, next]
                                      : [next];
                                    return { ...item, options: updatedOptions };
                                  }
                                  if (item.id === "level") {
                                    const current = item.optionsByTeam ?? {};
                                    if (editTeamOption) {
                                      const levels = current[editTeamOption] ?? [];
                                      const { [editTeamOption]: _, ...rest } = current;
                                      return { ...item, optionsByTeam: { ...rest, [next]: levels } };
                                    }
                                    if (current[next]) return item;
                                    return { ...item, optionsByTeam: { ...current, [next]: [] } };
                                  }
                                  return item;
                                })
                              );
                              setEditTeamOption(null);
                              setNewTeamOption("");
                            }}
                          >
                            {editTeamOption ? "Update Team" : "Add Team"}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 font-medium text-foreground">Levels</p>
                        <div className="rounded-2xl border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                          {teamOptions.length
                            ? `Configured for ${Object.keys(levelField?.optionsByTeam ?? {}).length} teams.`
                            : "Add a team to start setting levels."}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFields((prev) => {
                                const teamOptions = prev.find((item) => item.id === "team")?.options ?? [];
                                const hasLevel = prev.some((item) => item.id === "level");
                                if (!hasLevel) {
                                  return [
                                    ...prev,
                                    {
                                      id: "level",
                                      label: "Level",
                                      type: "dropdown",
                                      required: true,
                                      visible: true,
                                      options: [],
                                      optionsByTeam: {},
                                    },
                                  ];
                                }
                                return prev.map((item) => {
                                  if (item.id !== "level") return item;
                                  const current = item.optionsByTeam ?? {};
                                  if (Object.keys(current).length || !teamOptions.length) {
                                    return item;
                                  }
                                  const fallback = item.options ?? [];
                                  const seeded = teamOptions.reduce<Record<string, string[]>>(
                                    (acc, team) => ({ ...acc, [team]: fallback }),
                                    {}
                                  );
                                  return { ...item, optionsByTeam: seeded };
                                });
                              });
                              setSelectedTeam(teamOptions[0] ?? null);
                              setIsTeamModalOpen(true);
                            }}
                            disabled={!teamOptions.length}
                          >
                            Manage Levels
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-foreground">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.visible}
                          onChange={() => {
                            setFields((prev) =>
                              prev.map((item) =>
                                item.id === "team" ? { ...item, visible: !item.visible } : item
                              )
                            );
                          }}
                          className="h-4 w-4 accent-primary"
                        />
                        Show team
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={() => {
                            setFields((prev) =>
                              prev.map((item) =>
                                item.id === "team" ? { ...item, required: !item.required } : item
                              )
                            );
                          }}
                          className="h-4 w-4 accent-primary"
                        />
                        Required
                      </label>
                      {levelField ? (
                        <>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={levelField.visible}
                              onChange={() => {
                                setFields((prev) =>
                                  prev.map((item) =>
                                    item.id === "level"
                                      ? { ...item, visible: !item.visible }
                                      : item
                                  )
                                );
                              }}
                              className="h-4 w-4 accent-primary"
                            />
                            Show level
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={levelField.required}
                              onChange={() => {
                                setFields((prev) =>
                                  prev.map((item) =>
                                    item.id === "level"
                                      ? { ...item, required: !item.required }
                                      : item
                                  )
                                );
                              }}
                              className="h-4 w-4 accent-primary"
                            />
                            Level required
                          </label>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              }
              return (
              <div key={field.id} className="rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                  <Input
                    value={field.label}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFields((prev) =>
                        prev.map((item) => (item.id === field.id ? { ...item, label: value } : item))
                      );
                    }}
                  />
                  <Select
                    value={field.type}
                    onChange={(event) => {
                      const value = event.target.value as FieldType;
                      setFields((prev) =>
                        prev.map((item) => (item.id === field.id ? { ...item, type: value } : item))
                      );
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="dropdown">Dropdown</option>
                  </Select>
                </div>
                {field.type === "dropdown" ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {(field.options ?? []).map((option) => (
                        <div
                          key={`${field.id}-${option}`}
                          className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground"
                        >
                          {option}
                          <button
                            type="button"
                            className="text-muted-foreground"
                            onClick={() => {
                              setFields((prev) =>
                                prev.map((item) =>
                                  item.id === field.id
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
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        placeholder="Add option"
                        value={newFieldOption}
                        onChange={(event) => setNewFieldOption(event.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!newFieldOption.trim()) return;
                          const next = newFieldOption.trim();
                          if (field.id === "level") {
                            const teamField = fields.find((item) => item.id === "team");
                            if (!teamField?.options?.length) {
                              return;
                            }
                          }
                          setFields((prev) =>
                            prev.map((item) =>
                              item.id === field.id
                                ? {
                                    ...item,
                                    options: item.options ? [...item.options, next] : [next],
                                  }
                                : item
                            )
                          );
                          setNewFieldOption("");
                        }}
                        disabled={field.id === "level" && !fields.find((item) => item.id === "team")?.options?.length}
                      >
                        Add
                      </Button>
                    </div>
                    {field.id === "level" && !fields.find((item) => item.id === "team")?.options?.length ? (
                      <p className="text-xs text-muted-foreground">
                        Add team options first, then add levels.
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-foreground">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.visible}
                      onChange={() => {
                        setFields((prev) =>
                          prev.map((item) =>
                            item.id === field.id ? { ...item, visible: !item.visible } : item
                          )
                        );
                      }}
                      className="h-4 w-4 accent-primary"
                    />
                    Show
                  </label>
                  <label className="flex items-center gap-2">
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
                    onClick={() => setFields((prev) => prev.filter((item) => item.id !== field.id))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
            })}

            <div className="rounded-2xl border border-dashed border-border p-4">
              <p className="mb-3 font-medium text-foreground">Add Field</p>
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
                <Input
                  className="mt-3"
                  placeholder="Add dropdown option"
                  value={newFieldOption}
                  onChange={(event) => setNewFieldOption(event.target.value)}
                />
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-foreground">
                  <input
                    id="new-field-required"
                    type="checkbox"
                    checked={newFieldRequired}
                    onChange={() => setNewFieldRequired((prev) => !prev)}
                    className="h-4 w-4 accent-primary"
                  />
                  Required
                </label>
                <Button variant="outline" onClick={handleAddField}>
                  Add Field
                </Button>
                <Button variant="outline" onClick={handleAddTeamLevel}>
                  Add Team + Level
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {docs.map((doc) => (
              <div key={doc.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={doc.required}
                  onChange={() => {
                    setDocs((prev) =>
                      prev.map((item) =>
                        item.id === doc.id ? { ...item, required: !item.required } : item
                      )
                    );
                  }}
                  className="h-4 w-4 accent-primary"
                />
                <Input
                  value={doc.label}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDocs((prev) =>
                      prev.map((item) => (item.id === doc.id ? { ...item, label: value } : item))
                    );
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDocs((prev) => prev.filter((item) => item.id !== doc.id))}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-3">
              <Input
                placeholder="Add document requirement"
                value={newDocLabel}
                onChange={(event) => setNewDocLabel(event.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (!newDocLabel.trim()) return;
                  const id = `${newDocLabel.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
                  setDocs((prev) => [...prev, { id, label: newDocLabel.trim(), required: false }]);
                  setNewDocLabel("");
                }}
              >
                Add Document
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="mb-2 font-medium text-foreground">Welcome Message</p>
              <Input
                placeholder="Welcome to PH Performance..."
                value={welcomeMessage}
                onChange={(event) => setWelcomeMessage(event.target.value)}
              />
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">Coach Message</p>
              <Textarea
                placeholder="Share how parents can reach their coach."
                value={coachMessage}
                onChange={(event) => setCoachMessage(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            <div>
              <p className="mb-2 font-medium text-foreground">Default Program Tier</p>
              <Select value={defaultProgramTier} onChange={(event) => setDefaultProgramTier(event.target.value)}>
                <option value="PHP">PHP</option>
                <option value="PHP_Plus">PHP Plus</option>
                <option value="PHP_Premium">PHP Premium</option>
              </Select>
            </div>
            <div>
              <p className="mb-2 font-medium text-foreground">Approval Workflow</p>
              <Select value={approvalWorkflow} onChange={(event) => setApprovalWorkflow(event.target.value)}>
                <option value="manual">Manual review by coach</option>
                <option value="auto">Auto-approve standard entries</option>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <p className="mb-2 font-medium text-foreground">Internal Notes</p>
              <Textarea
                placeholder="Notes for your coaching team."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/30 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Ready to publish?</p>
            <p className="text-xs text-muted-foreground">Changes apply instantly to the mobile onboarding flow.</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Publishing..." : "Publish Changes"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Completed Onboarding</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 text-sm text-muted-foreground lg:grid-cols-[260px_1fr]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Guardians</p>
              <div className="space-y-2">
                {completedGuardians.length ? (
                  completedGuardians.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => setSelectedUserId(user.id)}
                      className={cn(
                        "w-full rounded-2xl border px-3 py-2 text-left text-sm",
                        selectedUserId === user.id
                          ? "border-primary bg-secondary text-foreground"
                          : "border-border text-muted-foreground hover:bg-secondary/50"
                      )}
                    >
                      <p className="text-foreground">{user.name || user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border px-3 py-3 text-xs text-muted-foreground">
                    No completed onboarding records yet.
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/30 p-4">
              {selectedUserId && onboardingData ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Details</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUserId(null)}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      ✕
                    </Button>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Guardian</p>
                    <div className="mt-2 grid gap-2 text-sm text-foreground">
                      <p>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {selectedGuardian?.name || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {selectedGuardian?.email || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {onboardingData.guardian?.phoneNumber || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Relation:</span>{" "}
                        {onboardingData.guardian?.relationToAthlete || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Athlete</p>
                    <div className="mt-2 grid gap-2 text-sm text-foreground">
                      <p>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {onboardingData.athlete?.name || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Age:</span>{" "}
                        {onboardingData.athlete?.age ?? "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Team:</span>{" "}
                        {onboardingData.athlete?.team || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Level:</span>{" "}
                        {extraLevel ?? "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Training days:</span>{" "}
                        {onboardingData.athlete?.trainingPerWeek ?? "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Goals:</span>{" "}
                        {onboardingData.athlete?.performanceGoals || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Equipment:</span>{" "}
                        {onboardingData.athlete?.equipmentAccess || "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Injuries:</span>{" "}
                        {onboardingData.athlete?.injuries ? JSON.stringify(onboardingData.athlete.injuries) : "—"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Extra responses:</span>{" "}
                        {extraEntries.length ? extraEntries.join(", ") : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Select a guardian to see their onboarding details.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Team Levels</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Teams</p>
              <div className="space-y-2">
                {(fields.find((item) => item.id === "team")?.options ?? []).map((team) => (
                  <button
                    key={`team-select-${team}`}
                    type="button"
                    onClick={() => {
                      setSelectedTeam(team);
                      setEditLevelOption(null);
                      setNewLevelOption("");
                    }}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left text-sm",
                      selectedTeam === team
                        ? "border-primary bg-secondary text-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary/50"
                    )}
                  >
                    {team}
                  </button>
                ))}
                {!fields.find((item) => item.id === "team")?.options?.length ? (
                  <div className="rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
                    Add teams first to configure levels.
                  </div>
                ) : null}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  {selectedTeam ? `${selectedTeam} Levels` : "Select a team"}
                </p>
                {selectedTeam ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {(fields.find((item) => item.id === "level")?.optionsByTeam?.[selectedTeam] ??
                        []).map((level) => (
                        <div
                          key={`level-${selectedTeam}-${level}`}
                          className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setEditLevelOption(level);
                              setNewLevelOption(level);
                            }}
                            className="text-xs text-foreground"
                          >
                            {level}
                          </button>
                          <button
                            type="button"
                            className="text-muted-foreground"
                            onClick={() => {
                              setFields((prev) =>
                                prev.map((item) => {
                                  if (item.id !== "level") return item;
                                  const current = item.optionsByTeam ?? {};
                                  const updated = (current[selectedTeam] ?? []).filter(
                                    (value) => value !== level
                                  );
                                  return {
                                    ...item,
                                    optionsByTeam: { ...current, [selectedTeam]: updated },
                                  };
                                })
                              );
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Input
                        placeholder="Add level"
                        value={newLevelOption}
                        onChange={(event) => setNewLevelOption(event.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!selectedTeam || !newLevelOption.trim()) return;
                          const next = newLevelOption.trim();
                          setFields((prev) =>
                            prev.map((item) => {
                              if (item.id !== "level") return item;
                              const current = item.optionsByTeam ?? {};
                              const existing = current[selectedTeam] ?? [];
                              const updated = editLevelOption
                                ? existing.map((value) => (value === editLevelOption ? next : value))
                                : existing.includes(next)
                                ? existing
                                : [...existing, next];
                              return {
                                ...item,
                                optionsByTeam: { ...current, [selectedTeam]: updated },
                              };
                            })
                          );
                          setEditLevelOption(null);
                          setNewLevelOption("");
                        }}
                      >
                        {editLevelOption ? "Update Level" : "Add Level"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Pick a team on the left to manage its levels.
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Levels are shown in the mobile app after the parent selects a team.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ParentShell>
  );
}
