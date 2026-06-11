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
import { asyncHandler, NotFoundError, ValidationError } from "../middleware/errorHandler";

const router: IRouter = Router();

/**
 * GET /assessments
 * Retrieves all assessments ordered by creation date.
 */
router.get("/assessments", asyncHandler(async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(assessmentsTable)
    .orderBy(assessmentsTable.createdAt);

  const response = ListAssessmentsResponse.parse(
    rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))
  );
  res.json(response);
}));

/**
 * POST /assessments
 * Creates a new assessment with carbon emission calculations.
 * Calculates: transport, electricity, food, and shopping emissions.
 */
router.post("/assessments", asyncHandler(async (req, res): Promise<void> => {
  const parsed = CreateAssessmentBody.safeParse(req.body);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")
    );
  }

  const emissions = calculateEmissions(parsed.data);
  const [row] = await db
    .insert(assessmentsTable)
    .values({ ...parsed.data, ...emissions })
    .returning();

  if (!row) {
    throw new Error("Failed to create assessment");
  }

  const response = GetAssessmentResponse.parse({
    ...row,
    createdAt: row.createdAt.toISOString(),
  });
  res.status(201).json(response);
}));

/**
 * GET /assessments/:id
 * Retrieves a specific assessment by ID.
 * Returns 404 if assessment not found.
 */
router.get("/assessments/:id", asyncHandler(async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAssessmentParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    throw new ValidationError(
      params.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")
    );
  }

  const [row] = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.id, params.data.id));

  if (!row) {
    throw new NotFoundError("Assessment");
  }

  const response = GetAssessmentResponse.parse({
    ...row,
    createdAt: row.createdAt.toISOString(),
  });
  res.json(response);
}));

export default router;
