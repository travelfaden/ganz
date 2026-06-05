-- Travel Faden: uruchom w Supabase → SQL Editor → New query → Run

create table if not exists public.order_consents (
  id uuid primary key default gen_random_uuid(),
  consent_id text unique not null,
  created_at timestamptz not null default now(),
  ip_address text,
  user_agent text,
  amount numeric,
  currency text default 'eur',
  product_name text,
  reisevorschlag_id text,
  form_data jsonb,
  consents jsonb not null default '[]'::jsonb,
  stripe_session_id text,
  customer_email text,
  payment_status text not null default 'pending',
  voucher_number text
);

create table if not exists public.order_number_seq (
  id int primary key default 1 check (id = 1),
  last_number int not null default 0
);

insert into public.order_number_seq (id, last_number)
values (1, 0)
on conflict (id) do nothing;

create or replace function public.next_order_number()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  update public.order_number_seq
  set last_number = last_number + 1
  where id = 1
  returning last_number into n;
  return n;
end;
$$;

grant execute on function public.next_order_number() to service_role;

create index if not exists order_consents_consent_id_idx on public.order_consents (consent_id);
create index if not exists order_consents_stripe_session_id_idx on public.order_consents (stripe_session_id);
create index if not exists order_consents_created_at_idx on public.order_consents (created_at desc);

create unique index if not exists order_consents_voucher_number_unique_idx
  on public.order_consents (voucher_number)
  where voucher_number is not null;

alter table public.order_consents enable row level security;

-- Brak polityk RLS = dostęp tylko przez service_role (Vercel API), nie z przeglądarki klienta.
