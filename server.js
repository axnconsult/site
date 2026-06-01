import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import crypto from "node:crypto";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { runOperationAgentTurn } from "./server/operation-agents.js";

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "app");
const port = Number(process.env.PORT || 80);
const maxBodyBytes = Number(process.env.MAX_BODY_BYTES || 1024 * 1024);

let pool;
let operationalTablesReady = false;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

const routes = new Map([
  ["/api/leads", handleLead],
  ["/api/consultoria", handleConsultoria],
  ["/api/perfil", handleProfile],
  ["/api/members/register", handleMemberRegister],
  ["/api/members/login", handleMemberLogin],
  ["/api/members/session", handleMemberSession],
  ["/api/operation/assistant", handleOperationAssistant],
  ["/api/wizard/load", handleWizardLoad],
  ["/api/wizard/save", handleWizardSave],
  ["/api/wizard/ask", handleWizardAsk]
]);

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (request.method === "GET" && url.pathname === "/health") {
      return sendText(response, 200, "ok");
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      return handleApiHealth(response);
    }

    if (request.method === "OPTIONS" && routes.has(url.pathname)) {
      return sendJson(response, 204, null);
    }

    if (request.method === "POST" && routes.has(url.pathname)) {
      const payload = await readJsonBody(request);
      const result = await routes.get(url.pathname)(payload);
      return sendJson(response, 200, result);
    }

    if (request.method === "GET" || request.method === "HEAD") {
      return serveStatic(url.pathname, request, response);
    }

    return sendJson(response, 405, { ok: false, error: "method_not_allowed" });
  } catch (error) {
    if (error.statusCode) {
      return sendJson(response, error.statusCode, { ok: false, error: error.code || "bad_request" });
    }

    console.error("Unhandled request error", error);
    return sendJson(response, 500, { ok: false, error: "internal_error" });
  }
});

server.listen(port, () => {
  console.log(`Axon site listening on :${port}`);
});

async function handleApiHealth(response) {
  try {
    await query("select 1");
    return sendJson(response, 200, { ok: true, database: "ok" });
  } catch (error) {
    console.error("Database healthcheck failed", error);
    return sendJson(response, 503, { ok: false, database: "unavailable" });
  }
}

async function handleLead(payload) {
  requireFields(payload, ["name", "email", "consent"]);
  requireGrantedConsent(payload.consent);

  const sql = `
    insert into site_leads (
      created_at,
      form_type,
      page,
      title,
      interest,
      offer,
      name,
      email,
      phone,
      stage,
      consent,
      consent_timestamp,
      legal_notice_version,
      tracking_json,
      raw_payload_json
    ) values (
      coalesce($1::timestamptz, now()),
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10::jsonb,
      $11,
      $12::timestamptz,
      $13,
      $14::jsonb,
      $15::jsonb
    )
    returning id
  `;

  const values = [
    nullableDate(payload.createdAt),
    payload.formType || "lead",
    nullableText(payload.page),
    nullableText(payload.title),
    nullableText(payload.interest),
    nullableText(payload.offer),
    payload.name,
    payload.email,
    nullableText(payload.phone),
    jsonValue(payload.stage ?? null),
    payload.consent,
    nullableDate(payload.consentTimestamp),
    nullableText(payload.legalNoticeVersion),
    jsonValue(payload.tracking ?? null),
    jsonValue(payload)
  ];

  const result = await query(sql, values);
  await notifyN8n("lead", payload);
  return { ok: true, id: result.rows[0].id };
}

async function handleConsultoria(payload) {
  requireFields(payload, ["name", "email", "company", "acquisition", "bottleneck", "consent"]);
  requireGrantedConsent(payload.consent);

  const sql = `
    insert into consultoria_intake (
      created_at,
      name,
      email,
      company,
      company_size,
      acquisition,
      bottleneck,
      message,
      consent,
      consent_timestamp,
      legal_notice_version,
      tracking_json,
      raw_payload_json
    ) values (
      coalesce($1::timestamptz, now()),
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10::timestamptz,
      $11,
      $12::jsonb,
      $13::jsonb
    )
    returning id
  `;

  const values = [
    nullableDate(payload.createdAt),
    payload.name,
    payload.email,
    payload.company,
    nullableText(payload.company_size),
    payload.acquisition,
    payload.bottleneck,
    nullableText(payload.message),
    payload.consent,
    nullableDate(payload.consentTimestamp),
    nullableText(payload.legalNoticeVersion),
    jsonValue(payload.tracking ?? null),
    jsonValue(payload)
  ];

  const result = await query(sql, values);
  await notifyN8n("consultoria", payload);
  return { ok: true, id: result.rows[0].id };
}

