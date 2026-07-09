"use client";

import * as React from "react";
import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Topbar } from "@/features/dashboard/components/Topbar";
import { DotBackground } from "@/components/magicui/dot-background";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // AuthProvider will already redirect, but just as a safety net:
  if (!user) {
    return null;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col relative z-0">
        <Topbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-transparent overflow-auto relative z-10">
          <DotBackground className="absolute inset-0 z-[-1]" />
          {children}
        </main>
      </div>
    </div>
  );
}
