# Publicar a Axon na Hostinger

Este guia foi escrito para quem tem pouca intimidade com infraestrutura e consegue seguir um processo de copiar e colar.

## Visao geral

O processo tem 6 partes:

1. preencher a configuracao do site
2. salvar uma versao no Git
3. subir o projeto para um repositorio remoto
4. publicar com `Compose a partir de URL`
5. apontar o dominio
6. testar o site

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
- ser lido pelo `Traefik` existente
- usar o resolver `mytlschallenge`
- responder ao dominio `axnconsult.com.br`

Importante:

- nao crie um segundo `Traefik`
- nao publique portas manualmente no projeto do site
- o proxy publico da VPS ja esta sendo feito pelo Traefik existente

## Parte 5: apontar o dominio

No DNS da Hostinger, crie ou confira:

- registro `A` para `axnconsult.com.br` apontando para o IP da VPS
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

Se o site abrir, mas o formulario falhar, verifique a API interna do site e a conexao com o Postgres operacional.

## Redeploy padrao quando houver novos commits

Se voce alterou o site, fez `commit`, fez `push` e clicou em `Atualizar`, mas a nova versao nao apareceu, use este fluxo como padrao:

1. confirme no GitHub que o arquivo alterado esta realmente na branch `main`
2. no Docker Manager, delete apenas o projeto do site
3. clique em `Compose`
4. clique em `Compose a partir de URL`
5. cole a mesma URL do repositorio
6. use o mesmo nome de projeto
7. suba de novo
8. teste em janela anonima ou com `Ctrl+F5`

### Por que esse fluxo e o mais confiavel

O `Update` da Hostinger recria os containers com a configuracao atual do projeto, mas nao deixa claro se sempre refaz o fetch da versao mais recente do repositorio remoto. Quando houver duvida sobre a versao publicada, recriar o projeto do site e mais previsivel do que depender apenas do botao `Atualizar`.

### O que pode ser deletado com seguranca

Delete somente o projeto do site, por exemplo `axnsite`.

Nao delete:

- `n8n`
- `n8n-traefik-1`
- Postgres do `n8n`
- Redis
- workers

### Se o site ainda parecer antigo depois da recriacao

Verifique nesta ordem:

1. o commit esta mesmo no GitHub
2. o projeto foi recriado de verdade
3. o navegador esta com cache
4. o Cloudflare esta servindo cache antigo

## Ordem recomendada para iniciantes

Se voce quiser o menor caminho para colocar no ar:

1. preencher `runtime-config.js`
2. publicar o site
3. abrir o dominio

Assim voce separa o problema em partes pequenas.

## Checklist final

- `app/runtime-config.js` preenchido
- projeto commitado
- projeto enviado para repositorio remoto
- Docker Manager com novo projeto `axon-site`
- dominio apontando para a VPS
- site abrindo em HTTPS
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

- endpoints internos em `app/runtime-config.js`
- se o backend responde em `/api/health`
- se o Postgres operacional esta acessivel pelo container do site

### O projeto nao sobe no Docker Manager

Verifique:

- se a URL do repositorio esta correta
- se o repositorio tem `docker-compose.yml` na raiz
- se `Dockerfile`, `nginx.conf` e `app/` tambem estao na raiz
- se o compose esta usando a rede correta do proxy publico
- se o certresolver esta como `mytlschallenge`

### O site sobe, mas continua com a versao antiga

Verifique:

- se o arquivo novo esta no GitHub
- se voce usou `Delete` + `Compose a partir de URL`
- se o teste foi feito com `Ctrl+F5` ou em aba anonima
- se o Cloudflare nao esta entregando cache antigo
