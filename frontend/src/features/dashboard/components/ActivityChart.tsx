"use client";

import { useTheme } from "next-themes";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";

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
      <Card className="h-full">
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
                    <stop offset="5%" stopColor={theme === 'dark' ? '#3b82f6' : '#2563eb'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme === 'dark' ? '#3b82f6' : '#2563eb'} stopOpacity={0} />
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
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#f9fafb' : '#111827'
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#60a5fa' : '#2563eb' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
