"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MenuIcon, XIcon, Briefcase } from "lucide-react";
import { signOut } from "next-auth/react";


const navigationItems = [
  {
    label: "Applied Jobs",
    icon: Briefcase,
    status: "applied",
  },
];

export default function FreelancerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "applied";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleTabChange = (status: string) => {
    router.push(`/freelancer/dashboard?status=${status}`);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          {isSidebarOpen ? (
            <XIcon className="h-4 w-4" />
          ) : (
            <MenuIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card/50 backdrop-blur-lg border-r border-border/50 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Profile Section */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Freelancer Name</p>
              <p className="text-sm text-muted-foreground">freelancer@example.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant={currentStatus === item.status ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 transition-colors",
                currentStatus === item.status &&
                  "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => handleTabChange(item.status)}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
            </Button>
          ))}
        </nav>
        <Button size="lg" className="glow-effect ml-4" onClick={handleLogout}>Logout</Button>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-200 ease-in-out",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}