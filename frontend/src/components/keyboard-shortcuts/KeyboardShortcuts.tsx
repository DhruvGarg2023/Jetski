"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Escape — close modals
      if (e.key === "Escape") {
        setShowHelp(false);
        setPendingKey(null);
        return;
      }

      // ? — show help
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      // Handle two-key combos (G + X, N + X)
      if (pendingKey === "g") {
        setPendingKey(null);
        switch (e.key) {
          case "d":
            e.preventDefault();
            router.push("/dashboard");
            return;
          case "r":
            e.preventDefault();
            router.push("/repositories");
            return;
          case "h":
            e.preventDefault();
            router.push("/reviews");
            return;
          case "s":
            e.preventDefault();
            router.push("/settings");
            return;
        }
      }

      if (pendingKey === "n") {
        setPendingKey(null);
        if (e.key === "r") {
          e.preventDefault();
          router.push("/repositories");
          return;
        }
      }

      // Set pending key for combos
      if (e.key === "g" && !e.ctrlKey && !e.metaKey) {
        setPendingKey("g");
        // Auto-clear after 1 second
        setTimeout(() => setPendingKey(null), 1000);
        return;
      }

      if (e.key === "n" && !e.ctrlKey && !e.metaKey) {
        setPendingKey("n");
        setTimeout(() => setPendingKey(null), 1000);
        return;
      }
    },
    [pendingKey, router]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const shortcuts = [
    { keys: ["Ctrl", "K"], description: "Open Command Palette" },
    { keys: ["G", "D"], description: "Go to Dashboard" },
    { keys: ["G", "R"], description: "Go to Repositories" },
    { keys: ["G", "H"], description: "Go to Review History" },
    { keys: ["G", "S"], description: "Go to Settings" },
    { keys: ["N", "R"], description: "New Review" },
    { keys: ["?"], description: "Show Keyboard Shortcuts" },
    { keys: ["Esc"], description: "Close Modal" },
  ];

  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⌨️ Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate faster with keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <span key={i}>
                    {i > 0 && (
                      <span className="text-muted-foreground mx-0.5 text-xs">
                        +
                      </span>
                    )}
                    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded border border-border bg-muted text-[11px] font-mono font-medium text-muted-foreground">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
