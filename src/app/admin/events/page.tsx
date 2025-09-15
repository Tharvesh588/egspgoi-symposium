
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { LoggedInUser, Event } from "@/lib/types";

import { events as allEvents } from "@/lib/data";
import { parseISO } from "date-fns";
import { format } from "date-fns-tz";
import { Users, Calendar as CalendarIcon, PlusCircle, Globe, Video, Smartphone, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";

export default function AdminEventsPage() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [paymentType, setPaymentType] = useState("free");
  const [eventMode, setEventMode] = useState("offline");
  const [date, setDate] = useState<Date>();
  const [formattedDates, setFormattedDates] = useState<Record<string, string>>({});

   useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");
    if (userData) {
      const parsedUser = JSON.parse(userData) as LoggedInUser;
      setUser(parsedUser);
      if (parsedUser.role === 'superadmin') {
        setEvents(allEvents);
      } else if (parsedUser.role === 'department' && parsedUser.departmentId) {
        setEvents(allEvents.filter(event => event.department.id === parsedUser.departmentId));
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);


  useEffect(() => {
    const newFormattedDates: Record<string, string> = {};
    events.forEach((event) => {
      newFormattedDates[event.id] = format(
        parseISO(event.date),
        "MMMM d, yyyy 'at' h:mm a zzz",
        { timeZone: 'UTC' }
      );
    });
    setFormattedDates(newFormattedDates);
  }, [events]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Events</h2>
          <p className="text-muted-foreground">
            {user?.role === 'superadmin' ? 'Manage all events across the college.' : 'Manage events for your department.'}
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-headline">Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new event to the symposium.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Event Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Hackathon 2024"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of the event."
                  className="col-span-3"
                />
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="thumbnail" className="text-right pt-2">
                  Event Thumbnail
                </Label>
                <div className="col-span-3">
                  <div className="relative">
                     <Upload className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="thumbnail"
                      type="file"
                      className="pl-8"
                      accept="image/*"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload an image less than 1MB.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="datetime" className="text-right">
                  Date & Time
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal col-span-3",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Event Mode</Label>
                <div className="col-span-3">
                  <RadioGroup
                    defaultValue="offline"
                    onValueChange={setEventMode}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="offline" id="offline" />
                      <Label htmlFor="offline">Offline</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">Online</Label>
                    </div>
                  </RadioGroup>
                  {eventMode === "offline" && (
                    <div className="relative mt-3">
                      <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="venue" placeholder="Venue" className="pl-8 mt-2" />
                    </div>
                  )}
                  {eventMode === "online" && (
                     <div className="relative mt-3">
                      <Video className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="meet-url" placeholder="Google Meet / Zoom URL" className="pl-8 mt-2" />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Payment</Label>
                <div className="col-span-3">
                  <RadioGroup
                    defaultValue="free"
                    onValueChange={setPaymentType}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free">Free</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid">Paid</Label>
                    </div>
                  </RadioGroup>
                  {paymentType === "paid" && (
                    <div className="mt-3 grid gap-3">
                       <Input
                        id="registration-fee"
                        type="number"
                        placeholder="Registration Fee"
                      />
                      <RadioGroup defaultValue="online-gateway" className="flex gap-4">
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="online-gateway" id="online-gateway" />
                            <Label htmlFor="online-gateway">Online Gateway</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="qr-code" id="qr-code" />
                            <Label htmlFor="qr-code">QR Code + Screenshot</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Contact
                </Label>
                <div className="relative col-span-3">
                    <Smartphone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="contact" placeholder="Contact Number" className="pl-8"/>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.id}
            className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 w-full">
              <Image
                src={event.imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                data-ai-hint={event.imageHint}
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-xl mb-1">
                  {event.name}
                </CardTitle>
                <Badge variant="secondary">{event.department.name}</Badge>
              </div>
              <CardDescription className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                {formattedDates[event.id] || "Loading..."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {event.participants.length} Participants
                </span>
              </div>
              <Button asChild variant="default" size="sm">
                <Link href={`/portal/events/${event.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

    