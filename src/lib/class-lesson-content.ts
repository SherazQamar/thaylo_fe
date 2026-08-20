export type ClassPhase = "teach" | "practice" | "quick_check";

export type CheckKind = "formative" | "summative";

export type PromptingLevel =
  | "none"
  | "general_redirection"
  | "restated_directions"
  | "vocabulary_clarification"
  | "structured_prompting"
  | "choice_elimination"
  | "answer_revealing_support";

export type InteractionType =
  | "single_choice"
  | "word_pick"
  | "word_ladder"
  | "sort"
  | "diagnose"
  | "repair"
  | "short_response";

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
  type: InteractionType;
  options: BlackboardOption[];
  /** Correct weak → strong order for word_ladder interactions */
  correctOrder?: string[];
  /** Scripted praise from curricular addendum / personalized runtime */
  correctFeedback?: string;
  /** Scripted misconception repair from curricular addendum / personalized runtime */
  incorrectFeedback?: string;
  stimulus?: string;
  acceptedPhrases?: string[];
  orderDirection?: string;
  explanationPrompt?: string;
  explanationAcceptedPhrases?: string[];
};

export function isOrderedInteraction(type: InteractionType | undefined): boolean {
  return type === "word_ladder" || type === "sort" || type === "repair";
}

export function isChoiceInteraction(type: InteractionType | undefined): boolean {
  return type === "single_choice" || type === "word_pick" || type === "diagnose";
}

export const PROMPTING_RANK: Record<PromptingLevel, number> = {
  none: 0,
  general_redirection: 1,
  restated_directions: 2,
  vocabulary_clarification: 3,
  structured_prompting: 4,
  choice_elimination: 5,
  answer_revealing_support: 6,
};

export function maxPromptingLevel(
  current: PromptingLevel,
  next: PromptingLevel,
): PromptingLevel {
  return PROMPTING_RANK[next] > PROMPTING_RANK[current] ? next : current;
}

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
