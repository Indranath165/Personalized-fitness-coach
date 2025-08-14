'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-100 dark:bg-slate-800",
        className
      )}
    />
  );
}

export function WorkoutCardSkeleton() {
  return (
    <div className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="ml-4 text-right">
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
      <div className="flex items-center">
        <Skeleton className="w-8 h-8 rounded" />
        <div className="ml-4 flex-1">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}
