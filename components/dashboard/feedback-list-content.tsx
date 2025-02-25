"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import type { DateRange } from "react-day-picker"
import { Star } from "lucide-react"

interface Feedback {
  id: string
  createdAt: Date
  serviceRating: number
  conditionRating: number
  feeRating: number
  durationRating: number
  comment: string | null
}

export function FeedbackListContent() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [date, setDate] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        if (date?.from) queryParams.append('from', date.from.toISOString())
        if (date?.to) queryParams.append('to', date.to.toISOString())
        
        const response = await fetch(`/api/feedback?${queryParams}`)
        const data = await response.json()
        setFeedbacks(data)
      } catch (error) {
        console.error('Error fetching feedback:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [date])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 transition-colors ${
              i < rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Feedback List
        </h1>
        <DateRangePicker date={date} setDate={setDate} />
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b dark:border-gray-700">
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Date</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Service</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Condition</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Fee</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Duration</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin" />
                      <span className="text-sm font-medium">Loading feedback...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-gray-500 dark:text-gray-400">
                      <span className="text-sm font-medium">No feedback found for the selected date range</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((feedback) => (
                  <TableRow 
                    key={feedback.id}
                    className="border-b dark:border-gray-700 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {format(new Date(feedback.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{renderStars(feedback.serviceRating)}</TableCell>
                    <TableCell>{renderStars(feedback.conditionRating)}</TableCell>
                    <TableCell>{renderStars(feedback.feeRating)}</TableCell>
                    <TableCell>{renderStars(feedback.durationRating)}</TableCell>
                    <TableCell className="max-w-md truncate text-gray-700 dark:text-gray-300">
                      {feedback.comment || 'No comment provided'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
