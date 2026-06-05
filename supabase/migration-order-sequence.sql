-- Uruchom w Supabase SQL Editor (po order_consents)

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

create unique index if not exists order_consents_voucher_number_unique_idx
  on public.order_consents (voucher_number)
  where voucher_number is not null;
