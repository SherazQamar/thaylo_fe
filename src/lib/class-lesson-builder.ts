import type {
  BlackboardInteraction,
  BlackboardStep,
  ClassPhase,
} from "@/lib/class-lesson-content";
import type { ChildClassLessonScript } from "@/lib/curriculum-api";
import {
  buildBlackboardStepsFromRuntimePlan,
  isLessonRuntimePlan,
  tagBlackboardCheckKinds,
} from "@/lib/class-runtime-plan";
import { shuffleArray } from "@/lib/shuffle";

export type ParsedPracticeExample = {
  category: string;
  words: string[];
  strongestWord: string;
  displayLadder: string;
};

const DEFAULT_PRACTICE_EXAMPLES = [
  "Temperature: Lukewarm Warm Hot Boiling.",
  "Fear: Uneasy Scared Terrified Petrified.",
  "Speed: Walking Jogging Running Sprinting.",
  "Happiness: Glad Happy Thrilled Ecstatic.",
  "Size: Large Huge Enormous Gargantuan.",
  "Dislike: Dislike Hate Loathe Detest.",
  "Volume: Quiet Silent Muted Hushed.",
  "Brightness: Shiny Bright Brilliant Dazzling.",
];

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parsePracticeExample(raw: string): ParsedPracticeExample | null {
  const trimmed = raw.trim().replace(/\.$/, "");
  const colonIndex = trimmed.indexOf(":");
  if (colonIndex === -1) return null;

  const category = trimmed.slice(0, colonIndex).trim();
  const words = trimmed
    .slice(colonIndex + 1)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!category || words.length < 2) return null;

  const strongestWord = words[words.length - 1];

  return {
    category,
    words,
    strongestWord,
    displayLadder: `${category}: ${words.join(" → ")}`,
  };
}

function buildPracticeInteraction(
  parsed: ParsedPracticeExample,
  index: number,
): BlackboardInteraction {
  return {
    id: `practice-${slug(parsed.category)}-${index}`,
    prompt: `Tap the strongest ${parsed.category.toLowerCase()} word:`,
    type: "single_choice",
    options: shuffleArray(
      parsed.words.map((word) => ({
        id: slug(word),
        label: word,
        correct: word === parsed.strongestWord,
      })),
    ),
  };
}

function buildPracticeSteps(examples: string[]): BlackboardStep[] {
  const parsedExamples = examples
    .map((example) => parsePracticeExample(example))
    .filter((example): example is ParsedPracticeExample => example != null);

  return parsedExamples.map((parsed, index) => ({
    id: `practice-${index + 1}`,
    phase: "practice" as ClassPhase,
    title: "Practice Examples",
    lines: index === 0 ? ["Which word is strongest?"] : [],
    bulletPoints: [parsed.displayLadder],
    interaction: buildPracticeInteraction(parsed, index),
  }));
}

function buildWordLadderInteraction(parsed: ParsedPracticeExample): BlackboardInteraction {
  return {
    id: `word-ladder-${slug(parsed.category)}`,
    prompt: "Drag the words into order from weakest to strongest:",
    type: "word_ladder",
    options: parsed.words.map((word) => ({
      id: slug(word),
      label: word,
    })),
    correctOrder: parsed.words.map((word) => slug(word)),
  };
}

function buildQuickCheckStep(
  assessments?: ChildClassLessonScript["assessments"],
  fallbackExample?: ParsedPracticeExample,
  masteryMarker?: string,
): BlackboardStep {
  const parsed =
    fallbackExample ??
    parsePracticeExample("Happiness: Glad Happy Thrilled Ecstatic.");

  const ladderPrompt =
    masteryMarker?.trim() ||
    "Drag the words into order from weakest to strongest:";

  if (parsed) {
    return {
      id: "quick-check",
      phase: "quick_check",
      title: "Quick Check — Word Ladder",
      lines: ["Word Ladder — order from weakest to strongest:"],
      interaction: {
        ...buildWordLadderInteraction(parsed),
        prompt: ladderPrompt.includes("drag")
          ? "Drag the words into order from weakest to strongest:"
          : ladderPrompt,
      },
    };
  }

  const mcq = assessments?.find(
    (item) =>
      item.type === "MCQ" &&
      Array.isArray(item.options) &&
      item.options.length >= 2,
  );

  if (mcq?.options?.length) {
    // Legacy assessments list the correct answer last; mark it, then shuffle display order.
    const correctOption = mcq.options[mcq.options.length - 1] ?? mcq.options[0];
    return {
      id: "quick-check",
      phase: "quick_check",
      title: "Quick Check",
      lines: [mcq.prompt],
      interaction: {
        id: mcq.key || "quick-check",
        prompt: mcq.prompt,
        type: "word_pick",
        options: shuffleArray(
          mcq.options.map((label) => ({
            id: slug(label),
            label,
            correct: label === correctOption,
          })),
        ),
      },
    };
  }

  return {
    id: "quick-check",
    phase: "quick_check",
    title: "Quick Check",
    lines: ["Tap the strongest word:"],
    interaction: {
      id: "quick-check-fallback",
      prompt: "Tap the strongest word:",
      type: "word_pick",
      options: [],
    },
  };
}

