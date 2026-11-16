import { card, q, type Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    title: "Write a good prompt",
    cards: [
      card("A lazy question gets a lazy answer", "AI mirrors the quality of your question. 'Tell me about World War 1' gets a generic summary. A strong prompt gives the AI context, a job, and limits.\n\nLearning to ask precise questions is really learning to think clearly about a problem."),
      card("Four ingredients", "Context: who you are and what it's for.\n\nTask: exactly what you want.\n\nConstraints: length, tone, format.\n\nFollow-ups: dig deeper with precise questions.\n\nExample: 'I'm in Year 10 studying the causes of WW1. Explain the alliance system in 150 words, then give me 3 quiz questions.'"),
    ],
    questions: [
      q("Which prompt will probably get the best answer?", ["Tell me about WW1", "WW1 causes?? quick", "I'm in Year 10 studying the causes of WW1. Explain the alliance system in 150 words, then quiz me with 3 questions.", "Explain WW1"], 2, "It has context, a task and constraints."),
      q("What is a 'constraint' in a prompt?", ["A mistake in your spelling", "A limit such as length, tone or format", "A picture you attach", "A password"], 1, "Constraints narrow the answer so it fits what you need."),
      q("The first answer isn't quite right. What's the best next move?", ["Give up", "Type the same thing again", "Ask a precise follow-up", "Switch to a different subject"], 2, "Follow-ups that say what to change are how you steer the AI."),
    ],
  },
  {
    title: "Check the answer",
    cards: [
      card("Confident, not careful", "AI aims for fluent, confident writing, not historical accuracy. So a fake citation or a false link between two ideas arrives with exactly the same confidence as a true one.\n\nRemember: it's predicting plausible text."),
      card("Treat it as a hypothesis", "You have a choice. Accept outputs blindly and risk errors, or treat the answer as a first guess that needs checking.\n\nTry this: pick the two or three claims that matter, search for them on reliable sites, and check that any source the AI gives you actually exists and really says that."),
    ],
    questions: [
      q("A chatbot gives you a quote and a source. What should you do?", ["Use it, it sounds right", "Ask the chatbot if it's sure, then trust it", "Check the source exists and says that", "Delete the chat"], 2, "Fake sources are a classic hallucination. The chatbot can't reliably check itself."),
      q("Why do false claims sound just as sure as true ones?", ["The AI is lying on purpose", "The AI is built to produce fluent text, not to verify facts", "The AI always knows when it's wrong"], 1, "Fluency and accuracy are different things."),
      q("What's the best way to treat an AI answer?", ["As a first hypothesis to test", "As final truth", "As a secret", "As a joke"], 0, "Useful starting point, then verify."),
    ],
  },
  {
    title: "Keep your info private",
    cards: [
      card("Your messages leave your device", "When you hit enter, your message travels to a company's data center. Depending on the service and its settings, chats may be stored or used to improve the AI.\n\nSo don't paste anything you wouldn't want out of your control."),
      card("What to keep out", "Keep out: your full name with address, school, passwords, ID numbers, photos or private stories about other people.\n\nSwap in general details ('a friend', 'my school') and check the app's privacy settings. If you're unsure, ask a parent or teacher. Running a model locally keeps everything on your own computer."),
    ],
    questions: [
      q("Which is safest to paste into a chatbot?", ["Your password", "Your home address", "A paragraph from your essay with names removed", "A friend's private message"], 2, "No personal details and nothing that belongs to someone else."),
      q("Why should you be careful about what you type?", ["Chatbots gossip with each other", "Typing is slow", "It uses up letters", "Your message goes to company servers and may be stored"], 3, "Treat a chatbot like a public space, not a diary."),
      q("True or false: if a chat feels private, it's guaranteed to be private.", ["True", "False"], 1, "How it feels says nothing about how data is stored. Check the settings."),
    ],
  },
  {
    title: "Give credit",
    cards: [
      card("Autopilot or co-pilot?", "Autopilot: you hand over the decision, trust the output blindly and never use your own judgment.\n\nCo-pilot: you're still flying the plane. The AI gives you a draft, an angle or a starting point, and you decide whether it's right, good, and really you."),
      card("Say when you used it", "How much AI is acceptable depends on your school and teacher, and it isn't always clear. But being open about it is the safe habit.\n\nExample: 'I used AI to brainstorm the structure, then wrote the essay myself.' If you're not sure what's allowed, ask before you submit."),
    ],
    questions: [
      q("Which is the co-pilot approach?", ["Paste the question and submit the AI's answer", "Let the AI decide your opinion", "Have AI write it all, then change a few words", "Write your own essay, then ask AI for feedback"], 3, "You stay in charge of the thinking and the decisions."),
      q("Which disclosure is honest and clear?", ["I used AI to brainstorm the structure, then wrote the essay myself.", "AI helped somehow.", "I wrote it all, trust me."], 0, "It says what the AI did and what you did."),
      q("What should you do if you're unsure whether AI is allowed?", ["Guess", "Ask your teacher first", "Hide it", "Hope for the best"], 1, "Rules differ. Asking beforehand protects you."),
    ],
  },
  {
    title: "When not to use AI",
    cards: [
      card("Mental effort builds skill", "Drafting forces your brain to turn messy thoughts into clear logic. If AI writes the first draft and you only edit it, you skip the hardest and most valuable part of thinking.\n\nResearchers call heavy over-reliance 'cognitive offloading'."),
      card("What the evidence suggests", "A 2026 MIT study cited in our AI Literacy guide tracked people using AI to spot online misinformation. With the tool they did 21% better, but after four weeks their unassisted score was 15.3% worse. They had stopped practising their own skepticism.\n\nA related risk is 'digital amnesia': mistaking the AI's knowledge for your own."),
      card("A good rule", "Use AI to go further, not to skip the learning. When you're trying to build a skill, try it yourself first, then ask AI to critique your attempt."),
    ],
    questions: [
      q("In the MIT study, what happened after four weeks?", ["Everyone became experts", "Unassisted misinformation-spotting got worse", "The AI stopped working", "Nothing changed"], 1, "They did better with the tool but worse without it."),
      q("Why is the 'first-draft trap' a problem?", ["Drafts are too long", "AI can't write drafts", "You skip the thinking that organises your ideas", "Drafts cost money"], 2, "Struggling with a draft is how you learn to reason."),
      q("Which use keeps your brain working?", ["Ask AI to do it all", "Copy the answer", "Try it yourself first, then ask AI to critique your attempt", "Let AI choose your topic"], 2, "You do the thinking, the AI gives feedback."),
    ],
  },
];
