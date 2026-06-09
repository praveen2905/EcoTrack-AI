import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Shield, Zap, BarChart } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-24 py-12">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Climate action meets <span className="text-primary">personal ambition.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              Track, reduce, and optimize your carbon footprint with precision-engineered AI insights and satisfying gamification.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link href="/assess">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                  Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Abstract Hero Graphic */}
          <div className="flex-1 w-full max-w-[500px] aspect-square relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-64 h-64 border-4 border-primary/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
               <div className="absolute w-4 h-4 bg-primary rounded-full top-0 -translate-y-1/2"></div>
            </div>
            <div className="absolute w-48 h-48 border-4 border-secondary/30 rounded-full flex items-center justify-center animate-[spin_8s_linear_infinite_reverse]">
               <div className="absolute w-3 h-3 bg-secondary rounded-full bottom-0 translate-y-1/2"></div>
            </div>
            <div className="absolute z-10 w-32 h-32 bg-background rounded-full shadow-2xl flex items-center justify-center border border-border">
              <Leaf className="w-12 h-12 text-primary" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <BarChart className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Precision Tracking</h3>
            <p className="text-muted-foreground">Log your transportation, energy, and consumption data to get an accurate picture of your true environmental impact.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI-Powered Insights</h3>
            <p className="text-muted-foreground">Our intelligent engine analyzes your habits and provides actionable, high-impact recommendations tailored just for you.</p>
          </div>
          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gamified Progress</h3>
            <p className="text-muted-foreground">Turn sustainability into a habit. Earn XP, level up, collect badges, and compete with friends on the leaderboard.</p>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}