import { Router, type IRouter } from "express";
import { db, challengesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/profile", async (_req, res): Promise<void> => {
  const challenges = await db.select().from(challengesTable);
  const completed = challenges.filter(c => c.completed).length;
  const totalPoints = completed * 10 + 120;
  const level = Math.floor(totalPoints / 100) + 1;
  const currentXp = totalPoints % 100;

  res.json({
    username: "EcoChampion",
    level,
    currentXp,
    xpToNextLevel: 100,
    totalPoints,
    streak: 7,
    totalCarbonSaved: 312.5,
    rank: 3,
    avatar: "EC",
    badges: [
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
    ],
  });
});

export default router;
