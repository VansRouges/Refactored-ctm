import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string | undefined, maxLength: number = 100): string {
  if (!text) return "Loading..."; // Handle undefined or null values gracefully
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export function formatCurrency(
  amount: number | undefined | null, 
  currency: string = "USD", 
  locale: string = "en-US"
): string {
  if (amount === undefined || amount === null || isNaN(amount)) return "N/A"; // Handle invalid inputs
  return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

