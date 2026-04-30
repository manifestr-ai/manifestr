create table folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table vault_items
add column folder_id uuid references folders(id) on delete set null;

CREATE POLICY "Allow insert for authenticated users"
ON folders
FOR INSERT
TO authenticated
WITH CHECK (true);