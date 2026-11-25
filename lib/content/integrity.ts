import { card, q, type Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    title: "The spectrum of AI use",
    cards: [
      card("Four levels", "1. Safe base: using AI for a high-level outline brainstorm or to check your reading comprehension.\n\n2. Assisted: you draft everything yourself, and ask for line-by-line feedback.\n\n3. High alert: co-writing passages where some sentences are generated. Higher risk of detection triggers.\n\n4. Out of bounds: copying outputs wholesale. You learn nothing."),
      card("Why the line is blurry", "Rules vary between schools and teachers, and academic pressure makes shortcuts tempting. Two questions help: 'What would I do without AI?' and 'Could I explain every line out loud?'"),
    ],
    questions: [
      q("Which use sits in the 'Safe base' level?", ["Co-writing paragraphs with AI", "Brainstorming a high-level outline", "Pasting AI text as your answer", "Asking AI to rewrite your whole essay"], 1, "Outlines and comprehension checks keep the real work yours."),
      q("Why is copying AI output wholesale 'out of bounds'?", ["It takes longer than writing the answer yourself", "It uses more tokens than your plan allows for", "It skips the learning your brain needs to do", "The AI's terms do not allow you to copy it"], 2, "The point of school work is what it builds in you."),
      q("A good self-test before submitting is...", ["Could I explain every line out loud?", "Does it sound fancy and advanced?", "Is it long enough to fill the limit?", "Did a friend read it and like it?"], 0, "If you can't explain it, it isn't really yours yet."),
    ],
  },
  {
    title: "How AI detectors work",
    cards: [
      card("Math, not magic", "AI detectors can't read or understand text like a human. They don't have a secret database of 'things ChatGPT wrote'.\n\nThey're programs that estimate the probability that a machine wrote a sentence."),
      card("Perplexity", "Perplexity measures how predictable your word choices are.\n\n'For breakfast, I ate a bowl of...' An AI says 'cereal' (predictable, low perplexity). A human might say 'jelly beans' (surprising, high perplexity).\n\nAI is trained to be 'perfectly average', so detectors flag text that is too predictable."),
      card("Detectors can be wrong", "Because they only guess, detectors can flag real human writing and miss edited AI text. Some studies have found they flag work by non-native English writers more often. A detector score on its own is not proof of anything."),
    ],
    questions: [
      q("What do AI detectors actually do?", ["Look the text up in a database of AI writing", "Read it closely and judge what it means", "Ask the AI directly whether it wrote the text", "Estimate the probability that a machine wrote it"], 3, "It's a statistical guess."),
      q("Which word choice has HIGHER perplexity?", ["'...cereal.'", "'...jelly beans.'"], 1, "Surprising choices are harder to predict."),
      q("Why isn't a detector score proof?", ["Detectors only guess, and they can be wrong", "Detectors are always right, so a score is proof", "Detectors only work on poems and short stories", "Detectors read the writer's mind as they type"], 0, "False flags happen, so a score alone shouldn't decide anything."),
    ],
  },
  {
    title: "Burstiness and AI-sounding words",
    cards: [
      card("Rhythm", "Burstiness is how much your sentence length and rhythm vary. AI writing tends to be flat: sentences of similar length and structure, like a metronome. Human writing bursts, like a drum solo. Short. Then a long, winding sentence with a few commas to explain something exciting."),
      card("Compare two excerpts", "Excerpt 1: 'The train was late again, and everyone groaned. As a little kid waved through the window, people smiled back. It showed that a small moment could make the morning feel better.'\n\nExcerpt 2: 'The train was late again, and everyone groaned. Then a little kid started waving at strangers through the window, and, one by one, people smiled back. Funny. I guess mornings can change in thirty seconds.'"),
      card("Favourite AI words", "Models overuse words that are statistically common in polished writing: 'delve', 'tapestry', 'underscores', 'transformative'.\n\nUsing one doesn't prove AI wrote something, but if you notice stock phrases creeping in, rewrite them in your own voice."),
    ],
    questions: [
      q("Which excerpt has more burstiness?", ["Excerpt 1, with similar sentence lengths all the way through", "Excerpt 2, with short and long sentences mixed"], 1, "The one-word 'Funny.' next to a long sentence gives it a human rhythm."),
      q("Does using the word 'delve' prove AI wrote a text?", ["Yes, that word is always a sign of AI", "No, it's just a word AI happens to overuse"], 1, "It's a hint at most, never proof."),
      q("AI writing often sounds like...", ["A drum solo", "A steady metronome", "A jazz improvisation", "A thunderstorm"], 1, "The rhythm is even and flat."),
    ],
  },
  {
    title: "Prove it's yours",
    cards: [
      card("Keep your process", "If a detector ever flags your work, your best defence is your process: notes, outlines, earlier drafts and version history (like the edit history in Google Docs).\n\nWrite your first draft yourself and keep it."),
      card("Sound like you", "Read your work out loud. Add details only you would know: a specific moment, a real opinion, an example from your life. Vary your rhythm.\n\nMixed sentence lengths and surprising choices are what make writing yours."),
    ],
    questions: [
      q("If your work is wrongly flagged, what helps most?", ["Arguing loudly that you would never do that", "Version history, notes and drafts", "Deleting the file so nobody can check it", "Running a second detector on the same text"], 1, "Evidence of your process is hard to argue with."),
      q("Which adds a human voice to your writing?", ["Longer vocabulary", "A specific personal example", "Repeating the question", "More AI editing"], 1, "Only you have your experiences."),
      q("True or false: a detector score alone proves AI was used.", ["True", "False"], 1, "Detectors guess. They can be wrong."),
    ],
  },
];
