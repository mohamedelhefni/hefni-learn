"use client";

import { useState } from "react";
import type { MultipleChoiceQuestion } from "@/lib/types";

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  onAnswer: (correct: boolean, points: number) => void;
}

export function MultipleChoice({ question, onAnswer }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(idx: number) {
    if (submitted) return;
    setSelected(idx);
  }

  function handleSubmit() {
    if (selected === null || submitted) return;
    setSubmitted(true);
    onAnswer(selected === question.correct, selected === question.correct ? question.points : 0);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {question.options.map((option, idx) => {
          let rowClass =
            "w-full text-left px-4 py-3 rounded-md border text-sm transition-colors duration-150 ";

          if (!submitted) {
            rowClass +=
              selected === idx
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-secondary/40 hover:bg-secondary hover:border-border/80";
          } else {
            if (idx === question.correct) {
              rowClass += "border-[var(--success)] bg-[var(--success-subtle)] text-[var(--success)]";
            } else if (idx === selected && selected !== question.correct) {
              rowClass += "border-destructive bg-destructive/10 text-destructive";
            } else {
              rowClass += "border-border bg-secondary/20 text-muted-foreground";
            }
          }

          return (
            <button key={idx} className={rowClass} onClick={() => handleSelect(idx)} disabled={submitted}>
              <span className="mr-3 text-xs font-mono font-medium text-muted-foreground">
                {String.fromCharCode(65 + idx)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
          >
            Submit
          </button>
        </div>
      )}

      {submitted && question.explanation && (
        <div className="rounded-md px-4 py-3 bg-muted text-sm text-muted-foreground mt-2">
          <span className="font-medium text-foreground">Explanation:</span> {question.explanation}
        </div>
      )}
    </div>
  );
}
