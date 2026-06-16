/**
 * @module api/leaderboard
 * @description Community leaderboard data endpoint.
 */

import { NextResponse } from "next/server";
import { LEADERBOARD } from "@/lib/mock-data";

/**
 * GET /api/leaderboard — Returns the ranked leaderboard entries.
 * @returns {NextResponse} JSON array of leaderboard entries sorted by rank.
 */
export async function GET() {
  return NextResponse.json(LEADERBOARD);
}
