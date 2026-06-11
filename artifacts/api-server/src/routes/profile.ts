import { Router, type IRouter } from "express";
import { db, challengesTable } from "@workspace/db";
import { asyncHandler } from "../middleware/errorHandler";

const router: IRouter = Router();

/**
 * Badge structure for user achievements.
 */
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt: string | null;
}

/**
 * User profile structure.
 */
interface UserProfile {
  username: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  totalPoints: number;
  streak: number;
  totalCarbonSaved: number;
  rank: number;
  avatar: string;
  badges: Badge[];
}

/** Available badges that users can earn */
const AVAILABLE_BADGES: Badge[] = [
  {
    id: "green-beginner",
    name: "Green Beginner",
    description: "Complete your first carbon assessment",
    icon: "Leaf",
    earned: true,
    earnedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "eco-warrior",
    name: "Eco Warrior",
    description: "Reduce emissions by 20% in a month",
    icon: "Shield",
    earned: true,
    earnedAt: "2024-02-10T00:00:00.000Z",
  },
  {
    id: "climate-hero",
    name: "Climate Hero",
    description: "Save 500 kg of CO2 total",
    icon: "Award",
    earned: false,
    earnedAt: null,
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Maintain a 7-day eco streak",
    icon: "Flame",
    earned: true,
    earnedAt: "2024-03-01T00:00:00.000Z",
  },
  {
    id: "tree-planter",
    name: "Tree Planter",
    description: "Plant 10 virtual trees through actions",
    icon: "TreePine",
    earned: false,
    earnedAt: null,
  },
  {
    id: "community-leader",
    name: "Community Leader",
    description: "Reach top 10 on the leaderboard",
    icon: "Trophy",
    earned: false,
    earnedAt: null,
  },
];

const POINTS_PER_CHALLENGE = 10;
const BASE_POINTS = 120;
const POINTS_PER_LEVEL = 100;

/**
 * GET /profile
 * Returns the current user's profile including level, XP, streaks, and achievements.
 */
router.get(
  "/profile",
  asyncHandler(async (_req, res): Promise<void> => {
    const challenges = await db.select().from(challengesTable);
    const completedCount = challenges.filter((c) => c.completed).length;

    const totalPoints = completedCount * POINTS_PER_CHALLENGE + BASE_POINTS;
    const level = Math.floor(totalPoints / POINTS_PER_LEVEL) + 1;
    const currentXp = totalPoints % POINTS_PER_LEVEL;

    const profile: UserProfile = {
      username: "EcoChampion",
      level,
      currentXp,
      xpToNextLevel: POINTS_PER_LEVEL,
      totalPoints,
      streak: 7,
      totalCarbonSaved: 312.5,
      rank: 3,
      avatar: "EC",
      badges: AVAILABLE_BADGES,
    };

    res.json(profile);
  }),
);

export default router;
