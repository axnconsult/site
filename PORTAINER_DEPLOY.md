# Publicar o site no Portainer

Este guia substitui o fluxo antigo do Hostinger Docker Manager.

## 1. Primeiro push

No computador:

```powershell
git add .
git commit -m "configura deploy do site pelo portainer"
git push origin main
```

No GitHub:

1. Abra o repo `axnconsult/site`
2. Va em `Actions`
3. Aguarde o workflow `Deploy site image`
4. Depois abra `Packages`
5. Abra o package `site`
6. Mude a visibilidade para `public`

## 2. Criar stack no Portainer

No Portainer:

1. Abra `Stacks`
2. Clique em `Add stack`
3. Nome: `axon-site`
4. Escolha `Web editor`
5. Cole o conteudo de `portainer-site-stack.yml`
6. Habilite o `Stack webhook`
7. Clique em `Deploy the stack`

## 3. Salvar webhook no GitHub

Depois de criar a stack:

1. Copie a URL do webhook gerado pelo Portainer
2. No GitHub, abra `Settings`
3. Abra `Secrets and variables`
4. Abra `Actions`
5. Crie o secret:
   - nome: `PORTAINER_WEBHOOK_URL`
   - valor: URL do webhook do Portainer

## 4. Como atualizar o site

Depois do setup inicial:

```powershell
git add .
git commit -m "ajusta site"
git push origin main
```

O GitHub Actions vai:

1. buildar a imagem
2. publicar no GHCR
3. chamar o Portainer
4. redeployar o site

## 5. Como testar

Abra:

- `https://axnconsult.com.br/health`
- `https://axnconsult.com.br`

Se nao atualizar:

- confira se o GitHub Actions terminou verde
- confira se o package `site` esta publico
- confira se o secret `PORTAINER_WEBHOOK_URL` existe
- confira os logs da stack `axon-site` no Portainer
