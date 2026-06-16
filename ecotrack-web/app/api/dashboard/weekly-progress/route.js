/**
 * @module api/dashboard/weekly-progress
 * @description API endpoint to fetch the user's weekly carbon emissions progress.
 * Uses a deterministic seeded calculation to ensure consistent, hydration-safe outputs.
 */

import { NextResponse } from "next/server";

/**
 * Returns a pseudo-random number between 0 and 1 based on an integer seed.
 * 
 * @param {number} seed - The seed to generate the random number from.
 * @returns {number} A value in [0, 1).
 */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * GET /api/dashboard/weekly-progress
 * Returns the weekly emissions history.
 * 
 * @returns {Promise<NextResponse>} JSON response containing weekly progress.
 */
export async function GET() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const data = days.map((day, i) => {
    // Generate a deterministic random offset based on index
    const randomOffset = seededRandom(i + 42) * 0.5;
    const emissions = Math.round((3.5 - i * 0.1 + randomOffset) * 10) / 10;
    
    return {
      day,
      emissions,
      target: 3.0,
    };
  });
  
  return NextResponse.json(data);
}
