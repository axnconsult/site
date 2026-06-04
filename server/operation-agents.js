import { readFile } from "node:fs/promises";
import path from "node:path";

// ─── Agente Validador (Anthropic/Claude) ─────────────────────────────────────
// Invisível ao usuário. Revisa cada resposta do Agente 01 antes de enviar ao
// frontend — remove hipóteses sem mercado, qualifica dados duvidosos, simplifica
// jargão e bloqueia invasão de escopo dos agentes seguintes.

const VALIDATOR_PROMPT = `Você é um revisor silencioso de qualidade do AXN Consult.
Você recebe a resposta que um agente de modelagem de negócio (GPT) está prestes a enviar a um empreendedor iniciante. Sua função é revisar essa resposta antes que o usuário a leia.
O usuário não sabe que você existe. Nunca se identifique, nunca adicione comentários sobre sua revisão, nunca altere o tom conversacional do agente original.

Revise a resposta considerando:

1. HIPÓTESES DE NEGÓCIO (quando presentes):
   - Existe evidência real de mercado comprador para cada hipótese?
   - Se uma hipótese for claramente superior, destaque-a e reduza o peso das demais.
   - Remova hipóteses que sejam apenas interesse pessoal sem demanda demonstrável.
   - Máximo de 3 hipóteses. Se houver uma óbvia, apresente só ela.

2. DADOS E PESQUISA:
   - Afirmações sobre mercado, concorrência ou demanda parecem baseadas em dados reais?
   - Se parecerem genéricas ou inventadas, remova-as ou substitua por linguagem cautelosa ("há indícios de que...", "vale verificar se...").

3. LINGUAGEM:
   - O usuário não tem conhecimento de administração ou marketing.
   - Simplifique jargão técnico sem perder precisão.
   - Menos opções é melhor. Clareza acima de completude.

4. ESCOPO:
   - O agente está invadindo etapas futuras (público-alvo detalhado, precificação, identidade visual)?
   - Se sim, remova essas partes.

Retorne APENAS a mensagem revisada, sem nenhum comentário adicional.
Se a mensagem estiver adequada, retorne-a sem alterações.`;

async function validateWithClaude(message) {
  if (!process.env.ANTHROPIC_API_KEY) return message;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15s max para o validador

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_VALIDATOR_MODEL || "claude-haiku-4-5",
        max_tokens: 2048,
        system: VALIDATOR_PROMPT,
        messages: [{ role: "user", content: message }]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      console.warn("Validator returned", response.status);
      return message; // fallback silencioso
    }

    const data = await response.json();
    return data.content?.[0]?.text || message;
  } catch (error) {
    console.warn("Validator failed:", error.message);
    return message; // nunca bloqueia — devolve original em caso de erro
  } finally {
    clearTimeout(timeout);
  }
}

// Extrai o campo assistant_message do JSON estruturado enquanto ele chega em stream.
// A Responses API com json_schema emite os campos na ordem do schema:
// status → assistant_message → next_agent_id → transfer_block.
// O extractor rastreia essa sequência caractere a caractere.
class AssistantMessageExtractor {
  constructor() {
    this._buffer = "";
    this._phase = "seeking_key"; // seeking_key | seeking_quote | in_value | done
    this._KEY_MARKER = '"assistant_message":';
    this._escaped = false;
  }

