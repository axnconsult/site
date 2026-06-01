# Axon Site MVP

Frontend multipagina da Axon, preparado para publicacao em VPS com Docker, Traefik e captura de leads pela API interna do projeto.

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
cd C:\Users\leona\Documents\Jobs\Axn_Dev
npm install
$env:PORT="3000"
npm start
```

## Configuracao

- `runtime-config.js`: links de redes, endpoints internos e futuros links de checkout

## Observacoes

- Os formularios agora enviam `POST` para `/api/leads`, `/api/consultoria` e `/api/perfil`.
- Veja `DEPLOYMENT.md`.
