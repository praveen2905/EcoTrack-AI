"use client";

import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Flame, Medal } from "lucide-react";

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard");
      return res.json();
    },
  });

  return (
    <MainLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Community Leaderboard</h1>
          <p className="text-muted-foreground">See how you stack up against the EcoTrack community.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : leaderboard?.length > 0 ? (
          <>
            <div className="flex justify-center items-end gap-2 md:gap-6 h-64 mb-8 pt-8">
              {leaderboard[1] && (
                <div className="flex flex-col items-center">
                  <Avatar className="h-16 w-16 border-4 border-slate-300 shadow-md">
                    <AvatarImage src={leaderboard[1].avatar} />
                    <AvatarFallback>{leaderboard[1].username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="mt-2 font-bold text-sm">{leaderboard[1].username}</div>
                  <div className="text-xs text-muted-foreground">{leaderboard[1].points} pts</div>
                  <div className="w-20 md:w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-t-lg mt-2 flex justify-center pt-2 border-t-4 border-slate-300">
                    <span className="text-2xl font-bold text-slate-400">2</span>
                  </div>
                </div>
              )}
              {leaderboard[0] && (
                <div className="flex flex-col items-center z-10">
                  <div className="mb-2 text-yellow-500 animate-bounce"><Trophy className="h-8 w-8" /></div>
                  <Avatar className="h-20 w-20 border-4 border-yellow-400 shadow-lg">
                    <AvatarImage src={leaderboard[0].avatar} />
                    <AvatarFallback>{leaderboard[0].username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="mt-2 font-bold text-lg">{leaderboard[0].username}</div>
                  <div className="text-xs text-muted-foreground font-medium">{leaderboard[0].points} pts</div>
                  <div className="w-24 md:w-28 h-32 bg-yellow-100 dark:bg-yellow-900/30 rounded-t-lg mt-2 flex justify-center pt-2 border-t-4 border-yellow-400">
                    <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">1</span>
                  </div>
                </div>
              )}
              {leaderboard[2] && (
                <div className="flex flex-col items-center">
                  <Avatar className="h-14 w-14 border-4 border-amber-600 shadow-md">
                    <AvatarImage src={leaderboard[2].avatar} />
                    <AvatarFallback>{leaderboard[2].username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="mt-2 font-bold text-sm">{leaderboard[2].username}</div>
                  <div className="text-xs text-muted-foreground">{leaderboard[2].points} pts</div>
                  <div className="w-20 md:w-24 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-t-lg mt-2 flex justify-center pt-2 border-t-4 border-amber-600">
                    <span className="text-xl font-bold text-amber-700">3</span>
                  </div>
                </div>
              )}
            </div>
            <Card>
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex justify-between items-center px-4">
                  <span className="text-sm font-medium text-muted-foreground w-12">Rank</span>
                  <span className="text-sm font-medium text-muted-foreground flex-1">Eco Warrior</span>
                  <span className="text-sm font-medium text-muted-foreground w-24 text-right hidden md:block">Saved CO₂</span>
                  <span className="text-sm font-medium text-muted-foreground w-24 text-right">Points</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {leaderboard.slice(3).map((entry) => (
                    <div key={entry.rank} className="flex items-center px-6 py-4 hover:bg-muted/50 transition-colors">
                      <span className="w-12 font-bold text-muted-foreground">{entry.rank}</span>
                      <div className="flex-1 flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.avatar} />
                          <AvatarFallback>{entry.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{entry.username}</div>
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            <span className="flex items-center text-orange-500"><Flame className="w-3 h-3 mr-1" />{entry.streak}</span>
                            <span>•</span>
                            <span className="flex items-center text-primary"><Medal className="w-3 h-3 mr-1" />{entry.badge}</span>
                          </div>
                        </div>
                      </div>
                      <span className="w-24 text-right font-medium text-primary hidden md:block">{entry.carbonSaved}kg</span>
                      <span className="w-24 text-right font-bold">{entry.points}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-20"><p className="text-muted-foreground">Leaderboard data unavailable.</p></div>
        )}
      </div>
    </MainLayout>
  );
}
