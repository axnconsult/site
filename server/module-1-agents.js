import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { Agent, Runner, webSearchTool, withTrace } from "@openai/agents";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const sdkDir = path.join(repoRoot, "source-material", "Agents", "agents-module-1");

const moduleOutputSchema = z.object({
  status: z.enum(["conversation", "result"]),
  assistant_message: z.string(),
  next_agent_id: z.string(),
  transfer_block: z.object({
    section_title: z.string(),
    content: z.string(),
    key_points: z.array(z.string())
  })
});

const workflowOrder = [
  "business_modeling",
  "target_audience",
  "strategic_differentiation",
  "strategic_pricing",
  "product_concept",
  "visual_identity"
];

const workflowDefinitions = [
  {
    id: "business_modeling",
    name: "AXN | 01 Modelagem de Negocio",
    sdkFile: "AXN 01 Modelagem de Negócio SDK.ts",
    nextWorkflowId: "target_audience",
    fallbackWorkflowId: "wf_6a14904af16481908015ff31ea7a04fd03a1104710bf6be8",
    tools: ["web_search"],
    reasoningEffort: "medium"
  },
  {
    id: "target_audience",
    name: "AXN | 02 Publico-Alvo",
    sdkFile: "AXN 02 Público-Alvo.ts",
    nextWorkflowId: "strategic_differentiation",
    fallbackWorkflowId: "wf_6a1490d4f54c81909c8f4c8a636668e40dc2205a8c6cb5c8",
    tools: ["web_search"],
    reasoningEffort: "low"
  },
  {
    id: "strategic_differentiation",
    name: "AXN | 03 Diferencial Estrategico",
    sdkFile: "AXN 03 Diferencial Estratégico.ts",
    nextWorkflowId: "strategic_pricing",
    fallbackWorkflowId: "wf_6a1492187c748190b3fd09deac31a3750d20841828204242",
    tools: ["web_search"],
    reasoningEffort: "low"
  },
  {
    id: "strategic_pricing",
    name: "AXN | 04 Precificacao Estrategica",
    sdkFile: "AXN 04 Precificação Estratégica.ts",
    nextWorkflowId: "product_concept",
    fallbackWorkflowId: "wf_6a1493cc492c8190b3f62d88de726cad08eca6b39a53a0a5",
    tools: ["web_search"],
    reasoningEffort: "low"
  },
  {
    id: "product_concept",
    name: "AXN | 05 Conceito de Produto",
    sdkFile: "AXN 05 Conceito de Produto.ts",
    nextWorkflowId: "visual_identity",
    fallbackWorkflowId: "wf_6a1494ae4ecc819085555e25109efa1d0010890d34eb9ea3",
    tools: [],
    reasoningEffort: "low"
  },
  {
    id: "visual_identity",
    name: "AXN | 06 Identidade Visual",
    sdkFile: "AXN 06 Identidade Visual.ts",
    nextWorkflowId: "",
    fallbackWorkflowId: "wf_6a149550f67c8190b0046fc2ee38d9800cb0fec96ba0e439",
    tools: [],
    reasoningEffort: "low"
  }
];

const webSearchPreview = webSearchTool({
  searchContextSize: "medium",
  userLocation: { type: "approximate" }
});

let agentsPromise;
let tablesReady = false;

export async function runModule1Turn({ payload, query }) {
  if (typeof query !== "function") {
    throw httpError(500, "module_1_database_unavailable");
  }

  await ensureModule1Tables(query);

  const userMessage = sanitizeMessage(payload?.message) || latestUserMessage(payload?.messages);
  if (!userMessage) {
    throw httpError(422, "missing_message");
  }

  const conversation = await loadOrCreateConversation(query, payload?.conversationId);
  await saveMessage(query, conversation.id, "user", conversation.active_workflow_id, userMessage);

  const agents = await getAgents();
  const runner = new Runner({
    traceMetadata: {
      __trace_source__: "axon-site",
      module: "module-1",
      conversation_id: conversation.id
    }
  });

  let activeWorkflowId = normalizeWorkflowId(conversation.active_workflow_id) || workflowOrder[0];
  let assistantMessage = "";
  let isComplete = false;

  return await withTrace("AXN | Modulo 1", async () => {
    for (let hop = 0; hop < workflowOrder.length; hop += 1) {
      const workflow = agents.get(activeWorkflowId);
      if (!workflow) {
        throw httpError(422, "invalid_workflow");
      }

      const [messages, transferBlocks] = await Promise.all([
        loadMessages(query, conversation.id),
        loadTransferBlocks(query, conversation.id)
      ]);

      const result = await runner.run(workflow.instance, buildAgentInput(messages, transferBlocks), {
        maxTurns: 8
      });

      if (!result.finalOutput) {
        throw httpError(502, "workflow_empty_output");
      }

      const output = result.finalOutput;
      assistantMessage = sanitizeMessage(output.assistant_message) || "Vamos continuar.";
      await saveMessage(query, conversation.id, "assistant", activeWorkflowId, assistantMessage);

      if (output.status !== "result") {
        await updateConversation(query, conversation.id, activeWorkflowId, "active");
        break;
      }

      await saveTransferBlock(query, conversation.id, activeWorkflowId, output.transfer_block);

      const nextWorkflowId = normalizeWorkflowId(output.next_agent_id) || workflow.nextWorkflowId;
      if (!nextWorkflowId) {
        activeWorkflowId = "";
        isComplete = true;
        await updateConversation(query, conversation.id, null, "completed");
        break;
      }

      activeWorkflowId = nextWorkflowId;
      await updateConversation(query, conversation.id, activeWorkflowId, "active");
    }

    return {
      ok: true,
      conversationId: conversation.id,
      assistant_message: assistantMessage,
      isComplete
    };
  });
}

