import { MainLayout } from "@/components/layout/MainLayout";
import {
  useListChallenges, getListChallengesQueryKey,
  useCompleteChallenge,
} from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Target, Leaf } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Challenges() {
  const { data: challenges, isLoading } = useListChallenges({
    query: { queryKey: getListChallengesQueryKey() },
  });
  const completeChallenge = useCompleteChallenge();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleComplete = (id: number, points: number, title: string) => {
    completeChallenge.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListChallengesQueryKey() });
          toast({
            title: "Challenge Completed!",
            description: `You earned ${points} points for "${title}". Keep it up!`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Could not complete challenge. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Challenges</h1>
          <p className="text-muted-foreground">Complete tasks to earn points and reduce your footprint.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading challenges" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : challenges && challenges.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Weekly challenges">
            {challenges.map((challenge) => (
              <Card
                key={challenge.id}
                role="listitem"
                className={`flex flex-col transition-all ${
                  challenge.completed
                    ? "bg-muted/30 border-muted"
                    : "hover:shadow-md border-primary/20"
                }`}
                data-testid={`card-challenge-${challenge.id}`}
                aria-label={`${challenge.title} — ${challenge.completed ? "Completed" : `${challenge.daysLeft} days remaining`}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant={challenge.completed ? "secondary" : "default"}
                      className="capitalize"
                    >
                      {challenge.category}
                    </Badge>
                    <span
                      className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full"
                      aria-label={`${challenge.points} points reward`}
                    >
                      <Target className="w-3 h-3 mr-1" aria-hidden="true" />
                      {challenge.points} pts
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{challenge.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex-1 text-sm text-muted-foreground">
                  <p>{challenge.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs font-medium">
                    <span className="flex items-center text-primary">
                      <Leaf className="w-3 h-3 mr-1" aria-hidden="true" />
                      -{challenge.carbonSaved} kg CO₂ saved
                    </span>
                    {!challenge.completed && (
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                        {challenge.daysLeft} {challenge.daysLeft === 1 ? "day" : "days"} left
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={challenge.completed ? "secondary" : "default"}
                    disabled={challenge.completed || completeChallenge.isPending}
                    onClick={() => handleComplete(challenge.id, challenge.points, challenge.title)}
                    aria-pressed={challenge.completed}
                    data-testid={`button-complete-${challenge.id}`}
                  >
                    {challenge.completed ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                        Completed
                      </>
                    ) : (
                      "Mark Complete"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20" role="status" data-testid="empty-state-challenges">
            <p className="text-muted-foreground">No challenges available this week.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
