# Axon Site

Site estatico da Axon, preparado para:

- publicar na Hostinger com Docker Manager
- servir arquivos com `nginx`
- rotear o dominio com `Traefik`
- enviar formularios para webhooks do `n8n`

## Arquivos principais

- `app/` -> site publico
- `app/runtime-config.js` -> links de redes, webhooks e checkouts
- `docker-compose.yml` -> projeto Docker para a Hostinger
- `Dockerfile` -> build do container do site
- `nginx.conf` -> configuracao web
- `PUBLICAR-NA-HOSTINGER.md` -> passo a passo completo de publicacao
- `N8N_WEBHOOKS.md` -> blueprint dos webhooks do `n8n`

## Antes de publicar

1. Preencha `app/runtime-config.js`
2. Faça um commit local
3. Suba este projeto para um repositorio remoto
4. Use `Compose a partir de URL` no Docker Manager da Hostinger

## Dominios esperados

- `axnconsult.com.br` -> site
- `hooks.axnconsult.com.br` -> webhooks do `n8n`
- `n8n.axnconsult.com.br` -> painel do `n8n`

## Proximo passo

Abra [PUBLICAR-NA-HOSTINGER.md](C:\Users\leona\Documents\Jobs\Codex_Axn\PUBLICAR-NA-HOSTINGER.md) e siga a ordem.
