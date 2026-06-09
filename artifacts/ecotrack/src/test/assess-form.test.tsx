import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@workspace/api-client-react", () => ({
  useCreateAssessment: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

import Assess from "@/pages/assess";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("Assess form", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  it("renders step 1 heading by default", () => {
    render(<Assess />, { wrapper });
    expect(screen.getByTestId("card-step-transportation")).toBeInTheDocument();
  });

  it("shows the step counter live region on mount", () => {
    render(<Assess />, { wrapper });
    const counter = screen.getByTestId("text-step-counter");
    expect(counter).toHaveAttribute("aria-live", "polite");
    expect(counter).toHaveTextContent("Step 1 of 4");
  });

  it("shows Back button as disabled on step 1", () => {
    render(<Assess />, { wrapper });
    const back = screen.getByTestId("button-prev-step");
    expect(back).toBeDisabled();
  });

  it("shows Next button on step 1", () => {
    render(<Assess />, { wrapper });
    const next = screen.getByTestId("button-next-step");
    expect(next).toBeInTheDocument();
  });

  it("has accessible labels for the transport km input", () => {
    render(<Assess />, { wrapper });
    const input = screen.getByTestId("input-transport-km");
    expect(input).toHaveAttribute("id", "transport-km");
    const label = document.querySelector('label[for="transport-km"]');
    expect(label).not.toBeNull();
  });

  it("advances to step 2 when Next is clicked with valid inputs", async () => {
    render(<Assess />, { wrapper });
    const next = screen.getByTestId("button-next-step");
    fireEvent.click(next);
    await waitFor(() => {
      expect(screen.getByTestId("card-step-electricity")).toBeInTheDocument();
    });
  });

  it("shows step 2 counter after advancing", async () => {
    render(<Assess />, { wrapper });
    fireEvent.click(screen.getByTestId("button-next-step"));
    await waitFor(() => {
      expect(screen.getByTestId("text-step-counter")).toHaveTextContent("Step 2 of 4");
    });
  });

  it("allows navigating back from step 2 to step 1", async () => {
    render(<Assess />, { wrapper });
    fireEvent.click(screen.getByTestId("button-next-step"));
    await waitFor(() => screen.getByTestId("card-step-electricity"));
    fireEvent.click(screen.getByTestId("button-prev-step"));
    await waitFor(() => {
      expect(screen.getByTestId("card-step-transportation")).toBeInTheDocument();
    });
  });

  it("renders the progress bar with correct aria attributes", () => {
    render(<Assess />, { wrapper });
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "25");
    expect(progress).toHaveAttribute("aria-valuemin", "0");
    expect(progress).toHaveAttribute("aria-valuemax", "100");
  });
});
