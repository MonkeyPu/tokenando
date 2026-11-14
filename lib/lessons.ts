export type Question = {
  prompt: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
};

// Real questions, keyed by course slug, then by lesson index (0-based).
// Any lesson not listed here gets the placeholder questions below.
const content: Record<string, Question[][]> = {
  "what-is-ai": [
    [
      {
        prompt: "Which of these uses AI?",
        options: ["A calculator adding 2 + 2", "A music app suggesting songs you might like", "A light switch", "A paper map"],
        answer: 1,
        explanation: "The music app learned from what lots of people listen to, then guesses what you'll enjoy. A calculator just follows fixed rules.",
      },
      {
        prompt: "How does an AI learn?",
        options: ["From examples and data", "By magic", "It's born knowing everything", "From its own feelings"],
        answer: 0,
        explanation: "AI looks at huge numbers of examples and finds patterns in them.",
      },
      {
        prompt: "True or false: an AI always gets the answer right.",
        options: ["True", "False"],
        answer: 1,
        explanation: "AI makes mistakes, sometimes confidently. That's why we check its answers.",
      },
    ],
  ],
};

export function getQuestions(slug: string, index: number, title: string): Question[] {
  const real = content[slug]?.[index];
  if (real) return real;
  return [
    {
      prompt: "Which topic is this lesson about?",
      options: [title, "Cooking pasta", "Dinosaur names"],
      answer: 0,
      explanation: "This is a placeholder lesson. The real questions are coming soon.",
    },
    {
      prompt: "Is it okay to skip a question you're not sure about?",
      options: ["Yes, skipping is fine", "No, you must answer everything"],
      answer: 0,
      explanation: "Skip whenever you like. You can always come back.",
    },
  ];
}