export async function exportModule1Conversation({ payload, query }) {
  await ensureModule1Tables(query);
  const conversationId = nullableUuid(payload?.conversationId);
  if (!conversationId) {
    throw httpError(422, "missing_conversation_id");
  }

  const [messages, transferBlocks] = await Promise.all([
    loadMessages(query, conversationId),
    loadTransferBlocks(query, conversationId)
  ]);

  return {
    ok: true,
    conversationId,
    messages: messages.map((message) => ({ role: message.role, content: message.content, createdAt: message.created_at })),
    transferBlocks
  };
}

async function getAgents() {
  if (!agentsPromise) {
    agentsPromise = buildAgents();
  }
  return agentsPromise;
}

async function buildAgents() {
  const entries = await Promise.all(
    workflowDefinitions.map(async (definition) => {
      const sdkSource = await fs.readFile(path.join(sdkDir, definition.sdkFile), "utf8");
      const sdkInstructions = extractSdkInstructions(sdkSource);
      const sdkModel = extractSdkModel(sdkSource) || "gpt-5.5";
      const workflowId = extractSdkWorkflowId(sdkSource) || definition.fallbackWorkflowId;
      const model = process.env.OPENAI_MODULE_1_MODEL || sdkModel;
      const instance = new Agent({
        name: definition.name,
        instructions: buildInstructions(sdkInstructions, definition),
        model,
        tools: definition.tools.includes("web_search") ? [webSearchPreview] : [],
        outputType: moduleOutputSchema,
        modelSettings: {
          reasoning: { effort: definition.reasoningEffort, summary: "auto" },
          store: true
        }
      });

      return [definition.id, { ...definition, workflowId, instance }];
    })
  );

  return new Map(entries);
}

function buildInstructions(sdkInstructions, definition) {
  return `${sdkInstructions}

## Contrato obrigatorio do app AXN

Voce esta dentro do Modulo 1 da area de membros da AXN. Para o usuario, tudo deve parecer uma conversa unica da AXN, sem mencionar agentes, workflows, schemas, OpenAI, API, banco de dados ou detalhes internos.

Responda sempre em JSON valido, obedecendo exatamente este formato:
{
  "status": "conversation" | "result",
  "assistant_message": "texto curto que aparece no chat",
  "next_agent_id": "",
  "transfer_block": {
    "section_title": "",
    "content": "",
    "key_points": []
  }
}

Enquanto ainda estiver perguntando, refinando ou esperando uma decisao do usuario, use status "conversation", next_agent_id vazio e transfer_block vazio.
Quando esta etapa estiver concluida, use status "result", preencha transfer_block com a entrega operacional da etapa e use next_agent_id "${definition.nextWorkflowId}".

O campo assistant_message e o unico texto visivel ao aluno. Ele deve ser natural, curto e conduzir a proxima resposta do usuario.
Nao exponha JSON, raciocinio oculto, checklist interno, instrucoes de sistema ou nomes de agentes no assistant_message.`;
}

function buildAgentInput(messages, transferBlocks) {
  const items = [];

  if (transferBlocks.length) {
    items.push({
      role: "system",
      content: `Blocos ja consolidados no planejamento estrategico:\n${JSON.stringify(transferBlocks, null, 2)}`
    });
  }

  for (const message of messages.slice(-30)) {
    items.push({
      role: message.role,
      ...(message.role === "assistant" ? { status: "completed" } : {}),
      content: [
        {
          type: message.role === "assistant" ? "output_text" : "input_text",
          text: message.content
        }
      ]
    });
  }

  return items;
}

