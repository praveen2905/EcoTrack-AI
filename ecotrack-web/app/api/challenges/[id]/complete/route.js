import { NextResponse } from "next/server";
import { completeChallenge } from "@/lib/store";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const challenge = completeChallenge(parseInt(id, 10));
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }
  return NextResponse.json(challenge);
}
