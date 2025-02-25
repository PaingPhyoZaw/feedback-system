"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartBarIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline"
import { Skeleton } from "@/components/ui/skeleton"

export function SummaryCards({ dateRange, isLoading: externalLoading = false }) {
  const [summaryData, setSummaryData] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    latestFeedbackDate: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/feedback')
        const feedbacks = await response.json()
        
        const total = feedbacks.length
        const avgRating = feedbacks.length > 0
          ? (feedbacks.reduce((acc, curr) => 
              acc + (curr.serviceRating + curr.conditionRating + curr.feeRating + curr.durationRating) / 4, 0
            ) / total).toFixed(1)
          : 0
        const latestDate = feedbacks.length > 0
          ? new Date(Math.max(...feedbacks.map(f => new Date(f.createdAt)))).toLocaleDateString()
          : "No feedback yet"

        setSummaryData({
          totalFeedbacks: total,
          averageRating: Number(avgRating),
          latestFeedbackDate: latestDate,
        })
      } catch (error) {
        console.error('Error fetching summary data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummaryData()
  }, [dateRange])

  const cards = [
    { title: "Total Feedbacks", value: summaryData.totalFeedbacks, icon: ChartBarIcon, change: "+20.1%" },
    { title: "Average Rating", value: summaryData.averageRating, icon: UserGroupIcon, change: "+15%" },
    { title: "Latest Feedback", value: summaryData.latestFeedbackDate, icon: ClockIcon, change: "2 days ago" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {(isLoading || externalLoading) ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.change}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}