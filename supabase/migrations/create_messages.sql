-- Create messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_id uuid references auth.users(id) not null,
  receiver_id uuid references auth.users(id), -- Nullable for now if we don't always have a clear receiver ID in the demo flow
  content text not null,
  product_context text, -- Optional: "Bicicleta", "Serviço de Limpeza"
  read boolean default false
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies
create policy "Users can read messages involved in"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);
