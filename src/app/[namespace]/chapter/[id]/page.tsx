"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChapterHeader } from "@/components/chapter/ChapterHeader";
import { SectionNav } from "@/components/chapter/SectionNav";
import { useProgress } from "@/lib/use-progress";
import type { ChapterResponse, ChapterNavItem } from "@/lib/types";

function ChapterNavButton({
  item,
  namespace,
  direction,
}: {
  item: ChapterNavItem;
  namespace: string;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  return (
    <Link
      href={`/${namespace}/chapter/${item.id}`}
      className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary/60 hover:bg-card/80 transition-colors group min-w-0"
    >
      {isPrev && <ChevronLeft className="size-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />}
      <div className={`flex flex-col min-w-0 ${isPrev ? "items-start" : "items-end"}`}>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {isPrev ? "← prev" : "next →"}
        </span>
        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
          Ch.{item.number} {item.title}
        </span>
      </div>
      {!isPrev && <ChevronRight className="size-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />}
    </Link>
  );
}

export default function ChapterPage() {
  const params = useParams();
  const namespace = params.namespace as string;
  const id = params.id as string;

  const [data, setData] = useState<ChapterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const progress = useProgress(`${namespace}/${id}`);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/${namespace}/chapters/${id}`);
        if (!res.ok) throw new Error(`Chapter not found: ${namespace}/${id}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [namespace, id]);

  const totalPoints = data
    ? [
        ...(data.command_practice ?? []).map((e) => e.points),
        // ...(data.scenarios ?? []).map((s) => s.points),
        ...(data.quiz?.questions ?? []).map((q) => q.points),
      ].reduce((s, p) => s + p, 0)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-sm text-muted-foreground">
          <span style={{ color: "var(--terminal-dim)" }}>$ </span>
          <span style={{ color: "var(--terminal-prompt)" }}>loading chapter...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-destructive font-mono text-sm">{error ?? "Chapter not found"}</p>
          <Link href={`/${namespace}`} className="text-primary text-sm hover:underline">
            Back to chapters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b border-border px-6 py-3 flex items-center gap-2 text-xs font-mono flex-wrap">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          home
        </Link>
        <span style={{ color: "var(--terminal-dim)" }}>/</span>
        <Link
          href={`/${namespace}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {namespace}
        </Link>
        <span style={{ color: "var(--terminal-dim)" }}>/</span>
        <span style={{ color: "var(--primary)" }} className="truncate">
          {data.chapter.title}
        </span>
      </div>

      {/* Chapter header */}
      <ChapterHeader
        chapter={data.chapter}
        earnedPoints={progress.earnedPoints}
        totalPoints={totalPoints}
      />

      {/* Section tabs */}
      <div className="flex-1 overflow-y-auto">
        <SectionNav
          data={data}
          completedExercises={progress.completedExercises}
          completedScenarios={progress.completedScenarios}
          quizCompleted={progress.quizCompleted}
          quizScore={progress.quizScore}
          onExerciseCompleted={progress.completeExercise}
          onScenarioCompleted={progress.completeScenario}
          onQuizCompleted={progress.completeQuiz}
        />
      </div>

      {/* Prev / Next navigation */}
      {(data.prev || data.next) && (
        <div className="border-t border-border px-6 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              {data.prev && (
                <ChapterNavButton item={data.prev} namespace={namespace} direction="prev" />
              )}
            </div>
            <div className="flex justify-end">
              {data.next && (
                <ChapterNavButton item={data.next} namespace={namespace} direction="next" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
