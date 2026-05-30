import { readFile } from "node:fs/promises";
import path from "node:path";

const AGENTS = [
  {
    id: "business_modeling",
    section: "fundamento_do_negocio",
    promptFile: "01-modelagem-de-negocio.md",
    webSearch: true
  },
  {
    id: "target_audience",
    section: "publico_alvo",
    promptFile: "02-publico-alvo.md",
    webSearch: true
  },
  {
    id: "strategic_differentiation",
    section: "diferenciacao_e_posicionamento",
    promptFile: "03-diferencial-estrategico.md",
    webSearch: true
  },
  {
    id: "strategic_pricing",
    section: "precificacao_e_oferta",
    promptFile: "04-precificacao-estrategica.md",
    webSearch: true
  },
  {
    id: "product_concept",
    section: "conceito_de_produto",
    promptFile: "05-conceito-de-produto.md",
    webSearch: false
  },
  {
    id: "visual_identity",
    section: "identidade_visual",
    promptFile: "06-identidade-visual.md",
    webSearch: false
  }
];

const AGENT_IDS = AGENTS.map((agent) => agent.id);
const AGENT_BY_ID = new Map(AGENTS.map((agent) => [agent.id, agent]));
const PROMPT_CACHE = new Map();

export async function runOperationAgentTurn({ rootDir, query, member, payload }) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      ok: true,
      fallback: true,
      answer: "A conexao com a OpenAI ainda nao esta configurada neste ambiente. Configure OPENAI_API_KEY na stack do site e rode o deploy novamente.",
      status: "configuration_error",
      agent_id: resolveAgentId(payload.stage?.agentId)
    };
  }

  const project = await upsertOperationProject(query, member, payload);
  const activeAgentId = resolveAgentId(project.current_stage_key === payload.stageKey
    ? payload.stage?.agentId
    : agentIdFromStageKey(payload.stageKey));
  const agent = AGENT_BY_ID.get(activeAgentId) || AGENTS[0];
  const history = await loadProjectHistory(query, project.id);
  const thread = normalizeThread(payload.thread);
  const instructions = await buildInstructions(rootDir, agent, history);

  const openaiRequest = {
    model: process.env.OPENAI_OPERATION_MODEL || "gpt-5.1",
    instructions,
    text: {
      format: {
        type: "json_schema",
        name: "operation_agent_turn",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["status", "assistant_message", "next_agent_id", "transfer_block"],
          properties: {
            status: {
              type: "string",
              enum: ["conversation", "result"]
            },
            assistant_message: {
              type: "string"
            },
            next_agent_id: {
              type: "string"
            },
            transfer_block: {
              type: "object",
              additionalProperties: false,
              required: ["section_title", "content", "key_points"],
              properties: {
                section_title: { type: "string" },
                content: { type: "string" },
                key_points: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              project: payload.project,
              module: payload.module,
              stage: payload.stage,
              stageKey: payload.stageKey,
              activeAgentId,
              validAgentIds: AGENT_IDS,
              previousDeliveries: history.completedBlocks,
              conversationThread: thread,
              userMessage: payload.message
            })
          }
        ]
      }
    ]
  };

  if (agent.webSearch && process.env.OPENAI_OPERATION_WEB_SEARCH !== "false") {
    openaiRequest.tools = [{ type: "web_search_preview" }];
  }

  const response = await callOpenAI(openaiRequest);
  const parsed = parseAgentOutput(response, agent);
  const status = normalizeStatus(parsed.status);
  const nextAgentId = status === "result"
    ? normalizeNextAgentId(parsed.next_agent_id || parsed.next_recommended_agent, agent.id)
    : "";
  const answer = cleanAssistantMessage(parsed.assistant_message || parsed.summary_for_user || parsed.answer || response.output_text);
  const transferBlock = normalizeTransferBlock(parsed.transfer_block, status);
  const projectSection = parsed.project_section || agent.section;

  await saveAgentRun(query, {
    project,
    member,
    stageKey: payload.stageKey,
    agentId: agent.id,
    status,
    userMessage: payload.message,
    answer,
    projectSection,
    transferBlock,
    rawResponse: response,
    openaiResponseId: response.id || null
  });

  if (status === "result" && nextAgentId) {
    await updateProjectStage(query, project.id, nextAgentId, payload.project);
  }

  return {
    ok: true,
    answer,
    agent_id: agent.id,
    status,
    project_section: projectSection,
    transfer_block: transferBlock,
    next_agent_id: nextAgentId,
    next_recommended_agent: nextAgentId,
    openai_response_id: response.id || null
  };
}

