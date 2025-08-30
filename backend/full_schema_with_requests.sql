-- Full schema for E-Certify including verification_requests
create extension if not exists pgcrypto;

create table if not exists public.roles (
  id serial primary key,
  name text not null unique
);

insert into public.roles (name)
select r from (values ('student'),('institution'),('verifier'),('admin')) as t(r)
where not exists (select 1 from public.roles where name = t.r);

create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null unique,
  password text not null,
  role_id int not null references public.roles(id),
  institution_id uuid,
  company_name text,
  metadata jsonb default '{}'::jsonb,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.institutions (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  address text,
  website text,
  contact_email text,
  metadata jsonb default '{}'::jsonb,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Add foreign key constraint only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'fk_users_institution'
      AND tc.table_schema = 'public'
      AND tc.table_name = 'users'
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT fk_users_institution
      FOREIGN KEY (institution_id) REFERENCES public.institutions(id) ON DELETE SET NULL;
  END IF;
END$$;

create table if not exists public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade,
  token text not null,
  device_info text,
  ip inet,
  expires_at timestamptz,
  revoked boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.certificates (
  id uuid default gen_random_uuid() primary key,
  issuer_user_id uuid references public.users(id) on delete restrict,
  issuer_institution_id uuid references public.institutions(id) on delete set null,
  recipient_user_id uuid references public.users(id) on delete set null,
  student_name text,
  student_email text,
  course_name text,
  certificate_type text,
  grade text,
  serial text,
  issue_date timestamptz default now(),
  completion_date timestamptz,
  expires_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  qr_code_url text,
  blockchain_hash text unique,
  ipfs_hash text,
  status text default 'issued',
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  certificate_id uuid references public.certificates(id) on delete cascade,
  tx_hash text not null unique,
  chain text,
  block_number bigint,
  explorer_url text,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.verifications (
  id uuid default gen_random_uuid() primary key,
  certificate_id uuid references public.certificates(id) on delete cascade,
  verifier_user_id uuid references public.users(id) on delete set null,
  result boolean not null,
  details jsonb default '{}'::jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz default now()
);

create table if not exists public.verification_requests (
  id uuid default gen_random_uuid() primary key,
  certificate_id uuid references public.certificates(id) on delete cascade,
  verifier_id uuid references public.users(id) on delete set null,
  student_id uuid references public.users(id) on delete set null,
  status text default 'pending',
  message text,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  actor_user_id uuid references public.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create or replace view public.certificate_summary as
select
  c.id,
  c.student_name,
  c.student_email,
  c.course_name,
  c.certificate_type,
  c.issuer_user_id,
  iu.name as issuer_name,
  c.issuer_institution_id,
  ci.name as issuer_institution_name,
  c.status,
  c.is_verified,
  c.blockchain_hash,
  c.created_at
from public.certificates c
left join public.users iu on iu.id = c.issuer_user_id
left join public.institutions ci on ci.id = c.issuer_institution_id;
