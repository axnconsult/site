# Publicar a Axon na Hostinger

Este guia foi escrito para quem tem pouca intimidade com infraestrutura e consegue seguir um processo de copiar e colar.

## Visao geral

O processo tem 6 partes:

1. preencher a configuracao do site
2. salvar uma versao no Git
3. subir o projeto para um repositorio remoto
4. publicar com `Compose a partir de URL`
5. apontar o dominio
6. testar o site e ligar os webhooks

## Parte 1: preencher a configuracao do site

Abra o arquivo `app/runtime-config.js`.

Troque os valores de exemplo pelos valores reais:

- `instagram`
- `youtube`
- `linkedin`
- `lead`
- `consultoria`
- `perfil`
- `deploy`
- `operacaoComercial`
- `consultoria`

Hoje os links de checkout podem ficar vazios se o Stripe ainda nao entrou.

## Parte 2: salvar uma versao no Git

No terminal, dentro da pasta do projeto, rode:

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
git add .
git commit -m "site axon pronto para publicar"
```

Se isso ja estiver configurado, os dois primeiros comandos nao precisam ser repetidos.

## Parte 3: subir para um repositorio remoto

O caminho mais simples para ensino e reproducao e usar GitHub.

### Opcao mais didatica

1. Crie um repositorio no GitHub
2. Copie a URL do repositorio
3. No terminal, rode:

```powershell
git remote add origin URL_DO_REPOSITORIO
git branch -M main
git push -u origin main
```

Exemplo de URL:

```text
https://github.com/seuusuario/axon-site.git
```

## Parte 4: publicar no Docker Manager

No painel da Hostinger:

1. Abra `Gerenciador Docker`
2. Se existir uma tentativa anterior do site em estado `Criado`, exclua essa tentativa
3. Clique em `Compose`
4. Clique em `Compose a partir de URL`
5. Cole a URL do repositorio
6. Use `axon-site` como nome do projeto
7. Confirme o deploy

O compose deste projeto ja esta preparado para:

- construir o container com `Dockerfile`
- servir o site em `nginx`
- entrar na rede `n8n_default`
- ser lido pelo `Traefik` que ja esta no projeto `n8n`
- usar o resolver `mytlschallenge`
- responder ao dominio `axnconsult.com.br`

Importante:

- nao crie um segundo `Traefik`
- nao publique portas manualmente no projeto do site
- o proxy publico da VPS ja esta sendo feito por `n8n-traefik-1`

## Parte 5: apontar o dominio

No DNS da Hostinger, crie ou confira:

- registro `A` para `axnconsult.com.br` apontando para o IP da VPS
- registro `A` para `hooks.axnconsult.com.br` apontando para o IP da VPS
- opcionalmente `A` para `n8n.axnconsult.com.br` apontando para o IP da VPS

Se o dominio principal ja estiver ligado a essa VPS, normalmente os subdominios usam o mesmo IP.

## Parte 6: testar o site

Depois que o projeto subir:

1. Abra `https://axnconsult.com.br`
2. Confira a home
3. Abra `Deploy`
4. Abra `Operacao Comercial`
5. Abra `Consultoria`
6. Abra `Perfil Empreendedor`
7. Teste um envio de formulario

Se o site abrir, mas o formulario falhar, o problema nao esta no deploy do site. O problema estara nos webhooks do `n8n`.

## Ligar os webhooks do n8n

Crie 3 endpoints no `n8n`:

- `POST /site-lead`
- `POST /site-consultoria`
- `POST /site-perfil`

Cada fluxo deve:

1. receber JSON
2. validar campos obrigatorios
3. gravar em planilha ou banco
4. enviar notificacao interna
5. responder com:

```json
{
  "ok": true
}
```

Tambem precisa responder estes cabecalhos:

- `Access-Control-Allow-Origin: https://axnconsult.com.br`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Ordem recomendada para iniciantes

Se voce quiser o menor caminho para colocar no ar:

1. preencher `runtime-config.js`
2. publicar o site
3. abrir o dominio
4. so depois ligar os webhooks

Assim voce separa o problema em duas partes:

- primeiro o site no ar
- depois a captura de leads

## Checklist final

- `app/runtime-config.js` preenchido
- projeto commitado
- projeto enviado para repositorio remoto
- Docker Manager com novo projeto `axon-site`
- dominio apontando para a VPS
- site abrindo em HTTPS
- webhooks do `n8n` ativos
- formulario retornando sucesso real

## Se der erro

### O site nao abre

Verifique:

- se o projeto subiu no Docker Manager
- se o container esta em `Running`
- se o dominio aponta para a VPS
- se o Traefik do seu ambiente continua ativo

### O site abre, mas o formulario falha

Verifique:

- URL dos webhooks em `app/runtime-config.js`
- se os webhooks do `n8n` estao publicados
- se o `n8n` responde com CORS

### O projeto nao sobe no Docker Manager

Verifique:

- se a URL do repositorio esta correta
- se o repositorio tem `docker-compose.yml` na raiz
- se `Dockerfile`, `nginx.conf` e `app/` tambem estao na raiz
- se o compose esta usando `n8n_default`
- se o certresolver esta como `mytlschallenge`
