"use client"

import { Suspense } from "react"
import { FeedbackListContent } from "@/components/dashboard/feedback-list-content"
import { Skeleton } from "@/components/ui/skeleton"

export default function FeedbackListPage() {
  return (
    <Suspense fallback={<FeedbackListSkeleton />}>
      <FeedbackListContent />
    </Suspense>
  )
}

function FeedbackListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-72" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="space-y-4">
            <div className="border-b dark:border-gray-700">
              <div className="grid grid-cols-6 gap-4">
                {Array(6).fill(null).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            </div>
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                {Array(6).fill(null).map((_, j) => (
                  <Skeleton key={j} className="h-6" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}