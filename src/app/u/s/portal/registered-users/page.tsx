
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { users } from "@/lib/data";
import { format, parseISO } from "date-fns";
import type { LoggedInUser, User } from "@/lib/types";

export default function RegisteredUsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [formattedDates, setFormattedDates] = useState<Record<string, string>>({});

  useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");
    if (userData) {
        setUser(JSON.parse(userData));
    } else {
        router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    const newFormattedDates: Record<string, string> = {};
    users.forEach((user) => {
        newFormattedDates[user.id] = format(parseISO(user.registeredAt), "PPpp");
    });
    setFormattedDates(newFormattedDates);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Registered Users
          </h2>
          <p className="text-muted-foreground">
            A list of all users who have registered for events.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Registered On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((regUser) => (
                <TableRow key={regUser.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={regUser.avatarUrl} alt={regUser.name} data-ai-hint="person" />
                          <AvatarFallback>{regUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{regUser.name}</p>
                          <p className="text-xs text-muted-foreground">{regUser.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline">{regUser.college}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                        {formattedDates[regUser.id]}
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