  push(chunk) {
    if (this._phase === "done") return "";
    let result = "";
    for (const char of chunk) {
      if (this._phase === "seeking_key") {
        this._buffer += char;
        if (
          this._buffer.length >= this._KEY_MARKER.length &&
          this._buffer.slice(-this._KEY_MARKER.length) === this._KEY_MARKER
        ) {
          this._phase = "seeking_quote";
        }
      } else if (this._phase === "seeking_quote") {
        if (char === '"') this._phase = "in_value";
        // ignora espaços/quebras entre ':' e '"'
      } else if (this._phase === "in_value") {
        if (this._escaped) {
          this._escaped = false;
          const unescaped = { n: "\n", t: "\t", r: "\r", '"': '"', "\\": "\\" }[char] || char;
          result += unescaped;
        } else if (char === "\\") {
          this._escaped = true;
        } else if (char === '"') {
          this._phase = "done";
        } else {
          result += char;
        }
      }
    }
    return result;
  }
}

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
  const activeStageKey = normalizeStageKey(project.current_stage_key || payload.stageKey);
  const activeAgentId = agentIdFromStageKey(activeStageKey);
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
              requestedStageKey: payload.stageKey,
              activeStageKey,
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
  if (response.status === "failed") {
    throw new Error(response.error?.message || response.error?.error?.message || "openai_operation_failed");
  }

  const parsed = parseAgentOutput(response, agent);
  const status = normalizeStatus(parsed.status);
  const nextAgentId = status === "result"
    ? nextAgentIdFor(activeAgentId)
    : "";
  const answer = cleanAssistantMessage(parsed.assistant_message || parsed.summary_for_user || parsed.answer || response.output_text);
  const transferBlock = normalizeTransferBlock(parsed.transfer_block, status);
  const projectSection = parsed.project_section || agent.section;

  await saveAgentRun(query, {
    project,
    member,
    stageKey: activeStageKey,
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

  const nextStageKey = nextAgentId ? stageKeyFromAgentId(nextAgentId) : activeStageKey;

  return {
    ok: true,
    answer,
    agent_id: agent.id,
    status,
    project_section: projectSection,
    transfer_block: transferBlock,
    next_agent_id: nextAgentId,
    next_recommended_agent: nextAgentId,
    active_stage_key: activeStageKey,
    next_stage_key: nextStageKey,
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

function nextAgentIdFor(currentAgentId) {
  const currentIndex = AGENT_IDS.indexOf(currentAgentId);
  return AGENT_IDS[currentIndex + 1] || "";
}

function agentIdFromStageKey(stageKey) {
  // module-1.0  → business_modeling  (Agente 01, único no Módulo 1)
  // module-2.N  → AGENTS[N+1]        (Agentes 02–06 no Módulo 2)
  const [moduleId, stageStr] = String(stageKey || "").split(".");
  const index = Number(stageStr || 0);
  if (moduleId === "module-2") {
    return AGENT_IDS[index + 1] || AGENT_IDS[1];
  }
  return AGENT_IDS[0]; // module-1 sempre usa Agente 01
}

function normalizeStageKey(stageKey) {
  const [moduleId, stageStr] = String(stageKey || "").split(".");
  const index = Number(stageStr || 0);
  if (moduleId === "module-2") {
    return `module-2.${Math.min(Math.max(Number.isFinite(index) ? index : 0, 0), 4)}`;
  }
  return "module-1.0";
}

function stageKeyFromAgentId(agentId) {
  const index = AGENT_IDS.indexOf(agentId);
  if (index <= 0) return "module-1.0";
  return `module-2.${index - 1}`; // target_audience→module-2.0, …, visual_identity→module-2.4
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
        current_stage_key = operation_projects.current_stage_key,
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

// ─── Assistente técnico (Módulos 3+) ────────────────────────────────────────

export async function runTechAssistantTurn({ query, member, payload }) {
  const step = payload.wizardStep || {};
  const project = payload.project || {};
  const stage = payload.stage || {};

  const systemPrompt = [
    "Voce e um assistente tecnico do AXN Consult.",
    "Sua funcao e ajudar empreendedores sem experiencia tecnica a configurar infraestrutura digital passo a passo.",
    "Responda em linguagem simples. Diga onde clicar, o que digitar, o que deve aparecer na tela.",
    "Nao invente configuracoes. Maximo 4 paragrafos curtos.",
    "",
    `ETAPA ATUAL: ${stage.title || ""}`,
    step.title ? `PASSO ATUAL: ${step.title}` : "",
    step.objective ? `OBJETIVO: ${step.objective}` : "",
    step.command ? `COMANDO: ${step.command}` : "",
    step.validation ? `VALIDACAO: ${step.validation}` : "",
    step.done ? `PODE SEGUIR SE: ${step.done}` : "",
    "",
    "DADOS DO PROJETO:",
    `- Dominio: ${project.domain || "nao informado"}`,
    `- IP da VPS: ${project.serverIp || "nao informado"}`,
    `- E-mail tecnico: ${project.technicalEmail || "nao informado"}`
  ].filter(Boolean).join("\n");

  if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
    return {
      ok: true,
      answer: step.objective
        ? `${step.title}: ${step.objective} Valide assim: ${step.validation || ""}`
        : "Configure OPENAI_API_KEY ou ANTHROPIC_API_KEY para ativar o assistente.",
      status: "conversation"
    };
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_TECH_MODEL || process.env.ANTHROPIC_VALIDATOR_MODEL || "claude-haiku-4-5",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: "user", content: payload.message }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        const answer = data.content?.[0]?.text || "Nao consegui processar sua duvida agora.";
        return { ok: true, answer, status: "conversation" };
      }
    } catch (error) {
      console.warn("Tech assistant (Anthropic) failed:", error.message);
    }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1024,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: payload.message }
        ]
      })
    });
    if (response.ok) {
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content || "Nao consegui processar sua duvida agora.";
      return { ok: true, answer, status: "conversation" };
    }
  } catch (error) {
    console.warn("Tech assistant (OpenAI) failed:", error.message);
  }

  return {
    ok: true,
    answer: step.objective ? `${step.title}: ${step.objective}` : "Nao consegui acionar o assistente agora.",
    status: "conversation"
  };
}

