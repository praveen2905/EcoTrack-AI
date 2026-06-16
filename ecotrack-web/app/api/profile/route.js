/**
 * @module api/profile
 * @description User profile data with XP, level, and badge information.
 */

import { NextResponse } from "next/server";
import { AVAILABLE_BADGES } from "@/lib/mock-data";
import { getCompletedChallengeCount } from "@/lib/store";

/** Points awarded per completed challenge. */
const POINTS_PER_CHALLENGE = 10;
/** Baseline points every user starts with. */
const BASE_POINTS = 120;
/** XP required to advance to the next level. */
const POINTS_PER_LEVEL = 100;

/**
 * GET /api/profile — Returns the current user's profile including
 * level progression, streak, rank, and earned badges.
 *
 * @returns {NextResponse} JSON profile object.
 */
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
