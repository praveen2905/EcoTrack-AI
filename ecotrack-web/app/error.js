"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Global error boundary for the Next.js app directory.
 * Catches unhandled runtime errors in React components.
 *
 * @param {Object} props - Component props
 * @param {Error & { digest?: string }} props.error - The error object
 * @param {() => void} props.reset - Function to retry rendering the route
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 px-4 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground max-w-md">
        An unexpected error occurred while loading this page. We've been notified and are looking into it.
      </p>
      <div className="flex space-x-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.href = "/"} variant="outline">
          Return Home
        </Button>
      </div>
    </div>
  );
}