async function handleProfile(payload) {
  requireFields(payload, ["lead", "answers", "result"]);
  requireFields(payload.lead, ["name", "email", "consent"]);
  requireGrantedConsent(payload.lead.consent);

  const resultPayload = payload.result;
  requireFields(resultPayload, ["dominantOperational", "dominantMotivation", "dominantBehavior"]);

  const sql = `
    insert into entrepreneur_profile_results (
      created_at,
      lead_name,
      lead_email,
      lead_phone,
      lead_consent,
      lead_consent_timestamp,
      legal_notice_version,
      dominant_operational,
      dominant_motivation,
      dominant_behavior,
      lowest_behavior,
      composite,
      result_title,
      cta_label,
      cta_href,
      answers_json,
      tracking_json,
      raw_payload_json
    ) values (
      coalesce($1::timestamptz, now()),
      $2,
      $3,
      $4,
      $5,
      $6::timestamptz,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13,
      $14,
      $15,
      $16::jsonb,
      $17::jsonb,
      $18::jsonb
    )
    returning id
  `;

  const values = [
    nullableDate(payload.createdAt),
    payload.lead.name,
    payload.lead.email,
    nullableText(payload.lead.phone),
    payload.lead.consent,
    nullableDate(payload.lead.consentTimestamp),
    nullableText(payload.lead.legalNoticeVersion),
    resultPayload.dominantOperational,
    resultPayload.dominantMotivation,
    resultPayload.dominantBehavior,
    nullableText(resultPayload.lowestBehavior),
    nullableText(resultPayload.composite),
    nullableText(resultPayload.title),
    nullableText(resultPayload.ctaLabel),
    nullableText(resultPayload.ctaHref),
    jsonValue(payload.answers),
    jsonValue(payload.lead.tracking ?? payload.tracking ?? null),
    jsonValue(payload)
  ];

  const result = await query(sql, values);
  await notifyN8n("perfil", payload);
  return { ok: true, id: result.rows[0].id };
}

async function handleMemberRegister(payload) {
  await ensureOperationalTables();
  requireFields(payload, ["name", "email", "password"]);
  requirePassword(payload.password);

  const email = normalizeEmail(payload.email);
  const existing = await query("select id from wizard_members where email = $1", [email]);
  if (existing.rowCount > 0) {
    throw httpError(409, "member_already_exists");
  }

  const { hash, salt } = hashPassword(payload.password);
  const sql = `
    insert into wizard_members (name, email, password_hash, password_salt)
    values ($1, $2, $3, $4)
    returning id, name, email, created_at
  `;

  const result = await query(sql, [payload.name, email, hash, salt]);
  const member = result.rows[0];
  return {
    ok: true,
    token: await createMemberSession(member.id),
    member,
    state: defaultWizardState()
  };
}

async function handleMemberLogin(payload) {
  await ensureOperationalTables();
  requireFields(payload, ["email", "password"]);
  const email = normalizeEmail(payload.email);

  const result = await query(
    "select id, name, email, password_hash, password_salt, created_at from wizard_members where email = $1",
    [email]
  );

  const member = result.rows[0];
  if (!member || !verifyPassword(payload.password, member.password_salt, member.password_hash)) {
    throw httpError(401, "invalid_credentials");
  }

  return {
    ok: true,
    token: await createMemberSession(member.id),
    member: publicMember(member),
    state: await loadWizardState(member.id)
  };
}

async function handleMemberSession(payload) {
  await ensureOperationalTables();
  const member = await getAuthenticatedMember(payload);
  return {
    ok: true,
    member,
    state: await loadWizardState(member.id)
  };
}

async function handleOperationAssistant(payload) {
  await ensureOperationalTables();
  const member = await getAuthenticatedMember(payload);
  requireFields(payload, ["message", "module", "stage", "stageKey", "project"]);

  try {
    return await runOperationAgentTurn({
      rootDir: __dirname,
      query,
      member,
      payload
    });
  } catch (error) {
    console.warn("operation assistant failed", error);
    return {
      ok: false,
      error: "operation_assistant_failed",
      answer: "Nao consegui acionar o assistente agora. O app esta no ar, mas o servico de IA falhou nesta tentativa. Confira os logs da stack."
    };
  }
}

