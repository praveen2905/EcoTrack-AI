import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[220px]" />
        <Skeleton className="h-4 w-[320px]" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
