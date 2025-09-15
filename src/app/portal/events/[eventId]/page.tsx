
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { events, winners as allWinners } from "@/lib/data";
import { parseISO } from "date-fns";
import { format } from "date-fns-tz";
import { notFound, useParams } from "next/navigation";
import { Calendar, Users, Trophy, DollarSign, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedRegistrationDates, setFormattedRegistrationDates] = useState<
    Record<string, string>
  >({});

  const event = events.find((e) => e.id === eventId);

  useEffect(() => {
    if (event) {
      setFormattedDate(
        format(parseISO(event.date), "EEEE, MMMM d, yyyy 'at' h:mm a zzz", { timeZone: 'UTC' })
      );
      const newFormattedDates: Record<string, string> = {};
      event.participants.forEach((user) => {
        newFormattedDates[user.id] = format(
          parseISO(user.registeredAt),
          "PP"
        );
      });
      setFormattedRegistrationDates(newFormattedDates);
    }
  }, [event]);

  if (!event) {
    notFound();
  }
  const winners = allWinners.filter(w => w.eventId === event.id);

  const totalRevenue = event.participants.length * event.registrationFee;
  const totalPrizes = winners.reduce((acc, winner) => acc + winner.prizeAmount, 0);

  return (
    <div className="container py-6">
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="users">Registered Users</TabsTrigger>
        <TabsTrigger value="winners">Winners</TabsTrigger>
        <TabsTrigger value="finance">Finance</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold tracking-tight font-headline mb-1">{event.name}</h1>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4"/>
                Edit Event
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{event.participants.length} participants registered</span>
            </div>
             <div className="flex items-center gap-4 text-sm">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span>${event.registrationFee} registration fee per participant</span>
            </div>
            <Separator />
            <Badge variant="secondary">{event.department.name}</Badge>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Registered Users</CardTitle>
            <CardDescription>
              A list of all users registered for {event.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Registered On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.participants.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person" />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.college}</TableCell>
                    <TableCell>{formattedRegistrationDates[user.id]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="winners">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Winner Details</CardTitle>
            <CardDescription>
              Winners and prize money distribution for {event.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead>Prize Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {winners.length > 0 ? winners.map((winner) => (
                  <TableRow key={winner.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Trophy className={`h-6 w-6 ${winner.position === 1 ? 'text-yellow-500' : winner.position === 2 ? 'text-gray-400' : 'text-orange-400'}`} />
                        <span className="font-bold text-lg">{winner.position}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={winner.user.avatarUrl} alt={winner.user.name} data-ai-hint="person"/>
                          <AvatarFallback>{winner.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{winner.user.name}</p>
                          <p className="text-xs text-muted-foreground">{winner.user.college}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${winner.prizeAmount.toLocaleString()}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">No winners recorded yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="finance">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Financial Summary</CardTitle>
            <CardDescription>
              Financial details for {event.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-headline">${totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">From {event.participants.length} registrations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Prizes Awarded</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-headline">${totalPrizes.toLocaleString()}</div>
                   <p className="text-xs text-muted-foreground">To {winners.length} winners</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold font-headline ${totalRevenue - totalPrizes >= 0 ? 'text-green-600' : 'text-red-600'}`}>${(totalRevenue - totalPrizes).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Revenue minus prizes</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  );
}
