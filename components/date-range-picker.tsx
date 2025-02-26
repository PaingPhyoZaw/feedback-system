"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  date,
  setDate,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center" sideOffset={4}>
          <div className="border-b border-border p-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Select date range</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const today = new Date()
                    setDate({
                      from: addDays(today, -7),
                      to: today,
                    })
                  }}
                >
                  Last 7 days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const today = new Date()
                    setDate({
                      from: addDays(today, -30),
                      to: today,
                    })
                  }}
                >
                  Last 30 days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const today = new Date()
                    setDate({
                      from: addDays(today, -60),
                      to: today,
                    })
                  }}
                >
                  Last 60 days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const today = new Date()
                    setDate({
                      from: addDays(today, -90),
                      to: today,
                    })
                  }}
                >
                  Last 90 days
                </Button>
              </div>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            classNames={{
              months: "flex space-x-8 p-6",
              month: "space-y-6",
              caption: "flex justify-between relative items-center px-1 mb-4",
              nav: "absolute top-0 left-0 right-0 flex justify-between w-full",
              nav_button: cn(
                "h-8 w-8 bg-transparent",
                "hover:bg-accent hover:text-accent-foreground",
                "inline-flex items-center justify-center rounded-md",
                "transition-colors disabled:pointer-events-none disabled:opacity-50"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              caption_label: "text-base font-medium text-gray-900 mx-auto",
              nav: "flex items-center space-x-1",
              nav_button: cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium",
                "h-8 w-8 bg-transparent hover:bg-gray-100 active:bg-gray-200",
                "transition-colors disabled:pointer-events-none disabled:opacity-50"
              ),
              table: "w-full border-collapse",
              head_row: "flex mb-2",
              head_cell: "text-gray-500 font-medium text-[13px] w-10 ",
              row: "flex w-full mt-1",
              cell: cn(
                "relative w-10 h-10 p-0 text-center text-sm focus-within:relative focus-within:z-20",
                "[&:has([aria-selected])]:bg-gray-100",
                "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              ),
              day: cn(
                "h-10 w-10 rounded-full p-0 font-normal",
                "hover:bg-gray-100",
                "aria-selected:bg-black aria-selected:text-white text-center",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              ),
              day_today: "bg-gray-50 text-black",
              day_outside: "text-gray-400",
              day_disabled: "text-gray-400",
              day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900",
              day_hidden: "invisible",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
