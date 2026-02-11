"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { Textarea } from "../../ui/textarea";

export type BookingsDialog =
  | null
  | "new-service"
  | "open-slots"
  | "calendar"
  | "booking-details";

type BookingsDialogsProps = {
  active: BookingsDialog;
  onClose: () => void;
  selectedBooking?: { name: string; athlete: string; time: string; type: string } | null;
  services?: { id: number; name: string; type: string }[];
  onRefresh?: () => void;
};

export function BookingsDialogs({ active, onClose, selectedBooking, services = [], onRefresh }: BookingsDialogsProps) {
  const [serviceName, setServiceName] = useState("");
  const [serviceType, setServiceType] = useState("group_call");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [capacity, setCapacity] = useState("");
  const [fixedStartTime, setFixedStartTime] = useState("");
  const [programTier, setProgramTier] = useState("");
  const [availabilityServiceId, setAvailabilityServiceId] = useState("");
  const [availabilityStart, setAvailabilityStart] = useState("");
  const [availabilityEnd, setAvailabilityEnd] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <Dialog open={active !== null} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {active === "new-service" && "Create New Service"}
            {active === "open-slots" && "Open Booking Slots"}
            {active === "calendar" && "Calendar View"}
            {active === "booking-details" && "Booking Details"}
          </DialogTitle>
          <DialogDescription>
            {selectedBooking
              ? `${selectedBooking.name} • ${selectedBooking.athlete}`
              : "UI-only for now."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          {active === "new-service" ? (
            <>
              <Input placeholder="Service name" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
              <Select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                <option value="group_call">Group Call</option>
                <option value="one_on_one">1:1</option>
                <option value="role_model">Role Model</option>
              </Select>
              <Input placeholder="Duration (mins)" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
              <Input placeholder="Capacity (optional)" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              <Input placeholder="Fixed start time (HH:MM)" value={fixedStartTime} onChange={(e) => setFixedStartTime(e.target.value)} />
              <Select value={programTier} onChange={(e) => setProgramTier(e.target.value)}>
                <option value="">Program tier (optional)</option>
                <option value="PHP">PHP</option>
                <option value="PHP_Plus">PHP Plus</option>
                <option value="PHP_Premium">PHP Premium</option>
              </Select>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    setError(null);
                    try {
                      const res = await fetch("/api/backend/bookings/services", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: serviceName,
                          type: serviceType,
                          durationMinutes: Number(durationMinutes),
                          capacity: capacity ? Number(capacity) : undefined,
                          fixedStartTime: fixedStartTime || undefined,
                          programTier: programTier || undefined,
                        }),
                      });
                      if (!res.ok) throw new Error("Failed to create service");
                      onRefresh?.();
                      onClose();
                    } catch (err: any) {
                      setError(err.message ?? "Failed to create service");
                    }
                  }}
                >
                  Create
                </Button>
              </div>
            </>
          ) : null}
          {active === "open-slots" ? (
            <>
              <Input type="datetime-local" placeholder="Start" value={availabilityStart} onChange={(e) => setAvailabilityStart(e.target.value)} />
              <Input type="datetime-local" placeholder="End" value={availabilityEnd} onChange={(e) => setAvailabilityEnd(e.target.value)} />
              <Select value={availabilityServiceId} onChange={(e) => setAvailabilityServiceId(e.target.value)}>
                <option value="">Service type</option>
                {services.map((service) => (
                  <option key={service.id} value={String(service.id)}>
                    {service.name}
                  </option>
                ))}
              </Select>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    setError(null);
                    try {
                      const res = await fetch("/api/backend/bookings/availability", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          serviceTypeId: Number(availabilityServiceId),
                          startsAt: new Date(availabilityStart).toISOString(),
                          endsAt: new Date(availabilityEnd).toISOString(),
                        }),
                      });
                      if (!res.ok) throw new Error("Failed to open slots");
                      onClose();
                    } catch (err: any) {
                      setError(err.message ?? "Failed to open slots");
                    }
                  }}
                >
                  Open Slots
                </Button>
              </div>
            </>
          ) : null}
          {active === "calendar" ? (
            <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm">
              Calendar view will display weekly sessions here.
            </div>
          ) : null}
          {active === "booking-details" && selectedBooking ? (
            <>
              <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm">
                <p className="font-semibold text-foreground">{selectedBooking.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedBooking.athlete} • {selectedBooking.time} • {selectedBooking.type}
                </p>
              </div>
              <Textarea placeholder="Coach notes" />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={onClose}>Save Notes</Button>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