async function handleWizardLoad(payload) {
  await ensureOperationalTables();
  const member = await getAuthenticatedMember(payload);
  return {
    ok: true,
    member,
    state: await loadWizardState(member.id)
  };
}

async function handleWizardSave(payload) {
  await ensureOperationalTables();
  const member = await getAuthenticatedMember(payload);
  requireFields(payload, ["state"]);

  const state = sanitizeWizardState(payload.state);
  const sql = `
    insert into wizard_progress (
      member_id,
      project_json,
      current_step,
      completed_steps_json,
      checklist_json,
      current_module,
      current_lesson,
      updated_at
    ) values ($1, $2::jsonb, $3, $4::jsonb, $5::jsonb, $6, $7, now())
    on conflict (member_id) do update set
      project_json = excluded.project_json,
      current_step = excluded.current_step,
      completed_steps_json = excluded.completed_steps_json,
      checklist_json = excluded.checklist_json,
      current_module = excluded.current_module,
      current_lesson = excluded.current_lesson,
      updated_at = now()
  `;

  await query(sql, [
    member.id,
    jsonValue(state.project),
    state.currentStep,
    jsonValue(state.completedSteps),
    jsonValue(state.checklist),
    state.currentModule,
    state.currentLesson
  ]);

  return { ok: true, state };
}

async function handleWizardAsk(payload) {
  await ensureOperationalTables();
  await getAuthenticatedMember(payload);
  requireFields(payload, ["stepTitle", "question"]);

  const answer = buildWizardAnswer(payload.stepTitle, payload.question, payload.context);
  return { ok: true, answer };
}

async function getAuthenticatedMember(payload) {
  await ensureOperationalTables();
  const token = payload?.token;
  if (!token) {
    throw httpError(401, "missing_token");
  }

  const tokenHash = hashToken(token);
  const result = await query(
    `
      select m.id, m.name, m.email, m.created_at
      from wizard_member_sessions s
      join wizard_members m on m.id = s.member_id
      where s.token_hash = $1 and s.expires_at > now()
    `,
    [tokenHash]
  );

  const member = result.rows[0];
  if (!member) {
    throw httpError(401, "invalid_token");
  }

  return publicMember(member);
}

async function ensureOperationalTables() {
  if (operationalTablesReady) {
    return;
  }

  await query("create extension if not exists pgcrypto");

  await query(`
    create table if not exists wizard_members (
      id uuid primary key default gen_random_uuid(),
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      name text not null,
      email text not null unique,
      password_hash text not null,
      password_salt text not null
    )
  `);

  await query("create index if not exists idx_wizard_members_email on wizard_members (email)");

  await query(`
    create table if not exists wizard_member_sessions (
      id uuid primary key default gen_random_uuid(),
      created_at timestamptz not null default now(),
      member_id uuid not null references wizard_members(id) on delete cascade,
      token_hash text not null unique,
      expires_at timestamptz not null
    )
  `);

  await query("create index if not exists idx_wizard_sessions_member on wizard_member_sessions (member_id)");
  await query("create index if not exists idx_wizard_sessions_expires_at on wizard_member_sessions (expires_at)");

  await query(`
    create table if not exists wizard_progress (
      member_id uuid primary key references wizard_members(id) on delete cascade,
      updated_at timestamptz not null default now(),
      project_json jsonb not null default '{}'::jsonb,
      current_step text not null default 'domain',
      current_module text not null default 'module-1',
      current_lesson text not null default 'module-1.0',
      completed_steps_json jsonb not null default '[]'::jsonb,
      checklist_json jsonb not null default '{}'::jsonb
    )
  `);

  await query("create index if not exists idx_wizard_progress_updated_at on wizard_progress (updated_at desc)");

  await query(`
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
    )
  `);

  await query("create index if not exists idx_operation_projects_member on operation_projects (member_id)");
  await query("create index if not exists idx_operation_projects_updated_at on operation_projects (updated_at desc)");

  await query(`
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
    )
  `);

  await query("create index if not exists idx_operation_agent_runs_project on operation_agent_runs (project_id, created_at desc)");
  await query("create index if not exists idx_operation_agent_runs_agent on operation_agent_runs (agent_id)");

  await query(`
    create table if not exists operation_conversation_messages (
      id uuid primary key default gen_random_uuid(),
      project_id uuid not null references operation_projects(id) on delete cascade,
      member_id uuid not null references wizard_members(id) on delete cascade,
      created_at timestamptz not null default now(),
      stage_key text not null,
      role text not null check (role in ('user', 'assistant', 'system')),
      content text not null,
      metadata_json jsonb not null default '{}'::jsonb
    )
  `);

  await query("create index if not exists idx_operation_messages_project on operation_conversation_messages (project_id, created_at)");
  operationalTablesReady = true;
}

