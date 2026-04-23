# Setup do Postgres da Axon no Portainer

Este guia assume a infra atual:

- Portainer em `painel.axnconsult.com.br`
- `n8n` em Docker Swarm
- rede overlay existente `network_swarm_public`

## 1. Criar a stack do banco

No Portainer:

1. abrir `Stacks`
2. clicar em `Add stack`
3. nome sugerido: `axon-postgres`
4. colar o conteudo de `portainer-postgres-stack.yml`
5. trocar `CHANGE_THIS_STRONG_PASSWORD` por uma senha forte real
6. clicar em `Deploy the stack`

Importante:

- nao publicar porta `5432`
- nao colocar labels do Traefik nessa stack

## 2. Aplicar o schema inicial

Depois que a stack subir:

1. abrir a stack `axon-postgres`
2. entrar no container em exec/console
3. rodar:

```bash
psql -U axon_app -d axon_ops
```

4. colar o conteudo de `db/axon_ops_schema.sql`
5. sair com:

```bash
\q
```

## 3. Criar a credencial no n8n

No `n8n`, criar uma credencial Postgres com:

- host: `axon_postgres`
- port: `5432`
- database: `axon_ops`
- user: `axon_app`
- password: a mesma senha definida na stack
- ssl: desabilitado, a menos que voce configure isso depois

## 4. Fluxo minimo por webhook

Para cada workflow do site:

1. `Webhook`
2. `Code` ou `IF` para validar payload
3. `Postgres` para inserir na tabela certa
4. `Respond to Webhook`

## 5. Teste de conectividade

Teste minimo esperado:

1. o site continua abrindo em `https://axnconsult.com.br`
2. o node `Postgres` no `n8n` conecta sem erro
3. um POST de teste grava registro no banco
4. o webhook responde `{ "ok": true }`

## 6. Operacao segura no MVP

- usar esse banco apenas para dados do negocio da Axon
- nao reutilizar o Postgres interno do `n8n`
- manter backup/volume da stack do banco
- revisar retencao de leads periodicamente
