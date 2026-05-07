"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "kubepath-progress";

interface ChapterProgress {
  earnedPoints: number;
  completedExercises: string[];
  completedScenarios: string[];
  quizScore?: number;
  quizCompleted?: boolean;
}

interface ProgressStore {
  [chapterId: string]: ChapterProgress;
}

function loadStore(): ProgressStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressStore) : {};
  } catch {
    return {};
  }
}

function saveStore(store: ProgressStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage full or blocked
  }
}

export function useProgress(chapterId: string) {
  const [store, setStore] = useState<ProgressStore>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStore(loadStore());
    setHydrated(true);
  }, []);

  const chapter = store[chapterId] ?? {
    earnedPoints: 0,
    completedExercises: [],
    completedScenarios: [],
  };

  const blank = useCallback(
    (): ChapterProgress => ({
      earnedPoints: 0,
      completedExercises: [],
      completedScenarios: [],
    }),
    []
  );

  /** Mark an exercise complete and award points — idempotent. */
  const completeExercise = useCallback(
    (exerciseId: string, points: number) => {
      setStore((prev) => {
        const current = prev[chapterId] ?? blank();
        if (current.completedExercises.includes(exerciseId)) return prev;
        const next = {
          ...prev,
          [chapterId]: {
            ...current,
            earnedPoints: current.earnedPoints + points,
            completedExercises: [...current.completedExercises, exerciseId],
          },
        };
        saveStore(next);
        return next;
      });
    },
    [chapterId, blank]
  );

  /** Mark a scenario complete and award points — idempotent. */
  const completeScenario = useCallback(
    (scenarioId: string, points: number) => {
      setStore((prev) => {
        const current = prev[chapterId] ?? blank();
        if (current.completedScenarios.includes(scenarioId)) return prev;
        const next = {
          ...prev,
          [chapterId]: {
            ...current,
            earnedPoints: current.earnedPoints + points,
            completedScenarios: [...current.completedScenarios, scenarioId],
          },
        };
        saveStore(next);
        return next;
      });
    },
    [chapterId, blank]
  );

  /** Record quiz result and award points — only awards once. */
  const completeQuiz = useCallback(
    (points: number, score: number) => {
      setStore((prev) => {
        const current = prev[chapterId] ?? blank();
        const next = {
          ...prev,
          [chapterId]: {
            ...current,
            // Only add points if quiz wasn't previously completed
            earnedPoints: current.quizCompleted
              ? current.earnedPoints
              : current.earnedPoints + points,
            quizScore: score,
            quizCompleted: true,
          },
        };
        saveStore(next);
        return next;
      });
    },
    [chapterId, blank]
  );

  return {
    hydrated,
    earnedPoints: chapter.earnedPoints,
    completedExercises: chapter.completedExercises,
    completedScenarios: chapter.completedScenarios,
    quizScore: chapter.quizScore,
    quizCompleted: chapter.quizCompleted ?? false,
    completeExercise,
    completeScenario,
    completeQuiz,
  };
}

export function useAllProgress() {
  const [store, setStore] = useState<ProgressStore>({});
  useEffect(() => {
    setStore(loadStore());
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setStore({});
  }, []);

  const entries = Object.values(store);
  const stats = {
    totalPoints: entries.reduce((s, c) => s + c.earnedPoints, 0),
    chaptersStarted: entries.filter((c) => c.earnedPoints > 0 || c.completedExercises.length > 0).length,
    exercisesCompleted: entries.reduce((s, c) => s + c.completedExercises.length, 0),
    scenariosCompleted: entries.reduce((s, c) => s + c.completedScenarios.length, 0),
    quizzesCompleted: entries.filter((c) => c.quizCompleted).length,
  };

  return { store, stats, resetAll };
}
