import { card, q, type Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    title: "Will AI take your job?",
    cards: [
      card("Reshape, not replace", "A 2026 Boston Consulting Group report, cited in our AI Literacy guide, found that 50% to 55% of jobs will be reshaped by AI within two to three years. Only 10% to 15% are at risk of being fully eliminated, and that would take five or more years."),
      card("What reshaping looks like", "The job title stays, but how you do the work changes. A software engineer writes less basic code and spends more time directing AI, checking security and fitting the pieces together.\n\nAutomating a task isn't the same as losing a job. If AI handles 40% of a teacher's paperwork, they get 40% of their time back for students."),
      card("Who's most exposed?", "Entry-level jobs. The routine tasks young people used to do to get a foot in the door are exactly what AI does best.\n\nThe real danger isn't AI replacing you. It's people who know how to use AI replacing people who don't."),
    ],
    questions: [
      q("What share of jobs are expected to be reshaped within a few years?", ["About 5%", "About 95%", "50% to 55%"], 2, "Most jobs will change, but few will vanish entirely."),
      q("Which jobs are most exposed to automation?", ["Entry-level jobs with routine tasks", "Senior roles requiring judgement", "Every job equally", "Jobs that need empathy"], 0, "Routine tasks are what AI handles best."),
      q("What does 'task automation is not job loss' mean?", ["AI leaves every job exactly as it is today, no changes", "Automating tasks can free time for the human parts of a job", "Nobody anywhere will lose a job because of AI", "Tasks get automated, but the work around them stays the same"], 1, "A teacher with less paperwork still teaches."),
    ],
  },
  {
    title: "The hiring paradox",
    cards: [
      card("A battle of the bots", "Applicants use AI to polish their resumes and auto-apply to hundreds of jobs. Companies get thousands of near-identical applications, so HR buys AI to filter them out.\n\nAI writes, AI reads, and people are left out of the loop. (The Atlantic, June 2026)"),
      card("Tinderized and Amazoned", "'Tinderized' hiring: applying to hundreds of jobs with one click.\n\n'Amazoned' applications: everyone uses the same tools, so applications all sound identical and personality is erased.\n\nThe backlash: employers can't tell who's real, so they auto-reject or ignore online applications."),
      card("How to break through", "Skip the algorithm, find the human: message the hiring manager or team directly.\n\nLead with a point of view. Take a stance on the company's product or problem. Algorithms optimise for keywords, not conviction.\n\nApply to fewer jobs, better. Ten researched, tailored applications beat 300 mass-blasted ones."),
    ],
    questions: [
      q("Why do so many applications sound alike?", ["Everyone uses the same AI tools", "Applicants copy each other's names", "Companies write them", "Resumes must be identical"], 0, "Same tools, same patterns, same sound."),
      q("What is 'tinderized' hiring?", ["Hiring someone you matched with on an app", "Applying to hundreds of jobs with one click", "Hiring new staff through social media posts", "Doing job interviews entirely over text"], 1, "Mass-applying has become effortless, so employers get flooded."),
      q("Which approach is the most likely to stand out?", ["Blasting 300 identical applications to every single listing", "Polishing your resume with the same AI as everybody else", "A tailored message to a real person with a clear point of view"], 2, "Quality and humanity signal effort that volume can't fake."),
    ],
  },
  {
    title: "Skills AI can't replace",
    cards: [
      card("Synthesis over production", "AI can write a 2,000-word essay in seconds, so the value of just producing text has crashed.\n\nThe future belongs to people who can read ten AI reports, spot the contradictions, judge what's true and pull out one clear insight. Don't be a generator. Be an editor."),
      card("Empathy and context", "An algorithm can read every book about heartbreak, but it has never had its heart broken. It has no lived experience.\n\nCultural nuance, real stories and understanding why people feel what they feel are skills that need a pulse."),
      card("Structured questioning", "Prompting is the art of framing a problem: setting constraints, giving context and asking precise follow-ups. A lazy question gets a lazy answer.\n\nIn a world where AI knows a lot, the quality of your questions is a superpower."),
    ],
    questions: [
      q("What does 'synthesis over production' mean?", ["Produce as much text as you can, as quickly as you can", "Judge many sources and pull out the core truth", "Avoid using AI, and read the sources yourself", "Memorise the key facts so you can repeat them"], 1, "Making content is cheap now. Making sense of it is valuable."),
      q("Why is empathy hard for AI?", ["It has no lived experience", "It can't read", "It's too slow", "It only works in English"], 0, "It's read about feelings, but never felt them."),
      q("What makes a prompt powerful?", ["Keeping it as short as possible, so nothing gets confused", "Clear framing: context, constraints and precise follow-ups", "Using technical words and long, detailed sentences", "Typing fast and asking several questions in one go"], 1, "Good questions come from clear thinking."),
    ],
  },
  {
    title: "Where your tokens go",
    cards: [
      card("Off to the data center", "When you hit enter, your message isn't processed on your phone or laptop. It travels over the internet to a data center: a huge warehouse of powerful computers where the AI model lives.\n\nIt can be hundreds or thousands of miles away. The chips predict your answer token by token and send it back, all in a few seconds."),
      card("GPUs", "GPUs (graphics processing units) run thousands of calculations at the same time, which is perfect for the vector maths behind tokens.\n\nDemand is so high that chips are scarce. CBS News reported in 2026 that the shortage has pushed Apple and Microsoft to raise prices on products like iPads and Xbox consoles."),
      card("Big buildings, big bills", "Some data centers are the size of several football fields. They use huge amounts of electricity, plus water for cooling, because thousands of chips running at once make a lot of heat."),
    ],
    questions: [
      q("Where is your message processed?", ["On your phone", "In a data center", "In your Wi-Fi router", "Inside your browser"], 1, "The model is far too big to run on a phone."),
      q("Why do AI data centers rely on GPUs?", ["They run thousands of calculations in parallel", "They are much cheaper than ordinary processors", "They store the training photos in a compact format", "They keep each chat private from the other users"], 0, "Parallel maths is exactly what token processing needs."),
      q("Why do data centers need so much cooling?", ["Thousands of chips running at once produce a lot of heat", "The buildings are in hot countries, so summers are long", "Cool air keeps the stored chats fresh and readable", "The fans make the servers run faster and quieter"], 0, "Heat has to go somewhere, and cooling uses water and power."),
    ],
  },
  {
    title: "AI, water and power",
    cards: [
      card("Thirsty, hungry chips", "Traditional data centers act like giant evaporative coolers, using millions of gallons of fresh water. Most electricity still comes from fossil fuels, so heavy energy use means carbon emissions.\n\nAI chips pack far more power into the same space than older hardware, so the footprint is growing faster than ever."),
      card("Fact-check a claim", "Microsoft's CEO Satya Nadella said the company's newest AI data centers use about as much water per year as a local restaurant. Does that hold up? Somewhat.\n\nIt's true for Microsoft's new closed-loop liquid cooling. Like a car radiator, the water is sealed in pipes and recirculated over and over, instead of being constantly evaporated."),
      card("The catch", "Without evaporation, you need big fans and chillers, which use more electricity. Google, Amazon and Meta are switching to similar designs, but hundreds of older data centers still use high-water cooling.\n\nSo 'somewhat' is the honest answer: true for the new design, not for the whole industry. Always ask what a claim covers."),
    ],
    questions: [
      q("What is closed-loop liquid cooling?", ["Water is sealed in pipes and recirculated", "Water is poured over the chips and left to dry", "Chips are packed in ice cubes inside the rack", "A single fan blows cool air over the building"], 0, "Like a car radiator, it reuses the same water."),
      q("What is the 'water vs electricity' dilemma?", ["Saving water can mean using more electricity for fans and chillers", "Saving electricity always means saving a matching amount of water too", "Cooling a data center costs nothing but a little water", "Chips need water, but they never need electricity"], 0, "Cooling without evaporation takes more power."),
      q("Why is the restaurant claim only 'somewhat' true?", ["It's completely false, data centers use no water at all", "It applies to the newest design, not to every data center", "It's true, but restaurants use far more water than that", "It's out of date, nobody has checked those numbers"], 1, "Many older data centers still use traditional, thirstier cooling."),
    ],
  },
];
