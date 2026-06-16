"use client";

/**
 * @module components/providers
 * @description Application providers wrapper, setting up React Query client,
 * Next-Themes support, Toast alerts system, and the root ErrorBoundary component.
 */

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/hooks/use-toast";
import { ErrorBoundary } from "./ErrorBoundary";

/**
 * Providers wraps child components with app-wide context providers.
 *
 * @param {object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @returns {React.ReactElement} The wrapped element.
 */
export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
