"use client"

import { DateRangePicker } from "@/components/date-range-picker"
import { Card, Title, Text } from "@tremor/react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { addDays, format, parseISO, startOfDay } from "date-fns"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  const [date, setDate] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCenter, setSelectedCenter] = useState("all")

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/reports?startDate=${date.from?.toISOString()}&endDate=${date.to?.toISOString()}&centerId=${selectedCenter}`
      )
      const jsonData = await res.json()
      setData(jsonData)
    } catch (error) {
      console.error("Error fetching report data:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReportData()
  }, [date, selectedCenter])

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading reports...</div>
      </div>
    )
  }

  const { overallStats, centerStats, feedbacks, serviceCenters } = data

  // Calculate month-over-month changes
  const calculateMoMChange = (current, previous) => {
    return previous ? ((current - previous) / previous * 100).toFixed(1) : 0
  }

  // Selected center stats
  const selectedCenterStats = selectedCenter === "all" 
    ? overallStats 
    : centerStats.find(c => c.id === selectedCenter)

  // Get previous month stats from API response
  const { previousStats } = data
  const previousMonthStats = {
    totalFeedback: previousStats.totalFeedback,
    averageRating: previousStats.averageRating,
    responseRate: previousStats.responseRate,
    customerSatisfaction: previousStats.customerSatisfaction
  }

  // Prepare time series data for the entire month
  const startOfMonth = startOfDay(new Date(date.from))
  const endOfMonth = date.to
  
  const timeSeriesData = []
  let currentDate = startOfMonth
  
  while (currentDate <= endOfMonth) {
    const dateStr = format(currentDate, 'MMM dd')
    const dayFeedbacks = feedbacks.filter(f => 
      format(parseISO(f.createdAt), 'MMM dd') === dateStr
    )
    
    const dayData = {
      date: dateStr,
      count: dayFeedbacks.length,
      avgRating: dayFeedbacks.length > 0 
        ? Math.round(dayFeedbacks.reduce((acc, f) => {
            const rating = (f.serviceRating + f.conditionRating + 
                          f.feeRating + f.durationRating) / 4
            return acc + rating
          }, 0) / dayFeedbacks.length)
        : 0
    }
    
    timeSeriesData.push(dayData)
    currentDate = addDays(currentDate, 1)
  }

  // Prepare center stats with rounded values
  const roundedCenterStats = centerStats.map(center => ({
    ...center,
    averageRating: Math.round(center.averageRating),
    responseRate: Math.round(center.responseRate),
    customerSatisfaction: Math.round(center.customerSatisfaction)
  }))

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Service Center Reports</h1>
          <p className="text-muted-foreground">
            {selectedCenter === "all" 
              ? "Overview of all service centers" 
              : `Details for ${serviceCenters.find(c => c.id === selectedCenter)?.name}`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCenter} onValueChange={setSelectedCenter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Service Center" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Centers</SelectItem>
              {serviceCenters.map(center => (
                <SelectItem key={center.id} value={center.id}>
                  {center.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex flex-col">
            <Text className="text-sm text-muted-foreground">Total Feedback</Text>
            <div className="flex items-baseline gap-2">
              <Text className="text-2xl font-bold">
                {selectedCenterStats.totalFeedback}
              </Text>
              <Text className={`text-sm ${calculateMoMChange(selectedCenterStats.totalFeedback, previousMonthStats.totalFeedback) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {calculateMoMChange(selectedCenterStats.totalFeedback, previousMonthStats.totalFeedback)}%
              </Text>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <Text className="text-sm text-muted-foreground">Average Rating</Text>
            <div className="flex items-baseline gap-2">
              <Text className="text-2xl font-bold">
                {selectedCenterStats.averageRating.toFixed(1)}
              </Text>
              <Text className="text-sm text-muted-foreground">/5</Text>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <Text className="text-sm text-muted-foreground">Response Rate</Text>
            <div className="flex items-baseline gap-2">
              <Text className="text-2xl font-bold">
                {selectedCenterStats.responseRate}%
              </Text>
              <Text className={`text-sm ${calculateMoMChange(selectedCenterStats.responseRate, previousMonthStats.responseRate) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {calculateMoMChange(selectedCenterStats.responseRate, previousMonthStats.responseRate)}%
              </Text>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-col">
            <Text className="text-sm text-muted-foreground">Customer Satisfaction</Text>
            <div className="flex items-baseline gap-2">
              <Text className="text-2xl font-bold">
                {selectedCenterStats.customerSatisfaction}%
              </Text>
              <Text className={`text-sm ${calculateMoMChange(selectedCenterStats.customerSatisfaction, previousMonthStats.customerSatisfaction) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {calculateMoMChange(selectedCenterStats.customerSatisfaction, previousMonthStats.customerSatisfaction)}%
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="w-full border-b justify-start">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="p-4">
              <div className="flex flex-col gap-1 mb-4">
                <Title className="text-lg">Feedback Volume</Title>
                <Text className="text-sm text-muted-foreground">
                  Daily feedback submissions
                </Text>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      interval={2}  // Show every 3rd label to avoid crowding
                      angle={-15}   // Angle the labels for better readability
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="count"
                      name="Feedback Count"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex flex-col gap-1 mb-4">
                <Title className="text-lg">Average Ratings</Title>
                <Text className="text-sm text-muted-foreground">
                  Daily average rating trends
                </Text>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      interval={2}  // Show every 3rd label to avoid crowding
                      angle={-15}   // Angle the labels for better readability
                    />
                    <YAxis 
                      domain={[0, 5]} 
                      tick={{ fontSize: 12 }}
                      tickCount={6}  // Force 6 ticks (0 to 5)
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avgRating"
                      name="Average Rating"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ratings">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="p-4">
              <div className="flex flex-col gap-1 mb-4">
                <Title className="text-lg">Rating Distribution</Title>
                <Text className="text-sm text-muted-foreground">
                  Distribution of ratings across categories
                </Text>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roundedCenterStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-15}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 5]}
                      tickCount={6}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageRating" name="Average Rating" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex flex-col gap-1 mb-4">
                <Title className="text-lg">Response Rate</Title>
                <Text className="text-sm text-muted-foreground">
                  Response rates by service center (%)
                </Text>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roundedCenterStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-15}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickCount={6}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, "Response Rate"]}
                    />
                    <Legend />
                    <Bar 
                      dataKey="responseRate" 
                      name="Response Rate" 
                      fill="#16a34a"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="p-4">
              <div className="flex flex-col gap-1 mb-4">
                <Title className="text-lg">Customer Satisfaction</Title>
                <Text className="text-sm text-muted-foreground">
                  Satisfaction scores by service center
                </Text>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roundedCenterStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-15}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickCount={6}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="customerSatisfaction" name="Satisfaction %" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex flex-col gap-1 mb-4">
                <Title className="text-lg">Total Feedback Volume</Title>
                <Text className="text-sm text-muted-foreground">
                  Total feedback received by center
                </Text>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roundedCenterStats} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-15}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalFeedback" name="Total Feedback" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