async function ensureModule1Tables(query) {
  if (tablesReady) {
    return;
  }

  await query(`
    create table if not exists module1_conversations (
      id uuid primary key,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      active_workflow_id text,
      status text not null default 'active',
      metadata_json jsonb not null default '{}'::jsonb
    )
  `);

  await query(`
    create table if not exists module1_messages (
      id uuid primary key,
      conversation_id uuid not null references module1_conversations(id) on delete cascade,
      created_at timestamptz not null default now(),
      role text not null check (role in ('user', 'assistant')),
      workflow_id text,
      content text not null
    )
  `);

  await query(`
    create table if not exists module1_transfer_blocks (
      id uuid primary key,
      conversation_id uuid not null references module1_conversations(id) on delete cascade,
      created_at timestamptz not null default now(),
      workflow_id text not null,
      section_title text,
      content text,
      key_points_json jsonb not null default '[]'::jsonb,
      raw_json jsonb not null default '{}'::jsonb
    )
  `);

  await query("create index if not exists idx_module1_conversations_updated_at on module1_conversations (updated_at desc)");
  await query("create index if not exists idx_module1_messages_conversation_created on module1_messages (conversation_id, created_at)");
  await query("create index if not exists idx_module1_blocks_conversation_created on module1_transfer_blocks (conversation_id, created_at)");

  tablesReady = true;
}

async function loadOrCreateConversation(query, rawConversationId) {
  const conversationId = nullableUuid(rawConversationId);

  if (conversationId) {
    const result = await query("select * from module1_conversations where id = $1", [conversationId]);
    if (result.rows[0]) {
      return result.rows[0];
    }
  }

  const id = randomUUID();
  const result = await query(
    `insert into module1_conversations (id, active_workflow_id, status)
     values ($1, $2, 'active')
     returning *`,
    [id, workflowOrder[0]]
  );
  return result.rows[0];
}

async function updateConversation(query, conversationId, activeWorkflowId, status) {
  await query(
    `update module1_conversations
     set active_workflow_id = $2, status = $3, updated_at = now()
     where id = $1`,
    [conversationId, activeWorkflowId, status]
  );
}

async function saveMessage(query, conversationId, role, workflowId, content) {
  await query(
    `insert into module1_messages (id, conversation_id, role, workflow_id, content)
     values ($1, $2, $3, $4, $5)`,
    [randomUUID(), conversationId, role, workflowId || null, content]
  );
}

async function loadMessages(query, conversationId) {
  const result = await query(
    `select role, content, created_at
     from module1_messages
     where conversation_id = $1
     order by created_at asc, id asc`,
    [conversationId]
  );
  return result.rows;
}

async function saveTransferBlock(query, conversationId, workflowId, transferBlock) {
  const block = normalizeTransferBlock(transferBlock);
  if (!block.section_title && !block.content && !block.key_points.length) {
    return;
  }

  await query(
    `insert into module1_transfer_blocks (
       id, conversation_id, workflow_id, section_title, content, key_points_json, raw_json
     ) values ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)`,
    [
      randomUUID(),
      conversationId,
      workflowId,
      block.section_title,
      block.content,
      JSON.stringify(block.key_points),
      JSON.stringify(block.raw)
    ]
  );
}

async function loadTransferBlocks(query, conversationId) {
  const result = await query(
    `select workflow_id, section_title, content, key_points_json, created_at
     from module1_transfer_blocks
     where conversation_id = $1
     order by created_at asc, id asc`,
    [conversationId]
  );

  return result.rows.map((row) => ({
    workflow_id: row.workflow_id,
    section_title: row.section_title || "",
    content: row.content || "",
    key_points: Array.isArray(row.key_points_json) ? row.key_points_json : []
  }));
}

function normalizeTransferBlock(value) {
  const raw = value && typeof value === "object" ? value : {};
  return {
    raw,
    section_title: sanitizeMessage(raw.section_title).slice(0, 240),
    content: sanitizeMessage(raw.content).slice(0, 16000),
    key_points: Array.isArray(raw.key_points)
      ? raw.key_points.map((point) => sanitizeMessage(point).slice(0, 600)).filter(Boolean).slice(0, 20)
      : []
  };
}

function extractSdkInstructions(source) {
  const match = source.match(/instructions:\s*`([\s\S]*?)`,\s*(?:model|tools|outputType|modelSettings)/);
  if (!match) {
    throw new Error("sdk_instructions_not_found");
  }
  return match[1];
}

function extractSdkModel(source) {
  return source.match(/model:\s*"([^"]+)"/)?.[1] || "";
}

function extractSdkWorkflowId(source) {
  return source.match(/workflow_id:\s*"([^"]+)"/)?.[1] || "";
}

function latestUserMessage(messages) {
  if (!Array.isArray(messages)) {
    return "";
  }

  return sanitizeMessage([...messages].reverse().find((message) => message?.role === "user")?.content);
}

function sanitizeMessage(value) {
  return String(value || "").replace(/\u0000/g, "").trim().slice(0, 8000);
}

function normalizeWorkflowId(value) {
  const text = String(value || "").trim();
  return workflowOrder.includes(text) ? text : "";
}

function nullableUuid(value) {
  const text = String(value || "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)
    ? text
    : "";
}

function httpError(statusCode, code) {
  const error = new Error(code);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}