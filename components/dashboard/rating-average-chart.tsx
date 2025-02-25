"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { useTheme } from "next-themes"

interface RatingData {
  category: string
  average: number
}

interface Props {
  className?: string
  ratingData: RatingData[]
}

export function RatingAverageChart({ className, ratingData }: Props) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const getRatingColor = (value: number) => {
    if (value >= 4) return isDark ? "#22c55e" : "#16a34a" // green
    if (value >= 3) return isDark ? "#eab308" : "#ca8a04" // yellow
    return isDark ? "#ef4444" : "#dc2626" // red
  }

  const getRatingLabel = (value: number) => {
    if (value >= 4) return "Excellent"
    if (value >= 3) return "Good"
    return "Needs Improvement"
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Customer Satisfaction
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span>Excellent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>Needs Improvement</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ratingData}
              margin={{ top: 5, right: 30, left: 0, bottom: 25 }}
              barSize={40}
            >
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [
                  `${value.toFixed(1)} - ${getRatingLabel(value)}`,
                  'Rating'
                ]}
              />
              <Bar
                dataKey="average"
                radius={[6, 6, 0, 0]}
              >
                {ratingData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getRatingColor(entry.average)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
