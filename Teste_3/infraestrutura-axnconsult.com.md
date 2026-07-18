# Infraestrutura Digital — axnconsult.com

Gerado em 15/07/2026 pela area de membros Axon.

## Dados principais

- Dominio: axnconsult.com
- IP da VPS: 187.77.239.134
- E-mail tecnico: axnconsult.contato@gmail.com

## Enderecos dos servicos

- Painel (Portainer): https://painel.axnconsult.com
- Workflows (n8n): https://workflows.axnconsult.com
- Webhooks: https://webhooks.axnconsult.com
- Site: https://axnconsult.com (publicacao no Modulo 5)

## Stack instalada

- VPS Ubuntu 24.04 (Hostinger KVM 2, regiao Sao Paulo)
- Docker Swarm (no manager: manager01)
- Traefik (proxy publico com HTTPS Let's Encrypt)
- Portainer (painel de operacao)
- PostgreSQL 16 + pgvector (banco axon_ops, usuario axon_app)
- n8n em fila (editor, webhook, worker, runners) + Redis

## Acessos que voce deve guardar por conta propria

As senhas nao ficam salvas na area de membros. Garanta que voce anotou:

- Senha root da VPS
- Usuario e senha do Portainer
- Senha do Postgres (superusuario e axon_app)
- N8N_ENCRYPTION_KEY e N8N_RUNNERS_AUTH_TOKEN