"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const supported = typeof window !== "undefined" && getSpeechRecognitionCtor() != null;

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  const start = useCallback((options?: { continuous?: boolean }) => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    recognitionRef.current?.abort();

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = options?.continuous === true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setListening(true);
      setInterimTranscript("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalText += text;
        } else {
          interim += text;
        }
      }

      if (interim) {
        setInterimTranscript(interim.trim());
      }
      if (finalText.trim()) {
        setTranscript((prev) => `${prev} ${finalText}`.trim());
        setInterimTranscript("");
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const toggle = useCallback(() => {
    if (listening) {
      stop();
      return;
    }
    start();
  }, [listening, start, stop]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const displayTranscript = [transcript, interimTranscript]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    supported,
    listening,
    transcript,
    interimTranscript,
    displayTranscript,
    start,
    stop,
    toggle,
    reset,
    setTranscript,
  };
}
