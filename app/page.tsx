"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { Loader2, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: string
  text: string
  options: {
    emoji: string
    label: string
    color: string
  }[]
}

export default function FeedbackPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const questions: Question[] = [
    {
      id: "staff",
      text: "ဝန်ဆောင်မှုလက်ခံသူ၏ ဆက်ဆံရေး",
      options: [
        { emoji: "😊", label: "အလွန်ကျေနပ်", color: "bg-green-500" },
        { emoji: "😃", label: "ကျေနပ်", color: "bg-green-400" },
        { emoji: "😐", label: "သာမန်", color: "bg-yellow-400" },
        { emoji: "😕", label: "မကျေနပ်", color: "bg-orange-400" },
        { emoji: "😡", label: "အလွန်မကျေနပ်", color: "bg-red-500" },
      ],
    },
    {
      id: "condition",
      text: "ပြင်ဆင်ပြီးဖုန်း၏ အခြေအနေ",
      options: [
        { emoji: "😊", label: "အရမ်းကောင်း", color: "bg-green-500" },
        { emoji: "😃", label: "ကောင်း", color: "bg-green-400" },
        { emoji: "😐", label: "သာမန်", color: "bg-yellow-400" },
        { emoji: "😕", label: "မကောင်း", color: "bg-orange-400" },
        { emoji: "😡", label: "အရမ်းညံ့", color: "bg-red-500" },
      ],
    },
    {
      id: "fee",
      text: "ဝန်ဆောင်ခ၏ သင့်တော်မှု",
      options: [
        { emoji: "😊", label: "အလွန်သင့်တော်", color: "bg-green-500" },
        { emoji: "😃", label: "သင့်တော်", color: "bg-green-400" },
        { emoji: "😐", label: "သာမန်", color: "bg-yellow-400" },
        { emoji: "😕", label: "မသင့်တော်", color: "bg-orange-400" },
        { emoji: "😡", label: "အလွန်မသင့်တော်", color: "bg-red-500" },
      ],
    },
    {
      id: "duration",
      text: "ဖုန်းပြင်ဆင်မှု၏ ကြာချိန်",
      options: [
        { emoji: "⚡", label: "အလွန်မြန်", color: "bg-green-500" },
        { emoji: "🏃", label: "မြန်", color: "bg-green-400" },
        { emoji: "🕒", label: "သာမန်", color: "bg-yellow-400" },
        { emoji: "🐢", label: "နှေး", color: "bg-orange-400" },
        { emoji: "😫", label: "အလွန်နှေး", color: "bg-red-500" },
      ],
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmitting(true)
    try {
      // Get center from URL or default to 'mdy'
      const center = new URLSearchParams(window.location.search).get('center') || 'mdy'
      
      const response = await fetch(`/api/feedback?center=${center}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staff: ratings.staff || 0,
          condition: ratings.condition || 0,
          fee: ratings.fee || 0,
          duration: ratings.duration || 0,
          comment: form.querySelector('textarea')?.value || ''
        }),
      })

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          setRatings({})
          const textarea = form.querySelector('textarea')
          if (textarea) {
            textarea.value = ''
          }
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-full">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed inset-x-0 top-4 z-50 mx-auto max-w-sm"
            >
              <Card className="bg-green-50 p-4">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Thank you for your feedback!</span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

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
              disabled={isSubmitting}
            />
          </Card>

          <Button 
            type="submit" 
            className="w-full py-6 text-lg"
            disabled={isSubmitting}
            variant={isSubmitting ? "outline" : "default"}
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </span>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}