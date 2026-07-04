const MEDIAPIPE_CONSOLE_NOISE =
  /TensorFlow Lite|XNNPACK delegate|Created TensorFlow Lite|Graph successfully started|Replacing \d+ node/i;

let consoleFilterInstalled = false;

/** MediaPipe WASM logs benign INFO lines via console.error — hide them from Next.js dev overlay. */
export function installMediaPipeConsoleFilter() {
  if (consoleFilterInstalled || typeof window === "undefined") {
    return;
  }
  consoleFilterInstalled = true;

  const passthrough = (original: (...args: unknown[]) => void) => {
    return (...args: unknown[]) => {
      const message = args
        .map((arg) => {
          if (typeof arg === "string") return arg;
          if (arg instanceof Error) return arg.message;
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        })
        .join(" ");

      if (MEDIAPIPE_CONSOLE_NOISE.test(message)) {
        return;
      }

      original(...args);
    };
  };

  console.error = passthrough(console.error.bind(console));
  console.warn = passthrough(console.warn.bind(console));
}

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export type FaceLandmarkerInstance = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestampMs: number,
  ) => { faceLandmarks?: Array<Array<{ x: number; y: number; z?: number }>> };
  close: () => void;
};

let landmarkerPromise: Promise<FaceLandmarkerInstance> | null = null;
let consumerCount = 0;

function createLandmarkerPromise(): Promise<FaceLandmarkerInstance> {
  return (async () => {
    const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const vision = await FilesetResolver.forVisionTasks(WASM_BASE);

    async function createWithDelegate(delegate: "GPU" | "CPU") {
      return FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate },
        runningMode: "VIDEO",
        numFaces: 1,
      });
    }

    try {
      return (await createWithDelegate("GPU")) as FaceLandmarkerInstance;
    } catch {
      return (await createWithDelegate("CPU")) as FaceLandmarkerInstance;
    }
  })();
}

export async function acquireFaceLandmarker(): Promise<FaceLandmarkerInstance> {
  if (typeof window === "undefined") {
    throw new Error("Face landmarker is browser-only");
  }

  installMediaPipeConsoleFilter();
  consumerCount += 1;

  if (!landmarkerPromise) {
    landmarkerPromise = createLandmarkerPromise().catch((error) => {
      landmarkerPromise = null;
      consumerCount = Math.max(0, consumerCount - 1);
      throw error;
    });
  }

  return landmarkerPromise;
}

export function releaseFaceLandmarkerConsumer() {
  consumerCount = Math.max(0, consumerCount - 1);
  if (consumerCount === 0 && landmarkerPromise) {
    void landmarkerPromise.then((landmarker) => landmarker.close()).catch(() => undefined);
    landmarkerPromise = null;
  }
}
