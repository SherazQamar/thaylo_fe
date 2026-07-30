import { needsOnboardingBeforeClass } from "@/lib/onboarding-api";
import { fetchBloomBuddyStatus } from "@/lib/bloom-buddy-api";
import { fetchChildPretest } from "@/lib/badge-api";
import { startChildClass } from "@/lib/curriculum-api";
import { getStartClassErrorMessage, NO_CLASS_AVAILABLE_MESSAGE } from "@/lib/child-class-messages";

type RouterLike = {
  push: (href: string) => void;
  replace?: (href: string) => void;
};

type NavigateOptions = {
  skipBloomBuddy?: boolean;
  skipPretest?: boolean;
  /** When true, wait for gate APIs before navigating (legacy). Default: instant launch page. */
  waitForGates?: boolean;
};

/**
 * Start class from Pathway.
 * Default: navigate instantly to /launch (child leaves Pathway immediately).
 * Gate checks (onboarding / Bloom Buddy / pre-test / start) run on the launch page.
 */
export async function navigateToChildClass(
  router: RouterLike,
  hasAssignedClass = true,
  options: NavigateOptions = {},
) {
  if (!hasAssignedClass) {
    throw new Error(NO_CLASS_AVAILABLE_MESSAGE);
  }

  if (!options.waitForGates) {
    router.push("/child-dashboard/launch");
    return;
  }

  try {
    const needsAssessment = await needsOnboardingBeforeClass();
    if (needsAssessment) {
      router.push("/child-onboarding?returnTo=lesson");
      return;
    }
  } catch {
    // If status check fails, allow continuing to class.
  }

  if (!options.skipBloomBuddy) {
    try {
      const bloomStatus = await fetchBloomBuddyStatus("BEFORE_LESSON");
      if (bloomStatus.needsCheckIn) {
        router.push("/child-dashboard/check-in");
        return;
      }
    } catch {
      // If Bloom Buddy is unavailable, do not block the lesson.
    }
  }

  if (!options.skipPretest) {
    try {
      const pretest = await fetchChildPretest();
      if (pretest.available && pretest.questions.length > 0) {
        router.push("/child-dashboard/pre-test");
        return;
      }
    } catch {
      // If pre-test is unavailable, continue into the lesson.
    }
  }

  try {
    const session = await startChildClass();
    router.push(`/child-dashboard/lesson?sessionId=${session.sessionId}`);
  } catch (error) {
    throw new Error(getStartClassErrorMessage(error));
  }
}

/** After class ends, offer an optional post-lesson mood check-in. */
export async function navigateAfterChildClass(router: RouterLike) {
  try {
    const bloomStatus = await fetchBloomBuddyStatus("AFTER_LESSON");
    if (bloomStatus.needsCheckIn) {
      router.push("/child-dashboard/check-in?timing=AFTER_LESSON");
      return;
    }
  } catch {
    // If Bloom Buddy is unavailable, return to dashboard.
  }

  router.push("/child-dashboard");
}
