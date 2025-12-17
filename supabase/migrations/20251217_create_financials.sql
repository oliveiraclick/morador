-- Reset Strict (To fix any existing constraints)
drop table if exists public.financial_transactions cascade;
drop type if exists transaction_type cascade;
drop type if exists transaction_status cascade;

-- Re-create Types
create type transaction_type as enum ('in', 'out');
create type transaction_status as enum ('paid', 'pending', 'late');

-- Create Table
create table public.financial_transactions (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    amount numeric(10,2) not null,
    type transaction_type not null, -- 'in' (receivable from pros), 'out' (expenses)
    status transaction_status default 'pending',
    date date not null default CURRENT_DATE,
    
    -- Optional Relation to Profile (Professionals)
    user_id uuid references public.profiles(id),
    
    -- Contact info snapshot (in case profile is deleted or to make it easier to query)
    contact_phone text, 
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.financial_transactions enable row level security;

-- Policies
create policy "Financials are viewable by authenticated users"
on public.financial_transactions for select
to authenticated
using (true);

create policy "Authenticated users can manage financials"
on public.financial_transactions for all
to authenticated
using (true);

-- Seed Data (Professional Context)
insert into public.financial_transactions (title, amount, type, status, date, contact_phone) values
('Mensalidade - Eletricista João', 59.90, 'in', 'paid', CURRENT_DATE, '5511999999999'),
('Manutenção Portão (Despesa)', 450.00, 'out', 'paid', CURRENT_DATE - 5, null),
('Taxa de Destaque - Manicure Ana', 29.90, 'in', 'late', CURRENT_DATE - 10, '5511988888888'),
('Mensalidade - Personal Trainer', 59.90, 'in', 'pending', CURRENT_DATE, '5511977777777');
