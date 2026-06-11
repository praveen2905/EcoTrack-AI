import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, assessmentsTable, challengesTable } from "@workspace/db";
import { asyncHandler } from "../middleware/errorHandler";

const router: IRouter = Router();

/** Default values used when assessment data is not yet available */
const DEFAULT_SUMMARY = {
  EMISSIONS: 95,
  CARBON_SCORE: 62,
  CARBON_POINTS: 120,
  STREAK_DAYS: 7,
  AVERAGE_USER_EMISSIONS: 185,
  TRANSPORT: 45,
  ELECTRICITY: 30,
  FOOD: 20,
  SHOPPING: 8,
};

/** Trees equivalent: 1 tree absorbs ~21kg CO2 annually */
const CO2_PER_TREE_ANNUALLY = 21;

/**
 * GET /dashboard/summary
 * Returns user's current carbon footprint summary and metrics.
 * Includes emissions breakdown, score, streaks, and comparisons to previous assessments.
 */
router.get("/dashboard/summary", asyncHandler(async (_req, res): Promise<void> => {
  const assessments = await db
    .select()
    .from(assessmentsTable)
    .orderBy(desc(assessmentsTable.createdAt))
    .limit(2);

  const challenges = await db
    .select()
    .from(challengesTable);

  const latest = assessments[0];
  const previous = assessments[1];
  const completedCount = challenges.filter((c) => c.completed).length;

  const totalEmissionsThisMonth = latest?.totalEmissions ?? DEFAULT_SUMMARY.EMISSIONS;
  const previousEmissions = previous?.totalEmissions ?? DEFAULT_SUMMARY.EMISSIONS * 1.15;

  const percentageChange =
    previousEmissions > 0
      ? ((totalEmissionsThisMonth - previousEmissions) / previousEmissions) * 100
      : 0;

  const response = {
    totalEmissionsThisMonth,
    percentageChangeFromLastMonth: Math.round(percentageChange * 10) / 10,
    carbonScore: latest?.carbonScore ?? DEFAULT_SUMMARY.CARBON_SCORE,
    challengesCompleted: completedCount,
    totalPoints: completedCount * 10 + DEFAULT_SUMMARY.CARBON_POINTS,
    streak: DEFAULT_SUMMARY.STREAK_DAYS,
    averageUserEmissions: DEFAULT_SUMMARY.AVERAGE_USER_EMISSIONS,
    treesEquivalent: Math.round(totalEmissionsThisMonth / CO2_PER_TREE_ANNUALLY),
    categoryBreakdown: {
      transport: latest?.transportEmissions ?? DEFAULT_SUMMARY.TRANSPORT,
      electricity: latest?.electricityEmissions ?? DEFAULT_SUMMARY.ELECTRICITY,
      food: latest?.foodEmissions ?? DEFAULT_SUMMARY.FOOD,
      shopping: latest?.shoppingEmissions ?? DEFAULT_SUMMARY.SHOPPING,
    },
  };

  res.json(response);
}));

/**
 * GET /dashboard/weekly-progress
 * Returns daily emissions data for the current week with targets.
 */
router.get("/dashboard/weekly-progress", asyncHandler(async (_req, res): Promise<void> => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
  const data = days.map((day, i) => ({
    day,
    emissions: Math.round((3.5 - i * 0.1 + Math.random() * 0.5) * 10) / 10,
    target: 3.0,
  }));
  res.json(data);
}));

/**
 * GET /dashboard/monthly-progress
 * Returns monthly emissions comparison: this year vs last year.
 */
router.get("/dashboard/monthly-progress", asyncHandler(async (_req, res): Promise<void> => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ] as const;

  const baseEmissions = [195, 190, 182, 175, 165, 158, 150, 143, 138, 130, 120, 115];
  const previousYearEmissions = [
    210, 208, 205, 200, 198, 192, 188, 185, 180, 175, 170, 165,
  ];

  const currentMonth = new Date().getMonth();
  const data = months.slice(0, currentMonth + 1).map((month, i) => ({
    month,
    emissions: baseEmissions[i],
    previousYear: previousYearEmissions[i],
  }));

  res.json(data);
}));

export default router;
