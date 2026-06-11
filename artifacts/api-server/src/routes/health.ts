import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

/**
 * GET /healthz
 * Health check endpoint used for monitoring and load balancing.
 * Returns immediately with status "ok".
 */
router.get("/healthz", (_req, res): void => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;
