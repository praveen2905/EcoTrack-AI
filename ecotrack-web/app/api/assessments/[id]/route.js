import { NextResponse } from "next/server";
import { getAssessmentById } from "@/lib/store";

export async function GET(request, { params }) {
  const { id } = await params;
  const assessment = getAssessmentById(parseInt(id, 10));
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }
  return NextResponse.json(assessment);
}
