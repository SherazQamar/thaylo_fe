export type ClassPhase = "teach" | "practice" | "quick_check";

export type BlackboardOption = {
  id: string;
  label: string;
  correct?: boolean;
};

export type BlackboardInteraction = {
  id: string;
  prompt: string;
  type: "single_choice" | "word_pick";
  options: BlackboardOption[];
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

/** Demo blackboard content for Lesson 1 — Intensity Scaling (until runtime loads scriptJson). */
export const LESSON_1_BLACKBOARD: BlackboardStep[] = [
  {
    id: "intro",
    phase: "teach",
    title: "Intensity Scaling",
    lines: [
      "Student goal:",
      "Pick the exact word that shows how strong a feeling is.",
    ],
    bulletPoints: [
      "Words are not just different — they can be stronger or weaker.",
      "Think of a volume knob for language.",
    ],
  },
  {
    id: "concept",
    phase: "teach",
    title: "The Volume Knob",
    lines: ["Concept: Intensity Gradient"],
    bulletPoints: [
      "Find the base meaning",
      "Look for clues about energy in the sentence",
      "Choose the word that matches that energy level",
      "Terms: Intensity · Gradient · Extremes · Moderate",
    ],
  },
  {
    id: "practice-1",
    phase: "practice",
    title: "Practice Examples",
    lines: ["Which word is strongest?"],
    bulletPoints: [
      "Temperature: Lukewarm → Warm → Hot → Boiling",
      "Fear: Uneasy → Scared → Terrified → Petrified",
    ],
    interaction: {
      id: "practice-happiness",
      prompt: "Tap the strongest happiness word:",
      type: "single_choice",
      options: [
        { id: "glad", label: "Glad" },
        { id: "happy", label: "Happy" },
        { id: "thrilled", label: "Thrilled" },
        { id: "ecstatic", label: "Ecstatic", correct: true },
      ],
    },
  },
  {
    id: "quick-check",
    phase: "quick_check",
    title: "Quick Check — Word Ladder",
    lines: ["Put synonyms in order from weakest to strongest:"],
    interaction: {
      id: "quick-check-ladder",
      prompt: "Tap the strongest word in the ladder:",
      type: "word_pick",
      options: [
        { id: "glad", label: "Glad" },
        { id: "happy", label: "Happy" },
        { id: "thrilled", label: "Thrilled" },
        { id: "ecstatic", label: "Ecstatic", correct: true },
      ],
    },
  },
];

export function getBlackboardSteps(lessonTitle?: string | null): BlackboardStep[] {
  const title = lessonTitle?.toLowerCase() ?? "";
  if (title.includes("intensity") || title.includes("lesson 1")) {
    return LESSON_1_BLACKBOARD;
  }
  return LESSON_1_BLACKBOARD;
}

export function phaseForStepIndex(stepIndex: number, steps: BlackboardStep[]): ClassPhase {
  return steps[stepIndex]?.phase ?? "teach";
}
