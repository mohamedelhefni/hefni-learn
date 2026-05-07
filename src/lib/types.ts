// Chapter metadata
export interface ChapterMeta {
  number: number;
  title: string;
  description?: string;
}

// Concept section
export interface Concept {
  title: string;
  content: string;
  key_points?: string[];
}

// Command practice validation
export interface Validation {
  type: "command_output" | "resource_exists" | "resource_state" | "resource_state_stable";
  command?: string;
  expected_contains?: string;
  expected_not_contains?: string;
  resource?: string;
  namespace?: string;
  state?: string;
  timeout?: number;
}

// Command practice exercise
export interface CommandPractice {
  id: string;
  title: string;
  instructions: string;
  command_hint: string;
  why_this_command?: string;
  common_mistakes?: string[];
  validation: Validation;
  points: number;
}

// Scenario challenge
export interface Scenario {
  id: string;
  title: string;
  description: string;
  manifest: string;
  hints: string[];
  solution_validation: Validation;
  points: number;
  hint_penalty?: number;
}

// Quiz question types
export interface MultipleChoiceQuestion {
  type: "multiple_choice";
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;
}

export interface CommandChallengeQuestion {
  type: "command_challenge";
  question: string;
  expected_contains: string;
  alternatives?: string[];
  hint?: string;
  explanation?: string;
  points: number;
}

export interface FillYamlQuestion {
  type: "fill_yaml";
  question: string;
  yaml_template: string;
  expected: string;
  explanation?: string;
  points: number;
}

export interface TrueFalseQuestion {
  type: "true_false";
  question: string;
  correct: boolean;
  explanation?: string;
  points: number;
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | CommandChallengeQuestion
  | FillYamlQuestion
  | TrueFalseQuestion;

// Quiz section
export interface Quiz {
  passing_score?: number;
  questions: QuizQuestion[];
}

// Full chapter data
export interface ChapterData {
  chapter: ChapterMeta;
  concepts: Concept[];
  command_practice?: CommandPractice[];
  scenarios?: Scenario[];
  quiz?: Quiz;
}

// Chapter list item for home page
export interface ChapterListItem {
  id: string;
  chapter: ChapterMeta;
  hasPractice: boolean;
  hasScenarios: boolean;
  hasQuiz: boolean;
  totalPoints: number;
}

// Simulator result
export interface SimResult {
  output: string;
  success: boolean;
  points?: number;
}
