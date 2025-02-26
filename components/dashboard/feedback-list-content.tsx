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
import { Star, ChevronLeft, ChevronRight, Download } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ServiceCenter {
  id: string
  name: string
  location: string
}

interface Feedback {
  id: string
  createdAt: Date
  serviceRating: number
  conditionRating: number
  feeRating: number
  durationRating: number
  comment: string | null
  serviceCenter: ServiceCenter
}

interface PaginationInfo {
  total: number
  pages: number
  page: number
  limit: number
}

export function FeedbackListContent() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([])
  const [selectedCenter, setSelectedCenter] = useState<string>("all")
  const [date, setDate] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10
  })

  useEffect(() => {
    const fetchServiceCenters = async () => {
      try {
        const response = await fetch('/api/service-centers')
        const data = await response.json()
        setServiceCenters(data)
      } catch (error) {
        console.error('Error fetching service centers:', error)
      }
    }

    fetchServiceCenters()
  }, [])

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        if (date?.from) queryParams.append('from', date.from.toISOString())
        if (date?.to) queryParams.append('to', date.to.toISOString())
        if (selectedCenter !== 'all') queryParams.append('centerId', selectedCenter)
        queryParams.append('page', pagination.page.toString())
        queryParams.append('limit', pagination.limit.toString())
        
        const response = await fetch(`/api/feedback?${queryParams}`)
        const data = await response.json()
        setFeedbacks(data.feedbacks)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Error fetching feedback:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [date, selectedCenter, pagination.page, pagination.limit])

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

  const handleExport = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (date?.from) queryParams.append('from', date.from.toISOString())
      if (date?.to) queryParams.append('to', date.to.toISOString())
      if (selectedCenter !== 'all') queryParams.append('centerId', selectedCenter)
      
      const response = await fetch(`/api/feedback/export?${queryParams}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `feedback-list-${format(new Date(), 'yyyy-MM-dd')}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting feedback:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Feedback List
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Select value={selectedCenter} onValueChange={setSelectedCenter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Service Centers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Service Centers</SelectItem>
              {serviceCenters.map((center) => (
                <SelectItem key={center.id} value={center.id}>
                  {center.name} - {center.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b dark:border-gray-700">
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Date</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Service Center</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Service</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Condition</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Fee</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Duration</TableHead>
                <TableHead className="font-medium text-gray-700 dark:text-gray-300">Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    </TableRow>
                  ))}
                </>
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-500 dark:text-gray-400">
                    No feedback found
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((feedback) => (
                  <TableRow key={feedback.id} className="border-b dark:border-gray-700">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {format(new Date(feedback.createdAt), "MMM d, yyyy")}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(feedback.createdAt), "h:mm a")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{feedback.serviceCenter.name}</div>
                        <div className="text-sm text-gray-500">{feedback.serviceCenter.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(feedback.serviceRating)}</TableCell>
                    <TableCell>{renderStars(feedback.conditionRating)}</TableCell>
                    <TableCell>{renderStars(feedback.feeRating)}</TableCell>
                    <TableCell>{renderStars(feedback.durationRating)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {feedback.comment || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && feedbacks.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
