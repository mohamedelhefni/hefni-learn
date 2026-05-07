"use client";

import { useState } from "react";
import type { FillYamlQuestion } from "@/lib/types";

interface FillYamlProps {
  question: FillYamlQuestion;
  onAnswer: (correct: boolean, points: number) => void;
}

export function FillYaml({ question, onAnswer }: FillYamlProps) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  // Split template on ____
  const parts = question.yaml_template.split("____");

  function handleSubmit() {
    if (!value.trim() || submitted) return;
    const isCorrect = value.trim().toLowerCase() === question.expected.toLowerCase();
    setCorrect(isCorrect);
    setSubmitted(true);
    onAnswer(isCorrect, isCorrect ? question.points : 0);
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-md p-4 font-mono text-xs leading-relaxed"
        style={{ background: "var(--terminal-bg)", color: "var(--terminal-text)" }}
      >
        {parts[0]}
        {submitted ? (
          <span
            className="px-1 rounded"
            style={{
              background: correct ? "var(--success-subtle)" : "oklch(0.62 0.20 24 / 0.2)",
              color: correct ? "var(--success)" : "oklch(0.62 0.20 24)",
            }}
          >
            {value.trim() || "_____"}
          </span>
        ) : (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="___"
            style={{
              background: "oklch(0.20 0.008 240)",
              color: "var(--terminal-prompt)",
              border: "1px solid oklch(0.35 0.010 195)",
              borderRadius: "0.25rem",
              padding: "0 0.375rem",
              fontFamily: "inherit",
              fontSize: "inherit",
              width: `${Math.max(4, value.length + 2)}ch`,
              outline: "none",
            }}
            autoComplete="off"
            spellCheck={false}
          />
        )}
        {parts[1]}
      </div>

      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground disabled:opacity-40"
          >
            Submit
          </button>
        </div>
      )}

      {submitted && (
        <div
          className="rounded-md px-4 py-3 text-sm"
          style={{
            background: correct ? "var(--success-subtle)" : "var(--warning-subtle)",
            color: correct ? "var(--success)" : "var(--warning)",
          }}
        >
          {correct ? (
            <span>Correct — {question.points} points.</span>
          ) : (
            <span>
              Not quite. The answer was{" "}
              <code className="font-mono text-xs">{question.expected}</code>.
            </span>
          )}
          {question.explanation && (
            <p className="mt-1 text-xs" style={{ color: "oklch(0.60 0.008 240)" }}>
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
