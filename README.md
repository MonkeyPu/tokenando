# Tokenando Junior

1. Create a Supabase project, run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in the URL and anon key.
3. `npm install && npm run dev`
4. Deploy: push to GitHub, import in Vercel, add the same two env vars.

Course titles and lessons live in `lib/courses.ts`.

## Assistant and mascot

- Looks, personalities and the mascot animations work without any API key (`lib/assistant.ts`, `components/Mascot.tsx`).
- Run `supabase/assistant_setup.sql` once in the Supabase SQL editor. It adds one column and some ready-made FAQ answers.
- When you have an API key, add `ANTHROPIC_API_KEY` in Vercel (Settings, Environment Variables) and redeploy. That switches on the AI answers in "Ask" and the custom look creator in Profile.
