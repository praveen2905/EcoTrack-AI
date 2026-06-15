import { NextResponse } from "next/server";

export async function GET() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const data = days.map((day, i) => ({
    day,
    emissions: Math.round((3.5 - i * 0.1 + Math.random() * 0.5) * 10) / 10,
    target: 3.0,
  }));
  return NextResponse.json(data);
}
