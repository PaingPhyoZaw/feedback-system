"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Skeleton } from "@/components/ui/skeleton"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function getDaysInMonth(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1
    const monthDisplay = month + 1 // Convert 0-based month to 1-based
    return `${monthDisplay}/${day}`
  })
}

function groupByDateWithAverage(feedbacks, currentMonth) {
  return feedbacks.reduce((acc, feedback) => {
    const date = new Date(feedback.createdAt)
    // Only process feedback from current month
    if (date.getMonth() === currentMonth) {
      const monthDisplay = date.getMonth() + 1
      const key = `${monthDisplay}/${date.getDate()}`
      
      if (!acc[key]) {
        acc[key] = { total: 0, count: 0 }
      }
      
      const avgRating = (
        feedback.serviceRating + 
        feedback.conditionRating + 
        feedback.feeRating + 
        feedback.durationRating
      ) / 4

      acc[key].total += avgRating
      acc[key].count += 1
    }
    return acc
  }, {})
}

export function FeedbackCharts({ dateRange, isLoading: externalLoading = false }) {
  const [chartData, setChartData] = useState({
    lineData: { labels: [], datasets: [] },
    barData: { labels: [], datasets: [] }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true)
        const currentDate = dateRange?.from || new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()
        
        // Set first and last day of current month
        const firstDay = new Date(currentYear, currentMonth, 1)
        const lastDay = new Date(currentYear, currentMonth + 1, 0)

        const response = await fetch(`/api/feedback?from=${firstDay.toISOString()}&to=${lastDay.toISOString()}`)
        const feedbacks = await response.json()

        // Line Chart Data
        const days = getDaysInMonth(currentDate)
        const dateAverages = groupByDateWithAverage(feedbacks, currentMonth)
        
        const lineData = {
          labels: days,
          datasets: [{
            label: 'Daily Average Rating',
            data: days.map(day => {
              const dayData = dateAverages[day]
              return dayData ? Number(dayData.total / dayData.count).toFixed(1) : null
            }),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        }

        // Bar Chart Data
        const avgRatings = calculateAverageRatings(feedbacks)
        const barData = {
          labels: ['Service', 'Condition', 'Fee', 'Duration'],
          datasets: [{
            label: 'Average Ratings',
            data: [avgRatings.service, avgRatings.condition, avgRatings.fee, avgRatings.duration],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
            ],
          }]
        }

        setChartData({ lineData, barData })
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [dateRange?.from])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { stepSize: 1 }
      },
      x: {
        grid: {
          display: true
        }
      }
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      },
      legend: {
        position: 'top'
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Feedback Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {(isLoading || externalLoading) ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Line data={chartData.lineData} options={chartOptions} />
          )}
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {(isLoading || externalLoading) ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Bar data={chartData.barData} options={chartOptions} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function calculateAverageRatings(feedbacks) {
  if (feedbacks.length === 0) {
    return { service: 0, condition: 0, fee: 0, duration: 0 }
  }

  const sum = feedbacks.reduce((acc, feedback) => ({
    service: acc.service + feedback.serviceRating,
    condition: acc.condition + feedback.conditionRating,
    fee: acc.fee + feedback.feeRating,
    duration: acc.duration + feedback.durationRating,
  }), { service: 0, condition: 0, fee: 0, duration: 0 })

  return {
    service: (sum.service / feedbacks.length).toFixed(1),
    condition: (sum.condition / feedbacks.length).toFixed(1),
    fee: (sum.fee / feedbacks.length).toFixed(1),
    duration: (sum.duration / feedbacks.length).toFixed(1),
  }
}

