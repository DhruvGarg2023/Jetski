"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, User, Moon, Sun, Monitor, Activity, Code2, Cpu } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { projectsService } from "@/features/projects/projects.service";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/magicui/border-beam";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [pat, setPat] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsService.getProjects(),
  });

  useEffect(() => {
    // Load existing PAT if available
    const existingPat = localStorage.getItem("github_pat");
    if (existingPat) {
      setPat(existingPat);
      setIsSaved(true);
    }
  }, []);

  const handleSavePat = () => {
    if (pat.trim().length === 0) {
      toast.error("Please enter a valid GitHub PAT.");
      return;
    }
    localStorage.setItem("github_pat", pat);
    setIsSaved(true);
    toast.success("GitHub PAT saved successfully!");
  };

  const handleClearPat = () => {
    localStorage.removeItem("github_pat");
    setPat("");
    setIsSaved(false);
    toast.info("GitHub PAT cleared.");
  };

  // Calculate API Usage
  const usageStats = useMemo(() => {
    if (!projects) return { promptTokens: 0, completionTokens: 0, totalTokens: 0, totalCostEst: 0 };
    
    let promptTokens = 0;
    let completionTokens = 0;

    projects.forEach(project => {
      if (project.repositories) {
        project.repositories.forEach(repo => {
          if (repo.reviews) {
            repo.reviews.forEach(review => {
              if (review.aiHistory) {
                promptTokens += review.aiHistory.promptTokens || 0;
                completionTokens += review.aiHistory.completionTokens || 0;
              }
            });
          }
        });
      }
    });

    const totalTokens = promptTokens + completionTokens;
    // Rough estimation for Gemini 1.5 Flash (free tier is free, but if paid: ~$0.075 / 1M tokens)
    const totalCostEst = (totalTokens / 1_000_000) * 0.075; 

    return { promptTokens, completionTokens, totalTokens, totalCostEst };
  }, [projects]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10"
    >
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="api-usage">API Usage</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Profile
              </CardTitle>
              <CardDescription>
                Manage your public profile and personal details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{user?.name || 'Unnamed User'}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="grid gap-2 pt-4">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue={user?.name || ''} disabled />
                <p className="text-xs text-muted-foreground">
                  Your name is synced with your GitHub account.
                </p>
              </div>
              <div className="grid gap-2 pt-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue={user?.email || ''} disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of Jetski AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Theme Preference</Label>
                  <div className="flex gap-4 mt-2">
                    <Button 
                      variant={theme === 'light' ? 'default' : 'outline'} 
                      className="w-32 justify-start gap-2"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button 
                      variant={theme === 'dark' ? 'default' : 'outline'} 
                      className="w-32 justify-start gap-2"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button 
                      variant={theme === 'system' ? 'default' : 'outline'} 
                      className="w-32 justify-start gap-2"
                      onClick={() => setTheme('system')}
                    >
                      <Monitor className="h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                API & Token Usage
              </CardTitle>
              <CardDescription>
                Track your token usage across all AI code reviews. 
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProjectsLoading ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <Skeleton className="h-24 rounded-lg" />
                  <Skeleton className="h-24 rounded-lg" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col p-4 bg-muted/30 rounded-lg border">
                    <span className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <Cpu className="h-4 w-4" />
                      Total Tokens Used
                    </span>
                    <span className="text-2xl font-bold">{usageStats.totalTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col p-4 bg-muted/30 rounded-lg border">
                    <span className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                      <Code2 className="h-4 w-4" />
                      Estimated Cost
                    </span>
                    <span className="text-2xl font-bold">
                      ${usageStats.totalCostEst.toFixed(4)}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="mt-8 space-y-4">
                <h4 className="text-sm font-medium border-b pb-2">Usage Breakdown</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Prompt Tokens (Input)</span>
                    <span className="font-medium">{usageStats.promptTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Completion Tokens (Output)</span>
                    <span className="font-medium">{usageStats.completionTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Default Model</span>
                    <span className="font-medium">gemini-2.5-flash</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="github" className="mt-6">
          <motion.div whileHover={{ y: -5 }} className="group relative">
            <Card className="bg-background/50 backdrop-blur-md border-white/10 overflow-hidden shadow-sm transition-all hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)]">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
                <BorderBeam size={300} duration={10} delay={0} />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  GitHub Personal Access Token
                </CardTitle>
                <CardDescription>
                  Enter your GitHub Personal Access Token (PAT) to allow Jetski to connect to your repositories and perform code reviews. 
                  This token is stored locally in your browser.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
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
                    className="bg-black/20 border-white/10"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Your token needs the <strong>repo</strong> scope to read repositories and commits.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between relative z-10 border-t border-white/5 pt-4">
                <Button variant="outline" onClick={handleClearPat} disabled={!isSaved && pat.length === 0} className="hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30">
                  Clear
                </Button>
                <Button onClick={handleSavePat} disabled={isSaved && pat.length > 0} className={isSaved ? "bg-green-600/20 text-green-500 hover:bg-green-600/30" : ""}>
                  {isSaved ? "Saved" : "Save Token"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
