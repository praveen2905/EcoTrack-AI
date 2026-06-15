import { NextResponse } from "next/server";
import { getChallenges } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getChallenges());
}
