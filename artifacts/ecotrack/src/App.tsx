import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

const Home = lazy(() => import("@/pages/home"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Assess = lazy(() => import("@/pages/assess"));
const Results = lazy(() => import("@/pages/results"));
const Recommendations = lazy(() => import("@/pages/recommendations"));
const Profile = lazy(() => import("@/pages/profile"));
const Challenges = lazy(() => import("@/pages/challenges"));
const Leaderboard = lazy(() => import("@/pages/leaderboard"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex flex-col gap-4 p-8">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-64 w-full rounded-xl" />
    <div className="grid grid-cols-3 gap-4">
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
  </div>
);

function Router() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/assess" component={Assess} />
          <Route path="/results" component={Results} />
          <Route path="/recommendations" component={Recommendations} />
          <Route path="/profile" component={Profile} />
          <Route path="/challenges" component={Challenges} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
