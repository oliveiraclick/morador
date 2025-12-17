-- Part 1: Start with this command
alter table public.condos 
add column if not exists require_approval boolean default true;
