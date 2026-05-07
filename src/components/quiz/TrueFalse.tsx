"use client";

import { useState } from "react";
import type { TrueFalseQuestion } from "@/lib/types";

interface TrueFalseProps {
  question: TrueFalseQuestion;
  onAnswer: (correct: boolean, points: number) => void;
}

export function TrueFalse({ question, onAnswer }: TrueFalseProps) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(val: boolean) {
    if (submitted) return;
    setSelected(val);
  }

  function handleSubmit() {
    if (selected === null || submitted) return;
    setSubmitted(true);
    const isCorrect = selected === question.correct;
    onAnswer(isCorrect, isCorrect ? question.points : 0);
  }

  function rowClass(val: boolean) {
    let base = "flex-1 py-3 px-5 rounded-md border text-sm font-medium transition-colors duration-150 ";
    if (!submitted) {
      return (
        base +
        (selected === val
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border bg-secondary/40 hover:bg-secondary")
      );
    }
    if (val === question.correct) {
      return base + "border-[var(--success)] bg-[var(--success-subtle)] text-[var(--success)]";
    }
    if (val === selected && selected !== question.correct) {
      return base + "border-destructive bg-destructive/10 text-destructive";
    }
    return base + "border-border bg-secondary/20 text-muted-foreground";
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <button className={rowClass(true)} onClick={() => handleSelect(true)} disabled={submitted}>
          True
        </button>
        <button className={rowClass(false)} onClick={() => handleSelect(false)} disabled={submitted}>
          False
        </button>
      </div>

      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground disabled:opacity-40"
          >
            Submit
          </button>
        </div>
      )}

      {submitted && question.explanation && (
        <div className="rounded-md px-4 py-3 bg-muted text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Explanation:</span> {question.explanation}
        </div>
      )}
    </div>
  );
}
