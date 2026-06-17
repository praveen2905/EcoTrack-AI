import { Loader2 } from "lucide-react";

/**
 * Global loading UI for the Next.js app directory.
 * Wraps page content in a Suspense boundary automatically.
 */
export default function GlobalLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center" aria-label="Loading content..." role="status">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Loading EcoTrack...
        </p>
      </div>
    </div>
  );
}
