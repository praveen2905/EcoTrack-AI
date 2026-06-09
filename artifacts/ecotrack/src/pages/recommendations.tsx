import { MainLayout } from "@/components/layout/MainLayout";
import { useGetRecommendations, getGetRecommendationsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, Car, ShoppingBag, Utensils, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import type { BadgeProps } from "@/components/ui/badge";

type PriorityVariant = BadgeProps["variant"];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  transport: <Car className="h-5 w-5" aria-hidden="true" />,
  electricity: <Zap className="h-5 w-5" aria-hidden="true" />,
  food: <Utensils className="h-5 w-5" aria-hidden="true" />,
  shopping: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
};

const PRIORITY_VARIANTS: Record<string, PriorityVariant> = {
  high: "destructive",
  medium: "default",
  low: "secondary",
};

function getCategoryIcon(category: string): React.ReactNode {
  return CATEGORY_ICONS[category.toLowerCase()] ?? (
    <Lightbulb className="h-5 w-5" aria-hidden="true" />
  );
}

function getPriorityVariant(priority: string): PriorityVariant {
  return PRIORITY_VARIANTS[priority.toLowerCase()] ?? "secondary";
}

export default function Recommendations() {
  const { data: recommendations, isLoading } = useGetRecommendations({
    query: { queryKey: getGetRecommendationsQueryKey() },
  });

  const sorted = useMemo(() => {
    if (!recommendations) return [];
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return [...recommendations].sort(
      (a, b) => (order[a.priority.toLowerCase()] ?? 3) - (order[b.priority.toLowerCase()] ?? 3),
    );
  }, [recommendations]);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
            <p className="text-muted-foreground">Personalized recommendations to reduce your footprint.</p>
          </div>
          <Button variant="outline" className="gap-2" aria-label="Open AI chat assistant">
            <MessageSquare className="h-4 w-4" aria-hidden="true" /> Chat with AI
          </Button>
        </div>

        {isLoading ? (
          <div
            className="grid gap-6 md:grid-cols-2"
            aria-label="Loading recommendations"
            aria-busy="true"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <div
            className="grid gap-6 md:grid-cols-2"
            role="list"
            aria-label="AI recommendations"
          >
            {sorted.map((rec) => (
              <Card
                key={rec.id}
                role="listitem"
                className="flex flex-col overflow-hidden hover-elevate transition-all"
                data-testid={`card-recommendation-${rec.id}`}
              >
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div
                        className="p-2 bg-background rounded-md border shadow-sm text-primary"
                        aria-hidden="true"
                      >
                        {getCategoryIcon(rec.category)}
                      </div>
                      <div>
                        <CardTitle className="text-base capitalize">{rec.category}</CardTitle>
                        <CardDescription className="text-xs">
                          Saving: ~{rec.estimatedCarbonSaving} kg CO₂/mo
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={getPriorityVariant(rec.priority)}
                      className="capitalize"
                      aria-label={`${rec.priority} priority`}
                    >
                      {rec.priority} Priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Insight
                      </h4>
                      <p className="text-sm">{rec.insight}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Action
                      </h4>
                      <p className="text-sm font-medium">{rec.suggestion}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="secondary"
                    className="w-full"
                    size="sm"
                    data-testid={`button-add-challenge-${rec.id}`}
                    aria-label={`Add "${rec.suggestion}" to challenges`}
                  >
                    Add to Challenges
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20" role="status" data-testid="empty-state-recommendations">
            <p className="text-muted-foreground">
              No recommendations available. Take an assessment first.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
