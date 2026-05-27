create table if not exists operation_projects (
  id uuid primary key,
  member_id uuid not null references wizard_members(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null default 'Projeto sem nome',
  status text not null default 'active',
  current_module text not null default 'module-1',
  current_stage_key text not null default 'module-1.0',
  project_json jsonb not null default '{}'::jsonb,
  strategic_plan_json jsonb not null default '{}'::jsonb,
  strategic_plan_markdown text not null default ''
);

create index if not exists idx_operation_projects_member on operation_projects (member_id);
create index if not exists idx_operation_projects_updated_at on operation_projects (updated_at desc);

create table if not exists operation_agent_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references operation_projects(id) on delete cascade,
  member_id uuid not null references wizard_members(id) on delete cascade,
  created_at timestamptz not null default now(),
  stage_key text not null,
  agent_id text not null,
  status text not null default 'in_progress',
  user_message text not null,
  assistant_answer text not null default '',
  project_section text,
  transfer_block_json jsonb,
  raw_response_json jsonb not null default '{}'::jsonb,
  openai_response_id text
);

create index if not exists idx_operation_agent_runs_project on operation_agent_runs (project_id, created_at desc);
create index if not exists idx_operation_agent_runs_agent on operation_agent_runs (agent_id);

create table if not exists operation_conversation_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references operation_projects(id) on delete cascade,
  member_id uuid not null references wizard_members(id) on delete cascade,
  created_at timestamptz not null default now(),
  stage_key text not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata_json jsonb not null default '{}'::jsonb
);

create index if not exists idx_operation_messages_project on operation_conversation_messages (project_id, created_at);
