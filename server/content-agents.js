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

export async function streamContentGeneration({ rootDir, query, member, payload, onDelta, onDone }) {
  const { agentType, project, context } = payload;
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

  const today = new Date().toLocaleDateString("pt-BR");
  // A grade começa na segunda-feira da semana seguinte — dá folga para o aluno
  // terminar a implementação guiada antes do primeiro post
  const gridStart = new Date();
  const daysUntilNextMonday = ((8 - gridStart.getDay()) % 7) || 7;
  gridStart.setDate(gridStart.getDate() + daysUntilNextMonday);
  const gridStartDate = gridStart.toLocaleDateString("pt-BR");

  const FORMAT_MAP = {
    roteiros_reels:     "Reels / Shorts",
    roteiros_carrossel: "Carrossel",
    roteiros_feed:      "Feed",
    roteiros_stories:   "Stories"
  };

  let promptFile;
  let systemAddendum;

  if (agentType === "grade_postagens") {
    promptFile = "7 - AXN _ Grade de Postagens.md";
    systemAddendum = [
      "",
      "## Contexto de execução",
      "",
      `Hoje é ${today}.`,
      `Data de início da grade: ${gridStartDate} (segunda-feira). O primeiro dia da grade é essa data, e os 28 dias correm a partir dela.`,
      "",
      "## Planejamento estratégico do empreendimento",
      "",
      strategicDoc
    ].join("\n");
  } else if (FORMAT_MAP[agentType]) {
    const format = FORMAT_MAP[agentType];
    promptFile = "8 - AXN _ Conteúdo de Posts.md";
    const gradeSection = context?.grade
      ? `\n\n## Grade de postagens aprovada\n\n${context.grade}`
      : "";
    systemAddendum = [
      "",
      "## Formato solicitado pelo wizard",
      "",
      `Gere SOMENTE o formato: **${format}**`,
      "",
      "## Planejamento estratégico",
      "",
      strategicDoc,
      gradeSection
    ].join("\n");
  } else if (agentType === "site_prd") {
    promptFile = "10 - AXN _ PRD do Site.md";
    systemAddendum = [
      "",
      "## Dados do projeto (use exatamente estes valores no PRD)",
      "",
      `- Domínio: ${project?.domain || "NAO_INFORMADO"}`,
      `- IP da VPS: ${project?.serverIp || "NAO_INFORMADO"}`,
      `- Plataforma de pagamento: ${project?.paymentPlatform || "Stripe"}`,
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

export async function generateCampaignImage({ rootDir, query, member, payload }) {
  const { project, feedback, previousImage, customBrief } = payload;
  const projectId = project?.id;

  if (!process.env.OPENAI_API_KEY) {
    return { ok: false, error: "openai_not_configured" };
  }

  // Ajuste iterativo: se há feedback e a imagem anterior, edita preservando a
  // composição em vez de gerar do zero. Se a edição falhar, cai na regeneração.
  if (feedback && previousImage) {
    const edited = await editCampaignImage({ previousImage, feedback });
    if (edited) return edited;
  }

  let strategicDoc;
  try {
    strategicDoc = await loadStrategicDocument(query, member, projectId);
  } catch (error) {
    console.warn("content-agents: failed to load strategic document for image", error.message);
    strategicDoc = "Planejamento estratégico não disponível.";
  }

  let agent9Prompt;
  try {
    agent9Prompt = await loadAgentPrompt(rootDir, "9 - AXN _ Comunicação Visual.md");
  } catch (error) {
    console.warn("content-agents: Agent 9 prompt file missing", error.message);
    return { ok: false, error: "prompt_file_missing" };
  }
  const systemForImagePrompt = agent9Prompt + "\n\n## Planejamento estratégico\n\n" + strategicDoc;

  const briefBlock = customBrief
    ? `\n\nO empreendedor forneceu este direcionamento próprio (logo, nome, conceito ou ideia de peça) — incorpore-o com prioridade sobre suas escolhas criativas, mantendo a identidade visual do planejamento: "${customBrief}"`
    : "";
  const userMessage = (feedback
    ? `Gere um novo prompt de imagem incorporando este feedback: "${feedback}"`
    : "Gere o prompt de imagem para a peça de campanha.") + briefBlock;

  let imagePrompt;
  try {
    const promptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CONTENT_MODEL || "gpt-4.1",
        messages: [
          { role: "system", content: systemForImagePrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 600
      })
    });

    if (!promptResponse.ok) {
      const errData = await promptResponse.json().catch(() => ({}));
      console.warn("Agent 9 prompt generation failed", promptResponse.status, errData);
      return { ok: false, error: "image_prompt_failed" };
    }

    const promptData = await promptResponse.json();
    imagePrompt = (promptData.choices?.[0]?.message?.content || "").trim();
  } catch (error) {
    console.warn("Agent 9 call failed:", error.message);
    return { ok: false, error: "image_prompt_failed" };
  }

  if (!imagePrompt) {
    return { ok: false, error: "image_prompt_empty" };
  }

  // gpt-image-2 é o modelo atual (abr/2026); cadeia de fallback para contas
  // sem acesso: gpt-image-2 → gpt-image-1 → dall-e-3
  const primaryModel = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
  const configFor = (model) => model === "dall-e-3"
    ? { model, size: "1024x1792", response_format: "url" }
    : { model, size: "1024x1536" };
  const seen = new Set();
  const attempts = [primaryModel, "gpt-image-1", "dall-e-3"]
    .filter((model) => !seen.has(model) && seen.add(model))
    .map(configFor);

  let lastDetail = "";

  for (const attempt of attempts) {
    const body = {
      model: attempt.model,
      prompt: imagePrompt,
      n: 1,
      size: attempt.size
    };
    if (attempt.response_format) body.response_format = attempt.response_format;

    try {
      const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const imageData = await imageResponse.json().catch(() => ({}));

      if (!imageResponse.ok) {
        lastDetail = imageData.error?.message || `HTTP ${imageResponse.status}`;
        console.warn(`Image generation failed (${attempt.model})`, imageResponse.status, lastDetail);
        continue;
      }

      const item = imageData.data?.[0] || {};
      const url = item.url || (item.b64_json ? `data:image/png;base64,${item.b64_json}` : "");

      if (url) {
        return { ok: true, url, prompt: imagePrompt, model: attempt.model };
      }
      lastDetail = "resposta da API sem imagem";
    } catch (error) {
      lastDetail = error.message;
      console.warn(`Image generation request failed (${attempt.model}):`, error.message);
    }
  }

  return { ok: false, error: "image_generation_failed", detail: lastDetail };
}

async function editCampaignImage({ previousImage, feedback }) {
  const match = /^data:image\/(png|jpeg|webp);base64,(.+)$/.exec(String(previousImage || ""));
  if (!match) return null;

  const buffer = Buffer.from(match[2], "base64");
  const primaryModel = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
  // dall-e-3 não suporta edição — só os modelos gpt-image
  const seen = new Set();
  const models = [primaryModel, "gpt-image-1"]
    .filter((model) => model !== "dall-e-3" && !seen.has(model) && seen.add(model));

  for (const model of models) {
    try {
      const form = new FormData();
      form.append("model", model);
      form.append("image", new Blob([buffer], { type: `image/${match[1]}` }), "previous.png");
      form.append("prompt", `Apply ONLY this requested change and keep everything else in the image exactly the same (composition, people, colors, text): ${feedback}`);
      form.append("size", "1024x1536");

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: form
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.warn(`Image edit failed (${model})`, response.status, data.error?.message || "");
        continue;
      }

      const item = data.data?.[0] || {};
      const url = item.url || (item.b64_json ? `data:image/png;base64,${item.b64_json}` : "");
      if (url) {
        return { ok: true, url, prompt: feedback, model, edited: true };
      }
    } catch (error) {
      console.warn(`Image edit request failed (${model}):`, error.message);
    }
  }

  return null;
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
