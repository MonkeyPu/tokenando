import { card, q, type Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    title: "What is a token?",
    cards: [
      card("Chunks, not letters", "AI doesn't read whole sentences or single letters. It splits text into tokens: pieces like 'straw' and 'berry', a short common word, or a bit of punctuation.\n\nA handy rule of thumb: about 750 words is roughly 1,000 tokens."),
      card("Reusable pieces", "Tokens aren't random cuts. 'Run' and 'running' share the token 'run', so the model sees they're related, even in a sentence it has never met.\n\nBecause pieces get reused, a model needs only around 200,000 tokens, not millions of separate words. That saves a lot of memory."),
    ],
    questions: [
      q("About how many tokens is 750 words?", ["About 100", "About 750,000", "About 1,000", "About 7,500"], 2, "Roughly 750 words is about 1,000 tokens."),
      q("Why does the shared 'run' token help the model?", ["They have the same number of letters", "It shows the words are related, even in new sentences", "It stores a dictionary of definitions", "It makes the model faster at spelling"], 1, "Related words share building blocks, so the model spots the connection."),
      q("Why do models use tokens instead of one entry per word?", ["Words are too hard for computers", "It makes answers longer", "Reusing pieces saves memory", "Tokens are easier for humans to read"], 2, "A few hundred thousand pieces can build almost any word."),
    ],
  },
  {
    title: "The strawberry problem",
    cards: [
      card("A famous trick question", "Ask an AI, 'How many r's are in strawberry?' Plenty of models have confidently said 2. The right answer is 3.\n\nWhy? The model never sees s-t-r-a-w-b-e-r-r-y letter by letter."),
      card("Tokens hide letters", "It sees chunks like 'straw' and 'berry'. To count letters it has to guess from patterns in its training data, while you can simply look.\n\nA human counts in a second. The model can sound totally sure and still be wrong, which is a great reminder to check the facts."),
    ],
    questions: [
      q("Why do some AIs miscount letters?", ["They can't do maths at all", "They see tokens, not individual letters", "They're too lazy", "They only know vowels"], 1, "The text is chopped into chunks before the model sees it."),
      q("How many r's are in 'strawberry'?", ["2", "4", "3"], 2, "Straw-berry: one r in 'straw', two in 'berry'."),
      q("What's the bigger lesson of the strawberry problem?", ["AI can't read", "AI is useless", "AI only works in English", "AI can sound confident and still be wrong"], 3, "Fluent and confident doesn't mean correct."),
    ],
  },
  {
    title: "Words as numbers",
    cards: [
      card("From tokens to vectors", "Each token is turned into a long list of numbers called a vector (or embedding). Think of it as coordinates on a giant map of meaning.\n\nWords used in similar ways land close together. King, queen, monarch, crown and castle form one cluster. Apple and fruit sit in another."),
      card("Directions carry meaning", "Relationships become directions on the map. Take 'king', subtract 'man', add 'woman', and you land near 'queen'.\n\nThe pictures we draw have 3 dimensions so we can see them. Real models use hundreds or even thousands."),
      card("Back to predicting", "When you ask a question, the model turns your words into vectors, looks at the nearby ideas, and predicts the most likely next token. Then the next. Until the answer is complete."),
    ],
    questions: [
      q("What is a vector in AI?", ["A short word", "A kind of computer virus", "A list of numbers that places a token on a map of meaning", "A speed limit for chatbots"], 2, "The numbers are coordinates for the token's meaning."),
      q("Where would 'apple' most likely land on the map?", ["Close to 'fruit'", "Close to 'castle'", "Close to 'monarch'"], 0, "Words used in similar contexts sit near each other."),
      q("Why does king - man + woman land near queen?", ["The AI looked it up in a dictionary", "Relationships like male to female are consistent directions on the map", "The letters add up", "It's just luck"], 1, "The 'male to female' direction is similar across many word pairs."),
    ],
  },
  {
    title: "Context windows and languages",
    cards: [
      card("A limited memory", "The context window is the most tokens a model can handle at once: your whole chat so far, plus its replies. If a chat goes past the limit, older messages get summarised or dropped, so the AI can lose early details.\n\nLong chats also slow down, because the model compares every token with all the others, and that work grows faster than the chat does."),
      card("Not every language costs the same", "Tokenizers learn mostly from English, so English is cheap to process. Many other languages need more tokens to say the same thing.\n\nMore tokens means higher cost and less room in the context window. It's one way AI isn't equally efficient for everyone."),
    ],
    questions: [
      q("What can happen when a chat passes the context window limit?", ["Nothing, AI remembers forever", "The chat becomes faster", "The AI deletes your account", "Older messages can be summarised or dropped"], 3, "The model can lose early details."),
      q("Why do long chats slow down?", ["The model re-processes all the tokens, and the comparisons grow fast", "Your wifi gets tired", "The AI gets bored", "The servers switch off"], 0, "More tokens means a lot more comparisons."),
      q("Why can the same message cost more in some languages?", ["Those languages are harder for humans", "More tokens are needed to express the same meaning", "Letters in other alphabets cost more", "The AI refuses to translate"], 1, "English is what most tokenizers learned from, so other languages get split into more pieces."),
    ],
  },
];
