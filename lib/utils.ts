import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, short = false): string {
  const date = new Date(dateString)

  if (short) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function maskEmail(email: string): string {
  const [username, domain] = email.split("@")

  if (username.length <= 3) {
    return `${username[0]}***@${domain}`
  }

  return `${username.substring(0, 3)}***@${domain}`
}
