
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Banknote } from "lucide-react";
import type { LoggedInUser } from "@/lib/types";

export default function AdminFinancePage() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");
    if (userData) {
      const parsedUser = JSON.parse(userData) as LoggedInUser;
      if (parsedUser.role !== 'superadmin') {
        router.push('/portal/dashboard');
      } else {
        setUser(parsedUser);
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);
  
  if (user?.role !== 'superadmin') {
    return null; // or a loading spinner while redirecting
  }

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-[calc(100vh-10rem)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <Banknote className="h-16 w-16 text-muted-foreground" />
        <h3 className="text-2xl font-bold tracking-tight font-headline">
          Financial Overview
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          This section is under construction. Soon you will be able to view detailed financial summaries, track revenue from registration fees, and manage prize money distribution.
        </p>
      </div>
    </div>
  );
}
