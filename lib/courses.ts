import type { Course } from "./types";
import { lessons as whatIsAi } from "./content/what-is-ai";
import { lessons as tokens } from "./content/tokens";
import { lessons as useItWell } from "./content/use-it-well";
import { lessons as integrity } from "./content/integrity";
import { lessons as chooseAModel } from "./content/choose-a-model";
import { lessons as effects } from "./content/effects";
import { lessons as localLlms } from "./content/local-llms";

export const courses: Course[] = [
  {
    slug: "what-is-ai",
    title: "What is AI?",
    blurb: "From Turing to ChatGPT: what AI really is, and what it isn't.",
    lessons: whatIsAi,
  },
  {
    slug: "tokens",
    title: "Tokens and meaning",
    blurb: "How AI reads: tokens, numbers, and why it can't count letters.",
    lessons: tokens,
    sources: [
      "Bergmann, Dave. \"What Is a Context Window?\" IBM Think.",
      "\"Why Do LLMs Charge More for Non-English Text? Tokenization and Languages.\" AI/TLDR, 13 June 2026.",
    ],
  },
  {
    slug: "use-it-well",
    title: "Using AI properly",
    blurb: "Ask better questions, check the answers, and stay in charge.",
    lessons: useItWell,
    sources: [
      "\"AI's Cognitive Implications: The Downfall of Our Thinking Skills.\" The European Business Review, 18 Dec. 2024.",
    ],
  },
  {
    slug: "school-and-honesty",
    title: "AI, school and honesty",
    blurb: "Where the lines are, how AI detectors work, and how to stay safe.",
    lessons: integrity,
  },
  {
    slug: "choose-a-model",
    title: "Choosing the right model",
    blurb: "Frontier, everyday, fast or cheap? Pick the right tool for the job.",
    lessons: chooseAModel,
  },
  {
    slug: "effects",
    title: "What AI changes",
    blurb: "How AI is reshaping jobs, hiring and the planet.",
    lessons: effects,
    sources: [
      "\"AI Will Reshape More Jobs Than It Replaces.\" Boston Consulting Group, 4 June 2026.",
      "Lowrey, Annie. \"AI Has Ruined the Job Market.\" The Atlantic, 4 June 2026.",
      "\"GPU Data Centers: How They Work, Energy Demands, and ROI.\" io.net Blog, 28 May 2026.",
      "Cunningham, Mary. \"Gadget Prices Have Fallen for Decades. Then AI Happened.\" CBS News, 26 June 2026.",
    ],
  },
  {
    slug: "local-llms",
    title: "Local LLMs",
    blurb: "Run an AI on your own computer, with no internet.",
    lessons: localLlms,
  },
  {
    slug: "ai-in-your-life",
    title: "AI in your life",
    blurb: "Put AI to work on homework, hobbies and habits.",
    lessons: [],
    comingSoon: true,
  },
  {
    slug: "make-your-app",
    title: "Make your own app",
    blurb: "Build something real. An AI judge reviews it.",
    lessons: [],
    comingSoon: true,
  },
];
