
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { events as allEvents, departments } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { Calendar, Users, MapPin, Ticket } from 'lucide-react';
import type { Event } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(allEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(allEvents);
  const [formattedDates, setFormattedDates] = useState<Record<string, {date: string, time: string}>>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [modeFilter, setModeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const newFormattedDates: Record<string, {date: string, time: string}> = {};
    allEvents.forEach((event) => {
      const parsedDate = parseISO(event.date);
      newFormattedDates[event.id] = {
        date: format(parsedDate, "MMMM d, yyyy"),
        time: format(parsedDate, "h:mm a"),
      };
    });
    setFormattedDates(newFormattedDates);
  }, []);

  useEffect(() => {
    let tempEvents = [...events];

    if (modeFilter !== 'all') {
      tempEvents = tempEvents.filter(event => event.mode === modeFilter);
    }
    if (departmentFilter !== 'all') {
      tempEvents = tempEvents.filter(event => event.department.id === departmentFilter);
    }
    if (priceFilter !== 'all') {
      tempEvents = tempEvents.filter(event => priceFilter === 'free' ? event.registrationFee === 0 : event.registrationFee > 0);
    }
    if (categoryFilter !== 'all') {
      tempEvents = tempEvents.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(tempEvents);
  }, [events, modeFilter, departmentFilter, priceFilter, categoryFilter]);


  const EventCard = ({ event }: { event: Event }) => (
      <DialogTrigger asChild>
        <Card
          key={event.id}
          className="flex flex-col overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => setSelectedEvent(event)}
        >
          <div className="relative h-48 w-full">
            <Image
              src={event.imageUrl}
              alt={event.name}
              fill
              className="object-cover"
              data-ai-hint={event.imageHint}
            />
            <Badge className="absolute top-2 right-2" variant={event.mode === 'online' ? 'default' : 'secondary'}>
                {event.mode === 'online' ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="font-headline text-xl mb-1">
                {event.name}
              </CardTitle>
              <Badge variant="outline">{event.department.name}</Badge>
            </div>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              {formattedDates[event.id]?.date} at {formattedDates[event.id]?.time}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-2">
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
            <Button variant="default" size="sm">
                {event.registrationFee === 0 ? 'Free' : `$${event.registrationFee}`}
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
  )

  return (
    <Dialog>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-headline tracking-tight">All Events</h1>
          <p className="text-muted-foreground mt-2">Browse, filter, and discover all the exciting events happening.</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-muted rounded-lg">
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-full sm:w-auto flex-1 min-w-[150px]">
                <SelectValue placeholder="Event Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-auto flex-1 min-w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full sm:w-auto flex-1 min-w-[150px]">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-auto flex-1 min-w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="non-technical">Non-Technical</SelectItem>
              </SelectContent>
            </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
          {filteredEvents.length === 0 && (
              <div className="text-center col-span-full py-12">
                  <p className="text-muted-foreground">No events match the current filters.</p>
              </div>
          )}
        </div>
      </div>

       {selectedEvent && (
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{selectedEvent.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 text-sm">
            <div className="flex items-center gap-2"><span className="font-semibold w-24">Date:</span> <span>{formattedDates[selectedEvent.id]?.date}</span></div>
            <div className="flex items-center gap-2"><span className="font-semibold w-24">Time:</span> <span>{formattedDates[selectedEvent.id]?.time}</span></div>
            <div className="flex items-center gap-2"><span className="font-semibold w-24">Venue:</span> <span>{selectedEvent.mode === 'online' ? 'Online' : 'EGS Pillay Engineering College'}</span></div>
             <div className="flex items-start gap-2">
                <span className="font-semibold w-24 shrink-0">Description:</span> 
                <p className="text-muted-foreground">{selectedEvent.description}</p>
            </div>
            <div className="flex items-center gap-2"><span className="font-semibold w-24">Conducted By:</span> <span>{selectedEvent.department.name}</span></div>
            <div className="flex items-center gap-2"><span className="font-semibold w-24">Price:</span> <span>{selectedEvent.registrationFee === 0 ? 'Free' : `$${selectedEvent.registrationFee}`}</span></div>
          </div>
           <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">For technical support, email us at web@egspec.org</p>
              <div className="flex gap-2">
                <Button>
                  <Ticket className="mr-2 h-4 w-4" />
                  Register
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/events/${selectedEvent.id}`}>View Full Details</Link>
                </Button>
              </div>
           </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
