import { readFile } from "node:fs/promises";
import path from "node:path";

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

// Anexos do chat (Módulo 1): o browser envia data URLs e eles seguem direto à OpenAI
// como input_image/input_file — sem parser no servidor, por decisão de produto.
const ATTACHMENT_DATA_URL_PATTERN = /^data:(image\/(png|jpeg|webp|gif)|application\/pdf);base64,[A-Za-z0-9+/=]+$/;
const ATTACHMENT_MAX_COUNT = 4;
const ATTACHMENT_MAX_TOTAL_CHARS = 7.5 * 1024 * 1024; // ~5,5MB de arquivo em base64, sob o limite de 8MB do body

function attachmentContentParts(attachments) {
  const parts = [];
  let totalChars = 0;

  for (const item of (Array.isArray(attachments) ? attachments : []).slice(0, ATTACHMENT_MAX_COUNT)) {
    const dataUrl = String(item?.dataUrl || "");
    if (!ATTACHMENT_DATA_URL_PATTERN.test(dataUrl)) continue;
    totalChars += dataUrl.length;
    if (totalChars > ATTACHMENT_MAX_TOTAL_CHARS) break;

    if (dataUrl.startsWith("data:application/pdf")) {
      parts.push({
        type: "input_file",
        filename: sanitizeAttachmentName(item.name) || "documento.pdf",
        file_data: dataUrl
      });
    } else {
      parts.push({ type: "input_image", image_url: dataUrl });
    }
  }

  return parts;
}

function sanitizeAttachmentName(name) {
  return String(name || "")
    .replace(/[^\w. \-()]/g, "_")
    .trim()
    .slice(0, 80);
}

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
  const priorStudentAnswers = await loadPriorStudentAnswers(query, project.id, activeStageKey);
  const instructions = await buildInstructions(rootDir, agent, history, priorStudentAnswers);
  const openaiRequest = buildOperationRequest({
    agent,
    payload,
    activeStageKey,
    activeAgentId,
    history,
    thread,
    instructions,
    priorStudentAnswers
  });

  const response = await callOpenAI(openaiRequest);
  if (response.status === "failed") {
    throw new Error(response.error?.message || response.error?.error?.message || "openai_operation_failed");
  }

  const parsed = parseAgentOutput(response, agent);
  let status = normalizeStatus(parsed.status);
  let answer = cleanAssistantMessage(parsed.assistant_message || parsed.summary_for_user || parsed.answer || response.output_text);
  let transferBlock = normalizeTransferBlock(parsed.transfer_block, status);
  ({ status, answer, transferBlock } = await applyHypothesisReview({ agent, status, answer, transferBlock, payload }));
  ({ status, answer, transferBlock } = await applyStageDeliveryReview({
    agent, status, answer, transferBlock, payload, history, baseRequest: openaiRequest
  }));
  const nextAgentId = status === "result"
    ? nextAgentIdFor(activeAgentId)
    : "";
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

// Schema de saída compartilhado pelos turnos com e sem streaming.
const OPERATION_TURN_SCHEMA = {
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
};

function buildOperationRequest({ agent, payload, activeStageKey, activeAgentId, history, thread, instructions, priorStudentAnswers }) {
  const request = {
    model: process.env.OPENAI_OPERATION_MODEL || "gpt-5.1",
    instructions,
    text: {
      format: {
        type: "json_schema",
        name: "operation_agent_turn",
        strict: true,
        schema: OPERATION_TURN_SCHEMA
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
              priorStudentAnswers: priorStudentAnswers || undefined,
              conversationThread: thread,
              userMessage: payload.message
            })
          },
          ...attachmentContentParts(payload.attachments)
        ]
      }
    ]
  };

  if (agent.webSearch && process.env.OPENAI_OPERATION_WEB_SEARCH !== "false") {
    request.tools = [{ type: "web_search_preview" }];
  }

  return request;
}

