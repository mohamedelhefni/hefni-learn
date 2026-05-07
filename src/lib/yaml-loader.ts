import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { ChapterData, ChapterListItem } from "./types";

const chaptersDir = path.join(process.cwd(), "src", "data", "chapters");

export function getChapter(id: string): ChapterData {
  const files = fs.readdirSync(chaptersDir);
  const file = files.find((f) => f.startsWith(id + "-") || f === `${id}.yaml`);
  if (!file) {
    throw new Error(`Chapter not found: ${id}`);
  }
  const raw = fs.readFileSync(path.join(chaptersDir, file), "utf-8");
  return yaml.load(raw) as ChapterData;
}

export function getAllChapters(): ChapterListItem[] {
  if (!fs.existsSync(chaptersDir)) return [];

  const files = fs
    .readdirSync(chaptersDir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .sort();

  return files.map((file) => {
    const id = file.replace(/\.(yaml|yml)$/, "").split("-")[0];
    const raw = fs.readFileSync(path.join(chaptersDir, file), "utf-8");
    const data = yaml.load(raw) as ChapterData;

    const practicePoints = (data.command_practice ?? []).reduce(
      (sum, ex) => sum + ex.points,
      0
    );
    const scenarioPoints = (data.scenarios ?? []).reduce(
      (sum, s) => sum + s.points,
      0
    );
    const quizPoints = (data.quiz?.questions ?? []).reduce(
      (sum, q) => sum + q.points,
      0
    );

    return {
      id,
      chapter: data.chapter,
      hasPractice: (data.command_practice?.length ?? 0) > 0,
      hasScenarios: (data.scenarios?.length ?? 0) > 0,
      hasQuiz: !!data.quiz,
      totalPoints: practicePoints + scenarioPoints + quizPoints,
    } satisfies ChapterListItem;
  });
}
