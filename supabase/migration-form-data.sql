-- Uruchom w Supabase SQL Editor

alter table public.order_consents
  add column if not exists form_data jsonb;
