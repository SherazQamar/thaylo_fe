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

function mapCameraError(error: unknown): ClassMediaError {
  if (isDomException(error)) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return {
          code: error.name,
          message: "Camera access was blocked.",
          guidance:
            "Click the lock icon in your browser address bar and set Camera to Allow, then click Try again. You only need the camera to join — the microphone is used later for push-to-talk questions.",
        };
      case "NotFoundError":
      case "DevicesNotFoundError":
        return {
          code: error.name,
          message: "No camera was found on this device.",
          guidance:
            "Connect a webcam, close other apps using the camera (Zoom, Teams), then try again.",
        };
      case "NotReadableError":
      case "TrackStartError":
        return {
          code: error.name,
          message: "Your camera is already in use.",
          guidance: "Close other video apps, then click Try again.",
        };
      case "SecurityError":
        return {
          code: error.name,
          message: "This page cannot access your camera.",
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
          message: error.message || "Could not access camera.",
          guidance: "Check browser camera permissions and try again.",
        };
    }
  }

  return {
    code: "unknown",
    message: "Could not access camera.",
    guidance: "Check browser camera permissions and try again.",
  };
}

async function requestCameraStream(): Promise<MediaStream> {
  const videoOnlyConstraints: MediaStreamConstraints[] = [
    { audio: false, video: true },
    {
      audio: false,
      video: { width: { ideal: 640 }, height: { ideal: 480 } },
    },
  ];

  let lastError: unknown = null;

  for (const constraints of videoOnlyConstraints) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (stream.getVideoTracks().length > 0) {
        return stream;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw mapCameraError(lastError);
}

/**
 * Request camera only for class join.
 * Microphone is requested later for push-to-talk questions.
 */
export async function requestClassMedia(): Promise<ClassMediaAccess> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw {
      code: "unsupported",
      message: "Camera is not supported in this browser.",
      guidance: "Use Chrome, Edge, or Safari on desktop.",
    } satisfies ClassMediaError;
  }

  if (!window.isSecureContext) {
    throw {
      code: "insecure",
      message: "Camera access requires a secure connection.",
      guidance: "Use https:// or open the app on http://localhost.",
    } satisfies ClassMediaError;
  }

  const videoStream = await requestCameraStream();
  return {
    stream: videoStream,
    hasVideo: true,
    hasAudio: false,
  };
}

/** Request mic on demand for push-to-talk (after class has started). */
export async function requestClassMicrophone(): Promise<MediaStream> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw {
      code: "unsupported",
      message: "Microphone is not supported in this browser.",
      guidance: "Use Chrome, Edge, or Safari.",
    } satisfies ClassMediaError;
  }

  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
  } catch (error) {
    if (isDomException(error)) {
      throw {
        code: error.name,
        message: "Microphone access was blocked.",
        guidance:
          "Allow microphone in the browser address bar, then hold the mic button to ask a question.",
      } satisfies ClassMediaError;
    }
    throw {
      code: "unknown",
      message: "Could not access microphone.",
      guidance: "Check browser microphone permissions and try again.",
    } satisfies ClassMediaError;
  }
}

export async function queryMediaPermissionHint(): Promise<string | null> {
  if (!navigator.permissions?.query) return null;

  try {
    const camera = await navigator.permissions.query({
      name: "camera" as PermissionName,
    });

    if (camera.state === "denied") {
      return "Camera is blocked for this site. Use the lock icon in the address bar → Allow camera, then try again.";
    }
  } catch {
    // Permissions API not fully supported (e.g. Safari).
  }

  return null;
}