function resolveAgentId(value) {
  const normalized = String(value || "").trim();
  if (AGENT_BY_ID.has(normalized)) return normalized;

  const aliases = {
    publico_alvo: "target_audience",
    public_alvo: "target_audience",
    target: "target_audience",
    target_audience: "target_audience",
    modelagem: "business_modeling",
    modelagem_de_negocio: "business_modeling",
    business_modeling: "business_modeling",
    diferencial: "strategic_differentiation",
    diferencial_estrategico: "strategic_differentiation",
    strategic_differentiation: "strategic_differentiation",
    precificacao: "strategic_pricing",
    precificacao_estrategica: "strategic_pricing",
    strategic_pricing: "strategic_pricing",
    conceito: "product_concept",
    conceito_de_produto: "product_concept",
    product_concept: "product_concept",
    identidade: "visual_identity",
    identidade_visual: "visual_identity",
    visual_identity: "visual_identity"
  };

  const key = normalized
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return aliases[key] || "business_modeling";
}

function normalizeNextAgentId(value, currentAgentId) {
  const resolved = resolveAgentId(value);
  const currentIndex = AGENT_IDS.indexOf(currentAgentId);
  const resolvedIndex = AGENT_IDS.indexOf(resolved);

  if (!value) return AGENT_IDS[currentIndex + 1] || "";
  if (resolvedIndex > currentIndex) return resolved;
  return AGENT_IDS[currentIndex + 1] || "";
}

function agentIdFromStageKey(stageKey) {
  const index = Number(String(stageKey || "").split(".")[1] || 0);
  return AGENT_IDS[index] || "business_modeling";
}

function stageKeyFromAgentId(agentId) {
  const index = Math.max(0, AGENT_IDS.indexOf(agentId));
  return `module-1.${index}`;
}

async function buildInstructions(rootDir, agent, history) {
  const prompt = await loadPrompt(rootDir, agent.promptFile);
  return [
    prompt,
    "",
    "## Contrato da conversa no app Axon",
    "Voce esta dentro da area de membros da Axon. Nao mencione n8n, ChatGPT personalizado, Agent Builder, OpenAI Platform, prompts, JSON, schema ou ferramentas internas.",
    "O aluno so deve ver o campo assistant_message. Escreva esse campo como conversa natural.",
    "Nao responda em blocos fixos como '1. validacao', '2. resumo', '3. proxima acao'.",
    "Nao faca resumo longo do que entendeu, exceto quando for a entrega final da etapa.",
    "Faca no maximo duas perguntas por vez. Se precisar enumerar perguntas, use '1.' e '2.' apenas para as perguntas objetivas.",
    "Nao avance para escopo de outro agente. Se o assunto for de outro agente, registre como pendencia e continue sua etapa.",
    "",
    "## IDs validos da jornada fixa",
    AGENT_IDS.map((id, index) => `${index + 1}. ${id}`).join("\n"),
    "",
    "Quando esta etapa ainda estiver em conversa, responda com status 'conversation', next_agent_id vazio e transfer_block vazio.",
    "Quando esta etapa estiver concluida, responda com status 'result', next_agent_id igual ao proximo ID valido e transfer_block preenchido.",
    "Nunca invente outro next_agent_id.",
    "",
    "## Entregas ja concluidas do projeto",
    JSON.stringify(history.completedBlocks || {}, null, 2)
  ].join("\n");
}

async function loadPrompt(rootDir, promptFile) {
  if (PROMPT_CACHE.has(promptFile)) return PROMPT_CACHE.get(promptFile);

  const filePath = path.join(rootDir, "source-material", "Agents", "revised-module-1", promptFile);
  const content = await readFile(filePath, "utf8");
  const prompt = content.includes("## Instrucoes do agente")
    ? content.split("## Instrucoes do agente").slice(1).join("## Instrucoes do agente").trim()
    : content;
  PROMPT_CACHE.set(promptFile, prompt);
  return prompt;
}

