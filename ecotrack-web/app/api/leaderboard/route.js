/**
 * @module api/leaderboard
 * @description Community leaderboard data endpoint.
 */

import { NextResponse } from "next/server";
import { LEADERBOARD } from "@/lib/mock-data";
import { handleApiError } from "@/lib/api-error";

/**
 * GET /api/leaderboard — Returns the ranked leaderboard entries.
 * @returns {Promise<NextResponse>} JSON array of leaderboard entries sorted by rank.
 */
export async function GET() {
  try {
    return NextResponse.json(LEADERBOARD);
  } catch (error) {
    return handleApiError(error, "Failed to retrieve leaderboard data.");
  }
}
