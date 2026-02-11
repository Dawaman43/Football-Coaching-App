"use client";

import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "../../components/admin/shell";
import { SectionHeader } from "../../components/admin/section-header";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { BookingsDialogs, type BookingsDialog } from "../../components/admin/bookings/bookings-dialogs";
import { BookingsFilters } from "../../components/admin/bookings/bookings-filters";
import { BookingsList } from "../../components/admin/bookings/bookings-list";
import { AvailabilityPanel } from "../../components/admin/bookings/availability-panel";

type BookingItem = {
  name: string;
  athlete: string;
  time: string;
  type: string;
};

type ServiceType = {
  id: number;
  name: string;
  type: string;
  durationMinutes: number;
  capacity?: number | null;
  fixedStartTime?: string | null;
  programTier?: string | null;
};

export default function BookingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [activeDialog, setActiveDialog] = useState<BookingsDialog>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [activeChip, setActiveChip] = useState<string>("All");
  const chips = ["All", "Video", "In-person", "Group", "Premium"];

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const [bookingsRes, servicesRes] = await Promise.all([
          fetch("/api/backend/admin/bookings"),
          fetch("/api/backend/bookings/services"),
        ]);

        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          const mapped = (data.bookings ?? []).map((item: any) => ({
            name: item.serviceName ?? item.type ?? "Session",
            athlete: item.athleteName ?? "Unknown athlete",
            time: item.startsAt ? new Date(item.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--",
            type: item.type ?? "Session",
          }));
          if (mounted) setBookings(mapped);
        }

        if (servicesRes.ok) {
          const data = await servicesRes.json();
          if (mounted) setServices(data.items ?? []);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    if (activeChip === "All") return bookings;
    if (activeChip === "Group") return bookings.filter((booking) => booking.name.includes("Group"));
    if (activeChip === "Premium") return bookings.filter((booking) => booking.name.includes("Role Model"));
    return bookings.filter((booking) => booking.type === activeChip);
  }, [activeChip]);

  return (
    <AdminShell
      title="Bookings"
      subtitle="Manage availability and sessions with Coach Mike Green."
      actions={<Button onClick={() => setActiveDialog("new-service")}>New Service</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="space-y-4">
            <SectionHeader
              title="Upcoming"
              description="Next confirmed sessions."
              actionLabel="Calendar"
              onAction={() => setActiveDialog("calendar")}
            />
            <BookingsFilters chips={chips} onChipSelect={setActiveChip} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
                Loading bookings...
              </div>
            ) : (
              <BookingsList
                bookings={filteredBookings}
                isLoading={isLoading}
                onSelect={(booking) => {
                  setSelectedBooking(booking);
                  setActiveDialog("booking-details");
                }}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionHeader
              title="Availability Blocks"
              description="Open or adjust coaching windows."
            />
          </CardHeader>
          <CardContent>
            <AvailabilityPanel
              isLoading={isLoading}
              onOpenSlots={() => setActiveDialog("open-slots")}
            />
          </CardContent>
        </Card>
      </div>

      <BookingsDialogs
        active={activeDialog}
        onClose={() => setActiveDialog(null)}
        selectedBooking={selectedBooking}
        services={services}
        onRefresh={() => {
          setIsLoading(true);
          fetch("/api/backend/admin/bookings")
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
              if (!data) return;
              const mapped = (data.bookings ?? []).map((item: any) => ({
                name: item.serviceName ?? item.type ?? "Session",
                athlete: item.athleteName ?? "Unknown athlete",
                time: item.startsAt ? new Date(item.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--",
                type: item.type ?? "Session",
              }));
              setBookings(mapped);
            })
            .finally(() => setIsLoading(false));
        }}
      />
    </AdminShell>
  );
}
