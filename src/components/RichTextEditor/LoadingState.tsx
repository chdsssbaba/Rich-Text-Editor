import React, { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingState: React.FC = memo(() => {
  return (
    <div 
      className="animate-pulse space-y-4"
      role="status"
      aria-label="Loading editor"
    >
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-card rounded-t-lg">
        <div className="flex gap-1">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        <Skeleton className="h-6 w-px mx-2" />
        <div className="flex gap-1">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
        <Skeleton className="h-6 w-px mx-2" />
        <div className="flex gap-1">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Content area skeleton */}
      <div className="p-6 bg-card rounded-b-lg space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <span className="sr-only">Loading editor...</span>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';
