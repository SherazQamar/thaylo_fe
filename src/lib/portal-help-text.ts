/** Plain-language help text for Parent & Wayfinder info icons. */

export const PARENT_DASHBOARD_HINTS = {
  activeToday: "Children who opened or worked on a lesson today.",
  avgWeeklyTime:
    "Time each child spent in lessons this week (from Sunday through today).",
  masteredSkills:
    "Total ELA lessons your children have passed so far (pilot track: up to 60).",
  masteryOfAttempted:
    "Share of finished lessons that were passed — not overall course completion. Example: 3 passed of 5 finished = 60%.",
  selOverview:
    "How often your child checked in feeling happy, uncertain, or low — all check-ins so far.",
  confidence:
    "Based on how much of the 60-lesson ELA track is mastered: High ≥60%, Medium ≥25%, Building if some progress, otherwise N/A.",
  focus: "Skill area for the lesson your child is in, or last worked on.",
} as const;

export const PARENT_REPORTS_HINTS = {
  masteryOfAttempted:
    "Percent of lessons finished in this date range that were passed.",
  passedAttempted: "Lessons passed versus finished in the selected date range.",
  timeInLessons: "Total time spent in lessons during this date range.",
  avgAssessmentScore:
    "Average quiz or assessment score across lessons in this range (when scores exist).",
  selCheckIns:
    "Mood check-ins in this date range: happy, uncertain, and low mood.",
} as const;

export const WAYFINDER_DASHBOARD_HINTS = {
  masteryTrend:
    "Improving if any of your students passed a lesson this week; Steady if they practiced but did not pass; — if there was no activity.",
  timeThisWeek:
    "Total learning time your assigned students spent in lessons this week (not your login time).",
  selSummary:
    "Clear = no red flags; Watch = lesson struggle flags; Red = active wellbeing (SEL) red flags.",
  priorities:
    "Students with active red lesson or wellbeing flags — open Alerts Center to follow up.",
  focus: "Skill area for the lesson this student is focusing on.",
  confidence:
    "Based on how much of the 60-lesson ELA track is mastered: High, Medium, or Building.",
  plantStage: "How far this student's learning plant has grown as they pass ELA lessons.",
} as const;

export const WAYFINDER_LIVE_HINTS = {
  risk: "Highest open support flag for this student: Amber = one failed attempt, Orange = two, Red = three or more. Clear = none.",
} as const;

export const SHARED_PROGRESS_HINTS = {
  progress:
    "Growth stage from lessons mastered — the plant grows as the student passes lessons.",
  confidence:
    "Based on how much of the 60-lesson ELA track is mastered: High, Medium, or Building.",
  risk: "Support signal from lesson struggles or wellbeing alerts for this student.",
  growthGarden:
    "Visual progress through the ELA plant stages as lessons are mastered.",
  mastery:
    "Share of attempted lessons that were passed, based on the student's learning progress.",
  courseProgress: "Lessons completed out of the pilot ELA track (60 lessons).",
  badgesEarned: "Badges this student has earned for learning milestones and habits.",
} as const;