function buildIntroStep(studentLanguage?: string): BlackboardStep {
  const defaultLines = [
    "Student goal:",
    "Pick the exact word that shows how strong a feeling is.",
  ];
  const defaultBullets = [
    "Words are not just different — they can be stronger or weaker.",
    "Think of a volume knob for language.",
  ];

  if (studentLanguage?.trim()) {
    const parts = studentLanguage
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (parts.length > 0) {
      return {
        id: "intro",
        phase: "teach",
        title: "Intensity Scaling",
        lines: [parts[0]],
        bulletPoints: parts.slice(1),
      };
    }
  }

  return {
    id: "intro",
    phase: "teach",
    title: "Intensity Scaling",
    lines: defaultLines,
    bulletPoints: defaultBullets,
  };
}

function buildConceptStep(core?: ChildClassLessonScript["instructionalCore"]): BlackboardStep {
  const lines: string[] = [];
  const bulletPoints: string[] = [];

  if (core?.concept?.trim()) {
    lines.push(`Concept: ${core.concept.trim()}`);
  } else {
    lines.push("Concept: Intensity Gradient");
  }

  if (core?.howTo?.length) {
    bulletPoints.push(...core.howTo);
  } else {
    bulletPoints.push(
      "Find the base meaning",
      "Look for clues about energy in the sentence",
      "Choose the word that matches that energy level",
    );
  }

  if (core?.terms?.length) {
    bulletPoints.push(`Terms: ${core.terms.join(" · ")}`);
  } else {
    bulletPoints.push("Terms: Intensity · Gradient · Extremes · Moderate");
  }

  return {
    id: "concept",
    phase: "teach",
    title: "The Volume Knob",
    lines,
    bulletPoints,
  };
}

export function buildBlackboardStepsFromLessonScript(
  lessonScript?: ChildClassLessonScript | null,
  lessonTitle?: string | null,
): BlackboardStep[] {
  const practiceExamples =
    lessonScript?.instructionalCore?.practiceExamples?.filter(Boolean) ??
    DEFAULT_PRACTICE_EXAMPLES;

  const steps: BlackboardStep[] = [
    buildIntroStep(lessonScript?.studentLanguage),
    buildConceptStep(lessonScript?.instructionalCore),
    ...buildPracticeSteps(practiceExamples),
    buildQuickCheckStep(
      lessonScript?.assessments,
      parsePracticeExample(
        practiceExamples[3] ?? practiceExamples[practiceExamples.length - 1] ?? "",
      ) ?? undefined,
      lessonScript?.instructionalCore?.masteryMarker,
    ),
  ];

  if (lessonTitle?.trim()) {
    steps[0] = { ...steps[0], title: lessonTitle.trim() };
  }

  return tagBlackboardCheckKinds(steps);
}

export function buildBlackboardSteps(input?: {
  lessonTitle?: string | null;
  lessonScript?: ChildClassLessonScript | null;
} | null): BlackboardStep[] {
  const runtimePlan = input?.lessonScript?.runtimePlan;
  if (isLessonRuntimePlan(runtimePlan)) {
    const steps = buildBlackboardStepsFromRuntimePlan(runtimePlan);
    if (input?.lessonTitle?.trim() && steps[0]) {
      steps[0] = { ...steps[0], title: input.lessonTitle.trim() };
    }
    return steps;
  }

  return buildBlackboardStepsFromLessonScript(
    input?.lessonScript,
    input?.lessonTitle,
  );
}
