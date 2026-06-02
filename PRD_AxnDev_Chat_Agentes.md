# PRD — Sistema de Chat com Agentes Especialistas
**Projeto:** Axn_Dev  
**Stack:** Next.js / React / PostgreSQL / OpenAI Responses API  
**Para:** Claude Code  
**Data:** Junho 2026

---

## Contexto e objetivo

O site já existe em Next.js com área de membros. O objetivo é adicionar um módulo de chat que conduz o usuário autenticado por uma entrevista sequencial com 6 Agentes Especialistas hospedados na OpenAI Platform (Responses API com handoffs nativos). Ao final da entrevista, o sistema gera e salva um Planejamento Estratégico + Agenda de Ações no banco PostgreSQL.

**Problema atual:** Uma tentativa anterior de integrar a OpenAI quebrou o login da área de membros. A correção do login é pré-requisito antes de qualquer nova feature.

---

## Tarefa 0 — Diagnóstico inicial (FAÇA ISSO PRIMEIRO)

Antes de qualquer implementação:

1. Leia toda a estrutura do projeto em `C:\Users\leona\Documents\Jobs\Axn_Dev`
2. Mapeie o que já existe relacionado a:
   - Autenticação (NextAuth, middleware, providers)
   - Rotas de API existentes em `src/app/api/` ou `pages/api/`
   - Qualquer referência à OpenAI (imports, env vars, fetch calls)
   - Schema do banco (migrations, Prisma schema, ou SQL files)
   - Componentes de chat ou área de membros
