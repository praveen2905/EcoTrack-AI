import { Suspense } from "react";
import ResultsPage from "@/components/pages/ResultsPage";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <ResultsPage />
    </Suspense>
  );
}
