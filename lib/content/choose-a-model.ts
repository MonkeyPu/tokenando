import { card, q, type Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    title: "The five tiers",
    cards: [
      card("Frontier and production", "Frontier models handle the hardest, longest, multi-step jobs. The cost: very slow, very expensive, and overkill for everyday tasks.\n\nProduction models are great at coding, research and complex writing, and stay consistent at scale. They cost more than mid-tier models and are slower than light ones."),
      card("Everyday, fast and value", "Everyday models handle most day-to-day tasks quickly and reliably, though they're not as strong as the top two tiers.\n\nFast and quick models answer in a flash and are cheap, but struggle with nuanced, multi-step reasoning.\n\nValue models are extremely cheap with huge context windows and hold up well on reasoning and coding, but trail the very best closed models on the hardest tasks."),
      card("Names change fast", "New versions appear every few months, so remember the tiers, not the version numbers.\n\nIn the Claude family, for example, Fable sits at the frontier, Opus is production, Sonnet is everyday and Haiku is fast and quick. Other families, like GPT, Gemini and DeepSeek, have their own versions of each tier."),
    ],
    questions: [
      q("Which tier suits a simple, high-volume job?", ["Frontier", "Production", "Fast and quick"], 2, "Fast, cheap models are ideal when the task is simple."),
      q("What's the main downside of a frontier model?", ["It's very slow and expensive", "It can't write code", "It has a tiny context window", "It only speaks English"], 0, "Great for hard problems, overkill for easy ones."),
      q("Why remember tiers, not version numbers?", ["Version numbers are secret", "New versions appear every few months", "Tiers never change", "Versions are always identical in every way"], 1, "The names churn, but the trade-offs between tiers stay."),
    ],
  },
  {
    title: "Pick the right tool",
    cards: [
      card("Match the job", "Deep reasoning (advanced maths, debugging code, tricky logic): use a thinking or frontier model. It spends more time reasoning, so it's slower, and can sound a little robotic.\n\nBest all-rounder for essays, code and natural conversation: an everyday or flagship model.\n\nQuick tasks like fixing grammar, summarising notes or translating: a fast model answers almost instantly."),
      card("Bigger isn't always better", "Using the biggest model for a quick job wastes time and money, a bit like hiring a rocket scientist to change a lightbulb.\n\nThe question isn't 'which tier is best?' It's 'which tier fits this job?'"),
    ],
    questions: [
      q("You need to debug a tricky program. Which fits best?", ["The cheapest fast model, then fix the rest by hand", "A thinking or frontier-tier model", "No AI at all, it will only get in the way"], 1, "Hard reasoning benefits from a model that thinks longer."),
      q("You want to fix the grammar in a short email. Which fits best?", ["A frontier model", "A fast model", "A model with the largest context window"], 1, "Speed and low cost matter more than deep reasoning here."),
      q("You want a strong all-rounder for essays and chatting. Which fits best?", ["An everyday or flagship model", "The smallest model you can find", "A raw base model"], 0, "That's the sweet spot of power, speed and natural conversation."),
    ],
  },
  {
    title: "Open vs closed models",
    cards: [
      card("Closed models", "With a closed model (like GPT or Claude) you use it through the company's app or its API. You can't download it or see inside it."),
      card("Open models", "Open-weight models, like Meta's Llama or Alibaba's Qwen, are published so anyone can download them, inspect them and run them on their own hardware. Many people call them 'open-source'.\n\nHugging Face is the biggest website for sharing them: researchers, companies and independent developers upload models and datasets for anyone to use."),
      card("The trade-offs", "Closed: usually the strongest and the easiest to use, but it costs money and your messages go to the company.\n\nOpen: free to download and customisable, and you can run it privately. But you need hardware and know-how, and it may trail the best closed models on the hardest tasks."),
    ],
    questions: [
      q("Which of these is an open model family?", ["GPT", "Llama", "None of them"], 1, "Meta's Llama is published for anyone to download."),
      q("What is Hugging Face?", ["A chat app for talking to several models at once", "A website where open models and datasets are shared", "A kind of GPU built for training big models", "A chatbot that answers questions about open models"], 1, "Think of it as a giant library of open AI models."),
      q("A benefit of an open model is...", ["It is always the smartest model available", "It needs no hardware to run on at all", "You can run it yourself and keep data private", "It always answers faster than closed models"], 2, "That control is the main reason people choose open models."),
    ],
  },
  {
    title: "Cost, speed and tokens",
    cards: [
      card("Paying by the token", "Most AI services charge by tokens in and tokens out. Bigger models cost more per token. Wordy prompts and very long chat histories mean more tokens, so more cost."),
      card("Thinking costs tokens too", "Reasoning models spend extra tokens 'thinking' before they answer. That's why they're slower and pricier, but better on hard problems."),
      card("Spend tokens wisely", "Be specific so the AI doesn't ramble. Start a new chat for a new topic. And pick a smaller model for simple jobs."),
    ],
    questions: [
      q("What do many AI services charge by?", ["The hour", "Tokens", "Letters typed", "Your internet speed"], 1, "Every token in and out adds to the bill."),
      q("Which saves money on a simple task?", ["Using a smaller model", "Using the biggest model", "Writing a much longer prompt"], 0, "Smaller models cost less per token."),
      q("Why are reasoning models slower?", ["They spend extra tokens thinking before answering", "They have much smaller context windows to read", "They usually run on phones instead of servers", "They are older models that were never optimised"], 0, "Reasoning takes extra steps, and extra tokens."),
    ],
  },
];
