import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="space-y-2 text-center">
        <Skeleton className="h-8 w-[250px] mx-auto" />
        <Skeleton className="h-4 w-[350px] mx-auto" />
      </div>
      <div className="flex justify-center items-end gap-6 h-64 mt-12 mb-8">
        <Skeleton className="w-24 h-24 rounded-t-lg" />
        <Skeleton className="w-28 h-32 rounded-t-lg" />
        <Skeleton className="w-24 h-20 rounded-t-lg" />
      </div>
      <div className="space-y-3 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
