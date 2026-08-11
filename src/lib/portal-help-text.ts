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
    "Bloom Buddy check-ins: Happy (😊), Okay (😐), or Worried (😟). Wellness never changes grades.",
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
    "Mood check-ins in this date range: Happy, Okay, and Worried (Blueprint 3-tap).",
} as const;

export const WAYFINDER_DASHBOARD_HINTS = {
  masteryTrend:
    "Week-over-week lesson passes across your caseload. Improving = more passes than last week; Declining = fewer; Steady = similar; — = no recent activity.",
  timeThisWeek:
    "Total learning time your assigned students spent in lessons this week (not your login time).",
  selSummary:
    "Bloom Buddy wellness: Clear = Green; Amber = pattern of struggle; Red = needs review. Watch = lesson difficulty flags only (not SEL).",
  presence:
    "Right now for your caseload: In lesson = in a live class; Online = on the portal but not in a lesson; Idle = not active recently.",
  priorities:
    "Students with active lesson red flags or Bloom Buddy Amber/Red wellness — open Alerts Center to follow up.",
  focus: "Skill area for the lesson this student is focusing on.",
  confidence:
    "Based on how much of the 60-lesson ELA track is mastered: High, Medium, or Building.",
  plantStage: "How far this student's learning plant has grown as they pass ELA lessons.",
  masteryTrendStudent:
    "This student's week-over-week lesson passes compared with last week.",
  wellnessFlag:
    "Bloom Buddy wellness only — does not change grades. Green = clear, Amber = watch, Red = review.",
  presenceStudent:
    "In lesson = live class now. Online = signed in on the portal. Idle = not active in the last ~90 seconds.",
} as const;

export const WAYFINDER_LIVE_HINTS = {
  risk: "Highest open support flag for this student: Amber = one failed attempt, Orange = two, Red = three or more. Clear = none.",
} as const;

export const SHARED_PROGRESS_HINTS = {
  progress:
    "Growth stage from lessons mastered — the plant grows as the student passes lessons.",
  confidence:
    "Based on how much of the 60-lesson ELA track is mastered: High ≥60%, Medium ≥25%, Building if some progress, otherwise N/A.",
  risk: "Support signal from the highest open lesson flag or Bloom Buddy wellness (Clear / Amber / Orange / Red). Does not change grades.",
  growthGarden:
    "Visual progress through the ELA plant stages as lessons are mastered.",
  mastery:
    "Share of attempted lessons that were passed, based on the student's learning progress.",
  courseProgress: "Lessons completed out of the pilot ELA track (60 lessons).",
  badgesEarned: "Badges this student has earned for learning milestones and habits.",
  curricularProgress:
    "Skill-family mastery for Grade 4 ELA. Expand a family to see lessons with time spent and average scores. Mastery comes from passed assessments only.",
  learningSummary:
    "Current Focus = skill family for the active/last lesson. Confidence = overall mastery level. Engagement = this week’s lesson activity.",
  wellbeingSnapshot:
    "Bloom Buddy 3-tap check-ins: Positive (😊 Happy), Neutral (😐 Okay), Low Mood (😟 Worried). Older moods still count in history. SEL never changes grades.",
} as const;

/** Shared Alerts vs Notifications copy for Parent & Wayfinder (plain language). */
export const ALERTS_CENTER_HINTS = {
  wayfinder:
    "Alerts are your action list for students who need support (lesson struggles, wellbeing flags, parent requests). Open a student, review the flag, then resolve or follow up. This is different from Notifications, which only shows what happened.",
  parent:
    "Alerts show when your child may need support — for example a tough lesson or a worried Bloom Buddy check-in. Open a card to read the details. This is your action list. Notifications is a separate inbox that only tells you something happened.",
} as const;

export const NOTIFICATIONS_CENTER_HINTS = {
  shared:
    "Notifications is a simple inbox of updates: Progress (lessons), SEL (wellbeing check-ins), and System (attendance or camera notes). Mark items as read when you have seen them. To take action on a student, use Alerts — that is the work list.",
} as const;
