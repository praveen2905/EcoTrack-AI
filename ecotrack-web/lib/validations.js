/**
 * @module lib/validations
 * @description Zod validation schemas for all API request/response payloads.
 * Centralised here to be shared between client-side forms and server-side
 * route handlers, ensuring a single source of truth.
 */

import { z } from "zod";

/**
 * Schema for the carbon assessment form submission.
 * Validates all numeric ranges and boolean toggles required by the
 * emission calculator.
 */
export const assessmentSchema = z.object({
  transportKm: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(10000, "Value seems unreasonably high"),
  usesPublicTransport: z.boolean(),
  flightsPerYear: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(365, "Cannot exceed 365"),
  acHoursPerDay: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(24, "Cannot exceed 24 hours"),
  fanHoursPerDay: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(24, "Cannot exceed 24 hours"),
  monthlyElectricityBill: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(100000, "Value seems unreasonably high"),
  isVegetarian: z.boolean(),
  foodDeliveryPerWeek: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(21, "Cannot exceed 21"),
  onlineOrdersPerMonth: z.coerce
    .number()
    .min(0, "Must be 0 or more")
    .max(200, "Cannot exceed 200"),
});

/**
 * Schema for validating a numeric resource ID (e.g. assessment ID, challenge ID).
 * Returns a safe integer or null when the input is invalid.
 */
export const numericIdSchema = z.coerce
  .number()
  .int("ID must be an integer")
  .positive("ID must be positive")
  .finite("ID must be finite");