// ─── Versão streaming ───────────────────────────────────────────────────────

export async function streamOperationAgentTurn({ rootDir, query, member, payload, onDelta, onDone }) {
  if (!process.env.OPENAI_API_KEY) {
    onDone({
      ok: true,
      fallback: true,
      answer: "A conexao com a OpenAI ainda nao esta configurada neste ambiente. Configure OPENAI_API_KEY na stack do site e rode o deploy novamente.",
      status: "configuration_error",
      agent_id: resolveAgentId(payload.stage?.agentId),
      next_agent_id: "",
      next_stage_key: payload.stageKey || "module-1.0",
      transfer_block: emptyTransferBlock()
    });
    return;
  }

  const project = await upsertOperationProject(query, member, payload);
  const activeStageKey = normalizeStageKey(project.current_stage_key || payload.stageKey);
  const activeAgentId = agentIdFromStageKey(activeStageKey);
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
            status: { type: "string", enum: ["conversation", "result"] },
            assistant_message: { type: "string" },
            next_agent_id: { type: "string" },
            transfer_block: {
              type: "object",
              additionalProperties: false,
              required: ["section_title", "content", "key_points"],
              properties: {
                section_title: { type: "string" },
                content: { type: "string" },
                key_points: { type: "array", items: { type: "string" } }
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
              requestedStageKey: payload.stageKey,
              activeStageKey,
              activeAgentId,
              validAgentIds: AGENT_IDS,
              previousDeliveries: history.completedBlocks,
              conversationThread: thread,
              userMessage: payload.message
            })
          }
        ]
      }
    ],
    stream: true
  };

  if (agent.webSearch && process.env.OPENAI_OPERATION_WEB_SEARCH !== "false") {
    openaiRequest.tools = [{ type: "web_search_preview" }];
  }

  // Agente 01: suprimir streaming em tempo real → acumular → validar com Claude → enviar tudo de uma vez.
  // Outros agentes: streaming direto ao frontend.
  const shouldValidate = activeAgentId === "business_modeling";
  const deltaProxy = shouldValidate ? () => {} : onDelta;

  await callOpenAIStream(openaiRequest, deltaProxy, async (fullText, responseId) => {
    const parsed = parseAgentOutput({ output_text: fullText }, agent);
    const status = normalizeStatus(parsed.status);
    const nextAgentId = status === "result" ? nextAgentIdFor(activeAgentId) : "";
    const rawAnswer = cleanAssistantMessage(parsed.assistant_message || parsed.summary_for_user || parsed.answer || fullText);

    // Validação Claude (Agente 01 apenas)
    const answer = shouldValidate ? await validateWithClaude(rawAnswer) : rawAnswer;

    // Para o Agente 01, enviar a mensagem validada de uma vez ao frontend
    if (shouldValidate) onDelta(answer);

    const transferBlock = normalizeTransferBlock(parsed.transfer_block, status);
    const projectSection = parsed.project_section || agent.section;

    await saveAgentRun(query, {
      project,
      member,
      stageKey: activeStageKey,
      agentId: agent.id,
      status,
      userMessage: payload.message,
      answer,
      projectSection,
      transferBlock,
      rawResponse: { output_text: fullText },
      openaiResponseId: responseId
    });

    if (status === "result" && nextAgentId) {
      await updateProjectStage(query, project.id, nextAgentId, payload.project);
    }

    const nextStageKey = nextAgentId ? stageKeyFromAgentId(nextAgentId) : activeStageKey;

    onDone({
      ok: true,
      answer,
      agent_id: agent.id,
      status,
      project_section: projectSection,
      transfer_block: transferBlock,
      next_agent_id: nextAgentId,
      next_recommended_agent: nextAgentId,
      active_stage_key: activeStageKey,
      next_stage_key: nextStageKey,
      openai_response_id: responseId || null
    });
  });
}

