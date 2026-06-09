import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockChallenges = [
  {
    id: 1,
    title: "Walk instead of drive",
    description: "Replace one car trip with walking per day.",
    category: "transport",
    points: 50,
    carbonSaved: 2.5,
    daysLeft: 5,
    completed: false,
  },
  {
    id: 2,
    title: "Meatless Monday",
    description: "Skip meat for one full day.",
    category: "food",
    points: 30,
    carbonSaved: 1.8,
    daysLeft: 3,
    completed: true,
  },
];

vi.mock("@workspace/api-client-react", () => ({
  useListChallenges: () => ({
    data: mockChallenges,
    isLoading: false,
  }),
  getListChallengesQueryKey: () => ["challenges"],
  useCompleteChallenge: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

import Challenges from "@/pages/challenges";

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("Challenges page", () => {
  it("renders the page heading", () => {
    render(<Challenges />, { wrapper });
    expect(screen.getByRole("heading", { name: /weekly challenges/i })).toBeInTheDocument();
  });

  it("renders a list of challenges", () => {
    render(<Challenges />, { wrapper });
    expect(screen.getByRole("list", { name: /weekly challenges/i })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(mockChallenges.length);
  });

  it("shows challenge titles", () => {
    render(<Challenges />, { wrapper });
    expect(screen.getByText("Walk instead of drive")).toBeInTheDocument();
    expect(screen.getByText("Meatless Monday")).toBeInTheDocument();
  });

  it("marks completed challenges with aria-pressed=true", () => {
    render(<Challenges />, { wrapper });
    const completedBtn = screen.getByTestId("button-complete-2");
    expect(completedBtn).toHaveAttribute("aria-pressed", "true");
    expect(completedBtn).toBeDisabled();
  });

  it("marks incomplete challenges with aria-pressed=false", () => {
    render(<Challenges />, { wrapper });
    const incompleteBtn = screen.getByTestId("button-complete-1");
    expect(incompleteBtn).toHaveAttribute("aria-pressed", "false");
    expect(incompleteBtn).not.toBeDisabled();
  });

  it("shows the carbon saved for each challenge", () => {
    render(<Challenges />, { wrapper });
    expect(screen.getByText(/-2\.5 kg CO/)).toBeInTheDocument();
  });
});
