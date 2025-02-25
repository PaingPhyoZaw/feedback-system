"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Feedback {
  id: string
  createdAt: string
  serviceRating: number
  conditionRating: number
  feeRating: number
  durationRating: number
  comment: string | null
}

interface Props {
  className?: string
  feedbacks: Feedback[]
}

export function RecentFeedbackCards({ className, feedbacks }: Props) {
  const calculateAverageRating = (feedback: Feedback) => {
    const ratings = [
      feedback.serviceRating,
      feedback.conditionRating,
      feedback.feeRating,
      feedback.durationRating,
    ]
    return ratings.reduce((a, b) => a + b, 0) / ratings.length
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500"
    if (rating >= 3) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Feedback</h3>
        <Link 
          href="/dashboard/feedback" 
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {feedbacks.slice(0, 4).map((feedback, index) => {
          const avgRating = calculateAverageRating(feedback)
          return (
            <Card key={feedback.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://avatar.vercel.sh/${feedback.id}${index}`} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        Customer Feedback
                      </p>
                      <div className="flex items-center">
                        <Star className={cn("h-4 w-4 fill-current", getRatingColor(avgRating))} />
                        <span className={cn("ml-1 text-sm font-medium", getRatingColor(avgRating))}>
                          {avgRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {feedback.comment && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {feedback.comment}
                      </p>
                    )}
                    <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}</span>
                      <span className="mx-1">•</span>
                      <div className="flex space-x-1">
                        <span className={cn("px-1.5 py-0.5 rounded-full text-xs", 
                          feedback.serviceRating >= 4 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                          feedback.serviceRating >= 3 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          Service {feedback.serviceRating}/5
                        </span>
                        <span className={cn("px-1.5 py-0.5 rounded-full text-xs",
                          feedback.conditionRating >= 4 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          feedback.conditionRating >= 3 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          Condition {feedback.conditionRating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
