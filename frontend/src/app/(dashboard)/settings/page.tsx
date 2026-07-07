"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [pat, setPat] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load existing PAT if available
    const existingPat = localStorage.getItem("github_pat");
    if (existingPat) {
      setPat(existingPat);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (pat.trim().length === 0) {
      toast.error("Please enter a valid GitHub PAT.");
      return;
    }
    localStorage.setItem("github_pat", pat);
    setIsSaved(true);
    toast.success("GitHub PAT saved successfully!");
  };

  const handleClear = () => {
    localStorage.removeItem("github_pat");
    setPat("");
    setIsSaved(false);
    toast.info("GitHub PAT cleared.");
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            GitHub Personal Access Token
          </CardTitle>
          <CardDescription>
            Enter your GitHub Personal Access Token (PAT) to allow Jetski to connect to your repositories and perform code reviews. 
            This token is stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="pat">Personal Access Token</Label>
            <Input
              id="pat"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={pat}
              onChange={(e) => {
                setPat(e.target.value);
                if (isSaved) setIsSaved(false);
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Your token needs the <strong>repo</strong> scope to read repositories and commits.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear} disabled={!isSaved && pat.length === 0}>
            Clear
          </Button>
          <Button onClick={handleSave} disabled={isSaved && pat.length > 0}>
            {isSaved ? "Saved" : "Save Token"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
