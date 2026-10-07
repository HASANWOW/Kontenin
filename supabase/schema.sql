-- Kontenin database schema (Supabase / Postgres)
-- Mirrors types/database.ts. Run in the Supabase SQL editor or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------- Users & profiles ----------

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  username text not null unique,
  avatar_url text,
  bio text,
  xp integer not null default 0,
  level integer not null default 1,
  streak_days integer not null default 0,
  last_active_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.creator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  platforms text[] not null default '{}',
  niche text not null,
  custom_niche text,
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  challenge text not null,
  goal text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Learning ----------

create table if not exists public.courses (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer not null,
  instructor_name text not null,
  rating numeric(2, 1) not null default 0,
  cover_hue integer not null default 262,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id text primary key,
  course_id text not null references public.courses (id) on delete cascade,
  position integer not null,
  title text not null,
  duration_minutes integer not null,
  video_url text,
  content jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique (course_id, position)
);

create table if not exists public.lesson_progress (
  user_id uuid not null references public.users (id) on delete cascade,
  lesson_id text not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  quiz_score integer,
  primary key (user_id, lesson_id)
);

-- ---------- Missions ----------

create table if not exists public.missions (
  id text primary key,
  number integer not null unique,
  title text not null,
  objective text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_minutes integer not null,
  xp_reward integer not null,
  evaluator text not null,
  content jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.mission_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  mission_id text not null references public.missions (id) on delete cascade,
  answer text not null,
  score integer not null check (score between 0 and 100),
  feedback jsonb not null default '{}',
  source text not null check (source in ('ai', 'demo')),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists mission_submissions_user_idx on public.mission_submissions (user_id, created_at desc);

-- ---------- Creation ----------

create table if not exists public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  hook text not null,
  angle text not null,
  format text not null,
  duration text not null,
  difficulty text not null,
  cta text not null,
  niche text not null,
  platform text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  topic text not null,
  platform text not null,
  sections jsonb not null,
  word_count integer not null,
  estimated_seconds integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  file_name text not null,
  source_url text,
  storage_path text,
  duration_seconds numeric,
  provider text not null check (provider in ('demo', 'wayinvideo')),
  provider_job_id text,
  status text not null default 'uploaded' check (status in ('uploaded', 'processing', 'ready', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists public.content_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  idea_id uuid references public.content_ideas (id) on delete set null,
  script_id uuid references public.scripts (id) on delete set null,
  video_id uuid references public.videos (id) on delete set null,
  status text not null default 'idea' check (status in ('idea', 'planned', 'draft', 'ready', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists public.video_analysis (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos (id) on delete cascade,
  overall integer not null,
  scores jsonb not null,
  feedback text not null,
  recommendations text[] not null default '{}',
  source text not null check (source in ('ai', 'demo')),
  created_at timestamptz not null default now()
);

create table if not exists public.video_clips (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos (id) on delete cascade,
  title text not null,
  start_seconds numeric not null,
  end_seconds numeric not null check (end_seconds > start_seconds),
  viral_score integer not null,
  platforms text[] not null default '{}',
  saved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.transcripts (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null unique references public.videos (id) on delete cascade,
  segments jsonb not null,
  language text not null default 'id',
  source text not null check (source in ('ai', 'demo')),
  created_at timestamptz not null default now()
);

-- ---------- Planning & analytics ----------

create table if not exists public.planner_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  platform text not null,
  type text not null check (type in ('video', 'post', 'story', 'live')),
  status text not null check (status in ('idea', 'planned', 'draft', 'ready', 'published')),
  scheduled_for date not null,
  notes text,
  color text not null default 'violet',
  created_at timestamptz not null default now()
);
create index if not exists planner_items_user_date_idx on public.planner_items (user_id, scheduled_for);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  content_id uuid references public.content_projects (id) on delete set null,
  date date not null,
  platform text not null,
  views integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  followers_gained integer not null default 0,
  avg_watch_seconds numeric not null default 0
);
create index if not exists analytics_user_date_idx on public.analytics (user_id, date);

-- ---------- Gamification & notifications ----------

create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null,
  xp_reward integer not null default 0
);

create table if not exists public.user_achievements (
  user_id uuid not null references public.users (id) on delete cascade,
  achievement_id text not null references public.achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  body text not null,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
-- Users can only read and write their own rows. Catalog tables are read-only for everyone signed in.

do $$
declare t text;
begin
  foreach t in array array[
    'creator_profiles', 'lesson_progress', 'mission_submissions', 'content_ideas', 'scripts',
    'content_projects', 'videos', 'planner_items', 'analytics', 'user_achievements', 'notifications'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format('create policy "own rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;

  foreach t in array array['courses', 'lessons', 'missions', 'achievements'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "read catalog" on public.%I', t);
    execute format('create policy "read catalog" on public.%I for select using (auth.role() = ''authenticated'')', t);
  end loop;
end $$;

alter table public.users enable row level security;
drop policy if exists "own profile" on public.users;
create policy "own profile" on public.users for all using (auth.uid() = id) with check (auth.uid() = id);

-- Video child tables inherit access through their parent video.
do $$
declare t text;
begin
  foreach t in array array['video_analysis', 'video_clips', 'transcripts'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "via video" on public.%I', t);
    execute format(
      'create policy "via video" on public.%I for all using (exists (select 1 from public.videos v where v.id = video_id and v.user_id = auth.uid()))',
      t
    );
  end loop;
end $$;

-- Create a public.users row when someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, full_name, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9_.]', '', 'g')) || '_' || substr(new.id::text, 1, 4)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
