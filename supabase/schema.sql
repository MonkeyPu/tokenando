-- Run in the Supabase SQL editor.

-- One row per user: assistant settings + streak.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  assistant_name text default 'Tok',
  assistant_personality text default 'friendly', -- a preset id, or 'custom'
  assistant_personality_custom text, -- the student's own description
  assistant_look jsonb default '{}', -- { preset, custom, description }
  voice_enabled boolean default false,
  streak_count int default 0,
  last_active date
);

-- Progress per lesson. Skipped lessons still count as done.
create table public.lesson_progress (
  user_id uuid references auth.users on delete cascade,
  course_slug text,
  lesson_index int,
  status text check (status in ('done', 'skipped')),
  updated_at timestamptz default now(),
  primary key (user_id, course_slug, lesson_index)
);

-- Preloaded answers checked before any AI call.
create table public.faq (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null,
  course_slug text
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.faq enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own progress" on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "faq is public" on public.faq for select using (true);

-- Create a profile row when someone signs up.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();
