"use client";

import { useState } from "react";
import { Sun, Moon, RotateCcw, Star, Zap, BookOpen, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useAllProgress } from "@/lib/use-progress";

function StatPill({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  if (value === 0) return null;
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono"
      style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
      title={label}
    >
      {icon}
      <span>{value}</span>
    </div>
  );
}

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { stats, resetAll } = useAllProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (confirmReset) {
      resetAll();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const hasProgress = stats.totalPoints > 0;

  return (
    <header className="border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-baseline gap-3 shrink-0">
          <h1 className="text-lg font-semibold tracking-tight">
            <span style={{ color: "var(--primary)" }}>hefni</span>·learn
          </h1>
          <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
            interactive tutorials
          </span>
        </div>

        {/* Stats */}
        {hasProgress && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Total points — always show if non-zero */}
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              title="Total points earned"
            >
              <Star className="size-3" />
              <span>{stats.totalPoints} pts</span>
            </div>

            <StatPill
              icon={<BookOpen className="size-3" />}
              value={stats.chaptersStarted}
              label="Chapters started"
            />
            <StatPill
              icon={<Zap className="size-3" />}
              value={stats.exercisesCompleted}
              label="Exercises completed"
            />
            <StatPill
              icon={<CheckSquare className="size-3" />}
              value={stats.scenariosCompleted}
              label="Scenarios completed"
            />
            <StatPill
              icon={<CheckSquare className="size-3" />}
              value={stats.quizzesCompleted}
              label="Quizzes completed"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {hasProgress && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className={confirmReset ? "text-destructive hover:text-destructive" : "text-muted-foreground"}
            >
              <RotateCcw className="size-3.5" />
              {confirmReset ? "Confirm?" : "Reset"}
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
