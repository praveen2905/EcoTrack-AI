import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Leaf, BarChart2, TrendingDown, Calculator, Star,
  Share2, Globe, Mail, Users, CheckCircle2,
} from "lucide-react";

/**
 * Pre-configured list of mock customer testimonials.
 */
const TESTIMONIALS = [
  {
    quote: "EcoTrack AI completely changed how I think about my daily commute. The AI recommendations are so specific and actually manageable.",
    name: "Sarah Jenkins", title: "Sustainability Lead", rating: 5, initials: "SJ",
  },
  {
    quote: "The dashboard blew me away. Being able to see my historical trends helps me stay on track with my 30% reduction goals.",
    name: "Marcus Thierno", title: "Product Designer", rating: 5, initials: "MT",
  },
  {
    quote: "Best sustainability app on the market. Period. The AI analysis is leagues ahead of the generic calculators I've used before.",
    name: "Elena Rodriguez", title: "Climate Advocate", rating: 5, initials: "ER",
  },
];

/**
 * Pre-configured list of steps describing the user journey.
 */
const JOURNEY_STEPS = [
  { num: "01", label: "Initial Discovery", desc: "A quick 5-minute survey about your daily energy, transport, and consumption habits.", right: "Answer questions" },
  { num: "02", label: "AI Analysis", desc: "Our proprietary AI calculates your exact carbon tonnage using global standards.", right: "EcoTrack Computes" },
  { num: "03", label: "Personalized Roadmap", desc: "Tailored strategies based on your unique profile to reduce emissions effectively.", right: "Receive recommendations" },
  { num: "04", label: "Track & Earn", desc: "Track real-time progress, join global leaderboard challenges, and unlock eco-rewards.", right: "Ongoing Impact" },
];

/**
 * HomePage component rendering the application landing page.
 *
 * @returns {React.ReactElement} The rendered HomePage component.
 */
