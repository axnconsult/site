# Axon Site MVP

Site estatico multipagina da Axon, preparado para publicacao imediata em VPS com Docker, Traefik e captura de leads via `n8n`.

## Paginas

- `index.html`: home comercial
- `deploy.html`: oferta do sprint ao vivo
- `operacao-comercial.html`: curso gravado
- `consultoria.html`: triagem de consultoria
- `ferramentas/gerador-de-prompts.html`: ferramenta pratica
- `sobre.html`: manifesto condensado
- `obrigado.html`: feedback de conversao
- `termos.html` e `privacidade.html`: base juridica do MVP

## Como abrir

Abra `index.html` no navegador.

Se preferir rodar com servidor local:

```powershell
cd C:\Users\leona\Documents\Jobs\Codex_Axn\app
npx serve .
```

## Configuracao

- `runtime-config.js`: links de redes, webhooks do `n8n` e futuros links de checkout

## Observacoes

- Os formularios agora enviam `POST` para webhooks remotos.
- Os endpoints padrao esperados sao:
  - `https://hooks.axnconsult.com.br/site-lead`
  - `https://hooks.axnconsult.com.br/site-consultoria`
  - `https://hooks.axnconsult.com.br/site-perfil`
- O proximo passo natural e ligar Stripe e um banco dedicado sem refazer o front.
- Veja `DEPLOYMENT.md` e `N8N_WEBHOOKS.md`.
