"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, utcToZonedTime } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

interface Feedback {
  id: number
  serviceRating: number
  conditionRating: number
  feeRating: number
  durationRating: number
  comment: string
  createdAt: string
}

interface OverviewProps {
  feedbacks: Feedback[]
}

export function Overview({ feedbacks: initialFeedbacks, isLoading: externalLoading = false }: OverviewProps & { isLoading?: boolean }) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/feedback/overview')
        const data = await response.json()
        setFeedbacks(data)
      } catch (error) {
        console.error('Error fetching feedbacks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if no initial data is provided
    if (!initialFeedbacks || initialFeedbacks.length === 0) {
      fetchFeedbacks()
    }

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchFeedbacks, 30000)

    // Cleanup interval on unmount
    return () => clearInterval(intervalId)
  }, [initialFeedbacks])

  const processData = () => {
    const today = new Date()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const currentMonthStart = zonedTimeToUtc(startOfMonth(today), timezone)
    const interval = eachDayOfInterval({
      start: currentMonthStart,
      end: zonedTimeToUtc(endOfMonth(today), timezone)
    })

    // Filter feedbacks for current month
    const currentMonthFeedbacks = feedbacks.filter(feedback => {
      const feedbackDate = parseISO(feedback.createdAt)
      return feedbackDate >= currentMonthStart
    })

    const dailyData = interval.map(date => {
      const zonedDate = utcToZonedTime(date, timezone)
      const dayFeedbacks = currentMonthFeedbacks.filter(feedback => {
        const feedbackDate = parseISO(feedback.createdAt)
        const zonedFeedbackDate = utcToZonedTime(feedbackDate, timezone)
        return format(zonedFeedbackDate, 'yyyy-MM-dd') === format(zonedDate, 'yyyy-MM-dd')
      })

      const avgRating = dayFeedbacks.length > 0
        ? (
            dayFeedbacks.reduce((sum, fb) => 
              sum + (fb.serviceRating + fb.conditionRating + fb.feeRating + fb.durationRating) / 4, 
              0
            ) / dayFeedbacks.length
          ).toFixed(1)
        : 0

      return {
        date: format(zonedDate, 'MMM dd'),
        count: dayFeedbacks.length,
        avgRating: Number(avgRating)
      }
    })

    return dailyData
  }

  if (isLoading || externalLoading) {
    return (
      <div className="w-full h-[350px] bg-card rounded-lg p-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-[280px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={processData()}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            background: "var(--background)", 
            border: "1px solid var(--border)" 
          }}
        />
        <Legend />
        <Bar
          dataKey="count"
          name="Number of Feedbacks"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="avgRating"
          name="Average Rating"
          fill="var(--secondary)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
