# Blueprint dos webhooks do site

Este documento descreve o MVP operacional atual da Axon:

- site -> `n8n`
- `n8n` -> `Postgres`
- `n8n` -> resposta silenciosa para o site

O objetivo aqui e colocar captacao no ar agora, sem depender de Google Sheets ou de uma camada mais pesada como Supabase self-hosted.

## Banco operacional

Subir a stack `portainer-postgres-stack.yml` no Portainer e aplicar o schema de `db/axon_ops_schema.sql`.

Padrao escolhido:

- host interno do banco no Swarm: `axon_postgres`
- banco: `axon_ops`
- usuario: `axon_app`
- senha: definida na stack do Portainer

## 1. Webhook `site-lead`

Uso:

- home
- Deploy
- Operacao Comercial
- ferramentas com gate de acesso

URL de producao esperada no n8n:

- `https://webhooks.axnconsult.com.br/webhook/site-lead`

Payload esperado:

```json
{
  "formType": "curso",
  "page": "/index.html",
  "title": "Axon | Operacao comercial com IA para divulgar, atender e vender",
  "createdAt": "2026-04-10T12:00:00.000Z",
  "legalNoticeVersion": "2026-04-10",
  "consentCopy": "Ao enviar, voce concorda...",
  "consentTimestamp": "2026-04-10T12:00:00.000Z",
  "tracking": {
    "url": "https://axnconsult.com.br/?utm_source=instagram",
    "referrer": "https://instagram.com/",
    "utm_source": "instagram",
    "utm_medium": "",
    "utm_campaign": "",
    "utm_content": "",
    "utm_term": ""
  },
  "interest": "Cursos Axon",
  "name": "Nome",
  "email": "email@dominio.com",
  "phone": "(11) 99999-9999",
  "offer": "Deploy",
  "stage": ["Ainda nao comecei"],
  "consent": "granted"
}
```

Destino no banco:

- tabela: `site_leads`

Mapeamento minimo:

- `created_at` <- `createdAt`
- `form_type` <- `formType`
- `page` <- `page`
- `title` <- `title`
- `interest` <- `interest`
- `offer` <- `offer`
- `name` <- `name`
- `email` <- `email`
- `phone` <- `phone`
- `stage` <- `stage`
- `consent` <- `consent`
- `consent_timestamp` <- `consentTimestamp`
- `legal_notice_version` <- `legalNoticeVersion`
- `tracking_json` <- `tracking`
- `raw_payload_json` <- payload inteiro

## 2. Webhook `site-consultoria`

Uso:

- formulario da pagina de consultoria

URL de producao esperada no n8n:

- `https://webhooks.axnconsult.com.br/webhook/site-consultoria`

Payload esperado:

```json
{
  "formType": "consultoria",
  "page": "/consultoria.html",
  "title": "Consultoria | Axon",
  "createdAt": "2026-04-10T12:00:00.000Z",
  "legalNoticeVersion": "2026-04-10",
  "consentCopy": "Ao enviar, voce concorda...",
  "consentTimestamp": "2026-04-10T12:00:00.000Z",
  "tracking": {
    "url": "https://axnconsult.com.br/consultoria.html",
    "referrer": "",
    "utm_source": "",
    "utm_medium": "",
    "utm_campaign": "",
    "utm_content": "",
    "utm_term": ""
  },
  "interest": "Consultoria",
  "name": "Nome",
  "email": "email@dominio.com",
  "company": "Empresa",
  "company_size": "Pequena empresa",
  "acquisition": "Como capta clientes",
  "bottleneck": "Gargalo principal",
  "message": "Meta para 90 dias",
  "consent": "granted"
}
```

Destino no banco:

- tabela: `consultoria_intake`

Mapeamento minimo:

- `created_at` <- `createdAt`
- `name` <- `name`
- `email` <- `email`
- `company` <- `company`
- `company_size` <- `company_size`
- `acquisition` <- `acquisition`
- `bottleneck` <- `bottleneck`
- `message` <- `message`
- `consent` <- `consent`
- `consent_timestamp` <- `consentTimestamp`
- `legal_notice_version` <- `legalNoticeVersion`
- `tracking_json` <- `tracking`
- `raw_payload_json` <- payload inteiro

## 3. Webhook `site-perfil`

Uso:

- gate de lead do Perfil Empreendedor
- respostas do teste
- resultado do diagnostico

URL de producao esperada no n8n:

- `https://webhooks.axnconsult.com.br/webhook/site-perfil`

Payload esperado:

