"use client"

import { Card } from "@/components/ui/card"

interface RecentFeedbackTableProps {
  feedbacks: Array<{
    id: string
    date: string
    serviceRating: number
    conditionRating: number
    feeRating: number
    durationRating: number
    comment: string
  }>
}

export function RecentFeedbackTable({ feedbacks }: RecentFeedbackTableProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Feedback</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Service</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Condition</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Fee</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Comment</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback.id} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{feedback.date}</td>
                  <td className="py-3 px-4">{feedback.serviceRating}</td>
                  <td className="py-3 px-4">{feedback.conditionRating}</td>
                  <td className="py-3 px-4">{feedback.feeRating}</td>
                  <td className="py-3 px-4">{feedback.durationRating}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{feedback.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
