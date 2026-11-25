import { card, q, type Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    title: "A short history of AI",
    cards: [
      card("Can machines think?", "In 1950, the mathematician Alan Turing asked a simple question: if you chat with something by text and can't tell whether it's a human, should we call it intelligent? That idea became the famous Turing Test.\n\nIn 1955, researcher John McCarthy gave the whole field its name: Artificial Intelligence.", "turing-test"),
      card("Winters and wins", "Early hopes were huge, but computers were too slow and had too little memory. When AI couldn't keep its big promises, funding dried up. Those dry spells are called AI Winters.\n\nThen each win restarted the clock. In 1997 a computer beat the world chess champion. In 2012 a network taught itself to spot cats in millions of videos. In 2022 ChatGPT put generative AI in everyone's browser.", "history-timeline"),
    ],
    questions: [
      q("What did Alan Turing suggest in 1950?", ["A machine counts as intelligent once it can beat a human at chess", "A machine needs real feelings before we can call it intelligent", "If you can't tell a machine from a human in a text chat, it's intelligent", "A machine is intelligent if it can learn any task without being told"], 2, "That's the Turing Test: judge by the conversation, not by what's inside the machine."),
      q("What was an 'AI winter'?", ["A period when AI chips needed extra cooling to run at all, so they paused", "A period when funding and progress dried up because AI overpromised", "A period after a famous chess match that stalled research", "A period when ChatGPT was taken offline for a season"], 1, "Computers were too slow and had too little memory, so investors and governments pulled back."),
      q("Which event kicked off today's generative AI boom?", ["Turing's paper in 1950", "Deep Blue beating Kasparov in 1997", "ChatGPT's public launch in 2022"], 2, "ChatGPT showed the public an AI that could write essays, code and more."),
    ],
  },
  {
    title: "Predicting, not thinking",
    cards: [
      card("A pattern engine", "Large language models (LLMs) like ChatGPT and Claude don't have opinions, feelings, or a stored list of facts. They are advanced statistical calculators.\n\nGiven your text, an LLM predicts the most likely next chunk of text, then the next, then the next, until it has a full answer.", "next-token"),
      card("Smart autocomplete", "Humans build mental models of the world: gravity, fairness, emotions. An LLM instead reads patterns in a huge amount of text.\n\nThink of your phone's autocomplete, but trained on a giant slice of the internet, books and code. That's why it can sound human without understanding things the way you do.", "smart-autocomplete"),
    ],
    questions: [
      q("What does an LLM do at its core?", ["Looks up answers in a database of facts", "Forms its own opinion about your question", "Predicts the next likely piece of text", "Searches the web every time"], 2, "Everything an LLM writes comes from repeated next-piece predictions."),
      q("Which comparison fits an LLM best?", ["A robot with feelings", "A very smart autocomplete", "A library catalogue"], 1, "It maps patterns from human writing, like autocomplete at a massive scale."),
      q("True or false: an LLM understands the world the way a human does.", ["True", "False"], 1, "It reads patterns in text. It has no experiences, emotions or physical world to learn from."),
    ],
  },
  {
    title: "How AI learns",
    cards: [
      card("Training means finding patterns", "Before you ever type a word, a model is trained on a massive pile of text: websites, books, articles and code.\n\nIt isn't memorising a library. It's learning which words tend to follow which other words, in which situations, across billions of examples.", "training-pile"),
      card("After training", "When you ask a question, the model can't flip back through its training text. It uses the patterns it learned to generate a response one token at a time.\n\nMany chatbots also get extra training from people, who rate answers so the AI becomes more helpful and polite.", "after-training"),
    ],
    questions: [
      q("What is a model mainly learning during training?", ["Exact pages that it will copy out later", "A list of correct answers to common questions", "Statistical patterns about language", "Your personal details from your account"], 2, "It learns which words and ideas tend to go together."),
      q("On its own, where does a model's answer come from?", ["A human types the answer and sends it back", "It is looked up word for word in the training text", "It is generated from the patterns the model learned"], 2, "It's generated, not retrieved. (Some chatbots can also use search tools, which is a separate add-on.)"),
      q("Why do chatbots get extra training from human feedback?", ["To make their answers more helpful and well-behaved", "To make them slower, so they can think for longer", "To delete any training data that is out of date", "To give them feelings about the topics they discuss"], 0, "People rate answers, and the model learns which kinds of replies are most useful."),
    ],
  },
  {
    title: "Why AI gets things wrong",
    cards: [
      card("Four ways AI goes wrong", "False information in the training data can be learned as if it were true.\n\nConflicting sources: different websites make different claims.\n\nOut-of-date knowledge: the model repeats old facts.\n\nHallucinations: when it doesn't actually know, it can still produce a plausible-sounding but wrong answer.", "failure-modes"),
      card("Plausible is not the same as true", "A hallucination isn't a database lookup that went wrong. The model generated text that fits the patterns it learned.\n\nAnd since AI always sounds confident, a made-up fact looks exactly like a real one. Always check anything important.", "hallucination"),
    ],
    questions: [
      q("Which is an example of a hallucination?", ["A chatbot refuses to answer a question it can't check", "A chatbot gives you a correct answer that is a few years out of date", "A chatbot invents a book and author that don't exist, and cites it", "A chatbot repeats the question you asked, word for word"], 2, "It sounds real, but it was generated, not found."),
      q("Why can AI repeat outdated information?", ["It doesn't read dates", "It forgets everything after each message", "Its knowledge stops at a point in time"], 2, "A model only knows what was in its training data, unless it's given a way to look things up."),
      q("True or false: if an AI sounds confident, it's probably correct.", ["True", "False"], 1, "Confidence is a writing style, not proof. Check anything that matters."),
    ],
  },
];
