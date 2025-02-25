"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FeedbackTable({ dateRange, isLoading: externalLoading = false }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [feedbacks, setFeedbacks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true)
        // Include dateRange in the API call
        const from = dateRange?.from?.toISOString()
        const to = dateRange?.to?.toISOString()
        const response = await fetch(`/api/feedback?from=${from}&to=${to}`)
        const data = await response.json()
        setFeedbacks(data)
      } catch (error) {
        console.error('Error fetching feedback:', error)
        setFeedbacks([]) // Reset feedbacks on error
      } finally {
        setIsLoading(false)
      }
    }

    if (dateRange?.from && dateRange?.to) {
      fetchFeedbacks()
    }
  }, [dateRange?.from, dateRange?.to]) // More specific dependencies

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage)

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {(isLoading || externalLoading) ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service Rating</TableHead>
                  <TableHead>Condition Rating</TableHead>
                  <TableHead>Fee Rating</TableHead>
                  <TableHead>Duration Rating</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((feedback) => (
                    <TableRow key={feedback?.id || index}>
                      <TableCell>{feedback?.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{feedback?.serviceRating ?? '-'}</TableCell>
                      <TableCell>{feedback?.conditionRating ?? '-'}</TableCell>
                      <TableCell>{feedback?.feeRating ?? '-'}</TableCell>
                      <TableCell>{feedback?.durationRating ?? '-'}</TableCell>
                      <TableCell>{feedback?.comment || '-'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </CardContent>
    </Card>
  )
}

