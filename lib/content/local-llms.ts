import { card, q, type Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    title: "AI on your own computer",
    cards: [
      card("Cloud vs local", "Normally your tokens fly off to a data center. A local LLM runs on your own laptop or phone instead, so your messages don't need to leave your device, and it can work with no internet at all."),
      card("Why small models matter", "The biggest models are far too large for a laptop or phone. But small language models (SLMs) are compact enough to run locally.\n\nThey're fast and handy for focused jobs like sorting text into categories, summarising notes or fixing grammar."),
    ],
    questions: [
      q("What's special about a local LLM?", ["It runs on your own device", "It's always smarter", "It can only speak English", "It lives in a data center"], 0, "Your device does the work, not a distant server."),
      q("Which job suits a small local model?", ["Writing a full novel from a single prompt", "Fixing grammar or summarising your notes", "Replacing a search engine for research", "Training itself on new data overnight"], 1, "Small models are great for focused tasks."),
      q("True or false: a local model needs the internet to answer.", ["True", "False"], 1, "Once it's downloaded, it can run offline."),
    ],
  },
  {
    title: "Reading a model name",
    cards: [
      card("Four parts", "Model names on Hugging Face follow a pattern:\n\n[Creator] / [Model name] - [Size] - [Purpose]\n\nExample: meta-llama/Llama-3-70B-Instruct\n\nmeta-llama is the creator (Meta, the company behind Instagram and Facebook). Llama-3 is the family name. 70B is the size. Instruct is the training type."),
      card("Instruct vs Base", "'Instruct' (or 'Chat') means the model was fine-tuned to follow human directions and chat naturally. A 'Base' model is a raw text-completer, mostly meant for developers to fine-tune.\n\nIf you want to chat, look for Instruct or Chat in the name."),
    ],
    questions: [
      q("In meta-llama/Llama-3-70B-Instruct, who is the creator?", ["Llama", "Instruct", "Meta", "Hugging Face"], 2, "The part before the slash is the creator."),
      q("Which model type is best for chatting?", ["Base", "Instruct", "Raw", "Dataset"], 1, "It's been trained to follow directions."),
      q("What does the 'Base' in a model name suggest?", ["A raw text-completer for developers to fine-tune", "The best and most polished version for beginners", "A tiny model with only a few parameters", "A model that has been tuned for chatting"], 0, "Base models haven't been taught to follow instructions."),
    ],
  },
  {
    title: "Model sizes and experts",
    cards: [
      card("What the B means", "The 'B' stands for billions of parameters: the internal dials and connections a model uses to process data.\n\n8B to 14B: small models. Very fast and often able to run on a laptop or phone.\n\n30B to 70B: medium models. Good reasoning, but they usually need a powerful server or a high-end computer.\n\n70B and up: heavyweights with near-frontier performance, requiring serious hardware."),
      card("Mixture of Experts", "A name like 35B-A3B means a Mixture of Experts (MoE) model. It has 35 billion parameters in total, but only about 3 billion are active for each prompt.\n\nThe result: big-model quality at small-model speed. One catch: you still need enough memory to hold all of the parameters."),
    ],
    questions: [
      q("What does '70B' mean?", ["70 billion parameters", "70 bytes of storage", "70 bots working together", "Version 70 of the model"], 0, "B stands for billions of parameters."),
      q("Which size range is usually a 'small' model for a laptop?", ["8B to 14B", "70B and up", "1,000B", "None"], 0, "Small models can often run locally."),
      q("What does 35B-A3B tell you?", ["It's a MoE: 35B total, about 3B active at a time", "It's 35 times bigger than a 3B model in every way", "It was released in 2035 as a third version", "It answers using only 3 billion words"], 0, "Only part of the model works on each prompt."),
    ],
  },
  {
    title: "Install one and chat offline",
    cards: [
      card("Easy tools", "Apps like Ollama and LM Studio let you download and chat with open models without writing code. Start with a small Instruct model.\n\nAsk a parent or teacher before installing software, and check you have enough memory (RAM) and storage."),
      card("Making models fit", "Models can be shrunk ('quantized') to use less memory, with a small drop in quality. As a rough guide, a small 7B to 8B model often runs fine on a laptop with 16 GB of RAM."),
      card("Try it yourself", "1. Install a local-model app.\n\n2. Download a small Instruct model.\n\n3. Turn off your Wi-Fi.\n\n4. Ask it a question. If it answers, you're running AI entirely on your own computer."),
    ],
    questions: [
      q("Which tools let you run open models on your own computer?", ["Ollama and LM Studio", "Calculator and Clock", "Photoshop only", "Maps"], 0, "They download and run models for you."),
      q("What does 'quantizing' a model do?", ["Makes it use less memory, with a small quality drop", "Makes it smarter by rounding its weights up", "Deletes the parts of the model it doesn't need", "Connects it to the internet so it can look things up"], 0, "It's compression for models."),
      q("How can you prove a model really runs locally?", ["Turn off Wi-Fi and see if it still answers", "Ask it politely whether it is running locally", "Check the colour of the app and its settings", "You can't prove it, you just have to trust it"], 0, "No internet, still working: it's local."),
    ],
  },
  {
    title: "Local vs cloud",
    cards: [
      card("Why choose local", "Privacy: your messages stay on your device.\n\nCost: free to use once it's downloaded.\n\nOffline: works anywhere, even on a plane.\n\nThe trade-off: small models are less capable than the biggest cloud models, and they use your computer's memory, battery and storage."),
      card("Why choose cloud", "The most powerful models live in data centers. You get top performance on hard tasks and nothing to install, but you need the internet, may pay by the token, and your data goes to the company.\n\nMany people use both: local for private or simple jobs, cloud for the hardest ones."),
    ],
    questions: [
      q("Which is a benefit of a local model?", ["It is always the smartest model you can get", "Your messages stay on your device", "It needs no storage space at all to run", "It never makes a mistake when it answers"], 1, "That privacy is the main draw."),
      q("When is a cloud model the better choice?", ["When you are offline on a plane with no Wi-Fi", "When you need top power for a very hard task", "When you want zero data sharing with any company", "When you have no internet and need an answer"], 1, "The biggest models only run in data centers."),
      q("What's a smart way to use both?", ["Local for private or simple jobs, cloud for the hardest ones", "Local for the hardest jobs, cloud for the private ones", "Only use the cloud, and keep the local model as backup", "Only use the local model, and keep the cloud for backup"], 0, "Choose the tool that fits the job."),
    ],
  },
];
