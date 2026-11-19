import type { Mood, Prop } from "./assistant";

// `scene` is optional. Without it the mascot picks a mood for the card automatically.
export type Card = { title: string; text: string; scene?: { mood?: Mood; prop?: Prop } };

export type Question = {
  prompt: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
};

export type Lesson = { title: string; cards: Card[]; questions: Question[] };

export type Course = {
  slug: string;
  title: string;
  blurb: string;
  lessons: Lesson[];
  sources?: string[];
  comingSoon?: boolean;
};

// Short helpers so the content files stay readable.
// Separate paragraphs inside a card with a blank line (\n\n).
export const card = (title: string, text: string): Card => ({ title, text });
export const q = (prompt: string, options: string[], answer: number, explanation: string): Question => ({ prompt, options, answer, explanation });
