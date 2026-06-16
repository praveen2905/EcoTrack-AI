/**
 * @module api/dashboard/monthly-progress
 * @description API endpoint to retrieve the user's monthly progress comparing current
 * year emissions vs previous year emissions.
 */

import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/monthly-progress
 * Returns monthly carbon emissions data up to the current calendar month.
 *
 * @returns {Promise<NextResponse>} JSON response containing monthly progress comparison.
 */
export async function GET() {
  try {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const baseEmissions = [195, 190, 182, 175, 165, 158, 150, 143, 138, 130, 120, 115];
    const previousYearEmissions = [210, 208, 205, 200, 198, 192, 188, 185, 180, 175, 170, 165];
    
    const currentMonth = new Date().getMonth();
    const data = months.slice(0, currentMonth + 1).map((month, i) => ({
      month,
      emissions: baseEmissions[i],
      previousYear: previousYearEmissions[i],
    }));
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "An internal server error occurred while retrieving progress data." },
      { status: 500 }
    );
  }
}