3. Identifique o que está quebrando o login — procure por:
   - Variáveis de ambiente mal configuradas (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
   - Imports ou referências à OpenAI dentro de arquivos de autenticação
   - Middleware interferindo nas rotas de auth
   - Erros no `[...nextauth].ts` ou equivalente
4. Corrija o login antes de prosseguir
5. Relate o que encontrou e o que corrigiu antes de implementar qualquer nova feature

---

## Arquitetura da solução

```
Usuário autenticado
       │
       ▼
[Chat UI — React]  ←──── SSE stream (resposta em tempo real)
       │
       ▼ POST /api/chat
[Handoff Controller]  ←── lê estado atual da sessão no Postgres
       │
       ├─► OpenAI Responses API (agente atual, com previous_response_id)
       │         │ stream de volta
       │         ▼
       │   [Streaming SSE → frontend]
       │
       └─► POST /api/save  (ao fim de cada agente e ao fim da entrevista)
                 │
                 ▼
          [PostgreSQL]
```

**Regra de segurança crítica:** A `OPENAI_API_KEY` nunca pode aparecer em nenhum arquivo com `'use client'`. Ela só existe no servidor (API Routes).

---

## Tarefa 1 — Variáveis de ambiente

Garanta que o arquivo `.env.local` contenha (sem sobrescrever valores existentes):

```env
# Auth — verifique se já existem e estão corretos
NEXTAUTH_SECRET=<valor existente ou gerar novo com: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# OpenAI — NUNCA expor no frontend
OPENAI_API_KEY=<chave da OpenAI>

# Banco de dados — verifique a string de conexão existente
DATABASE_URL=<string postgres existente no projeto>
```

---

## Tarefa 2 — Schema do banco de dados

Verifique se o projeto usa Prisma, Drizzle, ou SQL puro. Adapte conforme o padrão já existente no projeto.

### Se usar Prisma, adicione ao `schema.prisma`:

```prisma
model InterviewSession {
  id            String    @id @default(cuid())
  userId        String
  status        String    @default("in_progress") // in_progress | completed | abandoned
  currentAgent  Int       @default(1)              // 1 a 6
  lastResponseId String?                           // previous_response_id da OpenAI
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  messages      InterviewMessage[]
  report        StrategicReport?

  @@map("interview_sessions")
}

model InterviewMessage {
  id         String   @id @default(cuid())
  sessionId  String
  agentNumber Int                              // 1 a 6
  role       String                            // "user" | "assistant"
  content    String   @db.Text
  createdAt  DateTime @default(now())

  session    InterviewSession @relation(fields: [sessionId], references: [id])

  @@map("interview_messages")
}

model StrategicReport {
  id                String   @id @default(cuid())
  sessionId         String   @unique
  strategicPlan     String   @db.Text   // JSON ou texto do planejamento estratégico
  actionAgenda      String   @db.Text   // JSON ou texto da agenda de ações
  generatedAt       DateTime @default(now())

  session           InterviewSession @relation(fields: [sessionId], references: [id])

  @@map("strategic_reports")
}
```

### Se usar SQL puro, crie um arquivo `migrations/add_interview_tables.sql`:

```sql
CREATE TABLE IF NOT EXISTS interview_sessions (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'in_progress',
  current_agent   INTEGER NOT NULL DEFAULT 1,
  last_response_id TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interview_messages (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id   TEXT NOT NULL REFERENCES interview_sessions(id),
  agent_number INTEGER NOT NULL,
  role         TEXT NOT NULL,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS strategic_reports (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  session_id      TEXT UNIQUE NOT NULL REFERENCES interview_sessions(id),
  strategic_plan  TEXT NOT NULL,
  action_agenda   TEXT NOT NULL,
  generated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Tarefa 3 — Configuração dos agentes

Crie o arquivo `src/lib/agents.ts` (ou `src/config/agents.ts` conforme padrão do projeto):

```typescript
// IMPORTANTE: Substitua os IDs abaixo pelos IDs reais dos seus agentes
// na OpenAI Platform (seção Responses API / Agents)
export const AGENTS = [
  {
    number: 1,
    id: "COLE_AQUI_O_ID_DO_AGENTE_1",
    name: "Agente 1 — [nome do agente]",
    description: "Descrição do que esse agente faz na entrevista",
  },
  {
    number: 2,
    id: "COLE_AQUI_O_ID_DO_AGENTE_2",
    name: "Agente 2 — [nome do agente]",
    description: "",
  },
  {
    number: 3,
    id: "COLE_AQUI_O_ID_DO_AGENTE_3",
    name: "Agente 3 — [nome do agente]",
    description: "",
  },
  {
    number: 4,
    id: "COLE_AQUI_O_ID_DO_AGENTE_4",
    name: "Agente 4 — [nome do agente]",
    description: "",
  },
  {
    number: 5,
    id: "COLE_AQUI_O_ID_DO_AGENTE_5",
    name: "Agente 5 — [nome do agente]",
    description: "",
  },
  {
    number: 6,
    id: "COLE_AQUI_O_ID_DO_AGENTE_6",
    name: "Agente 6 — [nome do agente — gera o relatório final]",
    description: "Último agente: consolida tudo e gera o planejamento estratégico e agenda de ações",
  },
] as const;

export const TOTAL_AGENTS = AGENTS.length;

export function getAgent(number: number) {
  return AGENTS.find((a) => a.number === number) ?? AGENTS[0];
}
```

---

## Tarefa 4 — API Route: `/api/chat`

Crie `src/app/api/chat/route.ts` (ou `pages/api/chat.ts` conforme estrutura do projeto).

Esta rota:
- Verifica autenticação (rejeita se não autenticado)
- Recebe a mensagem do usuário + sessionId
- Identifica qual agente está ativo para essa sessão
- Chama a OpenAI Responses API com `previous_response_id` para manter contexto
- Faz stream da resposta via SSE
- Salva mensagem do usuário e resposta do agente no banco
- Avança para o próximo agente quando o atual sinaliza conclusão
- Dispara geração do relatório final após o agente 6

```typescript
// src/app/api/chat/route.ts
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ajuste o import conforme o projeto
import { getAgent, TOTAL_AGENTS } from "@/lib/agents";
import { db } from "@/lib/db"; // ajuste o import do banco conforme o projeto

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 1. Verificar autenticação
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Não autorizado", { status: 401 });
  }

  const { message, sessionId } = await req.json();

  if (!message || !sessionId) {
    return new Response("Dados inválidos", { status: 400 });
  }

  // 2. Buscar estado da sessão no banco
  // ADAPTE esta query conforme o ORM ou SQL do projeto
  const interviewSession = await db.interviewSession.findUnique({
    where: { id: sessionId },
  });

  if (!interviewSession || interviewSession.userId !== session.user.id) {
    return new Response("Sessão não encontrada", { status: 404 });
  }

  const currentAgentNumber = interviewSession.currentAgent;
  const agent = getAgent(currentAgentNumber);

  // 3. Salvar mensagem do usuário
  await db.interviewMessage.create({
    data: {
      sessionId,
      agentNumber: currentAgentNumber,
      role: "user",
      content: message,
    },
  });

  // 4. Chamar OpenAI Responses API com streaming
  const openAIBody: Record<string, unknown> = {
    model: "gpt-4o",
    input: message,
    // Mantém contexto completo da conversa sem reenviar histórico
    ...(interviewSession.lastResponseId && {
      previous_response_id: interviewSession.lastResponseId,
    }),
    stream: true,
  };

  // Só passa o agent na primeira mensagem (sem previous_response_id)
  // ou quando mudar de agente. Ajuste conforme comportamento dos seus workflows.
  if (!interviewSession.lastResponseId) {
    openAIBody.agent = agent.id;
  }

  const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "OpenAI-Beta": "responses=v1",
    },
    body: JSON.stringify(openAIBody),
  });

  if (!openAIResponse.ok) {
    const error = await openAIResponse.text();
    console.error("OpenAI error:", error);
    return new Response("Erro ao chamar agente", { status: 500 });
  }

  // 5. Stream SSE para o frontend
  const encoder = new TextEncoder();
  let fullContent = "";
  let newResponseId = "";

  const stream = new ReadableStream({
    async start(controller) {
      const reader = openAIResponse.body!.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.replace("data: ", "").trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);

              // Capturar ID da resposta para próxima chamada
              if (parsed.id) newResponseId = parsed.id;

              // Extrair texto do delta
              const delta =
                parsed.delta?.content?.[0]?.text ||
                parsed.choices?.[0]?.delta?.content ||
                "";

              if (delta) {
                fullContent += delta;
                // Enviar para o frontend
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`)
                );
              }

              // Detectar conclusão do agente
              // AJUSTE esta lógica conforme o sinal que seus agentes enviam
              const finishReason =
                parsed.choices?.[0]?.finish_reason ||
                parsed.status;

              if (finishReason === "stop" || finishReason === "completed") {
                // Salvar resposta do agente
                await db.interviewMessage.create({
                  data: {
                    sessionId,
                    agentNumber: currentAgentNumber,
                    role: "assistant",
                    content: fullContent,
                  },
                });

                // Avançar agente ou finalizar
                const isLastAgent = currentAgentNumber >= TOTAL_AGENTS;
                const nextAgent = isLastAgent
                  ? currentAgentNumber
                  : currentAgentNumber + 1;

                await db.interviewSession.update({
                  where: { id: sessionId },
                  data: {
                    currentAgent: nextAgent,
                    lastResponseId: newResponseId,
                    status: isLastAgent ? "completed" : "in_progress",
                  },
                });

                // Sinalizar mudança de agente ou conclusão para o frontend
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      event: isLastAgent ? "interview_complete" : "agent_complete",
                      nextAgent: isLastAgent ? null : nextAgent,
                    })}\n\n`
                  )
                );

                // Se último agente, salvar relatório
                if (isLastAgent) {
                  await saveReport(sessionId, fullContent);
                }
              }
            } catch {
              // chunk inválido, ignorar
            }
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function saveReport(sessionId: string, lastAgentContent: string) {
  // O agente 6 deve retornar um JSON ou texto estruturado
  // AJUSTE conforme o formato que seu agente 6 retorna
  try {
    // Tentativa de parsear JSON do conteúdo (se o agente retornar JSON)
    let plan = lastAgentContent;
    let agenda = "";

    try {
      const parsed = JSON.parse(lastAgentContent);
      plan = parsed.strategicPlan || lastAgentContent;
      agenda = parsed.actionAgenda || "";
    } catch {
      // Se não for JSON, salva o texto completo como planejamento
    }

    await db.strategicReport.create({
      data: {
        sessionId,
        strategicPlan: plan,
        actionAgenda: agenda,
      },
    });
  } catch (err) {
    console.error("Erro ao salvar relatório:", err);
  }
}
```

---

## Tarefa 5 — API Route: `/api/chat/session`

Crie `src/app/api/chat/session/route.ts` para iniciar uma nova sessão de entrevista:

```typescript
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Verificar se já existe sessão em andamento
  const existing = await db.interviewSession.findFirst({
    where: {
      userId: session.user.id,
      status: "in_progress",
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    return Response.json({ sessionId: existing.id, resumed: true });
  }

  // Criar nova sessão
  const newSession = await db.interviewSession.create({
    data: {
      userId: session.user.id,
      status: "in_progress",
      currentAgent: 1,
    },
  });

  return Response.json({ sessionId: newSession.id, resumed: false });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Retornar histórico de sessões do usuário
  const sessions = await db.interviewSession.findMany({
    where: { userId: session.user.id },
    include: { report: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(sessions);
}
```

---

## Tarefa 6 — Componente de Chat

Crie `src/components/InterviewChat.tsx` (ou na pasta de componentes existente do projeto):

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import { getAgent, TOTAL_AGENTS } from "@/lib/agents";

interface Message {
  role: "user" | "assistant";
  content: string;
  agentNumber?: number;
}

interface InterviewChatProps {
  sessionId: string;
  initialAgent?: number;
}

export function InterviewChat({ sessionId, initialAgent = 1 }: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(initialAgent);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agent = getAgent(currentAgent);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsStreaming(true);

    // Placeholder para streaming
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", agentNumber: currentAgent },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });

      if (!response.ok) throw new Error("Erro na resposta");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.replace("data: ", "").trim();
          try {
            const parsed = JSON.parse(data);

            if (parsed.text) {
              // Acumular texto no último assistente
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.text,
                  };
                }
                return updated;
              });
            }

            if (parsed.event === "agent_complete" && parsed.nextAgent) {
              setCurrentAgent(parsed.nextAgent);
            }

            if (parsed.event === "interview_complete") {
              setIsComplete(true);
            }
          } catch {
            // chunk inválido
          }
        }
      }
    } catch (err) {
      console.error("Erro no chat:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ocorreu um erro. Por favor, tente novamente.",
          agentNumber: currentAgent,
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Entrevista concluída!
        </h2>
        <p className="text-gray-600 mb-6">
          Seu Planejamento Estratégico e Agenda de Ações foram gerados e salvos.
        </p>
        <a
          href="/membro/relatorio" // AJUSTE o path conforme as rotas do projeto
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Ver Planejamento Estratégico
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header com progresso */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{agent.name}</span>
          <span className="text-sm text-gray-500">
            Agente {currentAgent} de {TOTAL_AGENTS}
          </span>
        </div>
        {/* Barra de progresso */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(currentAgent / TOTAL_AGENTS) * 100}%` }}
          />
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-900 rounded-bl-sm"
              }`}
            >
              {msg.role === "assistant" && msg.agentNumber && (
                <span className="text-xs text-gray-500 block mb-1">
                  {getAgent(msg.agentNumber).name}
                </span>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.content}
                {isStreaming &&
                  i === messages.length - 1 &&
                  msg.role === "assistant" && (
                    <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse" />
                  )}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua resposta..."
            disabled={isStreaming}
            rows={2}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStreaming ? "..." : "Enviar"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
}
```

---

## Tarefa 7 — Página da entrevista

Crie a página que exibe o chat. Ajuste o path conforme a estrutura de rotas do projeto (ex: `src/app/(members)/entrevista/page.tsx`):

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { InterviewChat } from "@/components/InterviewChat";

export default async function EntrevistaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Buscar ou criar sessão
  let interviewSession = await db.interviewSession.findFirst({
    where: { userId: session.user.id, status: "in_progress" },
    orderBy: { createdAt: "desc" },
  });

  if (!interviewSession) {
    interviewSession = await db.interviewSession.create({
      data: { userId: session.user.id },
    });
  }

  return (
    <div className="h-screen flex flex-col">
      <InterviewChat
        sessionId={interviewSession.id}
        initialAgent={interviewSession.currentAgent}
      />
    </div>
  );
}
```

---

## Checklist de implementação

O Claude Code deve confirmar cada item antes de finalizar:

- [ ] **Tarefa 0:** Login funcionando, diagnóstico documentado
- [ ] **Tarefa 1:** `.env.local` com todas as variáveis necessárias
- [ ] **Tarefa 2:** Tabelas criadas no banco (migration rodada)
- [ ] **Tarefa 3:** `agents.ts` criado — **IDs dos agentes precisam ser preenchidos pelo usuário**
- [ ] **Tarefa 4:** `/api/chat` com streaming SSE funcionando
- [ ] **Tarefa 5:** `/api/chat/session` para criação/retomada de sessão
- [ ] **Tarefa 6:** Componente `InterviewChat` integrado ao projeto
- [ ] **Tarefa 7:** Página da entrevista protegida por auth
- [ ] **Teste end-to-end:** Login → entrar na entrevista → conversar com agente 1 → ver resposta em streaming → banco salvo

---

## Notas importantes para o Claude Code

1. **Não assuma nada** — leia os arquivos existentes antes de criar qualquer coisa nova. O projeto pode ter padrões específicos (nomes de variáveis, estrutura de pastas, ORM utilizado).

2. **`previous_response_id`** — este é o mecanismo de handoff nativo da OpenAI Responses API. Cada resposta da API retorna um `id`. Na próxima chamada, esse `id` é passado como `previous_response_id` e o modelo recebe todo o contexto anterior automaticamente, sem você precisar reenviar o histórico de mensagens.

3. **IDs dos agentes** — o usuário precisa preencher os IDs reais em `agents.ts`. Esses IDs estão disponíveis no painel da OpenAI Platform em cada workflow/agent configurado.

4. **Sinal de conclusão de agente** — a lógica de "quando avançar para o próximo agente" depende do que os agentes retornam. Peça ao usuário para verificar o `finish_reason` ou campo de status que seus agentes enviam. Pode ser `"stop"`, `"completed"`, ou um campo customizado.

5. **Compatibilidade com o projeto** — adapte imports, nomes de funções e estrutura de pastas ao que já existe. Não quebre código que está funcionando.

6. **API da OpenAI Responses** — endpoint: `POST https://api.openai.com/v1/responses` com header `OpenAI-Beta: responses=v1`. Documente qualquer mudança caso a API esteja em versão diferente.
