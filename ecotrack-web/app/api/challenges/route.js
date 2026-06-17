/**
 * @module api/challenges
 * @description Retrieve the list of eco challenges.
 */

import { NextResponse } from "next/server";
import { getChallenges } from "@/lib/store";
import { handleApiError } from "@/lib/api-error";

/**
 * GET /api/challenges — Returns all available challenges with their completion status.
 * @returns {Promise<NextResponse>} JSON array of challenge objects.
 */
export async function GET() {
  try {
    return NextResponse.json(getChallenges());
  } catch (error) {
    return handleApiError(error, "Failed to retrieve challenges.");
  }
}