export default function HomePage() {
  const socialIcons = [
    { Icon: Share2, label: "Share website link" },
    { Icon: Globe, label: "Visit our global network website" },
    { Icon: Mail, label: "Send us an email" },
    { Icon: Users, label: "Join our community forums" },
  ];

  return (
    <MainLayout fullWidth>
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24" aria-label="Hero section">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Climate action meets{" "}
              <span className="text-primary">personal ambition.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[560px] leading-relaxed">
              Track, reduce, and optimize your carbon footprint with precision-engineered AI insights and satisfying gamification.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/assess">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full" aria-label="Start carbon footprint assessment">
                  Start Assessment <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full" aria-label="View application dashboard demo">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-[500px] aspect-square relative flex items-center justify-center" aria-hidden="true">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="relative w-64 h-64 border-4 border-primary/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
              <div className="absolute w-4 h-4 bg-primary rounded-full top-0 -translate-y-1/2" />
            </div>
            <div className="absolute w-48 h-48 border-4 border-secondary/30 rounded-full flex items-center justify-center animate-[spin_8s_linear_infinite_reverse]">
              <div className="absolute w-3 h-3 bg-secondary rounded-full bottom-0 translate-y-1/2" />
            </div>
            <div className="absolute z-10 w-32 h-32 bg-background rounded-full shadow-2xl flex items-center justify-center border border-border">
              <Leaf className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 pb-20" aria-label="Features summary">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <BarChart2 className="w-6 h-6 text-primary" />, bg: "bg-primary/10", title: "Precision Tracking", body: "Log transportation, energy, and consumption data to get an accurate picture of your true environmental impact." },
            { icon: <TrendingDown className="w-6 h-6 text-secondary" />, bg: "bg-secondary/10", title: "AI-Powered Insights", body: "Our intelligent engine analyzes your habits and provides actionable, high-impact recommendations tailored just for you." },
            { icon: <Star className="w-6 h-6 text-foreground" />, bg: "bg-accent", title: "Gamified Progress", body: "Turn sustainability into a habit. Earn XP, level up, collect badges, and compete on the leaderboard." },
          ].map((f) => (
            <div key={f.title} className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-6`}>{f.icon}</div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-[hsl(220_25%_10%)] dark:bg-[hsl(220_25%_8%)] py-20 px-4" aria-label="Sustainability tools">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Tools for Change</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Our intelligence suite automates the heavy lifting of sustainability, providing clear pathways to environmental stewardship.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Calculator className="w-6 h-6 text-primary" />, title: "Calculate", body: "Precision measurement of your lifestyle and business emissions from daily activities using advanced AI modelling." },
              { icon: <BarChart2 className="w-6 h-6 text-primary" />, title: "Track", body: "Monitor your progress over time with intuitive dashboards and real-time data sync across devices." },
              { icon: <TrendingDown className="w-6 h-6 text-primary" />, title: "Reduce", body: "Get actionable AI insights to lower your footprint through personalised habit coaching." },
            ].map((t) => (
              <div key={t.title} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-colors">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">{t.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{t.title}</h3>
                <p className="text-slate-400 leading-relaxed">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-20 px-4" aria-label="Customer onboarding path">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The Journey to Net Zero</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Our streamlined process makes sustainability accessible to everyone.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            <div className="flex flex-col gap-12">
              {JOURNEY_STEPS.map((step, i) => (
                <div key={step.num} className={`flex flex-col md:flex-row items-center gap-6 md:gap-0 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                    <h3 className="text-lg font-bold text-foreground mb-1">{step.label}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                    <span className="text-primary-foreground font-bold text-sm">{step.num}</span>
                  </div>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-left md:pl-12" : "md:text-right md:pr-12"}`}>
                    <span className="inline-flex items-center gap-2 text-primary font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      {step.right}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[hsl(220_25%_10%)] dark:bg-[hsl(220_25%_8%)] py-20 px-4" aria-label="Customer testimonials">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Conscious Humans</h2>
            <p className="text-slate-400 max-w-md mx-auto">Join thousands of people reducing their impact every day.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
                <div className="flex gap-1" aria-label={`Rating: ${t.rating} stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0" aria-hidden="true">{t.initials}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-primary py-20 px-4" aria-label="Call to action">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to make an impact?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-lg mx-auto">Join the movement and start your AI-powered sustainability assessment today. It&apos;s free to start.</p>
          <Link href="/assess">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-primary hover:bg-white/90 font-bold shadow-lg" aria-label="Get started for free now">
              Start Your Assessment Now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="w-full bg-[hsl(220_25%_7%)] dark:bg-[hsl(220_25%_5%)] py-14 px-4" role="contentinfo">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-primary" aria-hidden="true" />
                <span className="text-white font-bold text-lg">EcoTrack AI</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">Empowering individuals and businesses with intelligence-driven sustainability solutions.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              <div>
                <p className="text-white font-semibold mb-4">Product</p>
                <ul className="space-y-2 text-slate-500">
                  <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                  <li><Link href="/assess" className="hover:text-primary transition-colors">Assessment</Link></li>
                  <li><Link href="/challenges" className="hover:text-primary transition-colors">Challenges</Link></li>
                  <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-4">Company</p>
                <ul className="space-y-2 text-slate-500">
                  <li><span className="hover:text-primary transition-colors cursor-pointer">About</span></li>
                  <li><span className="hover:text-primary transition-colors cursor-pointer">Features</span></li>
                  <li><span className="hover:text-primary transition-colors cursor-pointer">Contact</span></li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-4">Legal</p>
                <ul className="space-y-2 text-slate-500">
                  <li><span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span></li>
                  <li><span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span></li>
                  <li><span className="hover:text-primary transition-colors cursor-pointer">Cookie Policy</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">&copy; {new Date().getFullYear()} EcoTrack AI. Intelligent Sustainability. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {socialIcons.map(({ Icon, label }, idx) => (
                <button key={idx} aria-label={label} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/40 transition-colors outline-none focus:ring-2 focus:ring-primary/40">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
