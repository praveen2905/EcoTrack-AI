/**
 * @module api/recommendations
 * @description AI-powered sustainability recommendations.
 * When assessment data is available, recommendations are personalised
 * with the user's actual transport emissions compared to the average.
 */

import { NextResponse } from "next/server";
import { TEMPLATE_RECOMMENDATIONS } from "@/lib/mock-data";
import { getAssessments } from "@/lib/store";

/** Average transport emissions (kg CO₂/month) used as a comparison baseline. */
const AVG_TRANSPORT_EMISSIONS = 35;

/**
 * GET /api/recommendations — Returns personalised sustainability
 * recommendations sorted by priority.
 *
 * If the user has completed at least one assessment, the transport
 * recommendation insight is dynamically adjusted to reflect their
 * actual emissions relative to the average.
 *
 * @returns {NextResponse} JSON array of recommendation objects.
 */
export async function GET() {
  const [latest] = getAssessments();
  const recommendations = latest
    ? TEMPLATE_RECOMMENDATIONS.map((rec) => {
        if (rec.id === 1 && latest.transportEmissions) {
          const difference = Math.round(
            ((latest.transportEmissions - AVG_TRANSPORT_EMISSIONS) / AVG_TRANSPORT_EMISSIONS) * 100,
          );
          return {
            ...rec,
            insight: `Your transportation emissions are ${Math.abs(difference)}% ${latest.transportEmissions > AVG_TRANSPORT_EMISSIONS ? "higher" : "lower"} than the average user.`,
          };
        }
        return rec;
      })
    : TEMPLATE_RECOMMENDATIONS;

  return NextResponse.json(recommendations);
}
