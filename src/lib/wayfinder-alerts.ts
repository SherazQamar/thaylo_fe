export interface WayfinderAlert {
  title: string;
  text: string;
  date: string;
  priority: "High" | "Medium" | "Low" | null;
  accent: string;
  type?: "message";
}

export const WAYFINDER_ALERTS: WayfinderAlert[] = [
  {
    title: "Student Struggling",
    text: "Bob Smith has failed the Math Module 3 times.",
    date: "29/01/2026",
    priority: "High",
    accent: "#FF6F6F",
  },
  {
    title: "SEL Red Flag",
    text: "Diana Prince reported low mood for 3 consecutive days.",
    date: "29/01/2026",
    priority: "Medium",
    accent: "#FFC542",
  },
  {
    title: "Parent Message",
    text: "Martha Johnson requested a meeting regarding Alice.",
    date: "29/01/2026",
    priority: null,
    accent: "#00CED1",
    type: "message",
  },
];
