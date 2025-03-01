"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MenuIcon,
  XIcon,
  CircleEllipsis,
  CheckCircle2,
  Clock,
  History,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";
import ConnectPetraWallet from "@/components/tetra";
const navigationItems = [
  {
    label: "In Progress",
    icon: CircleEllipsis,
    count: 3,
    status: "ongoing",
  },
  {
    label: "Completed",
    icon: CheckCircle2,
    count: 8,
    status: "completed",
  },
  {
    label: "Not Started",
    icon: Clock,
    count: 4,
    status: "not_started",
  },
  {
    label: "Past Work",
    icon: History,
    count: 12,
    status: "past",
  },
  {
    label: "Disputed Work",
    icon: AlertCircle,
    count: 1,
    status: "disputed",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ongoing";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleTabChange = (status: string) => {
    router.push(`/client/dashboard?status=${status}`);
  };

  const handleLogout = () => {
    // signOut();
    router.push('/');
  };

  const [isConnected, setIsConnected] = useState(false);

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
              <p className="font-medium">NewClient</p>
              <p className="text-sm text-muted-foreground">NewClient@newclient.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Button
            variant="default"
            className="w-full justify-start gap-3 mt-4"
            onClick={() => router.push("/client/job/create")}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="flex-1 text-left">Create Job</span>
          </Button>
        <ConnectPetraWallet isConnected={isConnected} setIsConnected={setIsConnected} />
        </nav>
      </aside>

      

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-200 ease-in-out",
          isSidebarOpen ? "lg:pl-0" : "lg:pl-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}