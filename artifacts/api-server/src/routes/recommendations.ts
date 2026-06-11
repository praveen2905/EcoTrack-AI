import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, assessmentsTable } from "@workspace/db";
import { asyncHandler } from "../middleware/errorHandler";

const router: IRouter = Router();

/**
 * Recommendation object structure.
 */
interface Recommendation {
  id: number;
  category: string;
  insight: string;
  suggestion: string;
  estimatedCarbonSaving: number;
  priority: "high" | "medium" | "low";
}

/** Template recommendations for users without assessments */
const TEMPLATE_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    category: "Transport",
    insight:
      "Transportation accounts for the largest portion of most users' carbon footprint.",
    suggestion:
      "Use a bicycle or walk for distances under 5 km. Consider carpooling for longer commutes.",
    estimatedCarbonSaving: 18.5,
    priority: "high",
  },
  {
    id: 2,
    category: "Electricity",
    insight:
      "Reducing AC usage by just 2 hours per day can save significant emissions each month.",
    suggestion:
      "Set your AC thermostat to 24°C or higher. Use ceiling fans as a supplement.",
    estimatedCarbonSaving: 12.0,
    priority: "high",
  },
  {
    id: 3,
    category: "Food",
    insight:
      "Plant-based meals produce up to 70% fewer emissions than meat-based alternatives.",
    suggestion:
      "Try Meatless Mondays and incorporate more legumes, vegetables, and grains into your diet.",
    estimatedCarbonSaving: 8.4,
    priority: "medium",
  },
  {
    id: 4,
    category: "Transport",
    insight:
      "Public transportation reduces per-capita emissions by up to 75% compared to private vehicles.",
    suggestion:
      "Use public transportation for your daily commute at least 3 times per week.",
    estimatedCarbonSaving: 15.2,
    priority: "high",
  },
  {
    id: 5,
    category: "Shopping",
    insight:
      "Each online order generates packaging waste and delivery emissions.",
    suggestion:
      "Consolidate online orders and choose longer delivery windows to reduce rush shipping.",
    estimatedCarbonSaving: 3.5,
    priority: "low",
  },
  {
    id: 6,
    category: "Electricity",
    insight:
      "Switching to LED bulbs and unplugging idle devices can reduce standby electricity consumption.",
    suggestion:
      "Replace all incandescent bulbs with LEDs and use smart power strips to eliminate phantom loads.",
    estimatedCarbonSaving: 6.0,
    priority: "medium",
  },
];

/**
 * GET /recommendations
 * Returns personalized sustainability recommendations based on user's latest assessment.
 * If no assessment exists, returns template recommendations.
 */
router.get(
  "/recommendations",
  asyncHandler(async (_req, res): Promise<void> => {
    const [latest] = await db
      .select()
      .from(assessmentsTable)
      .orderBy(desc(assessmentsTable.createdAt))
      .limit(1);

    const recommendations: Recommendation[] = latest
      ? TEMPLATE_RECOMMENDATIONS.map((rec) => {
          // Personalize transport recommendation if we have data
          if (rec.id === 1 && latest.transportEmissions) {
            const avgTransport = 35;
            const difference = Math.round(
              ((latest.transportEmissions - avgTransport) / avgTransport) * 100
            );
            return {
              ...rec,
              insight: `Your transportation emissions are ${Math.abs(difference)}% ${latest.transportEmissions > avgTransport ? "higher" : "lower"} than the average user.`,
            };
          }
          return rec;
        })
      : TEMPLATE_RECOMMENDATIONS;

    res.json(recommendations);
  }),
);

export default router;
