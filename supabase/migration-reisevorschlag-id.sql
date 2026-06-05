-- Uruchom w Supabase SQL Editor (jeśli tabela już istnieje)

alter table public.order_consents
  add column if not exists reisevorschlag_id text;

create index if not exists order_consents_reisevorschlag_id_idx
  on public.order_consents (reisevorschlag_id);
