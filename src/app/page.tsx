
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { events as allEvents } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { Calendar, Users, ArrowRight, ArrowRightCircle, Lightbulb, Network, Code, Users2, Globe, FileText, Ticket } from 'lucide-react';
import type { Event } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatWidget } from '@/components/chatbot/chat-widget';

const GoogleCalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
  </svg>
);


export default function HomePage() {
  const [onlineEvents, setOnlineEvents] = useState<Event[]>([]);
  const [offlineEvents, setOfflineEvents] = useState<Event[]>([]);
  const [formattedDates, setFormattedDates] = useState<Record<string, {date: string, time: string}>>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);


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

    setOnlineEvents(allEvents.filter(event => event.mode === 'online'));
    setOfflineEvents(allEvents.filter(event => event.mode === 'offline'));

  }, []);

  const speakers = [
    {
      name: 'Dr. Evelyn Reed',
      title: 'AI Researcher',
      company: 'Synthara Corp',
      avatarUrl: 'https://picsum.photos/seed/speaker1/200/200',
      imageHint: 'woman portrait',
    },
    {
      name: 'Marcus Chen',
      title: 'Cloud Architect',
      company: 'NexusCloud',
      avatarUrl: 'https://picsum.photos/seed/speaker2/200/200',
      imageHint: 'man portrait',
    },
    {
      name: 'Priya Sharma',
      title: 'Cybersecurity Expert',
      company: 'SecureNet',
      avatarUrl: 'https://picsum.photos/seed/speaker3/200/200',
      imageHint: 'woman professional',
      
    },
    {
      name: 'Ben Carter',
      title: 'Head of Product',
      company: 'InnovateX',
      avatarUrl: 'https://picsum.photos/seed/speaker4/200/200',
      imageHint: 'man professional',
    },
  ];

  const EventCard = ({ event }: { event: Event }) => (
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
          <Button asChild variant="default" size="sm" onClick={(e) => e.stopPropagation()}>
              <Link href={`/events/${event.id}`}>
              {event.registrationFee === 0 ? 'Free' : `$${event.registrationFee}`}
              </Link>
          </Button>
        </CardFooter>
      </Card>
  );

  const ViewAllCard = () => (
     <Card className="flex flex-col h-full items-center justify-center bg-muted/50 hover:bg-muted transition-colors">
      <CardContent className="flex flex-col items-center justify-center text-center p-6">
        <ArrowRightCircle className="h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-bold font-headline mb-2">Explore More</h3>
        <p className="text-muted-foreground mb-4">You've seen the highlights. Discover all the events we have to offer.</p>
        <Button asChild>
          <Link href="/events">View All Events</Link>
        </Button>
      </CardContent>
    </Card>
  )


  return (
    <Dialog onOpenChange={(open) => !open && setSelectedEvent(null)}>
      <main className="flex-1">
        <section className="relative h-[80vh] flex items-center justify-center text-center text-white">
          <Image
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Audience at a symposium"
            fill
            className="object-cover -z-10"
            data-ai-hint="conference audience"
          />
          <div className="absolute inset-0 bg-black/60 -z-10" />

          <div className="container px-4 md:px-6">
              <Badge>#EGSPECISSH-T</Badge>
              <h1 className="text-4xl font-extrabold font-headline md:text-7xl mt-4 tracking-tight">
                EGSPEC Biggest Event {new Date().getFullYear()}
              </h1>
              
              <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                Join thousands of students, professionals, and enthusiasts for the most anticipated tech and culture symposium of the year.
              </p>
               <div className="mt-8 flex items-center justify-center gap-4">
                <Button size="lg" variant="secondary">
                  Register Now
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white group">
                  <Link href="/events" className="flex items-center gap-2">
                    <span>Explore Events</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
          </div>
          
        </section>
        
        <section id="about-event" className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <Image src="https://egspec.blob.core.windows.net/egspec-assets/engineering_college.webp" 
                           alt="EGS Pillay Engineering College"
                           width={600}
                           height={400}
                           className="rounded-lg object-cover shadow-lg"
                           data-ai-hint="college campus"
                    />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase text-primary tracking-wider">Welcome to Our Symposium</h2>
                  <h3 className="text-3xl font-bold font-headline mt-2">About This Event</h3>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    Welcome to the International Symposium on Sustainable and High-Performance Computing (ISSH-T), a premier event dedicated to exploring the future of technology. Our symposium brings together leading experts, industry professionals, and aspiring students to share knowledge, foster collaboration, and drive innovation. This year's event focuses on cutting-edge topics in Al, data science, sustainable engineering, and management, providing a platform to discuss challenges and opportunities in shaping our future.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary"/>Engage with experts in various technology streams.</li>
                    <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary"/>Explore comprehensive engineering, management, and career tracks.</li>
                    <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary"/>Network with a broad range of students and professionals.</li>
                    <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary"/>Discover the impact of emerging technologies.</li>
                  </ul>
                   <Button asChild className="mt-6">
                      <Link href="/about">Learn More</Link>
                  </Button>
                </div>
             </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-headline">Who Benefits?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Our symposium is designed to provide value to a wide range of participants, from students to seasoned professionals.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 text-left">
              <div className="p-6 bg-background rounded-lg shadow-sm">
                <Lightbulb className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold font-headline text-lg">Inspiration</h3>
                <p className="text-muted-foreground mt-1">Get inspired by leading experts, groundbreaking research, and innovative projects that are shaping the future of technology.</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-sm">
                <Network className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold font-headline text-lg">Networking</h3>
                <p className="text-muted-foreground mt-1">Expand your professional network by connecting with industry leaders, academic experts, and talented peers from various disciplines.</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-sm">
                <Code className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold font-headline text-lg">Tech Insights</h3>
                <p className="text-muted-foreground mt-1">Gain deep insights into the latest technological advancements and trends directly from the innovators creating them.</p>
              </div>
               <div className="p-6 bg-background rounded-lg shadow-sm">
                <Users2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold font-headline text-lg">Collaborative Sessions</h3>
                <p className="text-muted-foreground mt-1">Participate in interactive workshops and sessions to collaborate, solve problems, and exchange ideas among participants.</p>
              </div>
               <div className="p-6 bg-background rounded-lg shadow-sm">
                <Globe className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold font-headline text-lg">Global Perspective</h3>
                <p className="text-muted-foreground mt-1">Experience a global outlook on tech and business with contributions from international speakers and attendees.</p>
              </div>
               <div className="p-6 bg-background rounded-lg shadow-sm">
                <FileText className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold font-headline text-lg">Exclusive Materials</h3>
                <p className="text-muted-foreground mt-1">Get access to exclusive content, including research papers, presentation slides, and recorded sessions from the event.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 space-y-12">
          <div className="container px-4 md:px-6">
             <h2 className="text-3xl font-bold font-headline tracking-tight mb-8 text-center">
                Upcoming Online Events
            </h2>
          </div>
          <div className='w-full'>
            <Carousel
              opts={{
                  align: "start",
                  dragFree: true,
              }}
              className="w-full"
              >
              <CarouselContent>
                  {onlineEvents.slice(0, 5).map((event) => (
                  <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/4">
                      <div className="p-1 h-full">
                      <EventCard event={event} />
                      </div>
                  </CarouselItem>
                  ))}
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                      <div className="p-1 h-full">
                      <ViewAllCard />
                      </div>
                  </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
          {onlineEvents.length === 0 && (
              <div className="text-center col-span-full py-12 container">
                  <p className="text-muted-foreground">No online events scheduled at the moment.</p>
              </div>
          )}
          
           <div className="container px-4 md:px-6">
             <h2 className="text-3xl font-bold font-headline tracking-tight mb-8 text-center">
                Upcoming Offline Events
            </h2>
           </div>
            <div className='w-full'>
              <Carousel
              opts={{
                  align: "start",
                  dragFree: true,
              }}
              className="w-full"
              >
              <CarouselContent>
                  {offlineEvents.slice(0,5).map((event) => (
                  <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/4">
                      <div className="p-1 h-full">
                      <EventCard event={event} />
                      </div>
                  </CarouselItem>
                  ))}
                  <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                      <div className="p-1 h-full">
                      <ViewAllCard />
                      </div>
                  </CarouselItem>
              </CarouselContent>
              </Carousel>
            </div>
            {offlineEvents.length === 0 && (
                <div className="text-center col-span-full py-12 container">
                    <p className="text-muted-foreground">No offline events scheduled at the moment.</p>
                </div>
            )}
        </section>

        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold font-headline">Our Speakers</h2>
             <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Meet the brilliant minds who will be sharing their insights at our symposium.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-10">
                {speakers.map((speaker) => (
                  <div key={speaker.name} className="flex flex-col items-center text-center">
                    <Avatar className="h-32 w-32 mb-4 border-4 border-background shadow-lg">
                      <AvatarImage src={speaker.avatarUrl} alt={speaker.name} data-ai-hint={speaker.imageHint} />
                      <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold font-headline text-lg">{speaker.name}</h3>
                    <p className="text-primary">{speaker.title}</p>
                    <p className="text-muted-foreground text-sm">{speaker.company}</p>
                  </div>
                ))}
              </div>
          </div>
        </section>
        
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold font-headline">Event &amp; Venue Partner</h2>
              <div className="mt-8 text-center">
                <Image src="/placeholder.svg" alt="Partner logo" width={150} height={50} className="mx-auto" data-ai-hint="logo"/>
             </div>
          </div>
        </section>

         <section className="relative py-16 md:py-24 bg-primary text-primary-foreground">
          <Image
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Crowd at a conference"
            fill
            className="object-cover -z-10"
            data-ai-hint="conference crowd"
          />
           <div className="absolute inset-0 bg-primary/80 -z-10" />
          <div className="container px-4 md:px-6 text-center mx-auto">
              <Badge variant="secondary">Don't Miss Out</Badge>
              <h2 className="text-3xl font-bold font-headline md:text-4xl text-white mt-4">
                Register for the Symposium
              </h2>
              <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">
                Join hundreds of students, professionals, and academics for a multi-day immersion in groundbreaking technology. Register today and take the next step in your career, network with peers, and gain the insights that will shape our future.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary">
                  Register Now
                </Button>
              </div>
          </div>
        </section>
      </main>
      
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
      <ChatWidget />
    </Dialog>
  );
}
