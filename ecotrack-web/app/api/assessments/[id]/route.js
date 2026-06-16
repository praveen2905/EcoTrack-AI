/**
 * @module api/assessments/[id]
 * @description Retrieve a single assessment by its numeric ID.
 * Validates the dynamic segment to prevent NaN / prototype-pollution issues.
 */

import { NextResponse } from "next/server";
import { numericIdSchema } from "@/lib/validations";
import { getAssessmentById } from "@/lib/store";

/**
 * GET /api/assessments/:id
 *
 * @param {Request} _request - Incoming HTTP request (unused).
 * @param {{ params: Promise<{ id: string }> }} context - Route context with the dynamic segment.
 * @returns {NextResponse} The matching assessment or a 404/400 error.
 */
export async function GET(_request, { params }) {
  const { id } = await params;
  const parsed = numericIdSchema.safeParse(id);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid assessment ID" }, { status: 400 });
  }

  const assessment = getAssessmentById(parsed.data);
  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  return NextResponse.json(assessment);
}
