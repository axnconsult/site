# Axon Site

Aplicacao leve da Axon, com frontend HTML/CSS/JS preservado e backend Node.js para API interna de formularios.

## Arquivos principais

- `app/` -> site publico
- `app/runtime-config.js` -> redes sociais, endpoints internos e links de checkout
- `server.js` -> servidor HTTP, arquivos estaticos e API interna
- `package.json` / `package-lock.json` -> dependencias do backend
- `Dockerfile` -> build da imagem do site
- `nginx.conf` -> configuracao legada do servidor estatico antigo
- `portainer-site-stack.yml` -> stack Swarm para colar no Portainer
- `portainer-postgres-stack.yml` -> stack Swarm do Postgres operacional da Axon
- `db/axon_ops_schema.sql` -> schema inicial do banco de leads
- `.github/workflows/deploy-site.yml` -> build e publicacao da imagem no GHCR
- `N8N_WEBHOOKS.md` -> blueprint dos webhooks do `n8n`
- `POSTGRES_SETUP.md` -> passo a passo do banco no Portainer e conexao do `n8n`
- `N8N_IMPORT_GUIDE.md` -> como importar e ajustar os workflows JSON no `n8n`
- `n8n-workflows/` -> workflows importaveis para os webhooks do site

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

## Captura operacional de leads

O fluxo principal para formularios e Perfil Empreendedor agora e:

1. site envia `POST` para `/api/leads`, `/api/consultoria` ou `/api/perfil`
2. backend valida o payload minimo
3. backend grava no Postgres operacional da Axon
4. backend responde `{ "ok": true, "id": "..." }`
5. opcionalmente, backend encaminha copia para o `n8n` se as variaveis `N8N_*_WEBHOOK_URL` existirem

Endpoints internos:

- `POST /api/leads`
- `POST /api/consultoria`
- `POST /api/perfil`
- `GET /health` -> healthcheck simples do container
- `GET /api/health` -> healthcheck com teste de Postgres

## Cuidados

- Nao commitar exports locais das stacks do Portainer/n8n com segredos
- Nao criar outro Traefik para o site
- Nao usar `build:` na stack Swarm do site
- Nao mexer nas stacks existentes de `traefik`, `portainer`, `n8n`, `postgres`, `redis` ou workers
- Trocar `CHANGE_THIS_STRONG_PASSWORD` no `portainer-site-stack.yml` antes do deploy
