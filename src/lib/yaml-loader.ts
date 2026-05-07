import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { ChapterData, ChapterListItem } from "./types";

const dataDir = path.join(process.cwd(), "src", "data");

/** List all available namespace directories under src/data/ */
export function listNamespaces(): string[] {
  if (!fs.existsSync(dataDir)) return [];
  return fs
    .readdirSync(dataDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/** Resolve the directory for a given namespace */
function namespaceDir(namespace: string): string {
  return path.join(dataDir, namespace);
}

/** Load a single chapter by namespace + numeric id prefix */
export function getChapter(namespace: string, id: string): ChapterData {
  const dir = namespaceDir(namespace);
  if (!fs.existsSync(dir)) {
    throw new Error(`Namespace not found: ${namespace}`);
  }
  const files = fs.readdirSync(dir);
  const file = files.find((f) => f.startsWith(id + "-") || f === `${id}.yaml`);
  if (!file) {
    throw new Error(`Chapter not found: ${id}`);
  }
  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  return yaml.load(raw) as ChapterData;
}

/** List all chapters for a namespace */
export function getAllChapters(namespace: string): ChapterListItem[] {
  const dir = namespaceDir(namespace);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .sort();

  return files.map((file) => {
    const id = file.replace(/\.(yaml|yml)$/, "").split("-")[0];
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const data = yaml.load(raw) as ChapterData;

    const practicePoints = (data.command_practice ?? []).reduce(
      (sum, ex) => sum + ex.points,
      0
    );
    // const scenarioPoints = (data.scenarios ?? []).reduce(
    //   (sum, s) => sum + s.points,
    //   0
    // );
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
      totalPoints: practicePoints   + quizPoints,
    } satisfies ChapterListItem;
  });
}