async function buildInstructions(rootDir, agent, history, priorStudentAnswers) {
  const prompt = await loadPrompt(rootDir, agent.promptFile);
  const priorAnswersSection = priorStudentAnswers
    ? [
        "",
        "## Respostas que o aluno JA DEU em etapas anteriores",
        "O campo priorStudentAnswers do input reune, por etapa, respostas que o aluno ja deu nas etapas anteriores da jornada.",
        "Nunca re-pergunte algo que ja esta respondido ali. Afirme o que ja sabe e siga adiante.",
        "Chegue com contexto: quando fizer sentido, resuma brevemente o que ja sabe sobre o tema da sua etapa e pergunte apenas o que ainda falta."
      ]
    : [];
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
    ...priorAnswersSection,
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

// ─── Contexto cumulativo entre etapas ────────────────────────────────────────
// Os threads do app são por-etapa; o que cruza etapas server-side são as
// respostas que o aluno já deu (role='user') nas etapas anteriores à ativa.
// Caps para segurar o tamanho do prompt: por mensagem, por etapa e global.

const PRIOR_ANSWERS_MESSAGE_CAP = 400;
const PRIOR_ANSWERS_STAGE_CAP = 3500;
const PRIOR_ANSWERS_TOTAL_CAP = 18000;

const STAGE_ORDER = ["module-1.0", "module-2.0", "module-2.1", "module-2.2", "module-2.3", "module-2.4"];

async function loadPriorStudentAnswers(query, projectId, activeStageKey) {
  const activeIndex = STAGE_ORDER.indexOf(normalizeStageKey(activeStageKey));
  if (activeIndex <= 0) return null;
  const priorStages = STAGE_ORDER.slice(0, activeIndex);

  const result = await query(
    `
      select stage_key, content
      from operation_conversation_messages
      where project_id = $1::uuid
        and role = 'user'
        and stage_key = any($2::text[])
      order by created_at asc
    `,
    [projectId, priorStages]
  );

  const rowsByStage = new Map(priorStages.map((stage) => [stage, []]));
  for (const row of result.rows) {
    rowsByStage.get(row.stage_key)?.push(row.content);
  }

  const answers = {};
  let totalChars = 0;

  for (const stage of priorStages) {
    const messages = [];
    let stageChars = 0;
    for (const content of rowsByStage.get(stage)) {
      const text = String(content || "").trim().slice(0, PRIOR_ANSWERS_MESSAGE_CAP);
      if (!text) continue;
      if (stageChars + text.length > PRIOR_ANSWERS_STAGE_CAP) break;
      if (totalChars + text.length > PRIOR_ANSWERS_TOTAL_CAP) break;
      messages.push(text);
      stageChars += text.length;
      totalChars += text.length;
    }
    if (messages.length) answers[stage] = messages;
    if (totalChars >= PRIOR_ANSWERS_TOTAL_CAP) break;
  }

  if (!totalChars) return null;

  console.log(
    `[operation] priorStudentAnswers para ${activeStageKey}: ${totalChars} chars em ${Object.keys(answers).length} etapa(s)`
  );
  return answers;
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

// ─── Revisão independente da hipótese (Módulo 1) ────────────────────────────
// Quando o Agente 01 conclui (status "result"), um segundo modelo (Claude) revisa
// a entrevista inteira + hipótese ANTES de a entrega chegar ao aluno. Se reprovar,
// o turno volta a "conversation" com lacunas objetivas — o Agente 01 pergunta só
// aquilo na rodada seguinte. O parecer é sempre visível ao aluno, que dá o aceite
// final. Sem ANTHROPIC_API_KEY ou em caso de falha, a conclusão segue sem revisão.

const REVIEW_MARKER = "Revisão independente";
const REVIEW_MARKER_PATTERN = /Revis[aã]o independente/i;

async function applyHypothesisReview({ agent, status, answer, transferBlock, payload }) {
  if (agent.id !== "business_modeling" || status !== "result") {
    return { status, answer, transferBlock };
  }

  const thread = normalizeThread(payload.thread);
  const priorReturns = thread.filter(
    (message) => message.role === "assistant" && REVIEW_MARKER_PATTERN.test(message.text)
  ).length;

  const review = await reviewBusinessHypothesis({
    thread,
    userMessage: payload.message,
    answer,
    transferBlock,
    priorReturns
  });
  if (!review) return { status, answer, transferBlock };

  if (review.verdict === "aprovado") {
    return {
      status,
      answer: `${answer}\n\n✅ ${REVIEW_MARKER}: ${review.parecer}`,
      transferBlock
    };
  }

  const lacunas = review.lacunas.length
    ? `\n\nO que ainda falta:\n${review.lacunas.map((item) => `- ${item}`).join("\n")}`
    : "";

  return {
    status: "conversation",
    answer: `${answer}\n\n🔎 ${REVIEW_MARKER}: ${review.parecer}${lacunas}\n\nVamos fechar esses pontos antes de concluir?`,
    transferBlock: emptyTransferBlock()
  };
}

async function reviewBusinessHypothesis({ thread, userMessage, answer, transferBlock, priorReturns }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("Hypothesis review skipped: ANTHROPIC_API_KEY ausente");
    return null;
  }

  const system = [
    "Voce e o revisor independente do modulo de Modelagem de Negocio da AXN Consult.",
    "O Agente entrevistador acredita ter concluido a etapa: o aluno escolheu uma hipotese de negocio.",
    "Sua funcao e revisar a entrevista inteira e a entrega proposta e decidir se a hipotese esta pronta.",
    "",
    "Aprove somente se as tres condicoes forem verdadeiras:",
    "1. A hipotese tem mercado comprador: a entrevista cita sinais concretos (concorrentes vendendo, categoria compravel, demanda visivel). NAO exija ticket, preco, faturamento ou modelo financeiro — precificacao pertence a outra etapa da jornada.",
    "2. A hipotese conecta com competencia ou interesse real do aluno que apareceu na entrevista — nao e uma ideia genericamente boa para outra pessoa.",
    "3. A hipotese e operacional e testavel por um iniciante, nao ampla ou vaga demais.",
    "",
    "Seja pragmatico: isto e uma hipotese para o aluno TESTAR, nao um plano de negocio. Devolva 'revisar' apenas por lacunas que comprometem materialmente a viabilidade ou a conexao com o aluno. Nao devolva por perfeccionismo.",
    "Se devolucoesAnteriores for 2 ou mais, aprove salvo problema fundamental, registrando os riscos restantes no parecer.",
    "",
    "O campo 'parecer' sera exibido ao aluno: escreva 2 a 4 frases dirigidas a ele, em tom respeitoso e direto, sem jargao e sem mencionar agentes, prompts ou sistemas.",
    "O campo 'lacunas' (apenas quando verdict for 'revisar') lista no maximo 3 itens objetivos, cada um algo que o aluno consegue responder na conversa.",
    "",
    'Responda APENAS com JSON valido neste formato: {"verdict":"aprovado","parecer":"...","lacunas":[]} ou {"verdict":"revisar","parecer":"...","lacunas":["..."]}'
  ].join("\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.ANTHROPIC_VALIDATOR_TIMEOUT_MS || 45000));

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_VALIDATOR_MODEL || "claude-sonnet-5",
        max_tokens: 1024,
        system,
        messages: [
          {
            role: "user",
            content: JSON.stringify({
              entrevista: thread,
              ultimaMensagemDoAluno: userMessage,
              entregaProposta: answer,
              blocoEstruturado: transferBlock,
              devolucoesAnteriores: priorReturns
            })
          }
        ]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.warn("Hypothesis review returned", response.status, data);
      return null;
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const parsed = JSON.parse(extractJsonText(text));
    if (!["aprovado", "revisar"].includes(parsed.verdict) || !parsed.parecer) {
      console.warn("Hypothesis review returned unexpected shape", text.slice(0, 200));
      return null;
    }

    return {
      verdict: parsed.verdict,
      parecer: String(parsed.parecer).trim(),
      lacunas: Array.isArray(parsed.lacunas) ? parsed.lacunas.map((item) => String(item).trim()).filter(Boolean) : []
    };
  } catch (error) {
    console.warn("Hypothesis review failed:", error.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Revisão silenciosa das etapas do Módulo 2 ──────────────────────────────
// Quando um agente 02–06 conclui (status "result"), o revisor Claude avalia a
// entrega ANTES de ela chegar ao aluno. Se reprovar, o servidor re-chama a
// OpenAI com as lacunas em uma mensagem interna ("o aluno não vê") e entrega a
// versão corrigida — máximo 1 ciclo, fail-open (falhou qualquer parte, a
// entrega original segue). Diferente do Módulo 1, o aluno nunca vê parecer.
// O streaming visual está desligado no app, então os deltas da versão
// reprovada nunca aparecem: o aluno só vê o "done" com a versão final.

const STAGE_REVIEW_CRITERIA = {
  target_audience:
    "O publico-alvo esta especifico e alcancavel: um grupo que o aluno consegue identificar, encontrar e acessar na pratica — nao 'todo mundo' nem um recorte vago.",
  strategic_differentiation:
    "O diferencial nao e generico: nada de 'qualidade', 'atendimento personalizado' ou promessas que qualquer concorrente diria. Precisa se apoiar em algo real do aluno ou da oferta.",
  strategic_pricing:
    "O preco proposto esta justificado e coerente com o publico, a oferta e a meta financeira do aluno que aparecem na conversa e nas entregas anteriores.",
  product_concept:
    "O conceito de produto esta completo: o que e, para quem, formato de entrega e promessa central — o aluno deve conseguir descrever o produto a alguem sem pontas soltas.",
  visual_identity:
    "A identidade visual e aplicavel na pratica: paleta, tipografia e diretrizes que o aluno consegue usar diretamente nas pecas, coerentes com o posicionamento."
};

async function applyStageDeliveryReview({ agent, status, answer, transferBlock, payload, history, baseRequest }) {
  if (!STAGE_REVIEW_CRITERIA[agent.id] || status !== "result") {
    return { status, answer, transferBlock };
  }

  const review = await reviewStageDelivery({
    agent,
    thread: normalizeThread(payload.thread),
    userMessage: payload.message,
    answer,
    transferBlock,
    completedBlocks: history.completedBlocks
  });
  if (!review || review.verdict === "aprovado") {
    return { status, answer, transferBlock };
  }

  console.log(`[operation] revisao interna reprovou ${agent.id}; lacunas: ${review.lacunas.join(" | ")}`);
  const corrected = await runInternalStageCorrection({ agent, baseRequest, answer, transferBlock, review });
  if (!corrected) return { status, answer, transferBlock };
  return corrected;
}

async function reviewStageDelivery({ agent, thread, userMessage, answer, transferBlock, completedBlocks }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("Stage review skipped: ANTHROPIC_API_KEY ausente");
    return null;
  }

  const system = [
    "Voce e o revisor interno das etapas do Diagnostico Estrategico da AXN Consult.",
    "O agente da etapa acredita ter concluido a entrega. Revise a conversa e a entrega proposta e decida se ela esta pronta.",
    "O aluno NUNCA ve este parecer — ele alimenta apenas uma correcao interna.",
    "",
    "Aprove somente se as tres condicoes forem verdadeiras:",
    `1. ${STAGE_REVIEW_CRITERIA[agent.id]}`,
    "2. A entrega e coerente com as entregas anteriores do projeto (entregasAnteriores) — nao contradiz publico, posicionamento ou decisoes ja fechadas.",
    "3. A entrega se apoia no que o aluno realmente disse na conversa — sem fatos inventados sobre o aluno ou o negocio.",
    "",
    "Seja pragmatico: devolva 'revisar' apenas por lacunas que comprometem materialmente a entrega. Nao devolva por perfeccionismo nem por estilo.",
    "O campo 'lacunas' (apenas quando verdict for 'revisar') lista no maximo 3 itens objetivos, corrigiveis com o que ja existe na conversa ou perguntaveis ao aluno.",
    "",
    'Responda APENAS com JSON valido neste formato: {"verdict":"aprovado","lacunas":[]} ou {"verdict":"revisar","lacunas":["..."]}'
  ].join("\n");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.ANTHROPIC_VALIDATOR_TIMEOUT_MS || 45000));

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_VALIDATOR_MODEL || "claude-sonnet-5",
        max_tokens: 1024,
        system,
        messages: [
          {
            role: "user",
            content: JSON.stringify({
              etapa: agent.section,
              conversa: thread,
              ultimaMensagemDoAluno: userMessage,
              entregaProposta: answer,
              blocoEstruturado: transferBlock,
              entregasAnteriores: completedBlocks
            })
          }
        ]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.warn("Stage review returned", response.status, data);
      return null;
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const parsed = JSON.parse(extractJsonText(text));
    if (!["aprovado", "revisar"].includes(parsed.verdict)) {
      console.warn("Stage review returned unexpected shape", text.slice(0, 200));
      return null;
    }

    return {
      verdict: parsed.verdict,
      lacunas: Array.isArray(parsed.lacunas) ? parsed.lacunas.map((item) => String(item).trim()).filter(Boolean) : []
    };
  } catch (error) {
    console.warn("Stage review failed:", error.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function runInternalStageCorrection({ agent, baseRequest, answer, transferBlock, review }) {
  const request = structuredClone(baseRequest);
  delete request.stream;
  request.input = [
    ...request.input,
    {
      role: "assistant",
      content: [
        {
          type: "output_text",
          text: JSON.stringify({
            status: "result",
            assistant_message: answer,
            next_agent_id: "",
            transfer_block: transferBlock
          })
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: [
            "REVISAO INTERNA — o aluno NAO ve esta mensagem nem a entrega que voce propos nesta rodada.",
            "Um revisor independente apontou lacunas na sua entrega:",
            ...review.lacunas.map((item) => `- ${item}`),
            "",
            "Reescreva a entrega final da etapa corrigindo essas lacunas, usando apenas informacoes que o aluno ja deu na conversa e nas etapas anteriores.",
            "Se alguma lacuna so puder ser resolvida com informacao nova do aluno, responda com status 'conversation' fazendo as perguntas necessarias.",
            "Nunca mencione revisao, revisor ou correcao ao aluno."
          ].join("\n")
        }
      ]
    }
  ];

  const response = await callOpenAI(request);
  if (response.status === "failed") return null;

  const parsed = parseAgentOutput(response, agent);
  const status = normalizeStatus(parsed.status);
  return {
    status,
    answer: cleanAssistantMessage(parsed.assistant_message || parsed.summary_for_user || parsed.answer || response.output_text),
    transferBlock: normalizeTransferBlock(parsed.transfer_block, status)
  };
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
  const priorStudentAnswers = await loadPriorStudentAnswers(query, project.id, activeStageKey);
  const instructions = await buildInstructions(rootDir, agent, history, priorStudentAnswers);
  const openaiRequest = buildOperationRequest({
    agent,
    payload,
    activeStageKey,
    activeAgentId,
    history,
    thread,
    instructions,
    priorStudentAnswers
  });
  openaiRequest.stream = true;

  await callOpenAIStream(openaiRequest, onDelta, async (fullText, responseId) => {
    const parsed = parseAgentOutput({ output_text: fullText }, agent);
    let status = normalizeStatus(parsed.status);
    let answer = cleanAssistantMessage(parsed.assistant_message || parsed.summary_for_user || parsed.answer || fullText);
    let transferBlock = normalizeTransferBlock(parsed.transfer_block, status);
    ({ status, answer, transferBlock } = await applyHypothesisReview({ agent, status, answer, transferBlock, payload }));
    ({ status, answer, transferBlock } = await applyStageDeliveryReview({
      agent, status, answer, transferBlock, payload, history, baseRequest: openaiRequest
    }));
    const nextAgentId = status === "result" ? nextAgentIdFor(activeAgentId) : "";
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
    // Linhas SSE podem chegar cortadas entre chunks — o resto fica no buffer
    let lineBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      lineBuffer += decoder.decode(value, { stream: true });
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop();

      for (const line of lines) {
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
