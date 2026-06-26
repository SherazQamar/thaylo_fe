import { io, type Socket } from "socket.io-client";

const AI_BASE_URL =
  process.env.NEXT_PUBLIC_AI_URL ?? "http://localhost:3002";

export type OnboardingTurnPhase =
  | "greeting"
  | "question"
  | "acknowledgment"
  | "complete";

export interface OnboardingTurnQuestion {
  key: string;
  order: number;
  prompt: string;
  type: string;
  options?: string[];
  subItems?: string[];
  requiresResponse?: boolean;
}

export interface OnboardingTurn {
  phase: OnboardingTurnPhase;
  sessionId: number;
  walkthroughTitle: string;
  speechText: string;
  displayText: string;
  question?: OnboardingTurnQuestion;
  progress: { current: number; total: number };
  awaitAnswer: boolean;
  isSessionComplete: boolean;
  onboardingComplete: boolean;
}

export function createOnboardingSocket(token: string): Socket {
  return io(`${AI_BASE_URL}/onboarding`, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
  });
}
