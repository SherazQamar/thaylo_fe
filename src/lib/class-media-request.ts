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
            "Click the lock icon in your browser address bar and set Camera to Allow, then click Try again. Microphone is optional — you do not need to enable it to join.",
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

function mergeStreams(audioStream: MediaStream, videoStream: MediaStream): MediaStream {
  const tracks = [
    ...audioStream.getAudioTracks(),
    ...videoStream.getVideoTracks(),
  ];
  return new MediaStream(tracks);
}

async function requestOptionalMicrophone(
  videoStream: MediaStream,
): Promise<ClassMediaAccess> {
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    return {
      stream: mergeStreams(audioStream, videoStream),
      hasVideo: true,
      hasAudio: true,
    };
  } catch {
    return {
      stream: videoStream,
      hasVideo: true,
      hasAudio: false,
    };
  }
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
 * Request camera (required) and optionally microphone.
 * Must be called directly from a user click/tap.
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
  return requestOptionalMicrophone(videoStream);
}

export async function queryMediaPermissionHint(): Promise<string | null> {
  if (!navigator.permissions?.query) return null;

  try {
    const [camera, microphone] = await Promise.all([
      navigator.permissions.query({ name: "camera" as PermissionName }),
      navigator.permissions.query({ name: "microphone" as PermissionName }),
    ]);

    if (camera.state === "denied") {
      return "Camera is blocked for this site. Use the lock icon in the address bar → Allow camera, then try again.";
    }
    if (microphone.state === "denied") {
      return "Microphone is off — that's fine. You only need camera access to join class.";
    }
  } catch {
    // Permissions API not fully supported (e.g. Safari).
  }

  return null;
}
