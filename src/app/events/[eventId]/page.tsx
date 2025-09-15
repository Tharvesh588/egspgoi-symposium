
"use client";

import Image from "next/image";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { events, winners as allWinners } from "@/lib/data";
import { parseISO } from "date-fns";
import { format } from 'date-fns-tz';
import { notFound, useParams } from "next/navigation";
import { Calendar, Users, Trophy, DollarSign, MapPin, Ticket } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [formattedDate, setFormattedDate] = useState("");
  const event = events.find((e) => e.id === eventId);

  useEffect(() => {
    if (event) {
      setFormattedDate(
        format(parseISO(event.date), "EEEE, MMMM d, yyyy 'at' h:mm a", { timeZone: 'UTC' })
      );
    }
  }, [event]);

  if (!event) {
    notFound();
  }

  const winners = allWinners.filter((w) => w.eventId === event.id);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              data-ai-hint={event.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-4xl font-bold font-headline text-white">
                {event.name}
              </h1>
              <Badge variant="secondary" className="mt-2">{event.department.name}</Badge>
            </div>
          </div>

          <div>
             <h2 className="text-2xl font-bold font-headline mb-4">About this Event</h2>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

           <div>
             <h2 className="text-2xl font-bold font-headline mb-4">Winners</h2>
             {winners.length > 0 ? (
                <Card>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Winner</TableHead>
                        <TableHead>Prize Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {winners.map((winner) => (
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
                        ))}
                    </TableBody>
                    </Table>
                </Card>
             ) : (
                <p className="text-muted-foreground">Winners have not been announced yet. Stay tuned!</p>
             )}
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
           <Card className="overflow-hidden">
             <CardHeader className="p-0">
                <div className="bg-muted p-4">
                    <CardTitle className="font-headline text-xl">Event Details</CardTitle>
                </div>
             </CardHeader>
             <CardContent className="p-4 space-y-4">
                 <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                        <p className="font-semibold">{formattedDate}</p>
                        <p className="text-sm text-muted-foreground">Date and Time</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                        <p className="font-semibold">ECE Block, Room 303</p>
                        <p className="text-sm text-muted-foreground">Venue</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Users className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                        <p className="font-semibold">{event.participants.length} already registered</p>
                        <p className="text-sm text-muted-foreground">Participants</p>
                    </div>
                </div>
             </CardContent>
           </Card>
            <Card className="text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">${event.registrationFee}</CardTitle>
                    <CardDescription>Registration Fee</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button size="lg" className="w-full">
                        <Ticket className="mr-2 h-5 w-5" />
                        Register Now
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
