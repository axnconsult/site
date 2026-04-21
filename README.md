# Axon Site

Site estatico da Axon, servido por `nginx` e preparado para deploy em Docker Swarm via Portainer.

## Arquivos principais

- `app/` -> site publico
- `app/runtime-config.js` -> redes sociais, webhooks e links de checkout
- `Dockerfile` -> build da imagem do site
- `nginx.conf` -> configuracao do servidor web
- `portainer-site-stack.yml` -> stack Swarm para colar no Portainer
- `.github/workflows/deploy-site.yml` -> build e publicacao da imagem no GHCR
- `N8N_WEBHOOKS.md` -> blueprint dos webhooks do `n8n`

## Fluxo de deploy atual

1. Alterar o site localmente
2. Fazer `commit`
3. Fazer `push` na branch `main`
4. GitHub Actions publica `ghcr.io/axnconsult/site:main`
5. GitHub Actions chama o webhook do Portainer, se o secret existir
6. Portainer redeploya a stack `axon-site`

## Primeira publicacao no Portainer

1. Fazer push do workflow para o GitHub
2. Aguardar o GitHub Actions criar a imagem no GHCR
3. Tornar o package `site` publico no GitHub
4. No Portainer, criar uma stack chamada `axon-site`
5. Colar o conteudo de `portainer-site-stack.yml`
6. Habilitar o stack webhook
7. Salvar a URL do webhook em `PORTAINER_WEBHOOK_URL` nos secrets do GitHub Actions

## Dominios esperados

- `axnconsult.com.br` -> site
- `webhooks.axnconsult.com.br` -> webhooks do `n8n`
- `workflows.axnconsult.com.br` -> editor do `n8n`
- `painel.axnconsult.com.br` -> Portainer

## Cuidados

- Nao commitar exports locais das stacks do Portainer/n8n com segredos
- Nao criar outro Traefik para o site
- Nao usar `build:` na stack Swarm do site
- Nao mexer nas stacks existentes de `traefik`, `portainer`, `n8n`, `postgres`, `redis` ou workers
