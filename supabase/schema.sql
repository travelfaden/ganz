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
  consents jsonb not null default '[]'::jsonb,
  stripe_session_id text,
  customer_email text,
  payment_status text not null default 'pending',
  voucher_number text
);

create index if not exists order_consents_consent_id_idx on public.order_consents (consent_id);
create index if not exists order_consents_stripe_session_id_idx on public.order_consents (stripe_session_id);
create index if not exists order_consents_created_at_idx on public.order_consents (created_at desc);

alter table public.order_consents enable row level security;

-- Brak polityk RLS = dostęp tylko przez service_role (Vercel API), nie z przeglądarki klienta.
