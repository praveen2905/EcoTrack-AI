import { Link, useLocation } from "wouter";
import { Leaf, User, Activity, LayoutDashboard, Target, Trophy, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assess", label: "Assess", icon: Activity },
  { href: "/recommendations", label: "Insights", icon: Leaf },
  { href: "/challenges", label: "Challenges", icon: Target },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-colors hover:text-primary" aria-label="EcoTrack AI home">
          <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="font-bold tracking-tight text-lg">EcoTrack AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={location === link.href ? "page" : undefined}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
            >
              <link.icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            data-testid="button-toggle-theme"
          >
            <Sun className="h-5 w-5 dark:hidden" aria-hidden="true" />
            <Moon className="hidden h-5 w-5 dark:block" aria-hidden="true" />
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="mr-2"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            data-testid="button-toggle-theme-mobile"
          >
            <Sun className="h-5 w-5 dark:hidden" aria-hidden="true" />
            <Moon className="hidden h-5 w-5 dark:block" aria-hidden="true" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open navigation menu"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav aria-label="Mobile navigation">
                <div className="flex flex-col gap-4 mt-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary ${
                        location === link.href ? "text-primary" : "text-muted-foreground"
                      }`}
                      aria-current={location === link.href ? "page" : undefined}
                      data-testid={`nav-mobile-link-${link.label.toLowerCase()}`}
                    >
                      <link.icon className="h-5 w-5" aria-hidden="true" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
