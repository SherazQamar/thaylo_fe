"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  queryMediaPermissionHint,
  requestClassMedia,
  type ClassMediaError,
} from "@/lib/class-media-request";

export function useClassMedia(autoStart = false) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [permissionError, setPermissionError] = useState<ClassMediaError | null>(null);
  const [permissionHint, setPermissionHint] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    void queryMediaPermissionHint().then(setPermissionHint);
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    setHasVideo(false);
    setHasAudio(false);
  }, []);

  const startMedia = useCallback(async () => {
    setIsRequesting(true);
    setPermissionError(null);

    try {
      stopStream();

      const result = await requestClassMedia();
      streamRef.current = result.stream;
      setStream(result.stream);
      setHasVideo(result.hasVideo);
      setHasAudio(result.hasAudio);
      setMicEnabled(result.hasAudio);
      setCameraEnabled(result.hasVideo);
      setPermissionHint(null);
      return result.stream;
    } catch (error) {
      const mediaError = error as ClassMediaError;
      if (mediaError?.message && mediaError?.guidance) {
        setPermissionError(mediaError);
      } else {
        setPermissionError({
          code: "unknown",
          message: "Could not access camera or microphone.",
          guidance: "Check browser permissions and try again.",
        });
      }
      return null;
    } finally {
      setIsRequesting(false);
    }
  }, [stopStream]);

  const toggleMic = useCallback(() => {
    const tracks = streamRef.current?.getAudioTracks() ?? [];
    if (tracks.length === 0) return;
    const next = !micEnabled;
    tracks.forEach((track) => {
      track.enabled = next;
    });
    setMicEnabled(next);
  }, [micEnabled]);

  const toggleCamera = useCallback(() => {
    const tracks = streamRef.current?.getVideoTracks() ?? [];
    if (tracks.length === 0) return;
    const next = !cameraEnabled;
    tracks.forEach((track) => {
      track.enabled = next;
    });
    setCameraEnabled(next);
  }, [cameraEnabled]);

  useEffect(() => {
    if (!autoStart) return;
    void startMedia();
    return () => stopStream();
  }, [autoStart, startMedia, stopStream]);

  const hasActiveMedia =
    !!stream &&
    stream.getAudioTracks().some((t) => t.readyState === "live") &&
    stream.getVideoTracks().some((t) => t.readyState === "live");

  const canJoinClass =
    !!stream &&
    stream.getAudioTracks().some((t) => t.readyState === "live") &&
    (stream.getVideoTracks().some((t) => t.readyState === "live") || !hasVideo);

  return {
    stream,
    micEnabled,
    cameraEnabled,
    hasVideo,
    hasAudio,
    permissionError,
    permissionHint,
    isRequesting,
    hasActiveMedia,
    canJoinClass,
    startMedia,
    stopStream,
    toggleMic,
    toggleCamera,
  };
}
