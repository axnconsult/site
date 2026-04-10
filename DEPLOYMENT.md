# Deploy da Axon na VPS atual

Resumo tecnico do deploy:

- site estatico servido por `nginx`
- publicacao pelo `Hostinger Docker Manager`
- roteamento pelo `Traefik` que ja roda no projeto `n8n`
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

## Topologia real da VPS

Hoje a VPS ja tem:

- um projeto `n8n`
- um container `n8n-traefik-1`
- a rede Docker `n8n_default`

Por isso o site da Axon deve:

- entrar na rede `n8n_default`
- usar o mesmo `Traefik`
- usar o resolver `mytlschallenge`

O site nao deve usar `traefik-public`, porque essa rede nao existe no ambiente atual.

## Fluxo recomendado

1. Preencher `app/runtime-config.js`
2. Subir o projeto para um repositorio remoto
3. Publicar com `Compose a partir de URL`
4. Apontar o dominio
5. Ativar os webhooks no `n8n`

## Redeploy recomendado

Quando houver novos commits no GitHub:

1. confirmar que a mudanca entrou na `main`
2. tentar `Atualizar` no Docker Manager
3. se a nova versao nao aparecer, deletar so o projeto do site
4. publicar novamente com `Compose a partir de URL`

Esse passou a ser o padrao operacional da Axon, porque e o caminho mais previsivel para garantir que a VPS puxe a versao mais recente do repositorio remoto sem tocar no projeto `n8n`.

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

## Cuidados importantes

- nao subir um segundo `Traefik`
- nao ocupar manualmente as portas `80` e `443`
- nao alterar o compose do projeto `n8n`
- se o projeto do site falhar, excluir a tentativa anterior e subir de novo com o compose corrigido
- se o `Update` nao refletir os commits novos, recriar so o projeto do site

## Stripe

Nao bloqueia o go-live.

Quando entrar:

1. criar links de pagamento por oferta
2. preencher `checkout` em `app/runtime-config.js`
3. receber eventos do Stripe no `n8n`
4. registrar pagamento e origem
