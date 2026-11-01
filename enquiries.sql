-- Run this once in the Supabase SQL editor.
-- Visitors (anon) can only INSERT. They cannot read, change or delete anything.

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null
    check (char_length(full_name) between 1 and 100),
  email text not null
    check (
      char_length(email) between 5 and 254
      and email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
  business_name text
    check (business_name is null or char_length(business_name) <= 150),
  project_type text not null
    check (project_type in ('design', 'development', 'ecommerce', 'improvements', 'other')),
  message text not null
    check (char_length(message) between 10 and 5000)
);

alter table public.enquiries enable row level security;

-- Start from zero access, then grant only what the form needs.
revoke all on public.enquiries from anon, authenticated;
grant insert on public.enquiries to anon;

drop policy if exists "anon can insert enquiries" on public.enquiries;
create policy "anon can insert enquiries"
  on public.enquiries
  for insert
  to anon
  with check (true); -- the column CHECK constraints above enforce the limits

-- You read enquiries in the Supabase dashboard (Table Editor), which bypasses RLS.
-- No SELECT, UPDATE or DELETE policy exists for anon, so those stay blocked.
