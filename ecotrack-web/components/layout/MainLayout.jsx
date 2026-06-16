/**
 * @module components/layout/MainLayout
 * @description The main layout wrapper for pages in the application.
 * Ensures consistent grid containment, sets up navigation, and provides
 * skip-links for screen reader and keyboard accessibility.
 */

import { Navbar } from "./Navbar";

/**
 * MainLayout component that wraps content with navigation and standard layout padding.
 *
 * @param {object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to render within main.
 * @param {boolean} [props.fullWidth=false] - Whether content stretches full width or stays within standard container bounds.
 * @returns {React.ReactElement} The rendered layout component.
 */
export function MainLayout({ children, fullWidth = false }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-ring outline-none"
      >
        Skip to main content
      </a>
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
