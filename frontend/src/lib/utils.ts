// src/lib/utils.ts
// The shadcn/ui class-name helper. Registry components import this as
// "@/lib/utils"; this project has no "@" path alias, so they use the
// relative path "../../lib/utils" instead.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
