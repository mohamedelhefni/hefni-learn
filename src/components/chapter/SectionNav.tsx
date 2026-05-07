"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConceptSection } from "@/components/concepts/ConceptSection";
import { CommandPracticeSection } from "@/components/command-practice/CommandPractice";
import { ScenarioList } from "@/components/scenarios/ScenarioChallenge";
import { QuizSection } from "@/components/quiz/QuizSection";
import type { ChapterData } from "@/lib/types";

interface SectionNavProps {
  data: ChapterData;
  completedExercises: string[];
  completedScenarios: string[];
  quizCompleted: boolean;
  quizScore?: number;
  onExerciseCompleted: (id: string, points: number) => void;
  onScenarioCompleted: (id: string, points: number) => void;
  onQuizCompleted: (points: number, score: number) => void;
}

export function SectionNav({
  data,
  completedExercises,
  completedScenarios,
  quizCompleted,
  quizScore,
  onExerciseCompleted,
  onScenarioCompleted,
  onQuizCompleted,
}: SectionNavProps) {
  const tabs = [
    { id: "concepts", label: "Concepts", always: true },
    { id: "practice", label: "Practice", always: false, show: !!data.command_practice?.length },
    // { id: "scenarios", label: "Scenarios", always: false, show: !!data.scenarios?.length },
    { id: "quiz", label: "Quiz", always: false, show: !!data.quiz },
  ].filter((t) => t.always || t.show);

  return (
    <Tabs defaultValue="concepts" className="flex-1">
      <TabsList className="mx-6 mt-4">
        {tabs.map((t) => (
          <TabsTrigger key={t.id} value={t.id}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="concepts" className="px-6 py-4">
        <ConceptSection concepts={data.concepts} />
      </TabsContent>

      {data.command_practice && data.command_practice.length > 0 && (
        <TabsContent value="practice" className="px-6 py-4">
          <CommandPracticeSection
            exercises={data.command_practice}
            completedExercises={completedExercises}
            onExerciseCompleted={onExerciseCompleted}
          />
        </TabsContent>
      )}

      {data.scenarios && data.scenarios.length > 0 && (
        <TabsContent value="scenarios" className="px-6 py-4">
          <ScenarioList
            scenarios={data.scenarios}
            completedScenarios={completedScenarios}
            onScenarioCompleted={onScenarioCompleted}
          />
        </TabsContent>
      )}

      {data.quiz && (
        <TabsContent value="quiz" className="px-6 py-4">
          <QuizSection
            quiz={data.quiz}
            alreadyCompleted={quizCompleted}
            savedScore={quizScore}
            onQuizCompleted={onQuizCompleted}
          />
        </TabsContent>
      )}
    </Tabs>
  );
}
