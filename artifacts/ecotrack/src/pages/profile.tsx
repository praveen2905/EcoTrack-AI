import { MainLayout } from "@/components/layout/MainLayout";
import { useGetProfile, getGetProfileQueryKey, useListChallenges, getListChallengesQueryKey, useGetLeaderboard, getGetLeaderboardQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, Trophy, Award, TreePine, Leaf } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { data: profile, isLoading } = useGetProfile({ query: { queryKey: getGetProfileQueryKey() } });

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Your sustainability journey.</p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        ) : profile ? (
          <>
            {/* Level & XP Card */}
            <Card className="overflow-hidden border-2 border-primary/10">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                <div className="absolute -bottom-10 left-6">
                  <Avatar className="h-20 w-20 border-4 border-background">
                    <AvatarImage src={profile.avatar} alt={profile.username} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <CardContent className="pt-14 pb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{profile.username}</h2>
                    <p className="text-muted-foreground">Level {profile.level} Eco Warrior</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-orange-500 font-bold text-xl">
                        <Flame className="h-5 w-5 mr-1" /> {profile.streak}
                      </div>
                      <span className="text-xs text-muted-foreground">Day Streak</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-primary font-bold text-xl">
                        <Trophy className="h-5 w-5 mr-1" /> #{profile.rank}
                      </div>
                      <span className="text-xs text-muted-foreground">Global Rank</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>XP Progress</span>
                    <span>{profile.currentXp} / {profile.xpToNextLevel} XP</span>
                  </div>
                  <Progress value={(profile.currentXp / profile.xpToNextLevel) * 100} className="h-3" />
                  <p className="text-xs text-muted-foreground text-right">{profile.xpToNextLevel - profile.currentXp} XP to Level {profile.level + 1}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Lifetime Impact</CardTitle>
                  <CardDescription>Total metrics since joining</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Leaf className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Carbon Saved</p>
                        <p className="text-sm text-muted-foreground">Compared to average</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{profile.totalCarbonSaved}kg</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <Award className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">Total Points</p>
                        <p className="text-sm text-muted-foreground">From challenges</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-secondary">{profile.totalPoints}</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-accent/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-background rounded-lg shadow-sm border border-border">
                        <TreePine className="h-6 w-6 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Trees Equivalent</p>
                        <p className="text-sm text-muted-foreground">Impact visualised</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{Math.floor(profile.totalCarbonSaved / 20)}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Achievements</CardTitle>
                  <CardDescription>Unlocked through milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {profile.badges.map((badge) => (
                      <div key={badge.id} className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${badge.earned ? 'bg-card border-primary/20 shadow-sm' : 'bg-muted/50 border-dashed opacity-50 grayscale'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${badge.earned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {/* Rendering a dummy icon based on name, real app would map strings to icons */}
                          {badge.name.includes("Beginner") ? <Leaf className="h-6 w-6" /> : 
                           badge.name.includes("Warrior") ? <Award className="h-6 w-6" /> : 
                           <Trophy className="h-6 w-6" />}
                        </div>
                        <span className="text-xs font-bold leading-tight mb-1">{badge.name}</span>
                        {badge.earned && badge.earnedAt && (
                          <span className="text-[10px] text-muted-foreground">{format(new Date(badge.earnedAt), 'MMM yyyy')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </MainLayout>
  );
}