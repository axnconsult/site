import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import crypto from "node:crypto";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { firstAgentId, isOperationAgentsEnabled, nextAgentFor, runOperationAgent } from "./server/operation-agents.js";

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "app");
const port = Number(process.env.PORT || 80);
const maxBodyBytes = Number(process.env.MAX_BODY_BYTES || 1024 * 1024);

let pool;

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
  const member = await getAuthenticatedMember(payload);
  return {
    ok: true,
    member,
    state: await loadWizardState(member.id)
  };
}

async function handleOperationAssistant(payload) {
  const member = await getAuthenticatedMember(payload);
  requireFields(payload, ["message", "module", "stage", "stageKey", "project"]);

  if (isOperationAgentsEnabled()) {
    try {
      const project = await upsertOperationProject(member, payload);
      const transferBlocks = await loadOperationTransferBlocks(project.id, member.id);
      const thread = await loadOperationThread(project.id, member.id);
      const activeAgentId = resolveOperationAgentId(project, payload);
      await saveOperationMessage(project.id, member.id, payload.stageKey, "user", payload.message, {
        agent_id: activeAgentId
      });

      const agentResult = await runOperationAgent({
        ...payload,
        member,
        project: {
          ...payload.project,
          id: project.id,
          name: project.name
        },
        activeAgentId,
        transferBlocks,
        thread: thread.length ? thread : payload.thread
      });

      await saveOperationMessage(project.id, member.id, payload.stageKey, "assistant", agentResult.answer, {
        agent_id: agentResult.agent_id,
        status: agentResult.status,
        next_agent_id: agentResult.next_agent_id || null
      });
      await saveOperationAgentRun(project.id, member.id, payload, agentResult);
      await updateOperationProjectAfterAgent(project.id, payload, agentResult);

      return {
        ok: true,
        answer: agentResult.answer,
        agent_id: agentResult.agent_id,
        status: agentResult.status,
        transfer_block: agentResult.transfer_block,
        next_agent_id: agentResult.next_agent_id,
        next_recommended_agent: agentResult.next_agent_id,
        provider: agentResult.provider
      };
    } catch (error) {
      console.warn("Operation agent runner failed", error);
      if (process.env.OPERATION_ASSISTANT_STRICT === "true") {
        throw httpError(502, "operation_agent_failed");
      }
    }
  }

  const endpoint = process.env.N8N_OPERATION_ASSISTANT_WEBHOOK_URL;
  if (!endpoint) {
    return {
      ok: true,
      fallback: true,
      answer: buildOperationAssistantFallback(payload.module, payload.stage, payload.message)
    };
  }

  const n8nPayload = {
    member,
    project: payload.project,
    module: payload.module,
    stage: payload.stage,
    stageKey: payload.stageKey,
    message: payload.message,
    thread: Array.isArray(payload.thread) ? payload.thread.slice(-20) : [],
    sentAt: new Date().toISOString()
  };

  const controller = new AbortController();
  const timeoutMs = Number(process.env.N8N_OPERATION_ASSISTANT_TIMEOUT_MS || 45000);
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_OPERATION_ASSISTANT_SECRET
          ? { "X-Axon-Webhook-Secret": process.env.N8N_OPERATION_ASSISTANT_SECRET }
          : {})
      },
      body: JSON.stringify(n8nPayload),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      console.warn("n8n operation assistant returned", response.status, data);
      return {
        ok: true,
        fallback: true,
        answer: buildOperationAssistantFallback(payload.module, payload.stage, payload.message)
      };
    }

    return {
      ok: true,
      answer: data.answer || data.summary_for_user || buildOperationAssistantFallback(payload.module, payload.stage, payload.message),
      agent_id: data.agent_id || payload.stage?.agentId || null,
      status: data.status || (data.saved ? "saved" : null),
      project_section: data.project_section || null,
      transfer_block: data.transfer_block || null,
      next_recommended_agent: data.next_recommended_agent || null
    };
  } catch (error) {
    console.warn("n8n operation assistant failed", error);
    return {
      ok: true,
      fallback: true,
      answer: buildOperationAssistantFallback(payload.module, payload.stage, payload.message)
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function upsertOperationProject(member, payload) {
  const projectId = nullableUuid(payload.project?.id) || crypto.randomUUID();
  const projectName = nullableText(payload.project?.name) || "Projeto sem nome";
  const projectJson = {
    ...(payload.project && typeof payload.project === "object" ? payload.project : {}),
    id: projectId,
    name: projectName
  };

  const result = await query(
    `
      insert into operation_projects (
        id,
        member_id,
        name,
        current_module,
        current_stage_key,
        project_json,
        updated_at
      ) values ($1, $2, $3, $4, $5, $6::jsonb, now())
      on conflict (id) do update set
        name = excluded.name,
        current_module = excluded.current_module,
        current_stage_key = excluded.current_stage_key,
        project_json = operation_projects.project_json || excluded.project_json,
        updated_at = now()
      where operation_projects.member_id = excluded.member_id
      returning *
    `,
    [
      projectId,
      member.id,
      projectName,
      nullableText(payload.module?.id) || "module-1",
      nullableText(payload.stageKey) || "module-1.0",
      jsonValue(projectJson)
    ]
  );

  if (!result.rows[0]) {
    throw httpError(403, "project_not_owned_by_member");
  }

  return result.rows[0];
}

async function loadOperationTransferBlocks(projectId, memberId) {
  const result = await query(
    `
      select project_section, transfer_block_json
      from operation_agent_runs
      where project_id = $1
        and member_id = $2
        and status = 'result'
        and project_section is not null
      order by created_at asc
    `,
    [projectId, memberId]
  );

  return result.rows.reduce((blocks, row) => {
    blocks[row.project_section] = row.transfer_block_json;
    return blocks;
  }, {});
}

async function loadOperationThread(projectId, memberId) {
  const result = await query(
    `
      select role, content, created_at
      from operation_conversation_messages
      where project_id = $1 and member_id = $2
      order by created_at desc
      limit 30
    `,
    [projectId, memberId]
  );

  return result.rows.reverse().map((row) => ({
    role: row.role,
    text: row.content,
    createdAt: row.created_at
  }));
}

async function saveOperationMessage(projectId, memberId, stageKey, role, content, metadata = {}) {
  await query(
    `
      insert into operation_conversation_messages (
        project_id,
        member_id,
        stage_key,
        role,
        content,
        metadata_json
      ) values ($1, $2, $3, $4, $5, $6::jsonb)
    `,
    [
      projectId,
      memberId,
      nullableText(stageKey) || "module-1.0",
      role,
      String(content || ""),
      jsonValue(metadata)
    ]
  );
}

async function saveOperationAgentRun(projectId, memberId, payload, agentResult) {
  await query(
    `
      insert into operation_agent_runs (
        project_id,
        member_id,
        stage_key,
        agent_id,
        status,
        user_message,
        assistant_answer,
        project_section,
        transfer_block_json,
        raw_response_json,
        openai_response_id
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11)
    `,
    [
      projectId,
      memberId,
      nullableText(payload.stageKey) || "module-1.0",
      nullableText(agentResult.agent_id) || firstAgentId(),
      agentResult.status === "result" ? "result" : "conversation",
      String(payload.message || ""),
      String(agentResult.answer || ""),
      nullableText(agentResult.project_section),
      jsonValue(agentResult.transfer_block || null),
      jsonValue(agentResult.raw_agent_output || agentResult),
      nullableText(agentResult.raw_response_id)
    ]
  );
}

async function updateOperationProjectAfterAgent(projectId, payload, agentResult) {
  const projectPatch = {
    lastAgentId: agentResult.agent_id || null,
    activeAgentId: agentResult.agent_id || firstAgentId(),
    nextAgentId: agentResult.status === "result" ? agentResult.next_agent_id || null : null,
    lastAgentStatus: agentResult.status,
    lastAssistantAt: new Date().toISOString()
  };

  const strategicPlanPatch = agentResult.status === "result" && agentResult.project_section
    ? { [agentResult.project_section]: agentResult.transfer_block || null }
    : {};

  await query(
    `
      update operation_projects
      set
        project_json = project_json || $2::jsonb,
        strategic_plan_json = strategic_plan_json || $3::jsonb,
        strategic_plan_markdown = case
          when $4::text <> '' then concat(strategic_plan_markdown, E'\n\n## ', $4::text, E'\n\n', $5::text)
          else strategic_plan_markdown
        end,
        current_module = $6,
        current_stage_key = $7,
        updated_at = now()
      where id = $1
    `,
    [
      projectId,
      jsonValue(projectPatch),
      jsonValue(strategicPlanPatch),
      agentResult.status === "result" ? nullableText(agentResult.transfer_block?.section_title) || "" : "",
      agentResult.status === "result" ? nullableText(agentResult.transfer_block?.content) || "" : "",
      nullableText(payload.module?.id) || "module-1",
      nullableText(payload.stageKey) || "module-1.0"
    ]
  );
}

function resolveOperationAgentId(project, payload) {
  const requestedAgentId = nullableText(payload.stage?.agentId) || firstAgentId();
  return requestedAgentId;
}

async function handleWizardLoad(payload) {
  const member = await getAuthenticatedMember(payload);
  return {
    ok: true,
    member,
    state: await loadWizardState(member.id)
  };
}

async function handleWizardSave(payload) {
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
  const member = await getAuthenticatedMember(payload);
  requireFields(payload, ["message"]);

  if (!isOperationAgentsEnabled()) {
    return {
      ok: true,
      fallback: true,
      answer: buildWizardAnswer(payload.stepTitle || "Módulo 1", payload.message, payload.context)
    };
  }

  const state = await loadWizardState(member.id);
  const project = state.project;

  const wizardProjectId = project.wizardProjectId || crypto.randomUUID();
  const activeAgentId = project.activeAgentId || firstAgentId();
  const transferBlocks = project.transferBlocks && typeof project.transferBlocks === "object"
    ? project.transferBlocks
    : {};

  await upsertWizardProject(wizardProjectId, member, project);

  const thread = await loadOperationThread(wizardProjectId, member.id);

  await saveOperationMessage(wizardProjectId, member.id, `module-1.${activeAgentId}`, "user", payload.message, {
    agent_id: activeAgentId
  });

  const agentResult = await runOperationAgent({
    message: payload.message,
    member,
    project: { id: wizardProjectId, name: project.name || "" },
    module: { id: "module-1", title: "Módulo 1" },
    stage: { agentId: activeAgentId },
    stageKey: `module-1.${activeAgentId}`,
    activeAgentId,
    transferBlocks,
    thread
  });

  await saveOperationMessage(wizardProjectId, member.id, `module-1.${agentResult.agent_id}`, "assistant", agentResult.answer, {
    agent_id: agentResult.agent_id,
    status: agentResult.status,
    next_agent_id: agentResult.next_agent_id || null
  });

  const nextAgentId = agentResult.status === "result"
    ? (agentResult.next_agent_id || nextAgentFor(activeAgentId) || "")
    : activeAgentId;

  const newTransferBlocks = agentResult.status === "result" && agentResult.project_section
    ? { ...transferBlocks, [agentResult.project_section]: agentResult.transfer_block }
    : transferBlocks;

  await saveWizardAgentState(member.id, state, {
    wizardProjectId,
    activeAgentId: nextAgentId,
    transferBlocks: newTransferBlocks
  });

  return {
    ok: true,
    answer: agentResult.answer,
    agent_id: agentResult.agent_id,
    status: agentResult.status,
    transfer_block: agentResult.transfer_block,
    next_agent_id: agentResult.next_agent_id
  };
}

async function upsertWizardProject(projectId, member, project) {
  await query(
    `
      insert into operation_projects (
        id, member_id, name, current_module, current_stage_key, project_json, updated_at
      ) values ($1, $2, $3, $4, $5, $6::jsonb, now())
      on conflict (id) do update set
        name = excluded.name,
        updated_at = now()
      where operation_projects.member_id = excluded.member_id
    `,
    [
      projectId,
      member.id,
      project.name || "Wizard",
      "module-1",
      "module-1.0",
      jsonValue({ id: projectId, name: project.name || "Wizard" })
    ]
  );
}

async function saveWizardAgentState(memberId, currentState, agentPatch) {
  const updatedState = {
    ...currentState,
    project: { ...currentState.project, ...agentPatch }
  };
  const sanitized = sanitizeWizardState(updatedState);
  await query(
    `
      insert into wizard_progress (
        member_id, project_json, current_step, completed_steps_json, checklist_json,
        current_module, current_lesson, updated_at
      ) values ($1, $2::jsonb, $3, $4::jsonb, $5::jsonb, $6, $7, now())
      on conflict (member_id) do update set
        project_json = excluded.project_json,
        current_step = excluded.current_step,
        completed_steps_json = excluded.completed_steps_json,
        checklist_json = excluded.checklist_json,
        current_module = excluded.current_module,
        current_lesson = excluded.current_lesson,
        updated_at = now()
    `,
    [
      memberId,
      jsonValue(sanitized.project),
      sanitized.currentStep,
      jsonValue(sanitized.completedSteps),
      jsonValue(sanitized.checklist),
      sanitized.currentModule,
      sanitized.currentLesson
    ]
  );
}

async function getAuthenticatedMember(payload) {
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
      siteImage: nullableText(project.siteImage) || "ghcr.io/axnconsult/site:main",
      wizardProjectId: nullableUuid(project.wizardProjectId) || "",
      activeAgentId: nullableText(project.activeAgentId) || "",
      transferBlocks: project.transferBlocks && typeof project.transferBlocks === "object"
        ? project.transferBlocks
        : {}
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

  if ([".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico"].includes(ext)) {
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
