import { NextResponse } from "next/server";
import { TEMPLATE_RECOMMENDATIONS } from "@/lib/mock-data";
import { getAssessments } from "@/lib/store";

export async function GET() {
  const [latest] = getAssessments();
  const recommendations = latest
    ? TEMPLATE_RECOMMENDATIONS.map((rec) => {
        if (rec.id === 1 && latest.transportEmissions) {
          const avgTransport = 35;
          const difference = Math.round(
            ((latest.transportEmissions - avgTransport) / avgTransport) * 100,
          );
          return {
            ...rec,
            insight: `Your transportation emissions are ${Math.abs(difference)}% ${latest.transportEmissions > avgTransport ? "higher" : "lower"} than the average user.`,
          };
        }
        return rec;
      })
    : TEMPLATE_RECOMMENDATIONS;

  return NextResponse.json(recommendations);
}
