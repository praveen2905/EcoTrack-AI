import { MainLayout } from "@/components/layout/MainLayout";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useGetAssessment, getGetAssessmentQueryKey, useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { ArrowRight, CheckCircle2, TrendingDown } from "lucide-react";

export default function Results() {
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) setAssessmentId(parseInt(id, 10));
  }, []);

  const { data: assessment, isLoading } = useGetAssessment(assessmentId || 0, { query: { enabled: !!assessmentId, queryKey: getGetAssessmentQueryKey(assessmentId || 0) } });
  const { data: summary } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  if (!assessmentId && !isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold">No Assessment Found</h1>
          <p className="text-muted-foreground">Please take an assessment to view your results.</p>
          <Link href="/assess">
            <Button>Take Assessment</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

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
                <CardHeader>
                  <CardTitle>Total Emissions</CardTitle>
                  <CardDescription>Monthly CO₂ equivalent</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-8 border-primary/20">
                    <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent animate-[spin_3s_linear_infinite]" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${(assessment.carbonScore / 100) * 100}%, 0 ${(assessment.carbonScore / 100) * 100}%)`}}></div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{assessment.totalEmissions.toFixed(0)}</div>
                      <div className="text-sm text-muted-foreground">kg CO₂</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      Score: {assessment.carbonScore}/100
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Breakdown</CardTitle>
                  <CardDescription>Where your emissions come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Transport', value: assessment.transportEmissions },
                            { name: 'Electricity', value: assessment.electricityEmissions },
                            { name: 'Food', value: assessment.foodEmissions },
                            { name: 'Shopping', value: assessment.shoppingEmissions },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {[0, 1, 2, 3].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} formatter={(value: number) => `${value.toFixed(1)}kg`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingDown className="h-5 w-5 text-primary" /> Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  {summary ? (
                    assessment.totalEmissions < summary.averageUserEmissions ? 
                    `Great job! You emit ${((summary.averageUserEmissions - assessment.totalEmissions) / summary.averageUserEmissions * 100).toFixed(0)}% less than the average user.` :
                    `You emit ${((assessment.totalEmissions - summary.averageUserEmissions) / summary.averageUserEmissions * 100).toFixed(0)}% more than the average user. Let's work on reducing it.`
                  ) : 'Comparing to global averages...'}
                </p>
              </CardContent>
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