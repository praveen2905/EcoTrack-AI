"use client";

/**
 * @module components/ErrorBoundary
 * @description React Class Component error boundary to capture and handle UI rendering failures
 * gracefully without crashing the whole application.
 */

import React from "react";
import { Button } from "@/components/ui/button";

/**
 * ErrorBoundary catches errors during rendering in its child component tree.
 */
export class ErrorBoundary extends React.Component {
  /**
   * @param {object} props - Component properties.
   * @param {React.ReactNode} props.children - Child components to wrap.
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Updates state so the next render shows the fallback UI.
   *
   * @param {Error} error - The caught error.
   * @returns {{ hasError: boolean, error: Error }} Updated state object.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Logs error metadata.
   *
   * @param {Error} error - Caught error.
   * @param {React.ErrorInfo} errorInfo - React rendering stack trace.
   */
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center space-y-4 border rounded-xl bg-destructive/5 border-destructive/20 m-4" role="alert">
          <h2 className="text-xl font-bold text-destructive">Something went wrong</h2>
          <p className="text-muted-foreground text-sm max-w-md">
            {this.state.error?.message || "An unexpected error occurred in this view. Please try refreshing or checking back later."}
          </p>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false, error: null })}
            aria-label="Retry loading failed component"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
