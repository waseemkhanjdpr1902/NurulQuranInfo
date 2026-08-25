create table if not exists public.quran_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb check (octet_length(payload::text) <= 1048576),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quran_user_data enable row level security;

drop policy if exists "Users can read their Quran journey" on public.quran_user_data;
create policy "Users can read their Quran journey"
  on public.quran_user_data for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their Quran journey" on public.quran_user_data;
create policy "Users can create their Quran journey"
  on public.quran_user_data for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their Quran journey" on public.quran_user_data;
create policy "Users can update their Quran journey"
  on public.quran_user_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their Quran journey" on public.quran_user_data;
create policy "Users can delete their Quran journey"
  on public.quran_user_data for delete
  using (auth.uid() = user_id);

revoke all on public.quran_user_data from anon;
grant select, insert, update, delete on public.quran_user_data to authenticated;
