import { needsOnboardingBeforeClass } from "@/lib/onboarding-api";
import { startChildClass } from "@/lib/curriculum-api";
import { getStartClassErrorMessage, NO_CLASS_AVAILABLE_MESSAGE } from "@/lib/child-class-messages";

type RouterLike = {
  push: (href: string) => void;
};

/**
 * Gate onboarding, start the next assigned class session, and open the lesson view.
 */
export async function navigateToChildClass(router: RouterLike, hasAssignedClass = true) {
  if (!hasAssignedClass) {
    throw new Error(NO_CLASS_AVAILABLE_MESSAGE);
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

  try {
    const session = await startChildClass();
    router.push(`/child-dashboard/lesson?sessionId=${session.sessionId}`);
  } catch (error) {
    throw new Error(getStartClassErrorMessage(error));
  }
}
