import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, assessmentsTable } from "@workspace/db";
import {
  CreateAssessmentBody,
  GetAssessmentParams,
  ListAssessmentsResponse,
  GetAssessmentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function calculateEmissions(data: {
  transportKm: number;
  usesPublicTransport: boolean;
  flightsPerYear: number;
  acHoursPerDay: number;
  fanHoursPerDay: number;
  monthlyElectricityBill: number;
  isVegetarian: boolean;
  foodDeliveryPerWeek: number;
  onlineOrdersPerMonth: number;
}) {
  const transportFactor = data.usesPublicTransport ? 0.05 : 0.21;
  const transportEmissions = data.transportKm * 30 * transportFactor + data.flightsPerYear * 90;
  const electricityEmissions = data.acHoursPerDay * 0.8 * 30 + data.fanHoursPerDay * 0.075 * 30 + data.monthlyElectricityBill * 0.85;
  const foodEmissions = data.isVegetarian ? 10 + data.foodDeliveryPerWeek * 1.2 * 4 : 22 + data.foodDeliveryPerWeek * 2.5 * 4;
  const shoppingEmissions = data.onlineOrdersPerMonth * 3.5;
  const totalEmissions = transportEmissions + electricityEmissions + foodEmissions + shoppingEmissions;
  const avgEmissions = 200;
  const carbonScore = Math.max(0, Math.min(100, Math.round(100 - (totalEmissions / avgEmissions) * 50)));
  return { transportEmissions, electricityEmissions, foodEmissions, shoppingEmissions, totalEmissions, carbonScore };
}

router.get("/assessments", async (req, res): Promise<void> => {
  const rows = await db.select().from(assessmentsTable).orderBy(assessmentsTable.createdAt);
  res.json(ListAssessmentsResponse.parse(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/assessments", async (req, res): Promise<void> => {
  const parsed = CreateAssessmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const emissions = calculateEmissions(parsed.data);
  const [row] = await db.insert(assessmentsTable).values({ ...parsed.data, ...emissions }).returning();
  res.status(201).json(GetAssessmentResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

router.get("/assessments/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAssessmentParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }
  res.json(GetAssessmentResponse.parse({ ...row, createdAt: row.createdAt.toISOString() }));
});

export default router;
