/**
 * @module api/challenges/[id]/complete
 * @description Mark a challenge as completed.
 * Validates the dynamic `id` segment with the shared numericIdSchema.
 */

import { NextResponse } from "next/server";
import { numericIdSchema } from "@/lib/validations";
import { completeChallenge } from "@/lib/store";

/**
 * PATCH /api/challenges/:id/complete
 *
 * @param {Request} _request - Incoming HTTP request (unused).
 * @param {{ params: Promise<{ id: string }> }} context - Route context with the dynamic segment.
 * @returns {NextResponse} The updated challenge or a 400/404 error.
 */
export async function PATCH(_request, { params }) {
  const { id } = await params;
  const parsed = numericIdSchema.safeParse(id);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid challenge ID" }, { status: 400 });
  }

  const challenge = completeChallenge(parsed.data);
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  return NextResponse.json(challenge);
}
