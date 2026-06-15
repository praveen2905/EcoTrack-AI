import { NextResponse } from "next/server";
import { LEADERBOARD } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(LEADERBOARD);
}
