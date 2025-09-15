
"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import type { LoggedInUser } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LifeBuoy, LogOut, Settings } from "lucide-react";

const pathToTitle: { [key: string]: string } = {
  "/portal/dashboard": "Dashboard",
  "/portal/events": "Events",
  "/portal/departments": "Departments",
  "/portal/finance": "Finance",
  "/portal/registered-users": "Registered Users",
};

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pathToTitle[pathname] || "Event Details";
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
    router.push("/");
  };
  
  if (!isClient) {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="flex-1">
        <h1 className="font-headline text-xl font-semibold md:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex flex-1 items-center gap-4 md:ml-auto md:flex-initial">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events or users..."
            className="pl-8"
          />
        </div>
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                 <AvatarImage
                    src={`https://picsum.photos/seed/${user?.name || 'admin'}/40/40`}
                    alt={user?.name || "Admin"}
                    data-ai-hint="person"
                  />
                <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
                <div className="flex flex-col">
                    <span className="text-sm font-medium">{user?.name || 'Admin'}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email || ''}
                    </span>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
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
      </div>
    </header>
  );
}
