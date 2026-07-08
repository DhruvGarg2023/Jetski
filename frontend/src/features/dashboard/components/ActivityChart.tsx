"use client";

import { useTheme } from "next-themes";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import { BorderBeam } from "@/components/magicui/border-beam";

interface ActivityChartProps {
  data: { date: string; count: number }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const { theme } = useTheme();

  // If no data is provided, generate a flat 30-day empty chart for visual placeholder
  const chartData = data.length > 0 ? data : Array.from({ length: 30 }).map((_, i) => ({
    date: format(subDays(new Date(), 29 - i), "MMM dd"),
    count: 0
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="col-span-1 lg:col-span-4"
    >
      <Card className="h-full relative overflow-hidden group bg-background/50 backdrop-blur-sm border-white/10 transition-colors hover:bg-muted/50">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <BorderBeam size={400} duration={15} delay={1} />
        </div>
        <CardHeader>
          <CardTitle>Review Activity</CardTitle>
          <CardDescription>
            Code reviews conducted over the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '12px',
                    color: 'hsl(var(--foreground))',
                    boxShadow: '0 10px 40px -10px rgba(139,92,246,0.3)'
                  }}
                  itemStyle={{ color: '#8b5cf6', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
