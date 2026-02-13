"use client";

import { ParentShell } from "../../../components/parent/shell";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export default function ParentBillingPage() {
  return (
    <ParentShell
      title="Billing"
      subtitle="Manage your subscription and invoices."
      actions={<Button variant="outline">Update Plan</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            PHP Program • Renews on Mar 01
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Visa ending in 4242
          </CardContent>
        </Card>
      </div>
    </ParentShell>
  );
}
