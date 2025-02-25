"use client"

import { useState } from "react"
import { DateRangePicker } from "@/components/DateRangePicker"
import { SummaryCards } from "@/components/SummaryCards"
import { FeedbackCharts } from "@/components/FeedbackCharts"
import { FeedbackTable } from "@/components/FeedbackTable"

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() })

  return (
    <div className="space-y-6">
      <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      <SummaryCards dateRange={dateRange} />
      <FeedbackCharts dateRange={dateRange} />
      <FeedbackTable dateRange={dateRange} />
    </div>
  )
}