```json
{
  "formType": "perfil_empreendedor",
  "page": "/perfil-empreendedor.html",
  "title": "Perfil Empreendedor | Axon",
  "createdAt": "2026-04-10T12:00:00.000Z",
  "legalNoticeVersion": "2026-04-10",
  "consentCopy": "Ao enviar, voce concorda...",
  "consentTimestamp": "2026-04-10T12:00:00.000Z",
  "tracking": {
    "url": "https://axnconsult.com.br/perfil-empreendedor.html",
    "referrer": "",
    "utm_source": "",
    "utm_medium": "",
    "utm_campaign": "",
    "utm_content": "",
    "utm_term": ""
  },
  "lead": {
    "formType": "perfil_empreendedor_gate",
    "page": "/perfil-empreendedor.html",
    "title": "Perfil Empreendedor | Axon",
    "createdAt": "2026-04-10T11:58:00.000Z",
    "legalNoticeVersion": "2026-04-10",
    "consentCopy": "Ao enviar, voce concorda...",
    "consentTimestamp": "2026-04-10T11:58:00.000Z",
    "tracking": {
      "url": "https://axnconsult.com.br/perfil-empreendedor.html",
      "referrer": "",
      "utm_source": "",
      "utm_medium": "",
      "utm_campaign": "",
      "utm_content": "",
      "utm_term": ""
    },
    "name": "Nome",
    "email": "email@dominio.com",
    "phone": "(11) 99999-9999",
    "consent": "granted",
    "interest": "Perfil Empreendedor"
  },
  "answers": {
    "q1": "4",
    "q2": "2"
  },
  "result": {
    "dominantMotivation": "money",
    "dominantOperational": "strategist",
    "dominantBehavior": "creativity",
    "lowestBehavior": "discipline",
    "composite": "Estrategista, motivado por autonomia, com baixa consistencia de execucao.",
    "title": "Estrategista: seu valor existe, mas a estrutura ainda define o tamanho do seu crescimento.",
    "ctaLabel": "Ver o Deploy",
    "ctaHref": "./deploy.html"
  }
}
```

Destino no banco:

- tabela: `entrepreneur_profile_results`

Mapeamento minimo:

- `created_at` <- `createdAt`
- `lead_name` <- `lead.name`
- `lead_email` <- `lead.email`
- `lead_phone` <- `lead.phone`
- `lead_consent` <- `lead.consent`
- `lead_consent_timestamp` <- `lead.consentTimestamp`
- `legal_notice_version` <- `lead.legalNoticeVersion`
- `dominant_operational` <- `result.dominantOperational`
- `dominant_motivation` <- `result.dominantMotivation`
- `dominant_behavior` <- `result.dominantBehavior`
- `lowest_behavior` <- `result.lowestBehavior`
- `composite` <- `result.composite`
- `result_title` <- `result.title`
- `cta_label` <- `result.ctaLabel`
- `cta_href` <- `result.ctaHref`
- `answers_json` <- `answers`
- `tracking_json` <- `lead.tracking`
- `raw_payload_json` <- payload inteiro

## Sequencia de nodes recomendada no n8n

Para cada fluxo:

1. `Webhook`
2. `Code` ou `IF` para validar campos obrigatorios
3. `Postgres` com `Insert` ou `Execute Query`
4. `Respond to Webhook`

## Queries de referencia

### `site-lead`

```sql
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
  :createdAt::timestamptz,
  :formType,
  :page,
  :title,
  :interest,
  :offer,
  :name,
  :email,
  :phone,
  :stage::jsonb,
  :consent,
  :consentTimestamp::timestamptz,
  :legalNoticeVersion,
  :tracking::jsonb,
  :rawPayload::jsonb
);
```

### `site-consultoria`

```sql
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
  :createdAt::timestamptz,
  :name,
  :email,
  :company,
  :company_size,
  :acquisition,
  :bottleneck,
  :message,
  :consent,
  :consentTimestamp::timestamptz,
  :legalNoticeVersion,
  :tracking::jsonb,
  :rawPayload::jsonb
);
```

### `site-perfil`

```sql
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
  :createdAt::timestamptz,
  :lead_name,
  :lead_email,
  :lead_phone,
  :lead_consent,
  :lead_consent_timestamp::timestamptz,
  :legal_notice_version,
  :dominant_operational,
  :dominant_motivation,
  :dominant_behavior,
  :lowest_behavior,
  :composite,
  :result_title,
  :cta_label,
  :cta_href,
  :answers_json::jsonb,
  :tracking_json::jsonb,
  :raw_payload_json::jsonb
);
```

## Validacao minima recomendada

### `site-lead`

- `name`
- `email`
- `consent === "granted"`

### `site-consultoria`

- `name`
- `email`
- `company`
- `acquisition`
- `bottleneck`
- `consent === "granted"`

### `site-perfil`

- `lead.name`
- `lead.email`
- `lead.consent === "granted"`
- `answers`
- `result`

## Resposta do webhook

No `Respond to Webhook`, retornar:

```json
{
  "ok": true
}
```

Cabecalhos necessarios:

- `Access-Control-Allow-Origin: https://axnconsult.com.br`
- `Access-Control-Allow-Origin: https://www.axnconsult.com.br`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Retencao e tratamento de dados no MVP

Padrao escolhido para a Axon:

- leads sem avancar no comercial: `180 dias`
- canal de contato e privacidade: `contato@anxconsult.com.br`

Boas praticas minimas:

- coletar apenas o necessario
- restringir acesso ao banco
- nao publicar a porta do Postgres
- nao usar o banco interno do `n8n` como banco de negocio
- revisar periodicamente os leads antigos para limpeza
