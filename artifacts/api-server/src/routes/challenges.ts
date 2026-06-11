import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, challengesTable } from "@workspace/db";
import {
  CompleteChallengeParams,
  ListChallengesResponse,
  CompleteChallengeResponse,
} from "@workspace/api-zod";
import {
  asyncHandler,
  NotFoundError,
  ValidationError,
} from "../middleware/errorHandler";

const router: IRouter = Router();

/**
 * GET /challenges
 * Retrieves all available challenges sorted by ID.
 */
router.get(
  "/challenges",
  asyncHandler(async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(challengesTable)
      .orderBy(challengesTable.id);

    const response = ListChallengesResponse.parse(rows);
    res.json(response);
  }),
);

/**
 * PATCH /challenges/:id/complete
 * Marks a challenge as completed.
 * Returns 404 if challenge not found.
 */
router.patch(
  "/challenges/:id/complete",
  asyncHandler(async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const params = CompleteChallengeParams.safeParse({
      id: parseInt(raw, 10),
    });

    if (!params.success) {
      throw new ValidationError(
        params.error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join("; "),
      );
    }

    const [row] = await db
      .update(challengesTable)
      .set({ completed: true })
      .where(eq(challengesTable.id, params.data.id))
      .returning();

    if (!row) {
      throw new NotFoundError("Challenge");
    }

    const response = CompleteChallengeResponse.parse(row);
    res.json(response);
  }),
);

export default router;
