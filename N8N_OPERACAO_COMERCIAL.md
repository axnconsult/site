# N8N - Operacao Comercial Modulo 1

Este workflow e o primeiro rascunho operacional para conectar a area de membros aos agentes da OpenAI e montar o Planejamento Estrategico Operacional do projeto.

## Fluxo

1. O app chama `POST /api/operation/assistant`.
2. O backend valida a sessao do membro.
3. O backend envia o contexto para o webhook do n8n em `N8N_OPERATION_ASSISTANT_WEBHOOK_URL`.
4. O n8n identifica a etapa e o agente responsavel.
5. O n8n carrega contexto e blocos anteriores do Postgres.
6. O n8n chama a OpenAI Responses API.
7. O n8n salva:
   - mensagem do usuario;
   - resposta do assistente;
   - `transfer_block`;
   - secao atual do Planejamento Estrategico.
8. O n8n devolve a resposta para o app.

## Arquivos

- `db/operation_commercial_schema.sql`: tabelas da Operacao Comercial.
- `n8n-workflows/n8n-operacao-comercial-modulo1.json`: workflow importavel no n8n.
- `source-material/Agents/revised-module-1/`: prompts revisados dos agentes.

## Variaveis

No site:

```env
N8N_OPERATION_ASSISTANT_WEBHOOK_URL=https://webhooks.axnconsult.com.br/webhook/operacao-comercial-assistente
N8N_OPERATION_ASSISTANT_SECRET=SENHA_FORTE_AQUI
```

No n8n:

```env
OPENAI_API_KEY=sk-...
OPENAI_OPERATION_MODEL=gpt-5.5
N8N_OPERATION_ASSISTANT_SECRET=SENHA_FORTE_AQUI
```

## Setup no Postgres

Rode o SQL:

```bash
psql "$DATABASE_URL" -f db/operation_commercial_schema.sql
```

Ou cole o conteudo no cliente Postgres usado na VPS.

## Setup no n8n

1. Importe `n8n-workflows/n8n-operacao-comercial-modulo1.json`.
2. Troque a credencial `REPLACE_WITH_POSTGRES_CREDENTIAL_ID` pela credencial real do Postgres.
3. No node `Build OpenAI Request`, substitua os textos `USE O PROMPT DO ARQUIVO...` pelo conteudo de cada prompt depois de `## Instrucoes do agente`.
4. Configure `OPENAI_API_KEY` no ambiente do n8n.
5. Ative o workflow.
6. Copie a URL de producao do webhook.
7. Configure `N8N_OPERATION_ASSISTANT_WEBHOOK_URL` no site.

## Contrato de resposta esperado

O n8n deve responder:

```json
{
  "ok": true,
  "answer": "texto para mostrar ao usuario",
  "agent_id": "business_modeling",
  "status": "needs_input",
  "project_section": "fundamento_do_negocio",
  "transfer_block": {},
  "next_recommended_agent": "target_audience"
}
```

## Observacao importante

Os workflows do Agent Builder ainda estao em draft. Enquanto isso, o n8n chama a Responses API com os prompts revisados. Quando os agentes forem publicados e tivermos o melhor contrato de execucao para eles, podemos trocar o node `OpenAI Responses` por uma chamada direta aos workflows publicados ou por uma camada propria no backend.
