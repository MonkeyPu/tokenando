export type Course = {
  slug: string;
  title: string;
  tab: string;
  blurb: string;
  lessons: string[];
};

// Lesson titles are placeholders. Real content comes later.
export const courses: Course[] = [
  {
    slug: "what-is-ai",
    title: "What is AI?",
    tab: "What is AI?",
    blurb: "See how AI works by looking inside it.",
    lessons: ["What counts as AI", "Learning from examples", "Tokens and predictions", "Where AI gets it wrong", "Recap"],
  },
  {
    slug: "use-it-well",
    title: "Using AI properly",
    tab: "Using AI",
    blurb: "Ask better questions and check the answers.",
    lessons: ["Write a good prompt", "Check the answer", "Keep your info private", "Give credit", "When not to use AI"],
  },
  {
    slug: "ai-in-your-life",
    title: "AI in your life",
    tab: "Your life",
    blurb: "Put AI to work on homework, hobbies and habits.",
    lessons: ["Homework helper", "Creative projects", "Everyday tools", "Build a routine", "Your AI plan"],
  },
  {
    slug: "effects",
    title: "What AI changes",
    tab: "Effects",
    blurb: "How AI affects jobs, school, fairness and the planet.",
    lessons: ["Jobs", "School", "Fairness and bias", "The planet", "Your say"],
  },
  {
    slug: "local-llms",
    title: "Local LLMs",
    tab: "Local LLMs",
    blurb: "Run an AI on your own computer, with no internet.",
    lessons: ["AI on your computer", "Model sizes", "Install one", "Chat offline", "Local vs cloud"],
  },
  {
    slug: "make-your-app",
    title: "Make your own app",
    tab: "Make an app",
    blurb: "Build something real. An AI judge reviews it.",
    lessons: ["Pick an idea", "Describe it", "Build version one", "Test it", "Meet the AI judge"],
  },
];
