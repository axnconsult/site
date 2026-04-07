# Deploy da Axon na VPS atual

Resumo tecnico do deploy:

- site estatico servido por `nginx`
- publicacao pelo `Hostinger Docker Manager`
- roteamento por `Traefik`
- formularios enviados para webhooks do `n8n`

## Dominios

- `axnconsult.com.br` -> site
- `hooks.axnconsult.com.br` -> webhooks do site
- `n8n.axnconsult.com.br` -> painel do `n8n`

## Estrutura usada pelo deploy

- `docker-compose.yml` -> define o projeto Docker
- `Dockerfile` -> monta a imagem do site
- `nginx.conf` -> configura o servidor web
- `app/` -> conteudo estatico publicado

## Fluxo recomendado

1. Preencher `app/runtime-config.js`
2. Subir o projeto para um repositorio remoto
3. Publicar com `Compose a partir de URL`
4. Apontar o dominio
5. Ativar os webhooks no `n8n`

Para o passo a passo completo, use [PUBLICAR-NA-HOSTINGER.md](C:\Users\leona\Documents\Jobs\Codex_Axn\PUBLICAR-NA-HOSTINGER.md).

## Webhooks obrigatorios

- `POST /site-lead`
- `POST /site-consultoria`
- `POST /site-perfil`

Resposta sugerida:

```json
{
  "ok": true
}
```

Cabecalhos recomendados:

- `Access-Control-Allow-Origin: https://axnconsult.com.br`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Armazenamento recomendado

Fase 1:

- `Google Sheets` ou planilha operacional via `n8n`

Fase 2:

- `Postgres` dedicado para leads, triagens e resultados

## Stripe

Nao bloqueia o go-live.

Quando entrar:

1. criar links de pagamento por oferta
2. preencher `checkout` em `app/runtime-config.js`
3. receber eventos do Stripe no `n8n`
4. registrar pagamento e origem
