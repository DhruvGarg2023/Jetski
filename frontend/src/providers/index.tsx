"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { SocketProvider } from "./socket-provider";
import { Toaster } from "sonner";
import { ReviewProgressToast } from "@/features/reviews/components/ReviewProgressToast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          <SocketProvider>
            {children}
            <Toaster 
              richColors 
              position="top-right"
              toastOptions={{
                classNames: {
                  toast: "bg-background border-border border shadow-2xl rounded-xl font-sans",
                  description: "text-muted-foreground",
                  actionButton: "bg-primary text-primary-foreground font-medium",
                  cancelButton: "bg-muted text-muted-foreground",
                },
              }}
            />
            <ReviewProgressToast />
          </SocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

