import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ensureStartsWith = (str: string, prefix: string) => {
  return str.startsWith(prefix) ? str : `${prefix}${str}`;
};

export function createUrl(pathname: string, searchParams: URLSearchParams | ReadonlyURLSearchParams) {
  const paramsString = searchParams.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
}
