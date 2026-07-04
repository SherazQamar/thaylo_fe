export type ClassPhase = "teach" | "practice" | "quick_check";

export type BlackboardOption = {
  id: string;
  label: string;
  correct?: boolean;
};

export type BlackboardInteraction = {
  id: string;
  prompt: string;
  type: "single_choice" | "word_pick" | "word_ladder";
  options: BlackboardOption[];
  /** Correct weak → strong order for word_ladder interactions */
  correctOrder?: string[];
};

export type BlackboardStep = {
  id: string;
  phase: ClassPhase;
  title: string;
  lines: string[];
  bulletPoints?: string[];
  interaction?: BlackboardInteraction;
};

export type ClassProgressStep = {
  id: ClassPhase;
  label: string;
};

export const CLASS_PROGRESS_STEPS: ClassProgressStep[] = [
  { id: "teach", label: "Lesson" },
  { id: "practice", label: "Practice" },
  { id: "quick_check", label: "Quick Check" },
];

export function phaseForStepIndex(stepIndex: number, steps: BlackboardStep[]): ClassPhase {
  return steps[stepIndex]?.phase ?? "teach";
}
