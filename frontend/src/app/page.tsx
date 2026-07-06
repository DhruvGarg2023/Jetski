"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { initSocket } from "@/services/socket";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize socket silently to ensure it doesn't throw errors
    const socket = initSocket();
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Phase 1 is Working! 🎉</h1>
        <p className="text-muted-foreground max-w-[600px]">
          The Next.js App Router, Tailwind CSS, shadcn/ui, next-themes, and global providers are all successfully configured.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 border p-8 rounded-xl bg-card shadow-sm">
        <h2 className="text-xl font-semibold">Test Controls</h2>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            variant="default" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            Toggle Theme (Current: {theme})
          </Button>
          
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                // Testing Axios client configuration (will likely 404/network error, but proves Axios works)
                await api.get('/');
                alert('Axios request dispatched successfully!');
              } catch (e: any) {
                alert(`Axios request dispatched. Expected error: ${e.message}`);
              }
            }}
          >
            Test Axios Client
          </Button>
        </div>
      </div>
    </div>
  );
}
