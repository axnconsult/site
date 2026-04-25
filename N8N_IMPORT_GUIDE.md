# Importar os workflows da Axon no n8n

Arquivos prontos para importacao:

- `n8n-workflows/n8n-site-lead.json`
- `n8n-workflows/n8n-site-consultoria.json`
- `n8n-workflows/n8n-site-perfil.json`

## Como importar

No n8n:

1. abrir `Workflows`
2. clicar em `Import from File`
3. importar um JSON por vez
4. abrir o workflow importado
5. selecionar a credencial correta no node `Postgres`
6. salvar
7. ativar

## O que ajustar em cada workflow

### 1. Credencial Postgres

No node `Postgres`, selecionar manualmente a credencial criada no n8n com:

- host: `axon_postgres`
- port: `5432`
- database: `axon_ops`
- user: `axon_app`
- password: a senha real do banco
- schema: `public`
- ssl: desligado

Se `axon_postgres` nao resolver no n8n, testar o nome do servico que estiver visivel no Portainer para a stack do banco.

### 2. URL final do webhook

Depois de ativar, a URL de producao deve bater com o front:

- `/webhook/site-lead`
- `/webhook/site-consultoria`
- `/webhook/site-perfil`

### 3. CORS

Se o navegador bloquear o `POST` do site, abrir o node `Webhook` e adicionar `Allowed Origins (CORS)` com:

- `https://axnconsult.com.br`
- `https://www.axnconsult.com.br`

Se o campo aceitar uma unica string, usar os dois dominios separados por virgula.

## O que os workflows ja fazem

- validam os campos minimos
- devolvem erro de validacao com status `400`
- gravam no Postgres quando o payload esta correto
- devolvem `{ "ok": true }` quando tudo da certo
- deixam o `500` para falhas reais de banco ou execucao

## Teste rapido depois da importacao

1. ativar o workflow `site-perfil`
2. abrir o site
3. preencher o gate e concluir o teste
4. confirmar que o front mostra o resultado
5. confirmar no banco que houve insert em `entrepreneur_profile_results`

Comandos uteis no `psql`:

```sql
select count(*) from site_leads;
select count(*) from consultoria_intake;
select count(*) from entrepreneur_profile_results;
```