async function createMemberSession(memberId) {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const ttlMs = Number(process.env.MEMBER_TOKEN_TTL_MS || 1000 * 60 * 60 * 24 * 14);
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();

  await query(
    "insert into wizard_member_sessions (member_id, token_hash, expires_at) values ($1, $2, $3::timestamptz)",
    [memberId, tokenHash, expiresAt]
  );

  return token;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

async function loadWizardState(memberId) {
  const result = await query(
    `
      select project_json, current_step, completed_steps_json, checklist_json, current_module, current_lesson, updated_at
      from wizard_progress
      where member_id = $1
    `,
    [memberId]
  );

  const row = result.rows[0];
  if (!row) {
    return defaultWizardState();
  }

  return sanitizeWizardState({
    project: row.project_json,
    currentStep: row.current_step,
    completedSteps: row.completed_steps_json,
    checklist: row.checklist_json,
    currentModule: row.current_module,
    currentLesson: row.current_lesson,
    updatedAt: row.updated_at
  });
}

function defaultWizardState() {
  return {
    project: {
      id: "",
      name: "",
      domain: "",
      serverIp: "",
      technicalEmail: "",
      hostName: "manager01",
      siteImage: "ghcr.io/axnconsult/site:main"
    },
    currentStep: "domain",
    currentModule: "module-1",
    currentLesson: "module-1.0",
    completedSteps: [],
    checklist: {},
    updatedAt: null
  };
}

function sanitizeWizardState(state) {
  const fallback = defaultWizardState();
  const project = {
    ...fallback.project,
    ...(state?.project && typeof state.project === "object" ? state.project : {})
  };
  const projectName = nullableText(project.name);

  return {
    project: {
      id: nullableUuid(project.id) || fallback.project.id,
      domain: nullableText(project.domain) || "",
      name: projectName === "Meu negocio online" ? "" : projectName || "",
      serverIp: nullableText(project.serverIp) || "",
      technicalEmail: nullableText(project.technicalEmail) || "",
      hostName: nullableText(project.hostName) || "manager01",
      siteImage: nullableText(project.siteImage) || "ghcr.io/axnconsult/site:main"
    },
    currentStep: nullableText(state?.currentStep) || fallback.currentStep,
    currentModule: nullableText(state?.currentModule) || fallback.currentModule,
    currentLesson: nullableText(state?.currentLesson) || fallback.currentLesson,
    completedSteps: Array.isArray(state?.completedSteps) ? state.completedSteps.map(String) : [],
    checklist: state?.checklist && typeof state.checklist === "object" ? state.checklist : {},
    updatedAt: state?.updatedAt || new Date().toISOString()
  };
}

function publicMember(member) {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    created_at: member.created_at
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function requirePassword(password) {
  if (String(password).length < 8) {
    throw httpError(422, "weak_password");
  }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { hash, salt };
}

function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt);
  const left = Buffer.from(hash, "hex");
  const right = Buffer.from(expectedHash, "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function buildWizardAnswer(stepTitle, question, context) {
  const cleanStep = String(stepTitle).slice(0, 120);
  const cleanQuestion = String(question).slice(0, 600);
  const cleanContext = String(context || "").slice(0, 800);

  return [
    `Etapa: ${cleanStep}`,
    "",
    "Vamos simplificar: execute apenas a acao desta etapa e valide antes de avancar.",
    cleanContext ? `Contexto atual: ${cleanContext}` : "",
    `Sua duvida: ${cleanQuestion}`,
    "",
    "Proximo passo pratico: confira os campos preenchidos, copie o comando indicado e rode no lugar certo. Depois use a validacao da etapa. Se a validacao nao bater, pare e trate como problema de DNS, proxy, container ou banco antes de continuar."
  ]
    .filter(Boolean)
    .join("\n");
}

function buildOperationAssistantFallback(module, stage, message) {
  const moduleTitle = nullableText(module?.title) || "Operacao Comercial";
  const stageTitle = Array.isArray(stage) ? stage[0] : nullableText(stage?.title) || "Etapa atual";
  const stageSummary = Array.isArray(stage) ? stage[1] : nullableText(stage?.summary) || "";
  const cleanMessage = String(message || "").slice(0, 1200);

  return [
    `Modulo: ${moduleTitle}`,
    `Etapa: ${stageTitle}`,
    "",
    stageSummary ? `Foco desta etapa: ${stageSummary}` : "",
    cleanMessage ? `O que voce trouxe: ${cleanMessage}` : "",
    "",
    "Ainda estou sem o webhook do n8n configurado neste ambiente. Enquanto isso, transforme sua resposta em tres pontos: decisao tomada, informacao que falta e proxima acao concreta."
  ]
    .filter(Boolean)
    .join("\n");
}

function getPool() {
  if (pool) {
    return pool;
  }

  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.PGPOOL_MAX || 5),
      ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined
    });
    return pool;
  }

  pool = new Pool({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || "axon_ops",
    user: process.env.PGUSER || "axon_app",
    password: process.env.PGPASSWORD,
    max: Number(process.env.PGPOOL_MAX || 5)
  });
  return pool;
}

