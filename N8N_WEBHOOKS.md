# Blueprint dos webhooks do site

## 1. Webhook `site-lead`

Payload esperado:

```json
{
  "formType": "curso",
  "page": "/index.html",
  "title": "Axon | Operacao comercial com IA para divulgar, atender e vender",
  "createdAt": "2026-03-31T12:00:00.000Z",
  "interest": "Cursos Axon",
  "name": "Nome",
  "email": "email@dominio.com",
  "phone": "(11) 99999-9999",
  "offer": "Deploy",
  "stage": ["Ainda nao comecei"]
}
```

Destino recomendado:

- aba `leads`

Colunas minimas:

- `createdAt`
- `page`
- `formType`
- `interest`
- `offer`
- `name`
- `email`
- `phone`
- `stage`

## 2. Webhook `site-consultoria`

Payload esperado:

```json
{
  "formType": "consultoria",
  "page": "/consultoria.html",
  "title": "Consultoria | Axon",
  "createdAt": "2026-03-31T12:00:00.000Z",
  "interest": "Consultoria",
  "name": "Nome",
  "email": "email@dominio.com",
  "company": "Empresa",
  "company_size": "Pequena empresa",
  "acquisition": "Como capta clientes",
  "bottleneck": "Gargalo principal",
  "message": "Meta para 90 dias"
}
```

Destino recomendado:

- aba `consultoria_intake`

## 3. Webhook `site-perfil`

Payload esperado:

```json
{
  "formType": "perfil_empreendedor",
  "page": "/perfil-empreendedor.html",
  "title": "Perfil Empreendedor | Axon",
  "createdAt": "2026-03-31T12:00:00.000Z",
  "lead": {
    "name": "Nome",
    "email": "email@dominio.com",
    "phone": "(11) 99999-9999",
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
    "title": "Estrategista: seu valor existe, mas a estrutura ainda define o tamanho do seu crescimento."
  }
}
```

Destino recomendado:

- aba `entrepreneur_profile_results`

Colunas minimas:

- `createdAt`
- `lead.name`
- `lead.email`
- `lead.phone`
- `result.dominantOperational`
- `result.dominantMotivation`
- `result.dominantBehavior`
- `result.title`
- `result.ctaLabel`

## Sequencia de nodes recomendada

Para cada fluxo:

1. `Webhook`
2. `IF` ou `Code` para validacao minima
3. `Google Sheets` ou `Postgres`
4. `Email` ou `Gmail`
5. `Respond to Webhook`

No `Respond to Webhook`, retornar tambem:

- `Access-Control-Allow-Origin: https://axnconsult.com.br`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`