async function callOpenAIStream(body, onDelta, onComplete) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Number(process.env.OPENAI_OPERATION_TIMEOUT_MS || 90000)
  );
  const extractor = new AssistantMessageExtractor();
  let fullText = "";
  let responseId = null;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.warn("OpenAI stream returned", response.status, data);
      const fallbackMsg = "Nao consegui acionar o assistente agora. Tente novamente em instantes.";
      onDelta(fallbackMsg);
      await onComplete(
        `{"status":"conversation","assistant_message":${JSON.stringify(fallbackMsg)},"next_agent_id":"","transfer_block":{"section_title":"","content":"","key_points":[]}}`,
        null
      );
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const dataStr = line.slice(6).trim();
        if (dataStr === "[DONE]") continue;

        let event;
        try {
          event = JSON.parse(dataStr);
        } catch {
          continue;
        }

        if (event.type === "response.created" && event.response?.id) {
          responseId = event.response.id;
        }

        if (event.type === "response.output_text.delta" && event.delta) {
          fullText += event.delta;
          const extracted = extractor.push(event.delta);
          if (extracted) onDelta(extracted);
        }
      }
    }

    await onComplete(fullText, responseId);
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Geração do Planejamento Estratégico ─────────────────────────────────────

export async function generateStrategicPlanMarkdown(query, projectId, projectName) {
  const result = await query(
    `
      select agent_id, project_section, status, transfer_block_json, created_at
      from operation_agent_runs
      where project_id = $1::uuid
      order by created_at asc
    `,
    [projectId]
  );

  // Pega o último result de cada agente
  const blocks = {};
  for (const row of result.rows) {
    if (normalizeStatus(row.status) === "result" && row.transfer_block_json) {
      blocks[row.agent_id] = row.transfer_block_json;
    }
  }

  const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const SECTION_LABELS = [
    { id: "business_modeling",         title: "1. Modelagem de Negócio" },
    { id: "target_audience",           title: "2. Público-Alvo" },
    { id: "strategic_differentiation", title: "3. Diferencial Estratégico" },
    { id: "strategic_pricing",         title: "4. Precificação Estratégica" },
    { id: "product_concept",           title: "5. Conceito de Produto" },
    { id: "visual_identity",           title: "6. Identidade Visual" }
  ];

  const lines = [
    `# Planejamento Estratégico — ${projectName}`,
    `Gerado em: ${date}`,
    ""
  ];

  for (const section of SECTION_LABELS) {
    const block = blocks[section.id];
    lines.push(`## ${section.title}`);
    if (!block) {
      lines.push("_Etapa não concluída._");
    } else {
      if (block.section_title) lines.push(`**${block.section_title}**`);
      if (block.content) lines.push("", block.content);
      if (Array.isArray(block.key_points) && block.key_points.length) {
        lines.push("");
        for (const point of block.key_points) {
          lines.push(`- ${point}`);
        }
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ─── Infraestrutura de banco (mantida abaixo) ────────────────────────────────

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
