export type ClassMediaAccess = {
  stream: MediaStream;
  hasVideo: boolean;
  hasAudio: boolean;
};

export type ClassMediaError = {
  code: string;
  message: string;
  guidance: string;
};

function isDomException(error: unknown): error is DOMException {
  return error instanceof DOMException;
}

function mapMediaError(error: unknown): ClassMediaError {
  if (isDomException(error)) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return {
          code: error.name,
          message: "Camera or microphone access was blocked.",
          guidance:
            "Click the lock or camera icon in your browser address bar, set Camera and Microphone to Allow, then click Try again. In Edge/Chrome: Site permissions → Allow.",
        };
      case "NotFoundError":
      case "DevicesNotFoundError":
        return {
          code: error.name,
          message: "No camera or microphone was found on this device.",
          guidance:
            "Connect a webcam and microphone, close other apps using the camera (Zoom, Teams), then try again.",
        };
      case "NotReadableError":
      case "TrackStartError":
        return {
          code: error.name,
          message: "Your camera or microphone is already in use.",
          guidance: "Close other video apps, then click Try again.",
        };
      case "SecurityError":
        return {
          code: error.name,
          message: "This page cannot access camera or microphone.",
          guidance: "Open Thaylo on https:// or http://localhost — not an insecure IP address.",
        };
      case "OverconstrainedError":
        return {
          code: error.name,
          message: "Your camera does not support the requested settings.",
          guidance: "Try again — we will use simpler camera settings.",
        };
      default:
        return {
          code: error.name,
          message: error.message || "Could not access camera or microphone.",
          guidance: "Check browser permissions and try again.",
        };
    }
  }

  return {
    code: "unknown",
    message: "Could not access camera or microphone.",
    guidance: "Check browser permissions and try again.",
  };
}

function mergeStreams(audioStream: MediaStream, videoStream: MediaStream): MediaStream {
  const tracks = [
    ...audioStream.getAudioTracks(),
    ...videoStream.getVideoTracks(),
  ];
  return new MediaStream(tracks);
}

/**
 * Request camera + microphone. Must be called directly from a user click/tap.
 * Tries full A/V first, then separate prompts, then audio-only fallback.
 */
export async function requestClassMedia(): Promise<ClassMediaAccess> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw {
      code: "unsupported",
      message: "Camera and microphone are not supported in this browser.",
      guidance: "Use Chrome, Edge, or Safari on desktop.",
    } satisfies ClassMediaError;
  }

  if (!window.isSecureContext) {
    throw {
      code: "insecure",
      message: "Camera and microphone require a secure connection.",
      guidance: "Use https:// or open the app on http://localhost.",
    } satisfies ClassMediaError;
  }

  const constraintAttempts: MediaStreamConstraints[] = [
    { audio: true, video: true },
    {
      audio: true,
      video: { width: { ideal: 640 }, height: { ideal: 480 } },
    },
  ];

  let lastError: unknown = null;

  for (const constraints of constraintAttempts) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return {
        stream,
        hasVideo: stream.getVideoTracks().length > 0,
        hasAudio: stream.getAudioTracks().length > 0,
      };
    } catch (error) {
      lastError = error;
      if (isDomException(error) && error.name === "NotAllowedError") {
        throw mapMediaError(error);
      }
    }
  }

  // Some browsers/devices fail combined request but succeed separately.
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      return {
        stream: mergeStreams(audioStream, videoStream),
        hasVideo: true,
        hasAudio: true,
      };
    } catch {
      return {
        stream: audioStream,
        hasVideo: false,
        hasAudio: true,
      };
    }
  } catch (error) {
    lastError = error;
  }

  throw mapMediaError(lastError);
}

export async function queryMediaPermissionHint(): Promise<string | null> {
  if (!navigator.permissions?.query) return null;

  try {
    const [camera, microphone] = await Promise.all([
      navigator.permissions.query({ name: "camera" as PermissionName }),
      navigator.permissions.query({ name: "microphone" as PermissionName }),
    ]);

    if (camera.state === "denied" || microphone.state === "denied") {
      return "Camera or microphone is blocked for this site. Use the lock icon in the address bar → Allow, then try again.";
    }
  } catch {
    // Permissions API not fully supported (e.g. Safari).
  }

  return null;
}
