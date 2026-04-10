# Blueprint dos webhooks do site

Este documento descreve o MVP operacional atual da Axon:

- site -> `n8n`
- `n8n` -> `Google Sheets`
- `n8n` -> notificacao por Gmail

O objetivo aqui e colocar captacao no ar agora, sem travar o comercial por falta de infraestrutura mais robusta.

## Estrutura recomendada no Google Sheets

Criar uma planilha chamada `Axon Leads`.

Criar 3 abas:

- `leads`
- `consultoria_intake`
- `entrepreneur_profile_results`

## 1. Webhook `site-lead`

Uso:

- home
- Deploy
- Operacao Comercial
- ferramentas com gate de acesso

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

Colunas minimas recomendadas:

- `createdAt`
- `formType`
- `page`
- `title`
- `interest`
- `offer`
- `name`
- `email`
- `phone`
- `stage`
- `consent`
- `consentTimestamp`
- `legalNoticeVersion`
- `tracking.url`
- `tracking.referrer`
- `tracking.utm_source`
- `tracking.utm_medium`
- `tracking.utm_campaign`
- `tracking.utm_content`
- `tracking.utm_term`

Notificacao por Gmail:

- assunto: `Novo lead no site da Axon`
- destino: `axnconsult.contato@gmail.com`

## 2. Webhook `site-consultoria`

Uso:

- formulario da pagina de consultoria

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

Colunas minimas recomendadas:

- `createdAt`
- `name`
- `email`
- `company`
- `company_size`
- `acquisition`
- `bottleneck`
- `message`
- `consent`
- `consentTimestamp`
- `legalNoticeVersion`
- `tracking.url`
- `tracking.utm_source`
- `tracking.utm_campaign`

Notificacao por Gmail:

- assunto: `Nova triagem de consultoria da Axon`
- destino: `axnconsult.contato@gmail.com`

## 3. Webhook `site-perfil`

Uso:

- gate de lead do Perfil Empreendedor
- respostas do teste
- resultado do diagnostico

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
    "title": "Estrategista: seu valor existe, mas a estrutura ainda define o tamanho do seu crescimento.",
    "ctaLabel": "Ver o Deploy",
    "ctaHref": "./deploy.html"
  }
}
```

Colunas minimas recomendadas:

- `createdAt`
- `lead.name`
- `lead.email`
- `lead.phone`
- `lead.consent`
- `lead.consentTimestamp`
- `lead.legalNoticeVersion`
- `result.dominantOperational`
- `result.dominantMotivation`
- `result.dominantBehavior`
- `result.title`
- `result.ctaLabel`
- `lead.tracking.url`
- `lead.tracking.utm_source`
- `lead.tracking.utm_campaign`

Notificacao por Gmail:

- assunto: `Novo diagnostico de Perfil Empreendedor`
- destino: `axnconsult.contato@gmail.com`

## Sequencia de nodes recomendada no n8n

Para cada fluxo:

1. `Webhook`
2. `Code` ou `IF` para validar campos obrigatorios
3. `Google Sheets` para append row
4. `Gmail` para notificar
5. `Respond to Webhook`

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
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Retencao e tratamento de dados no MVP

Padrao escolhido para a Axon:

- leads sem avancar no comercial: `180 dias`
- canal de contato e privacidade: `contato@anxconsult.com.br`

Boas praticas minimas:

- coletar apenas o necessario
- restringir acesso a planilha e ao Gmail
- nao deixar a planilha publica
- nao usar o banco interno do `n8n` como banco de negocio
- revisar a planilha periodicamente para exclusao de leads antigos
