import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(number?: number | string): string {
  const cleaned = String(number).replace(/\D/g, "");

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]} - ${match[3]}`;
  }

  return String(number);
}

export const formatPhoneInputValue = (value: string) => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "").slice(0, 10);

  // Format the phone number
  if (digits.length <= 3) {
    return `${digits}`;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
};

export const formatDateToString = (
  date?: Date | null,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!date) return "";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Date(date).toLocaleString("en-US", mergedOptions);
};
