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
      <div className="container flex h-16 items-center justify-center">
        <div className="flex items-center justify-between space-between w-full max-w-7xl gap-8">
          <div className="flex">
            <Link href="/" className="flex items-center space-x-2">
              <LucideClipboardList className="h-6 w-6" />
              <span className="font-bold text-xl">Suncture QA</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-4">
              <Button asChild variant={pathname === "/feedback" ? "default" : "ghost"} size="sm" className="gap-2">
                <Link href="/feedback">
                  <LucideClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">View Feedback</span>
                </Link>
              </Button>
              <Button asChild variant={pathname === "/feedback/new" ? "default" : "ghost"} size="sm" className="gap-2">
                <Link href="/feedback/new">
                  <LucidePlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Submit Feedback</span>
                </Link>
              </Button>
            </nav>
            <div>
              {isLoading ? (
                <Button variant="ghost" size="sm" disabled>
                  Loading...
                </Button>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <LucideUser className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/feedback/new">
                        <LucidePlus className="mr-2 h-4 w-4" />
                        <span>Submit Feedback</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/feedback">
                        <LucideClipboardList className="mr-2 h-4 w-4" />
                        <span>View Feedback</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
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
      </div>
    </header>
  )
}
