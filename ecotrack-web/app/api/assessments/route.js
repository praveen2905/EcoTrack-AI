/**
 * @module api/assessments
 * @description REST endpoint for carbon footprint assessments.
 * - GET  /api/assessments — returns all stored assessments.
 * - POST /api/assessments — validates input, calculates emissions, persists, and returns the new assessment.
 */

import { NextResponse } from "next/server";
import { assessmentSchema } from "@/lib/validations";
import { calculateEmissions } from "@/lib/emission-calculator";
import { createAssessment, getAssessments } from "@/lib/store";
import { handleApiError } from "@/lib/api-error";

/**
 * Retrieve every assessment in reverse-chronological order.
 * @returns {Promise<NextResponse>} JSON array of assessment objects.
 */
export async function GET() {
  try {
    return NextResponse.json(getAssessments());
  } catch (error) {
    return handleApiError(error, "Failed to retrieve assessments.");
  }
}

/**
 * Create a new carbon footprint assessment.
 *
 * Validates the request body against {@link assessmentSchema} before
 * running the emission calculator.  Returns 400 with structured error
 * details when validation fails.
 *
 * @param {Request} request - Incoming HTTP request with JSON body.
 * @returns {Promise<NextResponse>} The created assessment (201) or validation errors (400).
 */
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return handleApiError(new Error("Invalid JSON payload"), "Invalid JSON payload", 400);
    }

    const result = assessmentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const emissions = calculateEmissions(result.data);
    const assessment = createAssessment(result.data, emissions);
    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Failed to create assessment.");
  }
}
