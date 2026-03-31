# Axon Site MVP

MVP estatico multipagina para a Axon, pensado para depois migrar sem retrabalho conceitual para uma stack com `Next.js + Coolify`.

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

## Observacoes

- Os formularios salvam os envios em `localStorage` para demonstrar o fluxo.
- O proximo passo natural e conectar formularios a HubSpot, Resend e checkout externo.
- Os links de redes sociais estao em `script.js` e devem ser trocados pelos links reais da Axon.
