"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LucideClipboardList, LucideLogIn, LucideLogOut, LucidePlus, LucideUser } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <LucideClipboardList className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight">Suncture QA</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Button asChild variant={pathname === "/feedback" ? "default" : "ghost"} size="sm" className="gap-2">
              <Link href="/feedback">
                <LucideClipboardList className="h-4 w-4" />
                <span>View Feedback</span>
              </Link>
            </Button>
            <Button asChild variant={pathname === "/feedback/new" ? "default" : "ghost"} size="sm" className="gap-2">
              <Link href="/feedback/new">
                <LucidePlus className="h-4 w-4" />
                <span>Submit Feedback</span>
              </Link>
            </Button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <Button variant="ghost" size="sm" disabled className="min-w-[100px]">
                Loading...
              </Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <LucideUser className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline-block max-w-[150px] truncate">
                      {user.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/feedback/new" className="flex items-center">
                      <LucidePlus className="mr-2 h-4 w-4" />
                      <span>Submit Feedback</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/feedback" className="flex items-center">
                      <LucideClipboardList className="mr-2 h-4 w-4" />
                      <span>View Feedback</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600">
                    <LucideLogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="gap-2">
                <Link href="/auth">
                  <LucideLogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
