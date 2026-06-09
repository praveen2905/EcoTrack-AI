import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, assessmentsTable } from "@workspace/db";
import {
  CreateAssessmentBody,
  GetAssessmentParams,
  ListAssessmentsResponse,
  GetAssessmentResponse,
} from "@workspace/api-zod";
import { calculateEmissions } from "../lib/emission-calculator";

const router: IRouter = Router();

router.get("/assessments", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(assessmentsTable)
    .orderBy(assessmentsTable.createdAt);
  res.json(
    ListAssessmentsResponse.parse(
      rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
    )
  );
});

router.post("/assessments", async (req, res): Promise<void> => {
  const parsed = CreateAssessmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const emissions = calculateEmissions(parsed.data);
  const [row] = await db
    .insert(assessmentsTable)
    .values({ ...parsed.data, ...emissions })
    .returning();

  res.status(201).json(
    GetAssessmentResponse.parse({ ...row, createdAt: row.createdAt.toISOString() })
  );
});

router.get("/assessments/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAssessmentParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }

  res.json(
    GetAssessmentResponse.parse({ ...row, createdAt: row.createdAt.toISOString() })
  );
});

export default router;
