"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, Car, ShoppingBag, Utensils, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_ICONS = {
  transport: <Car className="h-5 w-5" />,
  electricity: <Zap className="h-5 w-5" />,
  food: <Utensils className="h-5 w-5" />,
  shopping: <ShoppingBag className="h-5 w-5" />,
};

const PRIORITY_VARIANTS = { high: "destructive", medium: "default", low: "secondary" };

export default function RecommendationsPage() {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const res = await fetch("/api/recommendations");
      return res.json();
    },
  });

  const sorted = useMemo(() => {
    if (!recommendations) return [];
    const order = { high: 0, medium: 1, low: 2 };
    return [...recommendations].sort((a, b) => (order[a.priority.toLowerCase()] ?? 3) - (order[b.priority.toLowerCase()] ?? 3));
  }, [recommendations]);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
            <p className="text-muted-foreground">Personalized recommendations to reduce your footprint.</p>
          </div>
          <Button variant="outline" className="gap-2"><MessageSquare className="h-4 w-4" /> Chat with AI</Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {sorted.map((rec) => (
              <Card key={rec.id} className="flex flex-col overflow-hidden transition-all">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-background rounded-md border shadow-sm text-primary">
                        {CATEGORY_ICONS[rec.category.toLowerCase()] ?? <Lightbulb className="h-5 w-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-base capitalize">{rec.category}</CardTitle>
                        <CardDescription className="text-xs">Saving: ~{rec.estimatedCarbonSaving} kg CO₂/mo</CardDescription>
                      </div>
                    </div>
                    <Badge variant={PRIORITY_VARIANTS[rec.priority.toLowerCase()] ?? "secondary"} className="capitalize">{rec.priority} Priority</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  <div className="space-y-4">
                    <div><h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Insight</h4><p className="text-sm">{rec.insight}</p></div>
                    <div><h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Action</h4><p className="text-sm font-medium">{rec.suggestion}</p></div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="secondary" className="w-full" size="sm">Add to Challenges</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20"><p className="text-muted-foreground">No recommendations available. Take an assessment first.</p></div>
        )}
      </div>
    </MainLayout>
  );
}
