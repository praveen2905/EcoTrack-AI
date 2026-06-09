import { pgTable, serial, boolean, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  transportKm: real("transport_km").notNull(),
  usesPublicTransport: boolean("uses_public_transport").notNull(),
  flightsPerYear: integer("flights_per_year").notNull(),
  acHoursPerDay: real("ac_hours_per_day").notNull(),
  fanHoursPerDay: real("fan_hours_per_day").notNull(),
  monthlyElectricityBill: real("monthly_electricity_bill").notNull(),
  isVegetarian: boolean("is_vegetarian").notNull(),
  foodDeliveryPerWeek: integer("food_delivery_per_week").notNull(),
  onlineOrdersPerMonth: integer("online_orders_per_month").notNull(),
  transportEmissions: real("transport_emissions").notNull(),
  electricityEmissions: real("electricity_emissions").notNull(),
  foodEmissions: real("food_emissions").notNull(),
  shoppingEmissions: real("shopping_emissions").notNull(),
  totalEmissions: real("total_emissions").notNull(),
  carbonScore: integer("carbon_score").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(assessmentsTable).omit({
  id: true,
  createdAt: true,
  transportEmissions: true,
  electricityEmissions: true,
  foodEmissions: true,
  shoppingEmissions: true,
  totalEmissions: true,
  carbonScore: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;
