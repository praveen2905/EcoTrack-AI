import { MainLayout } from "@/components/layout/MainLayout";
import { useListChallenges, getListChallengesQueryKey, useCompleteChallenge } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Target, Leaf } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Challenges() {
  const { data: challenges, isLoading } = useListChallenges({ query: { queryKey: getListChallengesQueryKey() } });
  const completeChallenge = useCompleteChallenge();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleComplete = (id: number, points: number) => {
    completeChallenge.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListChallengesQueryKey() });
          toast({
            title: "Challenge Completed!",
            description: `You earned ${points} points and reduced your footprint.`,
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
          <p className="text-muted-foreground">Complete tasks to earn points and level up.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : challenges ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className={`flex flex-col transition-all ${challenge.completed ? 'opacity-70 bg-muted/50' : 'hover-elevate border-primary/20'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={challenge.completed ? "secondary" : "default"} className="capitalize">
                      {challenge.category}
                    </Badge>
                    <span className="flex items-center text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                      <Target className="w-3 h-3 mr-1" /> {challenge.points} pts
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{challenge.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 text-sm text-muted-foreground">
                  {challenge.description}
                  
                  <div className="flex items-center gap-4 mt-4 text-xs font-medium">
                    <span className="flex items-center text-primary">
                      <Leaf className="w-3 h-3 mr-1" /> -{challenge.carbonSaved}kg CO₂
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {challenge.daysLeft} days left
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={challenge.completed ? "secondary" : "default"}
                    disabled={challenge.completed || completeChallenge.isPending}
                    onClick={() => handleComplete(challenge.id, challenge.points)}
                  >
                    {challenge.completed ? (
                      <><CheckCircle2 className="mr-2 h-4 w-4 text-green-500" /> Completed</>
                    ) : (
                      "Mark Complete"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No challenges available this week.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}