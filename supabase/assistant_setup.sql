-- Run once in the Supabase SQL editor. Safe to run before the API key exists.

-- 1. Room for the student's own personality description.
alter table public.profiles add column if not exists assistant_personality_custom text;

-- 2. Ready-made answers. The assistant checks these before it ever calls the AI.
insert into public.faq (question, answer, course_slug) values
  ('What is a token?', 'A token is a small chunk of text, like a short word or a piece of a longer one. AI reads and writes in tokens. About 750 words is roughly 1,000 tokens.', 'tokens'),
  ('What is an LLM?', 'LLM stands for large language model. It is a program trained on huge amounts of text that predicts the most likely next piece of text, over and over, to write answers.', 'what-is-ai'),
  ('What is a hallucination?', 'A hallucination is when an AI gives a confident answer that is made up or wrong, like inventing a book that does not exist. It happens because the AI generates likely-sounding text instead of looking facts up.', 'what-is-ai'),
  ('How many r''s are in strawberry?', 'There are 3. Some AIs get it wrong because they see the word as tokens like "straw" and "berry" instead of single letters.', 'tokens'),
  ('What is a context window?', 'The context window is the most tokens an AI can handle at once, including your whole chat so far. If a chat gets too long, older messages can be dropped or summarised.', 'tokens'),
  ('What is a vector or embedding?', 'A vector (or embedding) is a list of numbers that places a token on a map of meaning. Words used in similar ways end up close together on that map.', 'tokens'),
  ('What do AI detectors do?', 'AI detectors guess the probability that a machine wrote a text, using things like how predictable the words are. They can be wrong, so a score is never proof.', 'school-and-honesty'),
  ('What does 70B mean in a model name?', 'The B means billions of parameters, the internal dials a model uses. 70B means 70 billion. Bigger usually means more capable but needs more powerful hardware.', 'local-llms'),
  ('What is the difference between Instruct and Base models?', 'An Instruct (or Chat) model has been trained to follow directions and chat. A Base model is a raw text-completer, mostly meant for developers to fine-tune.', 'local-llms'),
  ('What is a data center?', 'A data center is a huge building full of powerful computers. When you send a message to an AI, it is processed there and the answer is sent back to you.', 'effects'),
  ('Will AI take my job?', 'Most experts expect AI to reshape far more jobs than it replaces. Routine entry-level tasks are the most exposed, so skills like judgement, empathy and asking good questions matter.', 'effects'),
  ('Can I trust AI answers?', 'Not blindly. AI sounds confident even when it is wrong. Treat answers as a first guess, and check the important claims and any sources it gives you.', 'use-it-well');
