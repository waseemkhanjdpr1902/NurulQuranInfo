create table if not exists public.quran_reflections (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quran_reflections_user_updated_idx
  on public.quran_reflections (user_id, updated_at desc);

alter table public.quran_reflections enable row level security;

drop policy if exists "Users can read their reflections" on public.quran_reflections;
create policy "Users can read their reflections"
  on public.quran_reflections for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their reflections" on public.quran_reflections;
create policy "Users can create their reflections"
  on public.quran_reflections for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their reflections" on public.quran_reflections;
create policy "Users can update their reflections"
  on public.quran_reflections for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their reflections" on public.quran_reflections;
create policy "Users can delete their reflections"
  on public.quran_reflections for delete
  using (auth.uid() = user_id);
