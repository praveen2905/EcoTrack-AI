import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, leaderboardTable } from "@workspace/db";
import { GetLeaderboardResponse } from "@workspace/api-zod";
import { asyncHandler } from "../middleware/errorHandler";

const router: IRouter = Router();

/**
 * GET /leaderboard
 * Retrieves the top eco-conscious users ranked by carbon score.
 * Results are sorted by rank in ascending order.
 */
router.get(
  "/leaderboard",
  asyncHandler(async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(leaderboardTable)
      .orderBy(asc(leaderboardTable.rank));

    const response = GetLeaderboardResponse.parse(rows);
    res.json(response);
  }),
);

export default router;
