import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, assessmentsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/recommendations", async (_req, res): Promise<void> => {
  const [latest] = await db.select().from(assessmentsTable).orderBy(desc(assessmentsTable.createdAt)).limit(1);

  const recommendations = [
    {
      id: 1,
      category: "Transport",
      insight: latest
        ? `Your transportation emissions are ${Math.round(((latest.transportEmissions - 35) / 35) * 100)}% ${latest.transportEmissions > 35 ? "higher" : "lower"} than the average user.`
        : "Transportation accounts for the largest portion of most users' carbon footprint.",
      suggestion: "Use a bicycle or walk for distances under 5 km. Consider carpooling for longer commutes.",
      estimatedCarbonSaving: 18.5,
      priority: "high",
    },
    {
      id: 2,
      category: "Electricity",
      insight: "Reducing AC usage by just 2 hours per day can save significant emissions each month.",
      suggestion: "Set your AC thermostat to 24°C or higher. Use ceiling fans as a supplement.",
      estimatedCarbonSaving: 12.0,
      priority: "high",
    },
    {
      id: 3,
      category: "Food",
      insight: "Plant-based meals produce up to 70% fewer emissions than meat-based alternatives.",
      suggestion: "Try Meatless Mondays and incorporate more legumes, vegetables, and grains into your diet.",
      estimatedCarbonSaving: 8.4,
      priority: "medium",
    },
    {
      id: 4,
      category: "Transport",
      insight: "Public transportation reduces per-capita emissions by up to 75% compared to private vehicles.",
      suggestion: "Use public transportation for your daily commute at least 3 times per week.",
      estimatedCarbonSaving: 15.2,
      priority: "high",
    },
    {
      id: 5,
      category: "Shopping",
      insight: "Each online order generates packaging waste and delivery emissions.",
      suggestion: "Consolidate online orders and choose longer delivery windows to reduce rush shipping.",
      estimatedCarbonSaving: 3.5,
      priority: "low",
    },
    {
      id: 6,
      category: "Electricity",
      insight: "Switching to LED bulbs and unplugging idle devices can reduce standby electricity consumption.",
      suggestion: "Replace all incandescent bulbs with LEDs and use smart power strips to eliminate phantom loads.",
      estimatedCarbonSaving: 6.0,
      priority: "medium",
    },
  ];

  res.json(recommendations);
});

export default router;
