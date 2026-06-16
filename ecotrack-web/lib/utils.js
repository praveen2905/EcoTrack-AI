/**
 * @module lib/utils
 * @description General styling utility helpers.
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes conditionally and merges conflicts.
 *
 * @param {...import('clsx').ClassValue} inputs - List of class strings/objects to merge.
 * @returns {string} The resolved className string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
