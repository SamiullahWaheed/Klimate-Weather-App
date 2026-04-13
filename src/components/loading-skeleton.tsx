import { Skeleton } from "./ui/skeleton";

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Skeleton className="h-[340px] w-full rounded-2xl" />
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-[280px] w-full rounded-2xl" />
          <Skeleton className="h-[280px] w-full rounded-2xl" />
        </div>
        <Skeleton className="h-[340px] w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default WeatherSkeleton;
