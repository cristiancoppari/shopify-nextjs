import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ensureStartsWith = (str: string, prefix: string) => {
  return str.startsWith(prefix) ? str : `${prefix}${str}`;
};
