import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, leaderboardTable } from "@workspace/db";
import { GetLeaderboardResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/leaderboard", async (_req, res): Promise<void> => {
  const rows = await db.select().from(leaderboardTable).orderBy(asc(leaderboardTable.rank));
  res.json(GetLeaderboardResponse.parse(rows));
});

export default router;
