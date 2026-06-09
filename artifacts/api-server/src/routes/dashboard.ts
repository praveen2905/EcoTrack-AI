import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, assessmentsTable, challengesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const assessments = await db.select().from(assessmentsTable).orderBy(desc(assessmentsTable.createdAt)).limit(2);
  const challenges = await db.select().from(challengesTable);
  const latest = assessments[0];
  const previous = assessments[1];
  const completed = challenges.filter(c => c.completed).length;

  const totalEmissionsThisMonth = latest?.totalEmissions ?? 95;
  const previousEmissions = previous?.totalEmissions ?? 110;
  const percentageChange = previousEmissions > 0 ? ((totalEmissionsThisMonth - previousEmissions) / previousEmissions) * 100 : 0;

  res.json({
    totalEmissionsThisMonth,
    percentageChangeFromLastMonth: Math.round(percentageChange * 10) / 10,
    carbonScore: latest?.carbonScore ?? 62,
    challengesCompleted: completed,
    totalPoints: completed * 10 + 120,
    streak: 7,
    averageUserEmissions: 185,
    treesEquivalent: Math.round(totalEmissionsThisMonth / 21),
    categoryBreakdown: {
      transport: latest?.transportEmissions ?? 45,
      electricity: latest?.electricityEmissions ?? 30,
      food: latest?.foodEmissions ?? 20,
      shopping: latest?.shoppingEmissions ?? 8,
    },
  });
});

router.get("/dashboard/weekly-progress", async (_req, res): Promise<void> => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = days.map((day, i) => ({
    day,
    emissions: Math.round((3.5 - i * 0.1 + Math.random() * 0.5) * 10) / 10,
    target: 3.0,
  }));
  res.json(data);
});

router.get("/dashboard/monthly-progress", async (_req, res): Promise<void> => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const base = [195, 190, 182, 175, 165, 158, 150, 143, 138, 130, 120, 115];
  const prev = [210, 208, 205, 200, 198, 192, 188, 185, 180, 175, 170, 165];
  const now = new Date().getMonth();
  const data = months.slice(0, now + 1).map((month, i) => ({
    month,
    emissions: base[i],
    previousYear: prev[i],
  }));
  res.json(data);
});

export default router;
