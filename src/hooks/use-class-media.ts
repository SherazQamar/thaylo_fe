"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  queryMediaPermissionHint,
  requestClassMedia,
  requestClassMicrophone,
  type ClassMediaError,
} from "@/lib/class-media-request";

export function useClassMedia(autoStart = false) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  /** Mic starts off — push-to-talk enables it only while asking. */
  const [micEnabled, setMicEnabled] = useState(false);
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
    setMicEnabled(false);
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
      setHasAudio(false);
      setMicEnabled(false);
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
          message: "Could not access camera.",
          guidance: "Check browser camera permissions and try again.",
        });
      }
      return null;
    } finally {
      setIsRequesting(false);
    }
  }, [stopStream]);

  const setMicTracksEnabled = useCallback((enabled: boolean) => {
    const tracks = streamRef.current?.getAudioTracks() ?? [];
    tracks.forEach((track) => {
      track.enabled = enabled;
    });
    setMicEnabled(enabled && tracks.length > 0);
  }, []);

  /** Ensure an audio track exists (requested on first push-to-talk). */
  const ensureMicrophone = useCallback(async (): Promise<boolean> => {
    const existing = streamRef.current?.getAudioTracks() ?? [];
    if (existing.some((track) => track.readyState === "live")) {
      setHasAudio(true);
      return true;
    }

    try {
      const audioStream = await requestClassMicrophone();
      const audioTrack = audioStream.getAudioTracks()[0];
      if (!audioTrack) return false;

      if (streamRef.current) {
        streamRef.current.addTrack(audioTrack);
        setStream(streamRef.current);
      } else {
        streamRef.current = audioStream;
        setStream(audioStream);
      }
      setHasAudio(true);
      return true;
    } catch (error) {
      const mediaError = error as ClassMediaError;
      if (mediaError?.message && mediaError?.guidance) {
        setPermissionError(mediaError);
      }
      return false;
    }
  }, []);

  const beginPushToTalk = useCallback(async (): Promise<boolean> => {
    const ok = await ensureMicrophone();
    if (!ok) return false;
    setMicTracksEnabled(true);
    return true;
  }, [ensureMicrophone, setMicTracksEnabled]);

  const endPushToTalk = useCallback(() => {
    setMicTracksEnabled(false);
  }, [setMicTracksEnabled]);

  const toggleCamera = useCallback((options?: { lockWhenOn?: boolean }) => {
    const tracks = streamRef.current?.getVideoTracks() ?? [];
    if (tracks.length === 0) return;
    const next = !cameraEnabled;
    if (options?.lockWhenOn && cameraEnabled && !next) return;
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
    stream.getVideoTracks().some((t) => t.readyState === "live" && t.enabled);

  const canJoinClass = hasActiveMedia && hasVideo;

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
    beginPushToTalk,
    endPushToTalk,
    toggleCamera,
  };
}
