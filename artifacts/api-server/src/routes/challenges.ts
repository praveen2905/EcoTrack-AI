import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, challengesTable } from "@workspace/db";
import { CompleteChallengeParams, ListChallengesResponse, CompleteChallengeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/challenges", async (_req, res): Promise<void> => {
  const rows = await db.select().from(challengesTable).orderBy(challengesTable.id);
  res.json(ListChallengesResponse.parse(rows));
});

router.patch("/challenges/:id/complete", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CompleteChallengeParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db
    .update(challengesTable)
    .set({ completed: true })
    .where(eq(challengesTable.id, params.data.id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }
  res.json(CompleteChallengeResponse.parse(row));
});

export default router;
