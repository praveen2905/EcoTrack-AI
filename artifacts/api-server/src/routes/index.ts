import { Router, type IRouter } from "express";
import healthRouter from "./health";
import assessmentsRouter from "./assessments";
import dashboardRouter from "./dashboard";
import challengesRouter from "./challenges";
import leaderboardRouter from "./leaderboard";
import profileRouter from "./profile";
import recommendationsRouter from "./recommendations";
import tipsRouter from "./tips";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assessmentsRouter);
router.use(dashboardRouter);
router.use(challengesRouter);
router.use(leaderboardRouter);
router.use(profileRouter);
router.use(recommendationsRouter);
router.use(tipsRouter);

export default router;
