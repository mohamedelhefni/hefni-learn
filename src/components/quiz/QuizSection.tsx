"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MultipleChoice } from "./MultipleChoice";
import { CommandChallenge } from "./CommandChallenge";
import { FillYaml } from "./FillYaml";
import { TrueFalse } from "./TrueFalse";
import type { Quiz, QuizQuestion } from "@/lib/types";

interface QuizSectionProps {
  quiz: Quiz;
  alreadyCompleted: boolean;
  savedScore?: number;
  onQuizCompleted: (points: number, score: number) => void;
}

const QUESTION_LABELS: Record<QuizQuestion["type"], string> = {
  multiple_choice: "Multiple choice",
  command_challenge: "Command",
  fill_yaml: "Fill in YAML",
  true_false: "True / False",
};

export function QuizSection({ quiz, alreadyCompleted, savedScore, onQuizCompleted }: QuizSectionProps) {
  const passingScore = quiz.passing_score ?? 70;
  const questions = quiz.questions;
  const totalPoints = questions.reduce((s, q) => s + q.points, 0);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ correct: boolean; points: number }[]>([]);
  const [finished, setFinished] = useState(false);
  const [retaking, setRetaking] = useState(false);
  const [retakeCount, setRetakeCount] = useState(0);

  function startRetake() {
    setCurrent(0);
    setAnswers([]);
    setFinished(false);
    setRetaking(true);
    setRetakeCount((n) => n + 1); // forces question components to remount
  }

  function handleAnswer(correct: boolean, points: number) {
    const updated = [...answers, { correct, points }];
    setAnswers(updated);
    // Don't award points mid-quiz; all points are awarded on finish
  }

  function goNext() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      // Quiz finished — award points only if first completion
      const earned = answers.reduce((s, a) => s + a.points, 0);
      const score =
        totalPoints > 0 ? Math.round((earned / totalPoints) * 100) : 0;
      onQuizCompleted(earned, score);
      setFinished(true);
    }
  }

  const earnedSoFar = answers.reduce((s, a) => s + a.points, 0);
  const progressPct = (current / questions.length) * 100;

  // Show completed state immediately if already finished in a prior session (and not retaking)
  if (alreadyCompleted && !finished && answers.length === 0 && !retaking) {
    const pct = savedScore ?? 0;
    const passed = pct >= passingScore;
    return (
      <div className="space-y-6 max-w-xl">
        <h2 className="text-xl font-semibold">Quiz</h2>
        <div className="rounded-lg border border-border bg-card p-6 text-center space-y-4">
          <div>
            <p
              className="text-5xl font-bold tabular-nums"
              style={{ color: passed ? "var(--success)" : "var(--warning)" }}
            >
              {pct}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">previous score</p>
          </div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              background: passed ? "var(--success-subtle)" : "var(--warning-subtle)",
              color: passed ? "var(--success)" : "var(--warning)",
            }}
          >
            {passed ? "Passed" : `Need ${passingScore}% to pass`}
          </div>
          <p className="text-xs text-muted-foreground">
            Points already awarded. Retaking won&apos;t grant additional points.
          </p>
        </div>
        <button
          onClick={startRetake}
          className="text-sm text-primary hover:underline"
        >
          Retake quiz (no extra points)
        </button>
      </div>
    );
  }

  if (finished) {
    const score = totalPoints > 0 ? Math.round((earnedSoFar / totalPoints) * 100) : 0;
    const passed = score >= passingScore;

    return (
      <div className="space-y-6 max-w-xl">
        <h2 className="text-xl font-semibold">Quiz complete</h2>

        <div className="rounded-lg border border-border bg-card p-6 text-center space-y-4">
          <div>
            <p
              className="text-5xl font-bold tabular-nums"
              style={{ color: passed ? "var(--success)" : "var(--warning)" }}
            >
              {score}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {earnedSoFar} / {totalPoints} pts
            </p>
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              background: passed ? "var(--success-subtle)" : "var(--warning-subtle)",
              color: passed ? "var(--success)" : "var(--warning)",
            }}
          >
            {passed ? "Passed" : `Need ${passingScore}% to pass`}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm pt-2">
            <div className="rounded-md bg-muted p-3">
              <p className="text-2xl font-bold text-foreground">
                {answers.filter((a) => a.correct).length}
              </p>
              <p className="text-muted-foreground">Correct</p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="text-2xl font-bold text-foreground">
                {answers.filter((a) => !a.correct).length}
              </p>
              <p className="text-muted-foreground">Incorrect</p>
            </div>
          </div>
        </div>

        <button
          onClick={startRetake}
          className="text-sm text-primary hover:underline"
        >
          Retake quiz {alreadyCompleted ? "(no extra points)" : ""}
        </button>
      </div>
    );
  }

  const question = questions[current];
  const hasAnswered = answers.length > current;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Quiz</h2>
          <span className="text-sm text-muted-foreground tabular-nums">
            {current + 1} / {questions.length}
          </span>
        </div>
        <Progress value={progressPct} className="h-1.5" />
      </div>

      <div key={retakeCount} className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs">
              {QUESTION_LABELS[question.type]}
            </Badge>
            <p className="font-medium text-sm leading-snug">{question.question}</p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {question.points} pts
          </Badge>
        </div>

        {question.type === "multiple_choice" && (
          <MultipleChoice question={question} onAnswer={handleAnswer} />
        )}
        {question.type === "command_challenge" && (
          <CommandChallenge question={question} onAnswer={handleAnswer} />
        )}
        {question.type === "fill_yaml" && (
          <FillYaml question={question} onAnswer={handleAnswer} />
        )}
        {question.type === "true_false" && (
          <TrueFalse question={question} onAnswer={handleAnswer} />
        )}

        {hasAnswered && (
          <div className="pt-2 border-t border-border flex justify-end">
            <button
              onClick={goNext}
              className="px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground"
            >
              {current < questions.length - 1 ? "Next question" : "See results"}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Earned so far: {earnedSoFar} pts</span>
        <span>·</span>
        <span>Passing: {passingScore}%</span>
      </div>
    </div>
  );
}
