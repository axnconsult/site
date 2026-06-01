create extension if not exists pgcrypto;

create table if not exists site_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_type text not null,
  page text,
  title text,
  interest text,
  offer text,
  name text not null,
  email text not null,
  phone text,
  stage jsonb,
  consent text not null,
  consent_timestamp timestamptz,
  legal_notice_version text,
  tracking_json jsonb,
  raw_payload_json jsonb not null
);

create index if not exists idx_site_leads_created_at on site_leads (created_at desc);
create index if not exists idx_site_leads_email on site_leads (email);
create index if not exists idx_site_leads_offer on site_leads (offer);

create table if not exists consultoria_intake (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text not null,
  company_size text,
  acquisition text not null,
  bottleneck text not null,
  message text,
  consent text not null,
  consent_timestamp timestamptz,
  legal_notice_version text,
  tracking_json jsonb,
  raw_payload_json jsonb not null
);

create index if not exists idx_consultoria_created_at on consultoria_intake (created_at desc);
create index if not exists idx_consultoria_email on consultoria_intake (email);
create index if not exists idx_consultoria_company on consultoria_intake (company);

create table if not exists entrepreneur_profile_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_name text not null,
  lead_email text not null,
  lead_phone text,
  lead_consent text not null,
  lead_consent_timestamp timestamptz,
  legal_notice_version text,
  dominant_operational text not null,
  dominant_motivation text not null,
  dominant_behavior text not null,
  lowest_behavior text,
  composite text,
  result_title text,
  cta_label text,
  cta_href text,
  answers_json jsonb not null,
  tracking_json jsonb,
  raw_payload_json jsonb not null
);

create index if not exists idx_profile_created_at on entrepreneur_profile_results (created_at desc);
create index if not exists idx_profile_email on entrepreneur_profile_results (lead_email);
create index if not exists idx_profile_operational on entrepreneur_profile_results (dominant_operational);

create table if not exists module1_conversations (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  active_workflow_id text,
  status text not null default 'active',
  metadata_json jsonb not null default '{}'::jsonb
);

create table if not exists module1_messages (
  id uuid primary key,
  conversation_id uuid not null references module1_conversations(id) on delete cascade,
  created_at timestamptz not null default now(),
  role text not null check (role in ('user', 'assistant')),
  workflow_id text,
  content text not null
);

create table if not exists module1_transfer_blocks (
  id uuid primary key,
  conversation_id uuid not null references module1_conversations(id) on delete cascade,
  created_at timestamptz not null default now(),
  workflow_id text not null,
  section_title text,
  content text,
  key_points_json jsonb not null default '[]'::jsonb,
  raw_json jsonb not null default '{}'::jsonb
);

create index if not exists idx_module1_conversations_updated_at on module1_conversations (updated_at desc);
create index if not exists idx_module1_messages_conversation_created on module1_messages (conversation_id, created_at);
create index if not exists idx_module1_blocks_conversation_created on module1_transfer_blocks (conversation_id, created_at);