function query(sql, values = []) {
  return getPool().query(sql, values).catch((error) => {
    console.error("Database query failed", error);
    throw httpError(503, "database_unavailable");
  });
}

async function notifyN8n(kind, payload) {
  const endpoint = process.env[`N8N_${kind.toUpperCase()}_WEBHOOK_URL`];
  if (!endpoint) {
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn(`n8n ${kind} webhook returned ${response.status}`);
    }
  } catch (error) {
    console.warn(`n8n ${kind} webhook failed`, error);
  }
}

async function readJsonBody(request) {
  const chunks = [];
  let total = 0;

  for await (const chunk of request) {
    total += chunk.length;
    if (total > maxBodyBytes) {
      throw httpError(413, "payload_too_large");
    }
    chunks.push(chunk);
  }

  if (!chunks.length) {
    throw httpError(400, "empty_body");
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw httpError(400, "invalid_json");
  }
}

async function serveStatic(urlPathname, request, response) {
  const pathname = urlPathname === "/" ? "/index.html" : urlPathname;
  const decodedPath = decodeURIComponent(pathname);
  const safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, safePath);
  const relativePath = path.relative(publicDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return sendText(response, 403, "forbidden");
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      return sendText(response, 404, "not found");
    }

    const ext = path.extname(filePath).toLowerCase();
    response.statusCode = 200;
    response.setHeader("Content-Type", contentTypes[ext] || "application/octet-stream");
    response.setHeader("Content-Length", fileStat.size);
    response.setHeader("X-Content-Type-Options", "nosniff");
    applyCacheHeaders(response, ext);

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch {
    sendText(response, 404, "not found");
  }
}

function applyCacheHeaders(response, ext) {
  if (ext === ".html") {
    response.setHeader("Cache-Control", "no-store");
    return;
  }

  if ([".css", ".js"].includes(ext)) {
    response.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate");
    return;
  }

  if ([".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico"].includes(ext)) {
    response.setHeader("Cache-Control", "public, max-age=604800, immutable");
  }
}

function requireFields(payload, fields) {
  for (const field of fields) {
    if (payload?.[field] === undefined || payload?.[field] === null || payload?.[field] === "") {
      throw httpError(422, `missing_${field}`);
    }
  }
}

function requireGrantedConsent(consent) {
  if (consent !== "granted") {
    throw httpError(422, "consent_required");
  }
}

function nullableText(value) {
  return value === undefined || value === null || value === "" ? null : String(value);
}

function nullableUuid(value) {
  const text = nullableText(value);
  return text && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)
    ? text
    : null;
}

function nullableDate(value) {
  return value === undefined || value === null || value === "" ? null : value;
}

function jsonValue(value) {
  return JSON.stringify(value ?? null);
}

function httpError(statusCode, code) {
  const error = new Error(code);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (statusCode === 204) {
    response.end();
    return;
  }

  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(payload);
}
