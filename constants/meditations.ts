export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: string;
  narrator: string;
  gradient: string[];
  featured: boolean;
}

export const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "mindfulness", name: "Mindfulness" },
  { id: "sleep", name: "Sleep" },
  { id: "anxiety", name: "Anxiety" },
  { id: "focus", name: "Focus" },
  { id: "gratitude", name: "Gratitude" },
  { id: "spiritual", name: "Spiritual" },
];

export const MEDITATION_SESSIONS: MeditationSession[] = [
  {
    id: "morning-mindfulness",
    title: "Morning Mindfulness",
    description: "Start your day with clarity and intention through gentle awareness practices.",
    duration: 10,
    category: "mindfulness",
    narrator: "Sarah Chen",
    gradient: ["#FF6B6B", "#FF8E53"],
    featured: true,
  },
  {
    id: "deep-sleep",
    title: "Deep Sleep Journey",
    description: "Drift into peaceful slumber with calming visualizations and body relaxation.",
    duration: 20,
    category: "sleep",
    narrator: "Michael Rivers",
    gradient: ["#667EEA", "#764BA2"],
    featured: true,
  },
  {
    id: "anxiety-relief",
    title: "Anxiety Relief",
    description: "Release tension and find calm through breathing techniques and grounding exercises.",
    duration: 15,
    category: "anxiety",
    narrator: "Emma Thompson",
    gradient: ["#4FACFE", "#00F2FE"],
    featured: true,
  },
  {
    id: "focus-flow",
    title: "Focus & Flow",
    description: "Enhance concentration and enter a state of productive flow.",
    duration: 12,
    category: "focus",
    narrator: "David Kim",
    gradient: ["#43E97B", "#38F9D7"],
    featured: false,
  },
  {
    id: "gratitude-practice",
    title: "Gratitude Practice",
    description: "Cultivate appreciation and joy through guided gratitude meditation.",
    duration: 8,
    category: "gratitude",
    narrator: "Lisa Martinez",
    gradient: ["#FA709A", "#FEE140"],
    featured: false,
  },
  {
    id: "spiritual-awakening",
    title: "Spiritual Awakening",
    description: "Connect with your higher self and explore spiritual dimensions.",
    duration: 25,
    category: "spiritual",
    narrator: "Raj Patel",
    gradient: ["#A8EDEA", "#FED6E3"],
    featured: false,
  },
  {
    id: "body-scan",
    title: "Body Scan Relaxation",
    description: "Progressive relaxation through mindful body awareness.",
    duration: 18,
    category: "mindfulness",
    narrator: "Sarah Chen",
    gradient: ["#FBC2EB", "#A6C1EE"],
    featured: false,
  },
  {
    id: "loving-kindness",
    title: "Loving Kindness",
    description: "Cultivate compassion for yourself and others through metta meditation.",
    duration: 15,
    category: "spiritual",
    narrator: "Emma Thompson",
    gradient: ["#F093FB", "#F5576C"],
    featured: false,
  },
];