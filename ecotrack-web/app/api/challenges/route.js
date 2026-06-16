/**
 * @module api/challenges
 * @description Retrieve the list of eco challenges.
 */

import { NextResponse } from "next/server";
import { getChallenges } from "@/lib/store";

/**
 * GET /api/challenges — Returns all available challenges with their completion status.
 * @returns {NextResponse} JSON array of challenge objects.
 */
export async function GET() {
  return NextResponse.json(getChallenges());
}
