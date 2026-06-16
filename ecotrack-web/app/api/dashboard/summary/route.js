/**
 * @module api/dashboard/summary
 * @description API endpoint to fetch a summary of the user's carbon tracking stats.
 * Integrates the latest assessment values and challenge completion state.
 */

import { NextResponse } from "next/server";
import {
  getAssessments,
  getCompletedChallengeCount,
} from "@/lib/store";

/**
 * Default fallback values for when no assessment has been taken yet.
 */
const DEFAULT = {
  EMISSIONS: 95,
  CARBON_SCORE: 62,
  CARBON_POINTS: 120,
  STREAK_DAYS: 7,
  AVERAGE_USER_EMISSIONS: 185,
  TRANSPORT: 45,
  ELECTRICITY: 30,
  FOOD: 20,
  SHOPPING: 8,
};

/**
 * GET /api/dashboard/summary
 * Retrieves the compiled dashboard statistics.
 *
 * @returns {Promise<NextResponse>} The JSON representation of dashboard summary stats.
 */
export async function GET() {
  try {
    const assessments = getAssessments();
    const latest = assessments[0];
    const previous = assessments[1];
    const completedCount = getCompletedChallengeCount();

    const totalEmissionsThisMonth = latest?.totalEmissions ?? DEFAULT.EMISSIONS;
    const previousEmissions = previous?.totalEmissions ?? DEFAULT.EMISSIONS * 1.15;
    const percentageChange =
      previousEmissions > 0
        ? ((totalEmissionsThisMonth - previousEmissions) / previousEmissions) * 100
        : 0;

    return NextResponse.json({
      totalEmissionsThisMonth,
      percentageChangeFromLastMonth: Math.round(percentageChange * 10) / 10,
      carbonScore: latest?.carbonScore ?? DEFAULT.CARBON_SCORE,
      challengesCompleted: completedCount,
      totalPoints: completedCount * 10 + DEFAULT.CARBON_POINTS,
      streak: DEFAULT.STREAK_DAYS,
      averageUserEmissions: DEFAULT.AVERAGE_USER_EMISSIONS,
      treesEquivalent: Math.round(totalEmissionsThisMonth / 21),
      categoryBreakdown: {
        transport: latest?.transportEmissions ?? DEFAULT.TRANSPORT,
        electricity: latest?.electricityEmissions ?? DEFAULT.ELECTRICITY,
        food: latest?.foodEmissions ?? DEFAULT.FOOD,
        shopping: latest?.shoppingEmissions ?? DEFAULT.SHOPPING,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An internal server error occurred while retrieving dashboard summary." },
      { status: 500 }
    );
  }
}
