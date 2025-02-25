"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

interface Question {
  id: string
  text: string
  options: {
    emoji: string
    label: string
    color: string
  }[]
}

export default function FeedbackForm() {
  const [ratings, setRatings] = useState<Record<string, number>>({})

  const questions: Question[] = [
    {
      id: "staff",
      text: "Service Staff Interaction",
      options: [
        { emoji: "😊", label: "Very Satisfied", color: "bg-green-500" },
        { emoji: "😃", label: "Satisfied", color: "bg-green-400" },
        { emoji: "😐", label: "Neutral", color: "bg-yellow-400" },
        { emoji: "😕", label: "Dissatisfied", color: "bg-orange-400" },
        { emoji: "😡", label: "Very Dissatisfied", color: "bg-red-500" },
      ],
    },
    {
      id: "condition",
      text: "Phone Condition After Repair",
      options: [
        { emoji: "😊", label: "Excellent", color: "bg-green-500" },
        { emoji: "😃", label: "Good", color: "bg-green-400" },
        { emoji: "😐", label: "Normal", color: "bg-yellow-400" },
        { emoji: "😕", label: "Bad", color: "bg-orange-400" },
        { emoji: "😡", label: "Very Poor", color: "bg-red-500" },
      ],
    },
    {
      id: "fee",
      text: "Service Fee Appropriateness",
      options: [
        { emoji: "😊", label: "Very Fair", color: "bg-green-500" },
        { emoji: "😃", label: "Fair", color: "bg-green-400" },
        { emoji: "😐", label: "Neutral", color: "bg-yellow-400" },
        { emoji: "😕", label: "Unfair", color: "bg-orange-400" },
        { emoji: "😡", label: "Very Unfair", color: "bg-red-500" },
      ],
    },
    {
      id: "duration",
      text: "Repair Duration",
      options: [
        { emoji: "⚡", label: "Very Fast", color: "bg-green-500" },
        { emoji: "🏃", label: "Fast", color: "bg-green-400" },
        { emoji: "🕒", label: "Normal", color: "bg-yellow-400" },
        { emoji: "🐢", label: "Slow", color: "bg-orange-400" },
        { emoji: "😫", label: "Very Slow", color: "bg-red-500" },
      ],
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted ratings:", ratings)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-full">
        <Button variant="ghost" size="icon" className="mb-4 rounded-full bg-white/90 shadow-sm">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="overflow-hidden bg-white/80 p-6 backdrop-blur-sm">
              <h3 className="mb-6 text-center text-xl font-medium text-gray-800">{question.text}</h3>
              <div className="flex flex-wrap justify-between gap-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRatings({ ...ratings, [question.id]: index })}
                    className="group flex flex-1 min-w-[100px] flex-col items-center"
                  >
                    <div
                      className={`relative mb-3 h-20 w-20 transform rounded-full transition-all duration-200 
                      ${ratings[question.id] === index ? option.color : "bg-gray-100"} 
                      ${ratings[question.id] === index ? "scale-110 ring-2 ring-offset-2" : "hover:scale-105"}
                      before:absolute before:inset-0 before:rounded-full before:shadow-inner
                    `}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-4xl">{option.emoji}</span>
                    </div>
                    <span className="text-center text-sm text-gray-600">{option.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          ))}

          <Card className="bg-white/80 p-6 backdrop-blur-sm">
            <Textarea
              placeholder="Please tell your experience (Optional)"
              className="min-h-[120px] resize-none bg-white/70 text-lg"
            />
          </Card>

          <Button type="submit" className="w-full bg-black py-6 text-lg text-white hover:bg-black/90">
            Submit Feedback
          </Button>
        </form>
      </div>
    </div>
  )
}

