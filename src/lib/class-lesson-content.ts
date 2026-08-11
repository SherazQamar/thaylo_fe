export type ClassPhase = "teach" | "practice" | "quick_check";

export type CheckKind = "formative" | "summative";

export type BlackboardOption = {
  id: string;
  label: string;
  correct?: boolean;
  /** Scaffold clue shown during assessment — not the answer */
  hint?: string;
};

export type BlackboardInteraction = {
  id: string;
  prompt: string;
  type: "single_choice" | "word_pick" | "word_ladder";
  options: BlackboardOption[];
  /** Correct weak → strong order for word_ladder interactions */
  correctOrder?: string[];
  /** Scripted praise from curricular addendum / personalized runtime */
  correctFeedback?: string;
  /** Scripted misconception repair from curricular addendum / personalized runtime */
  incorrectFeedback?: string;
};

export type BlackboardStep = {
  id: string;
  phase: ClassPhase;
  title: string;
  lines: string[];
  bulletPoints?: string[];
  interaction?: BlackboardInteraction;
  /** Full AI-generated teaching script — spoken as paragraphs when present. */
  narrationScript?: string;
  /** Formative = reteach path; summative = mastery gate (Blueprint T4). */
  checkKind?: CheckKind;
  /** Demo rubric dimensions this check targets (Blueprint M3). */
  rubricDimensionIds?: string[];
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
