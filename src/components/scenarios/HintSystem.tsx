"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HintSystemProps {
  hints: string[];
  hintPenalty?: number;
  onHintUsed: (penaltyPoints: number) => void;
}

export function HintSystem({ hints, hintPenalty = 0, onHintUsed }: HintSystemProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [penaltyApplied, setPenaltyApplied] = useState<boolean[]>(hints.map(() => false));

  function revealNext() {
    const idx = revealedCount;
    if (idx >= hints.length) return;
    if (!penaltyApplied[idx] && hintPenalty > 0) {
      onHintUsed(hintPenalty);
      const updated = [...penaltyApplied];
      updated[idx] = true;
      setPenaltyApplied(updated);
    }
    setRevealedCount((c) => c + 1);
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: revealedCount }).map((_, i) => (
        <div key={i} className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 px-3 py-2">
          <span className="text-amber-500 text-xs font-semibold shrink-0 mt-0.5">Hint {i + 1}</span>
          <p className="text-sm text-amber-700 dark:text-amber-300">{hints[i]}</p>
          {hintPenalty > 0 && (
            <Badge variant="outline" className="ml-auto shrink-0 text-xs text-amber-600 border-amber-400">
              -{hintPenalty} pts
            </Badge>
          )}
        </div>
      ))}

      {revealedCount < hints.length && (
        <Button
          variant="outline"
          size="sm"
          className="text-amber-600 border-amber-400 hover:bg-amber-500/10"
          onClick={revealNext}
        >
          {revealedCount === 0 ? "Show hint" : "Next hint"}
          {hintPenalty > 0 && ` (-${hintPenalty} pts)`}
        </Button>
      )}

      {revealedCount === hints.length && hints.length > 0 && (
        <p className="text-xs text-muted-foreground">All hints shown.</p>
      )}
    </div>
  );
}
