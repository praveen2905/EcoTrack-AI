import { Skeleton } from "@/components/ui/skeleton";

/**
 * Standard loading skeleton fallback for page routing transitions.
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Skeleton className="col-span-4 h-[300px] w-full rounded-xl" />
        <Skeleton className="col-span-3 h-[300px] w-full rounded-xl" />
      </div>
    </div>
  );
}
