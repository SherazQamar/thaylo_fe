export type ClassChatRole = "calyx" | "child" | "system";

export type ClassChatMessage = {
  id: string;
  role: ClassChatRole;
  text: string;
  time: string;
};

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function createMessage(
  role: ClassChatRole,
  text: string,
): ClassChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    text,
    time: formatTime(),
  };
}

/** UI-phase instructor replies until classroom WebSocket runtime is connected. */
export function generateCalyxReply(
  userMessage: string,
  context?: { lessonTitle?: string; stepTitle?: string; instructorName?: string },
): string {
  const instructorName = context?.instructorName?.trim() || "AI Instructor";
  const msg = userMessage.toLowerCase().trim();

  if (!msg) {
    return "Type a question and I'll help you during class.";
  }

  if (/hello|hi|hey|start/.test(msg)) {
    return `Hi! I'm ${instructorName}. Today we're working on ${context?.lessonTitle ?? "your lesson"}. Ask me anything about intensity scaling or the examples on the board.`;
  }

  if (/intensity|volume knob|gradient|stronger|weaker/.test(msg)) {
    return "Intensity is how strong a word feels. Start with the base meaning, look for energy clues in the sentence, then pick the word that matches that level — like turning a volume knob up or down.";
  }

  if (/example|temperature|fear|happy|glad|thrilled|ecstatic|boiling|scared/.test(msg)) {
    return "Great question! On the board you can see word ladders — each set moves from weaker to stronger. Try naming which word is the strongest in the set we're practicing.";
  }

  if (/word ladder|order|weakest|strongest|scrambl/.test(msg)) {
    return "For the Word Ladder, drag or list words from weakest to strongest. For feelings: Glad → Happy → Thrilled → Ecstatic. Want a hint? Compare how big each feeling feels.";
  }

  if (/help|confused|don't understand|do not understand/.test(msg)) {
    return "No problem — let's slow down. Look at the blackboard: find the base word first, then ask yourself which option feels like a little more energy and which feels like the most.";
  }

  if (/next|continue|move on/.test(msg)) {
    return "We'll move to the next part when you're ready. Finish the quick check first, or ask me to explain the current example again.";
  }

  return `Good question about "${userMessage.trim()}". ${context?.stepTitle ? `We're on "${context.stepTitle}" right now.` : ""} Check the blackboard for the main idea, or ask me about intensity, examples, or the word ladder.`;
}

export function getWelcomeMessage(lessonTitle: string, instructorName = "AI Instructor"): string {
  return `Welcome to ${lessonTitle}! I'm ${instructorName}. Hold the mic button anytime to ask a question about today's lesson.`;
}

export function buildClassGreeting(
  studentName: string,
  lessonTitle: string,
  instructorName = "AI Instructor",
): string {
  const name = studentName.trim() || "there";
  return `Hello ${name}! I'm ${instructorName}, your tutor. Welcome to today's class on ${lessonTitle}. Let's get started.`;
}

export function buildRetakeClassGreeting(
  studentName: string,
  lessonTitle: string,
  calyxIntro?: string | null,
): string {
  if (calyxIntro?.trim()) {
    return calyxIntro.trim();
  }

  const name = studentName.trim() || "there";
  return `Welcome back, ${name}! Let's try ${lessonTitle} again with some fresh examples. You've got this.`;
}
