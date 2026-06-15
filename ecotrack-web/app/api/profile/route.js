import { NextResponse } from "next/server";
import { AVAILABLE_BADGES } from "@/lib/mock-data";
import { getCompletedChallengeCount } from "@/lib/store";

const POINTS_PER_CHALLENGE = 10;
const BASE_POINTS = 120;
const POINTS_PER_LEVEL = 100;

export async function GET() {
  const completedCount = getCompletedChallengeCount();
  const totalPoints = completedCount * POINTS_PER_CHALLENGE + BASE_POINTS;
  const level = Math.floor(totalPoints / POINTS_PER_LEVEL) + 1;
  const currentXp = totalPoints % POINTS_PER_LEVEL;

  return NextResponse.json({
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
  });
}
