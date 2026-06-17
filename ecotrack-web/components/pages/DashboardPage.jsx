"use client";

/**
 * @module components/pages/DashboardPage
 * @description Main dashboard page showing carbon tracking metrics, weekly line charts, category breakdowns,
 * and monthly comparisons.
 */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
const WeeklyLineChart = dynamic(() => import("@/components/ui/dashboard-charts").then((mod) => mod.WeeklyLineChart), { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> });
const CategoryPieChart = dynamic(() => import("@/components/ui/dashboard-charts").then((mod) => mod.CategoryPieChart), { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> });
const MonthlyBarChart = dynamic(() => import("@/components/ui/dashboard-charts").then((mod) => mod.MonthlyBarChart), { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> });
import { Leaf, Target, Award, ArrowUp, ArrowDown } from "lucide-react";
import { fetchApi } from "@/lib/api";



/**
 * DashboardPage component showing overall statistics, weekly progress, category pie chart, and monthly bar chart.
 *
 * @returns {React.ReactElement} The rendered DashboardPage.
 */
export default function DashboardPage() {
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => fetchApi("/api/dashboard/summary"),
  });
  const { data: weekly, isLoading: isLoadingWeekly } = useQuery({
    queryKey: ["weekly-progress"],
    queryFn: () => fetchApi("/api/dashboard/weekly-progress"),
  });
  const { data: monthly, isLoading: isLoadingMonthly } = useQuery({
    queryKey: ["monthly-progress"],
    queryFn: () => fetchApi("/api/dashboard/monthly-progress"),
  });

  const pieData = useMemo(() => {
    if (!summary) return [];
    return [
      { name: "Transport", value: summary.categoryBreakdown.transport },
      { name: "Electricity", value: summary.categoryBreakdown.electricity },
      { name: "Food", value: summary.categoryBreakdown.food },
      { name: "Shopping", value: summary.categoryBreakdown.shopping },
    ];
  }, [summary]);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your environmental impact at a glance.</p>
        </div>

        {isLoadingSummary ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : summary ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" aria-label={`Total emissions: ${summary.totalEmissionsThisMonth} kg CO₂`}>
                  {summary.totalEmissionsThisMonth} kg CO₂
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {summary.percentageChangeFromLastMonth > 0 ? (
                    <><ArrowUp className="h-3 w-3 text-destructive" aria-hidden="true" /><span className="text-destructive font-medium">{summary.percentageChangeFromLastMonth}% increase</span></>
                  ) : (
                    <><ArrowDown className="h-3 w-3 text-primary" aria-hidden="true" /><span className="text-primary font-medium">{Math.abs(summary.percentageChangeFromLastMonth)}% decrease</span></>
                  )}
                  <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" aria-label={`Carbon score: ${summary.carbonScore} out of 100`}>
                  {summary.carbonScore}/100
                </div>
                <p className="text-xs text-muted-foreground mt-1">Average user is {summary.averageUserEmissions} kg</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" aria-label={`Completed challenges: ${summary.challengesCompleted}`}>
                  {summary.challengesCompleted}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{summary.streak}-day streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trees Equivalent</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" aria-label={`Equivalent trees planted: ${summary.treesEquivalent}`}>
                  {summary.treesEquivalent}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Planted this month</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Your daily emissions against your target</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoadingWeekly ? <Skeleton className="h-[300px] w-full" /> : weekly ? (
                <div className="h-[300px]" role="img" aria-label="Line chart showing daily emissions compared to target. Refer to dashboard values for exact emissions.">
                  <WeeklyLineChart data={weekly} />
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Where your emissions come from</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSummary ? <Skeleton className="h-[300px] w-full" /> : summary ? (
                <div className="h-[300px]" role="img" aria-label="Pie chart showing breakdown of emissions: transport, electricity, food, and shopping.">
                  <CategoryPieChart data={pieData} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {monthly && monthly.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>Emissions vs previous year</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoadingMonthly ? <Skeleton className="h-[300px] w-full" /> : (
                <div className="h-[300px]" role="img" aria-label="Bar chart showing monthly emissions of this year compared to last year.">
                  <MonthlyBarChart data={monthly} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
