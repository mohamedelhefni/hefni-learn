"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useAllProgress } from "@/lib/use-progress";
import type { ChapterListItem } from "@/lib/types";

interface ChapterGridProps {
  chapters: ChapterListItem[];
  namespace: string;
}

function ChapterCard({
  item,
  namespace,
  earnedPoints,
}: {
  item: ChapterListItem;
  namespace: string;
  earnedPoints: number;
}) {
  const tags = [
    item.hasPractice && "Practice",
    item.hasQuiz && "Quiz",
  ].filter(Boolean) as string[];

  const isCompleted = item.totalPoints > 0 && earnedPoints >= item.totalPoints;
  const isStarted = earnedPoints > 0 && !isCompleted;

  return (
    <Link href={`/${namespace}/chapter/${item.id}`} className="group block">
      <article
        className={[
          "relative h-full rounded-lg border bg-card p-6 transition-colors duration-150 overflow-hidden",
          isCompleted
            ? "border-green-500/60 bg-green-500/5 hover:border-green-500/80"
            : "border-border hover:border-primary/60 hover:bg-card/80",
        ].join(" ")}
      >
        {/* Decorative chapter number */}
        <span
          className="absolute -top-3 -right-2 text-8xl font-bold tabular-nums select-none pointer-events-none"
          style={{ color: "var(--muted-foreground)", lineHeight: 1, opacity: 0.15 }}
          aria-hidden
        >
          {String(item.chapter.number).padStart(2, "0")}
        </span>

        {/* Top accent line */}
        <div
          className={[
            "absolute top-0 left-0 right-0 h-0.5 rounded-t-lg transition-opacity duration-150",
            isCompleted
              ? "bg-green-500 opacity-100"
              : "bg-primary opacity-0 group-hover:opacity-100",
          ].join(" ")}
        />

        <div className="relative space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Chapter {item.chapter.number}
              </p>
              {isCompleted && (
                <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
              )}
            </div>
            <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
              {item.chapter.title}
            </h2>
            {item.chapter.description && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {item.chapter.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-foreground)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <span className="text-xs font-mono tabular-nums shrink-0 ml-2">
              {isStarted ? (
                <span style={{ color: "var(--primary)" }}>
                  {earnedPoints} / {item.totalPoints} pts
                </span>
              ) : isCompleted ? (
                <span className="text-green-500">{item.totalPoints} pts ✓</span>
              ) : (
                <span className="text-muted-foreground">{item.totalPoints} pts</span>
              )}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ChapterGrid({ chapters, namespace }: ChapterGridProps) {
  const { store } = useAllProgress();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {chapters.map((item) => {
        const key = `${namespace}/${item.id}`;
        const earned = store[key]?.earnedPoints ?? 0;
        return (
          <ChapterCard
            key={item.id}
            item={item}
            namespace={namespace}
            earnedPoints={earned}
          />
        );
      })}
    </div>
  );
}
