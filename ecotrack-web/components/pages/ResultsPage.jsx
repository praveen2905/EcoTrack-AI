"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { ArrowRight, TrendingDown } from "lucide-react";

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];
const TOOLTIP_STYLE = { backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" };

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("id") ? parseInt(searchParams.get("id"), 10) : null;

  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: async () => {
      const res = await fetch(`/api/assessments/${assessmentId}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!assessmentId,
  });

  const { data: summary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/summary");
      return res.json();
    },
  });

  if (!assessmentId) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold">No Assessment Found</h1>
          <p className="text-muted-foreground">Please complete an assessment to view your results.</p>
          <Link href="/assess"><Button>Take Assessment</Button></Link>
        </div>
      </MainLayout>
    );
  }

  const pieData = assessment ? [
    { name: "Transport", value: assessment.transportEmissions },
    { name: "Electricity", value: assessment.electricityEmissions },
    { name: "Food", value: assessment.foodEmissions },
    { name: "Shopping", value: assessment.shoppingEmissions },
  ] : [];

  const comparisonText = summary && assessment
    ? assessment.totalEmissions < summary.averageUserEmissions
      ? `Great job! You emit ${((summary.averageUserEmissions - assessment.totalEmissions) / summary.averageUserEmissions * 100).toFixed(0)}% less than the average user.`
      : `You emit ${((assessment.totalEmissions - summary.averageUserEmissions) / summary.averageUserEmissions * 100).toFixed(0)}% more than the average user. Let's work on reducing it.`
    : "Comparing to global averages...";

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Carbon Footprint</h1>
          <p className="text-muted-foreground">Based on your recent assessment.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        ) : assessment ? (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="flex flex-col">
                <CardHeader><CardTitle>Total Emissions</CardTitle><CardDescription>Monthly CO₂ equivalent</CardDescription></CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center space-y-6">
                  <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-8 border-primary/20">
                    <div className="text-center z-10">
                      <div className="text-4xl font-bold">{assessment.totalEmissions.toFixed(0)}</div>
                      <div className="text-sm text-muted-foreground">kg CO₂/month</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full text-sm">
                    {[
                      { label: "Transport", value: assessment.transportEmissions },
                      { label: "Electricity", value: assessment.electricityEmissions },
                      { label: "Food", value: assessment.foodEmissions },
                      { label: "Shopping", value: assessment.shoppingEmissions },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between px-3 py-2 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-semibold">{item.value.toFixed(1)} kg</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">Score: {assessment.carbonScore}/100</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Breakdown</CardTitle><CardDescription>Where your emissions come from</CardDescription></CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
                          {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                        </Pie>
                        <RechartsTooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${Number(v).toFixed(1)}kg`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingDown className="h-5 w-5 text-primary" /> Comparison</CardTitle></CardHeader>
              <CardContent><p className="text-lg">{comparisonText}</p></CardContent>
              <CardFooter>
                <Link href="/recommendations" className="w-full">
                  <Button className="w-full h-12 text-lg">View Recommendations <ArrowRight className="ml-2 h-5 w-5" /></Button>
                </Link>
              </CardFooter>
            </Card>
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}