async function callOpenAI(body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.OPENAI_OPERATION_TIMEOUT_MS || 60000));

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.warn("OpenAI operation assistant returned", response.status, data);
      return {
        output_text: "Nao consegui acionar o assistente agora. Tente novamente em instantes.",
        error: data,
        status: "failed"
      };
    }

    return {
      ...data,
      output_text: extractOutputText(data)
    };
  } catch (error) {
    console.warn("OpenAI operation assistant failed", error);
    return {
      output_text: "Nao consegui acionar o assistente agora. Tente novamente em instantes.",
      error: { message: error.message },
      status: "failed"
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractOutputText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function parseAgentOutput(response, agent) {
  const text = response.output_text || "";
  const jsonText = extractJsonText(text);

  try {
    return JSON.parse(jsonText);
  } catch {
    return {
      status: "conversation",
      assistant_message: text || "Me conte um pouco mais para eu continuar esta etapa.",
      project_section: agent.section,
      transfer_block: emptyTransferBlock(),
      next_agent_id: ""
    };
  }
}

function extractJsonText(text) {
  const cleaned = String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  if (cleaned.startsWith("{") && cleaned.endsWith("}")) return cleaned;

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start >= 0 && end > start) return cleaned.slice(start, end + 1);

  return cleaned;
}

function normalizeStatus(status) {
  const value = String(status || "").toLowerCase();
  if (["result", "completed", "complete", "done"].includes(value)) return "result";
  return "conversation";
}

function normalizeTransferBlock(block, status) {
  if (status !== "result") return emptyTransferBlock();
  if (block && typeof block === "object") return block;
  return emptyTransferBlock();
}

function emptyTransferBlock() {
  return {
    section_title: "",
    content: "",
    key_points: []
  };
}

function cleanAssistantMessage(value) {
  return String(value || "Me conte um pouco mais para eu continuar esta etapa.")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function normalizeThread(thread) {
  return (Array.isArray(thread) ? thread : [])
    .filter((message) => message?.role && message?.text)
    .filter((message) => !String(message.text).includes("Estou organizando sua resposta"))
    .slice(-20)
    .map((message) => ({
      role: message.role,
      text: message.text
    }));
}

async function upsertOperationProject(query, member, payload) {
  const projectId = payload.project?.id;
  const projectName = payload.project?.name || payload.project?.title || "Projeto sem nome";
  const stageKey = payload.stageKey || "module-1.0";
  const moduleId = payload.module?.id || "module-1";

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
      ) values (
        $1::uuid,
        $2::uuid,
        $3,
        $4,
        $5,
        $6::jsonb,
        now()
      )
      on conflict (id) do update set
        name = excluded.name,
        current_module = excluded.current_module,
        current_stage_key = excluded.current_stage_key,
        project_json = operation_projects.project_json || excluded.project_json,
        updated_at = now()
      returning *
    `,
    [
      projectId,
      member.id,
      projectName,
      moduleId,
      stageKey,
      JSON.stringify(payload.project || {})
    ]
  );

  return result.rows[0];
}

async function loadProjectHistory(query, projectId) {
  const result = await query(
    `
      select agent_id, status, project_section, transfer_block_json, created_at
      from operation_agent_runs
      where project_id = $1::uuid
      order by created_at asc
    `,
    [projectId]
  );

  const completedBlocks = {};
  for (const row of result.rows) {
    if (normalizeStatus(row.status) === "result" && row.transfer_block_json) {
      completedBlocks[row.project_section || row.agent_id] = row.transfer_block_json;
    }
  }

  return {
    runs: result.rows,
    completedBlocks
  };
}

async function saveAgentRun(query, data) {
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
      ) values (
        $1::uuid,
        $2::uuid,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9::jsonb,
        $10::jsonb,
        $11
      )
    `,
    [
      data.project.id,
      data.member.id,
      data.stageKey,
      data.agentId,
      data.status,
      data.userMessage,
      data.answer,
      data.projectSection,
      JSON.stringify(data.transferBlock || null),
      JSON.stringify(data.rawResponse || {}),
      data.openaiResponseId
    ]
  );

  await query(
    `
      insert into operation_conversation_messages (project_id, member_id, stage_key, role, content, metadata_json)
      values
        ($1::uuid, $2::uuid, $3, 'user', $4, $5::jsonb),
        ($1::uuid, $2::uuid, $3, 'assistant', $6, $7::jsonb)
    `,
    [
      data.project.id,
      data.member.id,
      data.stageKey,
      data.userMessage,
      JSON.stringify({ agent_id: data.agentId }),
      data.answer,
      JSON.stringify({ agent_id: data.agentId, status: data.status })
    ]
  );
}

async function updateProjectStage(query, projectId, nextAgentId, projectPayload) {
  const stageKey = stageKeyFromAgentId(nextAgentId);
  await query(
    `
      update operation_projects
      set
        current_stage_key = $2,
        project_json = project_json || $3::jsonb,
        updated_at = now()
      where id = $1::uuid
    `,
    [projectId, stageKey, JSON.stringify(projectPayload || {})]
  );
}
