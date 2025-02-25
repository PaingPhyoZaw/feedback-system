"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { format, startOfMonth, endOfMonth, sub } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const datePresets = [
  {
    label: 'Current Month',
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    label: 'Last Month',
    getValue: () => ({
      from: startOfMonth(sub(new Date(), { months: 1 })),
      to: endOfMonth(sub(new Date(), { months: 1 }))
    })
  },
  {
    label: 'Last 3 Months',
    getValue: () => ({
      from: startOfMonth(sub(new Date(), { months: 2 })),
      to: endOfMonth(new Date())
    })
  }
]

export function DateRangePicker({
  date,
  setDate,
  className,
}: {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handlePresetChange = (preset: string) => {
    const selectedPreset = datePresets.find(p => p.label === preset)
    if (selectedPreset) {
      setDate(selectedPreset.getValue())
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"  // Changed from dateRange to date
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (  // Changed from dateRange to date
              date.to ? (    // Changed from dateRange to date
                <>
                  {format(date.from, "MMM d, yyyy")} -{" "}  
                  {format(date.to, "MMM d, yyyy")}    
                </>
              ) : (
                format(date.from, "MMM d, yyyy")            // Changed from dateRange to date
              )
            ) : (
              <span>Pick a date range</span>
            )}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select range preset" />
              </SelectTrigger>
              <SelectContent>
                {datePresets.map((preset) => (
                  <SelectItem key={preset.label} value={preset.label}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            fromMonth={sub(new Date(), { months: 6 })}
            toMonth={new Date()}
            pagedNavigation
            weekStartsOn={0}
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
            components={{
              IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
              IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

