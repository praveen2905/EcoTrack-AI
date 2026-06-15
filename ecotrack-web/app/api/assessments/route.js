import { NextResponse } from "next/server";
import { calculateEmissions } from "@/lib/emission-calculator";
import { createAssessment, getAssessments } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getAssessments());
}

export async function POST(request) {
  const body = await request.json();
  const emissions = calculateEmissions(body);
  const assessment = createAssessment(body, emissions);
  return NextResponse.json(assessment, { status: 201 });
}
