import { MainLayout } from "@/components/layout/MainLayout";
import {
  useGetDashboardSummary, getGetDashboardSummaryQueryKey,
  useGetWeeklyProgress, getGetWeeklyProgressQueryKey,
  useGetMonthlyProgress, getGetMonthlyProgressQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Leaf, Target, Award, ArrowUp, ArrowDown } from "lucide-react";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
] as const;

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "var(--radius)",
} as const;

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() },
  });
  const { data: weekly, isLoading: isLoadingWeekly } = useGetWeeklyProgress({
    query: { queryKey: getGetWeeklyProgressQueryKey() },
  });
  const { data: monthly, isLoading: isLoadingMonthly } = useGetMonthlyProgress({
    query: { queryKey: getGetMonthlyProgressQueryKey() },
  });

  const pieData = summary
    ? [
        { name: "Transport", value: summary.categoryBreakdown.transport },
        { name: "Electricity", value: summary.categoryBreakdown.electricity },
        { name: "Food", value: summary.categoryBreakdown.food },
        { name: "Shopping", value: summary.categoryBreakdown.shopping },
      ]
    : [];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your environmental impact at a glance.</p>
        </div>

        {isLoadingSummary ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : summary ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card data-testid="card-total-emissions">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="value-total-emissions">
                  {summary.totalEmissionsThisMonth} kg CO₂
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {summary.percentageChangeFromLastMonth > 0 ? (
                    <>
                      <ArrowUp className="h-3 w-3 text-destructive" aria-hidden="true" />
                      <span className="text-destructive font-medium">
                        {summary.percentageChangeFromLastMonth}% increase
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3 w-3 text-primary" aria-hidden="true" />
                      <span className="text-primary font-medium">
                        {Math.abs(summary.percentageChangeFromLastMonth)}% decrease
                      </span>
                    </>
                  )}
                  <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-carbon-score">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="value-carbon-score">
                  {summary.carbonScore}/100
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average user is {summary.averageUserEmissions} kg
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-challenges">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="value-challenges-completed">
                  {summary.challengesCompleted}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {summary.streak}-day streak
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-trees">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trees Equivalent</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="value-trees">
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
              {isLoadingWeekly ? (
                <Skeleton className="h-[300px] w-full" />
              ) : weekly ? (
                <div
                  className="h-[300px]"
                  role="img"
                  aria-label="Line chart showing daily emissions vs target for the week"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weekly} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Line type="monotone" dataKey="emissions" name="Emissions" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="target" name="Target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
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
              {isLoadingSummary ? (
                <Skeleton className="h-[300px] w-full" />
              ) : summary ? (
                <div
                  className="h-[300px]"
                  role="img"
                  aria-label={`Pie chart: Transport ${summary.categoryBreakdown.transport}kg, Electricity ${summary.categoryBreakdown.electricity}kg, Food ${summary.categoryBreakdown.food}kg, Shopping ${summary.categoryBreakdown.shopping}kg`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${v}kg`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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
              {isLoadingMonthly ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div
                  className="h-[300px]"
                  role="img"
                  aria-label="Bar chart comparing monthly emissions to previous year"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend />
                      <Bar dataKey="emissions" name="This Year" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="previousYear" name="Last Year" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} opacity={0.5} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
