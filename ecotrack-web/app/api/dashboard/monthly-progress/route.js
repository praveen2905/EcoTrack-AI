import { NextResponse } from "next/server";

export async function GET() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const baseEmissions = [195, 190, 182, 175, 165, 158, 150, 143, 138, 130, 120, 115];
  const previousYearEmissions = [210, 208, 205, 200, 198, 192, 188, 185, 180, 175, 170, 165];
  const currentMonth = new Date().getMonth();
  const data = months.slice(0, currentMonth + 1).map((month, i) => ({
    month,
    emissions: baseEmissions[i],
    previousYear: previousYearEmissions[i],
  }));
  return NextResponse.json(data);
}
