"use client";

/**
 * @module components/pages/ChallengesPage
 * @description Challenges dashboard where users view available carbon-saving challenges,
 * mark them complete, and earn gamified points.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Target, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/api";

/**
 * ChallengesPage component that lists user challenges and handles completions.
 *
 * @returns {React.ReactElement} The rendered ChallengesPage.
 */
export default function ChallengesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => fetchApi("/api/challenges"),
  });

  const completeChallengeMutation = useMutation({
    mutationFn: async (id) => {
      return fetchApi(`/api/challenges/${id}/complete`, { method: "PATCH" });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      const challenge = challenges?.find((c) => c.id === id);
      toast({
        title: "Challenge Completed!",
        description: `You earned ${challenge?.points ?? 0} points for "${challenge?.title ?? ""}". Keep it up!`,
      });
    },
    onError: () => toast({ title: "Error", description: "Could not complete challenge.", variant: "destructive" }),
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Challenges</h1>
          <p className="text-muted-foreground">Complete tasks to earn points and reduce your footprint.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
          </div>
        ) : challenges?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Available challenges">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className={`flex flex-col transition-all ${challenge.completed ? "bg-muted/30 border-muted" : "hover:shadow-md border-primary/20"}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={challenge.completed ? "secondary" : "default"} className="capitalize">{challenge.category}</Badge>
                    <span className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full" aria-label={`${challenge.points} target points`}>
                      <Target className="w-3 h-3 mr-1" />{challenge.points} pts
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{challenge.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 text-sm text-muted-foreground">
                  <p>{challenge.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs font-medium">
                    <span className="flex items-center text-primary" aria-label={`${challenge.carbonSaved} kilograms of carbon dioxide saved`}><Leaf className="w-3 h-3 mr-1" />-{challenge.carbonSaved} kg CO₂ saved</span>
                    {!challenge.completed && <span className="flex items-center text-muted-foreground"><Clock className="w-3 h-3 mr-1" />{challenge.daysLeft} days left</span>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={challenge.completed ? "secondary" : "default"}
                    disabled={challenge.completed || completeChallengeMutation.isPending}
                    onClick={() => completeChallengeMutation.mutate(challenge.id)}
                    aria-label={challenge.completed ? `Completed ${challenge.title}` : `Mark ${challenge.title} as complete`}
                  >
                    {challenge.completed ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Completed</> : "Mark Complete"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20"><p className="text-muted-foreground">No challenges available this week.</p></div>
        )}
      </div>
    </MainLayout>
  );
}
