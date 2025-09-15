
"use client";

import Link from "next/link";
import { AppWindow, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import type { LoggedInUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { LifeBuoy, LogOut, Settings } from "lucide-react";


export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("loggedInUser");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    router.push("/");
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="w-full px-[50px]">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
          <AppWindow className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg hidden sm:inline-block">Symposium Central</span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm">
               <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">Explore Events</Link>
               <Link href="/#about-event" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
               <Link href="/code-of-conduct" className="text-muted-foreground transition-colors hover:text-foreground">Code of Conduct</Link>
            </nav>

            <div className="flex items-center justify-end gap-2 md:gap-4">
               <div className="relative w-full max-w-sm hidden sm:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search events..."
                    className="pl-8"
                  />
                </div>
              {isClient && user ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage
                            src={`https://picsum.photos/seed/${user.name}/40/40`}
                            alt={user.name}
                            data-ai-hint="person"
                          />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {user.email}
                            </span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/u/s/portal/dashboard')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LifeBuoy className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">Sign up</Link>
                  </Button>
                </div>
              )}
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Navigation</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col gap-6 p-6">
                    <Link href="/" className="flex items-center gap-2 font-bold">
                        <AppWindow className="h-6 w-6 text-primary" />
                        <span className="font-headline text-lg">Symposium Central</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                      <SheetClose asChild>
                        <Link href="/events" className="text-muted-foreground transition-colors hover:text-foreground">Explore Events</Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/#about-event" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/code-of-conduct" className="text-muted-foreground transition-colors hover:text-foreground">Code of Conduct</Link>
                      </SheetClose>
                    </nav>
                     <div className="flex flex-col gap-2 pt-4 border-t">
                        {isClient && user ? (
                          <Button onClick={handleLogout}>Log out</Button>
                        ) : (
                          <>
                            <SheetClose asChild>
                                <Button variant="outline" asChild>
                                    <Link href="/auth/login">Log in</Link>
                                </Button>
                            </SheetClose>
                             <SheetClose asChild>
                                <Button asChild>
                                    <Link href="/auth/signup">Sign up</Link>
                                </Button>
                            </SheetClose>
                          </>
                        )}
                      </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
