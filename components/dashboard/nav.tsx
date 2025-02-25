"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"

export function Nav() {
  const pathname = usePathname()

  return (
    <div className="flex h-16 items-center px-4 border-b">
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <Link href="/dashboard" className="font-bold">
          1.Care Feedback
        </Link>
      </div>
      <nav className="flex items-center space-x-6 mx-6">
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard"
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          Overview
        </Link>
        <Link
          href="/dashboard/reports"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard/reports"
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          Reports
        </Link>
        <Link
          href="/dashboard/settings"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard/settings"
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          Settings
        </Link>
      </nav>
      <div className="ml-auto flex items-center space-x-4">
        <UserNav />
      </div>
    </div>
  )
}