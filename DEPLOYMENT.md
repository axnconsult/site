# Deploy da Axon com Portainer + GHCR

Resumo tecnico:

- site estatico servido por `nginx`
- imagem publicada em `ghcr.io/axnconsult/site:main`
- deploy em Docker Swarm pelo Portainer
- roteamento pelo Traefik existente em `network_swarm_public`
- formularios enviados para webhooks do `n8n`
- persistencia operacional em Postgres separado da stack do `n8n`

## Topologia atual da VPS

A infra esta em Docker Swarm e ja possui:

- `traefik` como proxy publico
- `portainer` em `painel.axnconsult.com.br`
- `n8n_editor` em `workflows.axnconsult.com.br`
- `n8n_webhook` em `webhooks.axnconsult.com.br`
- rede publica externa `network_swarm_public`

O site deve usar a mesma rede publica e o resolver `letsencryptresolver`.

## Banco operacional da Axon

Para captacao de leads, a Axon deve subir uma stack separada de Postgres usando `portainer-postgres-stack.yml`.

Padrao escolhido:

- banco: `axon_ops`
- usuario de aplicacao: `axon_app`
- sem publicacao de porta
- acesso apenas por containers na `network_swarm_public`
- schema inicial em `db/axon_ops_schema.sql`

## Fluxo de publicacao

1. GitHub Actions builda o `Dockerfile`
2. GitHub Actions publica a imagem no GHCR
3. Portainer roda a stack `axon-site` usando `portainer-site-stack.yml`
4. Traefik publica `https://axnconsult.com.br`

## Auto-update

Depois da primeira configuracao:

1. criar o secret `PORTAINER_WEBHOOK_URL` no GitHub Actions
2. fazer `commit + push`
3. aguardar o workflow `Deploy site image`
4. conferir se a stack foi redeployada no Portainer

Se o secret ainda nao existir, o workflow publica a imagem, mas nao chama o Portainer.

## Testes

- `https://axnconsult.com.br/health` deve retornar `ok`
- `https://axnconsult.com.br` deve abrir a home
- GitHub Actions deve terminar verde
- a stack `axon-site` deve ficar em estado running
- uma alteracao pequena no site deve aparecer apos novo push e `Ctrl+F5`

## Cuidados importantes

- nao subir um segundo `Traefik`
- nao publicar portas `80` ou `443` diretamente no site
- nao usar `docker-compose.yml` antigo para Swarm
- nao alterar stacks existentes do `n8n`
- manter a imagem GHCR publica ou configurar credenciais de registry no Portainer

## Webhooks do n8n

O front espera:

- `POST https://webhooks.axnconsult.com.br/webhook/site-lead`
- `POST https://webhooks.axnconsult.com.br/webhook/site-consultoria`
- `POST https://webhooks.axnconsult.com.br/webhook/site-perfil`

Detalhes em `N8N_WEBHOOKS.md`.
