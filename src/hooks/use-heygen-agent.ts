"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AgentEventsEnum,
  LiveAvatarSession,
  SessionEvent,
  SessionState,
} from "@heygen/liveavatar-web-sdk";

import { delay, estimateSpeakDurationMs } from "@/lib/tts-word-sync";

export type HeygenAvatarConfig = {
  enabled?: boolean;
  provider?: "none" | "heygen";
  heygenAvatarId?: string;
  heygenVoiceId?: string;
};

export type HeygenAgentStatus =
  | "disabled"
  | "connecting"
  | "connected"
  | "error"
  | "disconnected";

function isHeygenConfigReady(config?: HeygenAvatarConfig | null) {
  return Boolean(
    config?.enabled &&
      config.provider === "heygen" &&
      config.heygenAvatarId?.trim(),
  );
}

/**
 * LiveAvatar (HeyGen successor) for live class lip-sync.
 * Classic Streaming Avatar API is sunset; tokens come from api.liveavatar.com.
 */
export function useHeygenAgent(
  config: HeygenAvatarConfig | null | undefined,
  getSessionToken: () => Promise<string>,
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const connectedRef = useRef(false);
  const speakChainRef = useRef<Promise<boolean>>(Promise.resolve(true));
  const speakResolverRef = useRef<(() => void) | null>(null);
  const speakStartedResolverRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<HeygenAgentStatus>("disabled");
  const [speaking, setSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const enabled = isHeygenConfigReady(config);
  const avatarId = config?.heygenAvatarId?.trim() ?? "";
  const voiceId = config?.heygenVoiceId?.trim() ?? "";

  const attachVideoElement = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && sessionRef.current) {
      sessionRef.current.attach(el);
      void el.play().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      connectedRef.current = false;
      setStatus("disabled");
      setSpeaking(false);
      setErrorMessage(null);
      return;
    }

    let cancelled = false;
    let keepAliveTimer: number | undefined;
    connectedRef.current = false;
    setStatus("connecting");
    setErrorMessage(null);

    async function connect() {
      try {
        const token = await getSessionToken();
        if (!token) throw new Error("LiveAvatar session token is empty");

        const session = new LiveAvatarSession(token, { voiceChat: false });
        sessionRef.current = session;

        session.on(SessionEvent.SESSION_STATE_CHANGED, (state) => {
          if (cancelled) return;
          if (state === SessionState.CONNECTED) {
            connectedRef.current = true;
            setStatus("connected");
          } else if (state === SessionState.CONNECTING) {
            connectedRef.current = false;
            setStatus("connecting");
          } else if (state === SessionState.DISCONNECTED) {
            connectedRef.current = false;
            setStatus("disconnected");
          }
        });

        session.on(SessionEvent.SESSION_STREAM_READY, () => {
          if (cancelled) return;
          connectedRef.current = true;
          setStatus("connected");
          if (videoRef.current) {
            session.attach(videoRef.current);
            void videoRef.current.play().catch(() => undefined);
          }
        });

        session.on(SessionEvent.SESSION_DISCONNECTED, () => {
          if (cancelled) return;
          connectedRef.current = false;
          setStatus("disconnected");
          setSpeaking(false);
        });

        session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
          if (cancelled) return;
          setSpeaking(true);
          const resolveStarted = speakStartedResolverRef.current;
          speakStartedResolverRef.current = null;
          resolveStarted?.();
        });

        session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
          if (cancelled) return;
          setSpeaking(false);
          const resolve = speakResolverRef.current;
          speakResolverRef.current = null;
          resolve?.();
        });

        await session.start();
        if (cancelled) {
          await session.stop().catch(() => undefined);
          return;
        }

        void avatarId;
        void voiceId;

        if (videoRef.current) {
          session.attach(videoRef.current);
          void videoRef.current.play().catch(() => undefined);
        }
        connectedRef.current = true;
        setStatus("connected");

        // Light keep-alive only — do not speak a warm-up line (adds lag / desync risk).
        void session.keepAlive().catch(() => undefined);

        keepAliveTimer = window.setInterval(() => {
          void session.keepAlive().catch(() => undefined);
        }, 60_000);
      } catch (error) {
        if (cancelled) return;
        connectedRef.current = false;
        setStatus("error");
        setSpeaking(false);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to connect LiveAvatar",
        );
      }
    }

    void connect();

    return () => {
      cancelled = true;
      if (keepAliveTimer) window.clearInterval(keepAliveTimer);
      connectedRef.current = false;
      setSpeaking(false);
      speakResolverRef.current = null;
      speakChainRef.current = Promise.resolve(true);
      const session = sessionRef.current;
      sessionRef.current = null;
      void session?.stop().catch(() => undefined);
    };
  }, [enabled, avatarId, voiceId, getSessionToken]);

  const speakOnce = useCallback(async (
    text: string,
    handlers?: { onStarted?: () => void },
  ): Promise<boolean> => {
    const input = text.trim();
    if (!input) {
      handlers?.onStarted?.();
      return true;
    }
    const session = sessionRef.current;
    if (!session || !connectedRef.current) return false;

    try {
      let startedFired = false;
      const fireStarted = () => {
        if (startedFired) return;
        startedFired = true;
        handlers?.onStarted?.();
      };

      const done = new Promise<void>((resolve) => {
        speakResolverRef.current = resolve;
      });
      speakStartedResolverRef.current = fireStarted;

      // Speak immediately — do not block waiting for SPEAK_STARTED (felt like a freeze).
      session.repeat(input);

      // Notify board sync when lips start; fall back quickly if event is late.
      const startFallback = window.setTimeout(fireStarted, 500);

      const timeoutMs = Math.max(estimateSpeakDurationMs(input, 380) * 3.5, 30_000);
      const timedOut = await Promise.race([
        done.then(() => false),
        delay(timeoutMs).then(() => true),
      ]);

      window.clearTimeout(startFallback);
      fireStarted();
      speakStartedResolverRef.current = null;
      speakResolverRef.current = null;
      setSpeaking(false);
      return !timedOut;
    } catch {
      speakStartedResolverRef.current = null;
      speakResolverRef.current = null;
      setSpeaking(false);
      return false;
    }
  }, []);

  const speak = useCallback(async (
    text: string,
    handlers?: { onStarted?: () => void },
  ) => {
    const task = speakChainRef.current.then(() => speakOnce(text, handlers));
    speakChainRef.current = task.catch(() => false);
    return task;
  }, [speakOnce]);

  const stop = useCallback(() => {
    speakChainRef.current = Promise.resolve(true);
    speakResolverRef.current = null;
    speakStartedResolverRef.current = null;
    setSpeaking(false);
    try {
      sessionRef.current?.interrupt();
    } catch {
      // ignore interrupt errors on hang-up
    }
  }, []);

  return {
    enabled,
    status,
    isReady: status === "connected",
    speaking,
    errorMessage,
    videoRef: attachVideoElement,
    speak,
    stop,
  };
}
