"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface FeedbackFormProps {
  serviceCenterId: string
}

export function FeedbackForm({ serviceCenterId }: FeedbackFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [ratings, setRatings] = useState({
    serviceRating: "",
    conditionRating: "",
    feeRating: "",
    durationRating: "",
  })
  const [comment, setComment] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!Object.values(ratings).every(rating => rating)) {
      toast({
        variant: "destructive",
        title: "Please provide all ratings",
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...ratings,
          comment,
          serviceCenterId,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit feedback")

      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback has been submitted successfully.",
      })

      // Reset form
      setRatings({
        serviceRating: "",
        conditionRating: "",
        feeRating: "",
        durationRating: "",
      })
      setComment("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to submit feedback",
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Service Feedback Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Service Quality</Label>
                <RadioGroup
                  value={ratings.serviceRating}
                  onValueChange={(value) =>
                    setRatings({ ...ratings, serviceRating: value })
                  }
                  className="flex space-x-4"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`service-${value}`} />
                      <Label htmlFor={`service-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Condition & Cleanliness</Label>
                <RadioGroup
                  value={ratings.conditionRating}
                  onValueChange={(value) =>
                    setRatings({ ...ratings, conditionRating: value })
                  }
                  className="flex space-x-4"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`condition-${value}`} />
                      <Label htmlFor={`condition-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Fee Structure</Label>
                <RadioGroup
                  value={ratings.feeRating}
                  onValueChange={(value) =>
                    setRatings({ ...ratings, feeRating: value })
                  }
                  className="flex space-x-4"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`fee-${value}`} />
                      <Label htmlFor={`fee-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Service Duration</Label>
                <RadioGroup
                  value={ratings.durationRating}
                  onValueChange={(value) =>
                    setRatings({ ...ratings, durationRating: value })
                  }
                  className="flex space-x-4"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`duration-${value}`} />
                      <Label htmlFor={`duration-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Comments</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="h-32"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
