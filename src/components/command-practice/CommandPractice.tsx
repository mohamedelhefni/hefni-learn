"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TerminalSimulator } from "./TerminalSimulator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { CommandPractice } from "@/lib/types";

interface CommandPracticeSectionProps {
  exercises: CommandPractice[];
  completedExercises: string[];
  onExerciseCompleted: (id: string, points: number) => void;
}

export function CommandPracticeSection({
  exercises,
  completedExercises,
  onExerciseCompleted,
}: CommandPracticeSectionProps) {
  // Initialise from persisted data so completed state survives reloads
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(completedExercises)
  );

  function handleSuccess(id: string, points: number) {
    if (!completed.has(id)) {
      setCompleted((prev) => new Set([...prev, id]));
      onExerciseCompleted(id, points);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Command Practice</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Practice kubectl commands in the simulated terminal below.
        </p>
      </div>

      {exercises.map((ex) => (
        <Card key={ex.id} className={completed.has(ex.id) ? "border-green-500/50 bg-green-500/5" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{ex.title}</CardTitle>
              <div className="flex items-center gap-2 shrink-0">
                {completed.has(ex.id) && (
                  <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs">Completed</Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {ex.points} pts
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-xs">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{ex.instructions}</ReactMarkdown>
            </div>
            <TerminalSimulator
              exercise={ex}
              onSuccess={(pts) => handleSuccess(ex.id, pts)}
              alreadyCompleted={completed.has(ex.id)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
