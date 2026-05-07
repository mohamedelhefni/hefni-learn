"use client";

import { Progress } from "@/components/ui/progress";
import type { ChapterMeta } from "@/lib/types";

interface ChapterHeaderProps {
  chapter: ChapterMeta;
  earnedPoints: number;
  totalPoints: number;
}

export function ChapterHeader({ chapter, earnedPoints, totalPoints }: ChapterHeaderProps) {
  const pct = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return (
    <div className="border-b bg-card px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Chapter {chapter.number}
          </p>
          <h1 className="text-2xl font-bold tracking-tight">{chapter.title}</h1>
          {chapter.description && (
            <p className="mt-1 text-sm text-muted-foreground">{chapter.description}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium">
            {earnedPoints} / {totalPoints} pts
          </p>
          <p className="text-xs text-muted-foreground">{pct}% complete</p>
        </div>
      </div>
      <div className="mt-3">
        <Progress value={pct} className="h-2" />
      </div>
    </div>
  );
}
