"use client";

import { useState } from "react";
import { simulateCommand } from "@/lib/simulator";
import type { CommandChallengeQuestion } from "@/lib/types";

interface CommandChallengeProps {
  question: CommandChallengeQuestion;
  onAnswer: (correct: boolean, points: number) => void;
}

function normalizeCmd(cmd: string) {
  return cmd.trim().replace(/\s+/g, " ").toLowerCase();
}

function matchesExpected(norm: string, expected: string): boolean {
  // Full match or the typed command contains the expected fragment/prefix
  return norm === expected || norm.includes(expected);
}

export function CommandChallenge({ question, onAnswer }: CommandChallengeProps) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [cmdOutput, setCmdOutput] = useState<string | null>(null);

  function handleSubmit() {
    if (!input.trim() || submitted) return;

    const norm = normalizeCmd(input);
    const expected = normalizeCmd(question.expected_contains);

    const isCorrect =
      matchesExpected(norm, expected) ||
      (question.alternatives ?? []).some((alt) =>
        matchesExpected(norm, normalizeCmd(alt))
      );

    // Run through simulator to show realistic output
    const output = simulateCommand(input.trim());
    setCmdOutput(output);
    setCorrect(isCorrect);
    setSubmitted(true);
    onAnswer(isCorrect, isCorrect ? question.points : 0);
  }

  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-2 rounded-md px-3 py-2"
        style={{ background: "var(--terminal-bg)" }}
      >
        <span style={{ color: "var(--terminal-dim)", fontFamily: "monospace" }}>$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={submitted}
          placeholder="kubectl ..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{
            color: "var(--terminal-prompt)",
            fontFamily: "ui-monospace, monospace",
            caretColor: "var(--terminal-text)",
          }}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {/* Simulated output */}
      {cmdOutput !== null && (
        <pre
          className="rounded-md px-3 py-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap"
          style={{ background: "var(--terminal-bg)", color: "var(--terminal-text)" }}
        >
          {cmdOutput}
        </pre>
      )}

      {question.hint && !submitted && (
        <p className="text-xs text-muted-foreground">Hint: {question.hint}</p>
      )}

      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
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
            <span>Not quite — try a different command.</span>
          )}
          {question.explanation && (
            <p className="mt-1 text-xs opacity-80">{question.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
