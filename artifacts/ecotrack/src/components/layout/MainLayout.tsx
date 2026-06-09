import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { SkipNav } from "@/components/SkipNav";

interface MainLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SkipNav />
      <Navbar />
      {fullWidth ? (
        <main id="main-content" tabIndex={-1} className="flex-1 w-full outline-none">
          {children}
        </main>
      ) : (
        <main id="main-content" tabIndex={-1} className="flex-1 container mx-auto px-4 py-8 max-w-6xl outline-none">
          {children}
        </main>
      )}
    </div>
  );
}
