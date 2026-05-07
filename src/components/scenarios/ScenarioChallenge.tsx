"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HintSystem } from "./HintSystem";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Scenario } from "@/lib/types";

interface ScenarioChallengeProps {
  scenario: Scenario;
  onSolved: (points: number) => void;
  alreadySolved?: boolean;
}

function ScenarioChallenge({ scenario, onSolved, alreadySolved = false }: ScenarioChallengeProps) {
  const [solved, setSolved] = useState(alreadySolved);
  const [pendingPenalty, setPendingPenalty] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);

  function handleHintUsed(penalty: number) {
    setPendingPenalty((p) => p + penalty);
  }

  function handleSubmit() {
    if (!answer.trim()) return;
    // For this simulated environment, validate that the answer
    // mentions the key fix (apiVersion or image field)
    const answerLower = answer.toLowerCase();
    const scenarioId = scenario.id;
    let isCorrect = false;

    if (scenarioId === "scenario-01") {
      isCorrect = answerLower.includes("v1") && !answerLower.includes("apps/v1");
    } else if (scenarioId === "scenario-02") {
      isCorrect = answerLower.includes("image");
    } else {
      // Generic: answer must be non-trivial
      isCorrect = answer.trim().length > 10;
    }

    setCorrect(isCorrect);
    setShowFeedback(true);

    if (isCorrect && !solved) {
      const earned = Math.max(0, scenario.points - pendingPenalty);
      setSolved(true);
      onSolved(earned);
    }
  }

  const earnedPoints = Math.max(0, scenario.points - pendingPenalty);

  return (
    <Card className={solved ? "border-[var(--success)]/40 bg-[var(--success-subtle)]" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{scenario.title}</CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            {solved && (
              <Badge style={{ backgroundColor: "var(--success)", color: "oklch(0.10 0.010 240)" }}>
                Solved
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {scenario.points} pts
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Problem description */}
        <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:bg-[var(--terminal-bg)] [&_pre]:text-[var(--terminal-text)] [&_pre]:p-3 [&_pre]:rounded [&_pre]:text-xs [&_pre]:overflow-x-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{scenario.description}</ReactMarkdown>
        </div>

        {/* Broken manifest */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Broken manifest
          </p>
          <pre
            className="rounded-md p-4 text-xs font-mono overflow-x-auto leading-relaxed"
            style={{
              background: "var(--terminal-bg)",
              color: "var(--terminal-text)",
            }}
          >
            {scenario.manifest}
          </pre>
        </div>

        {/* Hint system */}
        {!solved && (
          <HintSystem
            hints={scenario.hints}
            hintPenalty={scenario.hint_penalty}
            onHintUsed={handleHintUsed}
          />
        )}

        {/* Fix answer input */}
        {!solved && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Describe your fix
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              placeholder="What's wrong and how would you fix it? (e.g. 'Change apiVersion from apps/v1 to v1')"
              className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Points available: {earnedPoints} / {scenario.points}
                {pendingPenalty > 0 && (
                  <span className="text-[var(--warning)] ml-1">
                    ({pendingPenalty} hint penalty)
                  </span>
                )}
              </p>
              <Button size="sm" onClick={handleSubmit} disabled={!answer.trim()}>
                Submit fix
              </Button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`rounded-md px-4 py-3 text-sm ${
              correct
                ? "bg-[var(--success-subtle)] text-[var(--success)]"
                : "bg-[var(--warning-subtle)] text-[var(--warning)]"
            }`}
          >
            {correct ? (
              <span>Correct — {earnedPoints} points earned.</span>
            ) : (
              <span>Not quite. Re-read the hints and try again.</span>
            )}
          </div>
        )}

        {/* Solved state: show solution */}
        {solved && (
          <div className="rounded-md px-4 py-3 bg-[var(--success-subtle)] text-[var(--success)] text-sm">
            Scenario solved — {earnedPoints} pts earned.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ScenarioListProps {
  scenarios: Scenario[];
  completedScenarios: string[];
  onScenarioCompleted: (id: string, points: number) => void;
}

export function ScenarioList({ scenarios, completedScenarios, onScenarioCompleted }: ScenarioListProps) {
  // Initialise from persisted data so solved state survives reloads
  const [solvedSet, setSolvedSet] = useState<Set<string>>(
    () => new Set(completedScenarios)
  );

  function handleSolved(id: string, points: number) {
    if (!solvedSet.has(id)) {
      setSolvedSet((prev) => new Set([...prev, id]));
      onScenarioCompleted(id, points);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Scenarios</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Debug broken Kubernetes manifests. Use hints sparingly — they cost points.
        </p>
      </div>
      {scenarios.map((scenario) => (
        <ScenarioChallenge
          key={scenario.id}
          scenario={scenario}
          onSolved={(pts) => handleSolved(scenario.id, pts)}
          alreadySolved={solvedSet.has(scenario.id)}
        />
      ))}
    </div>
  );
}
