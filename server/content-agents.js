import { readFile } from "node:fs/promises";
import path from "node:path";

const PROMPT_CACHE = new Map();

async function loadAgentPrompt(rootDir, filename) {
  if (PROMPT_CACHE.has(filename)) return PROMPT_CACHE.get(filename);
  const filePath = path.join(rootDir, "source-material", "Agents", filename);
  const content = await readFile(filePath, "utf8");
  PROMPT_CACHE.set(filename, content);
  return content;
}

async function loadStrategicDocument(query, member, projectId) {
  const result = await query(
    `select agent_id, transfer_block_json
     from operation_agent_runs
     where project_id = $1::uuid and member_id = $2::uuid
       and status = 'result' and transfer_block_json is not null
     order by created_at asc`,
    [projectId, member.id]
  );

  const blocks = {};
  for (const row of result.rows) {
    if (!blocks[row.agent_id]) {
      blocks[row.agent_id] = row.transfer_block_json;
    }
  }

  const SECTIONS = [
    { id: "business_modeling",         title: "1. Modelagem de Negócio" },
    { id: "target_audience",           title: "2. Público-Alvo" },
    { id: "strategic_differentiation", title: "3. Diferencial Estratégico" },
    { id: "strategic_pricing",         title: "4. Precificação Estratégica" },
    { id: "product_concept",           title: "5. Conceito de Produto" },
    { id: "visual_identity",           title: "6. Identidade Visual" }
  ];

  const lines = ["# Planejamento Estratégico\n"];
  for (const section of SECTIONS) {
    const block = blocks[section.id];
    lines.push(`## ${section.title}`);
    if (block) {
      if (block.section_title) lines.push(`**${block.section_title}**`);
      if (block.content) lines.push("", block.content);
      if (Array.isArray(block.key_points) && block.key_points.length) {
        lines.push("");
        for (const point of block.key_points) lines.push(`- ${point}`);
      }
    } else {
      lines.push("_Não concluída._");
    }
    lines.push("");
  }

  return lines.join("\n");
}

// Geração de conteúdo do Módulo 4 (grade, roteiros, peça de campanha) foi
// aposentada em 2026-07: a rotina de divulgação vive nos fluxos n8n do aluno,
// gerados no painel de gestão (buildGradePostagensWorkflowJson / buildFabricaImagensWorkflowJson).
export async function streamContentGeneration({ rootDir, query, member, payload, onDelta, onDone }) {
  const { agentType, project } = payload;
  const projectId = project?.id;

  if (!process.env.OPENAI_API_KEY) {
    onDelta("OPENAI_API_KEY não configurada. Configure a chave na stack e faça o deploy novamente.");
    onDone({ ok: false, error: "openai_not_configured" });
    return;
  }

  let strategicDoc;
  try {
    strategicDoc = await loadStrategicDocument(query, member, projectId);
  } catch (error) {
    console.warn("content-agents: failed to load strategic document", error.message);
    strategicDoc = "Planejamento estratégico não disponível.";
  }

  let promptFile;
  let systemAddendum;

  if (agentType === "site_prd") {
    promptFile = "10 - AXN _ PRD do Site.md";
    systemAddendum = [
      "",
      "## Dados do projeto (use exatamente estes valores no PRD)",
      "",
      `- Domínio: ${project?.domain || "NAO_INFORMADO"}`,
      `- IP da VPS: ${project?.serverIp || "NAO_INFORMADO"}`,
      `- Plataforma de pagamento: ${project?.paymentPlatform || "Mercado Pago"}`,
      `- Link de pagamento (checkout): ${project?.paymentLink || "NAO_INFORMADO"}`,
      "",
      "## Planejamento estratégico do empreendimento",
      "",
      strategicDoc
    ].join("\n");
  } else if (agentType === "atendimento_prompt") {
    promptFile = "11 - AXN _ Agente de Atendimento.md";
    systemAddendum = [
      "",
      "## Dados do projeto (use exatamente estes valores)",
      "",
      `- Site do negócio (direcione interessados para cá): https://${project?.domain || "NAO_INFORMADO"}`,
      "",
      "## Planejamento estratégico do empreendimento",
      "",
      strategicDoc
    ].join("\n");
  } else if (agentType === "painel_prd") {
    promptFile = "12 - AXN _ PRD do Painel.md";
    systemAddendum = [
      "",
      "## Dados do projeto (use exatamente estes valores no PRD)",
      "",
      `- Domínio: ${project?.domain || "NAO_INFORMADO"}`,
      `- IP da VPS: ${project?.serverIp || "NAO_INFORMADO"}`,
      "",
      "## Planejamento estratégico do empreendimento",
      "",
      strategicDoc
    ].join("\n");
  } else {
    onDelta("Tipo de agente inválido.");
    onDone({ ok: false, error: "invalid_agent_type" });
    return;
  }

  let agentPrompt;
  try {
    agentPrompt = await loadAgentPrompt(rootDir, promptFile);
  } catch (error) {
    console.warn(`content-agents: prompt file missing (${promptFile})`, error.message);
    onDone({ ok: false, error: "prompt_file_missing" });
    return;
  }
  const systemPrompt = agentPrompt + systemAddendum;

  const openaiRequest = {
    model: process.env.OPENAI_CONTENT_MODEL || "gpt-4.1",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Pode gerar." }
    ],
    max_tokens: 8000
  };

  await callOpenAIChatStream(openaiRequest, onDelta, onDone);
}

async function callOpenAIChatStream(body, onDelta, onDone) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Number(process.env.OPENAI_CONTENT_TIMEOUT_MS || 120000)
  );

  let fullText = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
      console.warn("OpenAI content stream returned", response.status, data);
      const msg = "Não consegui acionar o agente agora. Tente novamente em instantes.";
      onDelta(msg);
      onDone({ ok: false, error: "stream_failed" });
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

        const delta = event.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;
          onDelta(delta);
        }
      }
    }

    onDone({ ok: true, text: fullText });
  } catch (error) {
    console.warn("Content stream failed:", error.message);
    onDone({ ok: false, error: "stream_failed" });
  } finally {
    clearTimeout(timeout);
  }
}
