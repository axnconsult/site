O Claude vai construir e publicar o **Painel de Gestão** do negócio em `gestao.axnconsult.com`. Os arquivos de documentos, planejamento estratégico e credenciais estão disponíveis na pasta do projeto. CONFIRME com o usuário antes de cada comando que altere o servidor.

---

# 1. Pré-checagens (ANTES de qualquer alteração)

**1.1. Teste dos webhooks principais:**
- Métricas:  
  ```
  curl https://workflows.axnconsult.com/webhook/painel-metricas
  ```
  Deve responder JSON.

- Conselho (post):  
  ```
  curl -X POST -H "Content-Type: application/json" -d '{"pergunta":"teste"}' https://workflows.axnconsult.com/webhook/conselho
  ```
  Deve responder JSON com campo `resposta`.

- Grade de Postagens (leitura):  
  ```
  curl -X POST -H "Content-Type: application/json" -d '{"action":"carregar"}' https://workflows.axnconsult.com/webhook/grade-postagens
  ```
  Deve responder JSON com campo `grade`.

- Peças (leitura):  
  ```
  curl -X POST -H "Content-Type: application/json" -d '{"action":"listar"}' https://workflows.axnconsult.com/webhook/pecas
  ```
  Deve responder JSON com campo `pecas`.

- **NUNCA chame as actions que criam conteúdo** (`gerar`, `ajustar`, `arte`) durante a checagem.

- **Se algum falhar:** PARE e oriente o usuário a ativar os workflows no n8n antes de prosseguir.

**1.2. Verifique Fábricas de Vídeos e Carrosséis:**
- Pergunte ao usuário **se os workflows `Fabrica de Videos` e `Fabrica de Carrosseis` estão ativos** no n8n.
- Se não estiverem ativos: continue normalmente; o card exibe mensagem de erro se envio falhar.

**1.3. DNS:**
- Execute:
  ```
  nslookup gestao.axnconsult.com
  ```
  Confirme que resolve para IP `187.77.239.134`.  
  Se não resolver: instrua o usuário a criar o registro A na Cloudflare (`gestao` → 187.77.239.134, DNS only).  
  Se houver curinga `*`, está coberto.

**1.4. SSH no Windows (não-interativo):**
- Instale o PuTTY via winget, AVISANDO sobre a janela UAC:
  ```
  winget install --id PuTTY.PuTTY
  ```
- Capture a chave do host uma vez, de modo não interativo:
  ```
  echo y | plink root@187.77.239.134 echo ok
  ```
- Use sempre o parâmetro `-batch` para todos os comandos seguintes.

**1.5. Peça a senha root da VPS** ao usuário. (Detalhes no gerenciador de senhas; IP: 187.77.239.134)

---

# 2. O painel

**Requisitos gerais:**  
- Página estática, mobile-first, arquivos: `index.html`, `styles.css`, `script.js`
- Paleta:  
  - Azul petróleo confiável: `#0F3B57` (títulos, blocos-chave)
  - Azul claro: `#E4F2FF` (fundos amplos, cards, posts educativos)
  - Amarelo destaque: `#FFC857` (CTAs, selos, alertas positivos)
  - Verde eficiência: `#2BB673` (ícones de feito, labels, barras de progresso)
- Tipografia: Poppins (títulos, subtítulos e corpo)
- Vibe: clara, leve, organizada; foco em blocos separados. Evite “verde WhatsApp” como cor principal, fundos muito escuros, excesso de elementos.
- Modo escuro: CSS variables; preference salva em `localStorage`. Na primeira visita, respeite `prefers-color-scheme`.
- Toda navegação entre abas é client-side (sem reload), status salvo em `localStorage`.

## Cabeçalho:
- Nome do negócio **Deploy** + "Painel de Gestão"
- Navegação por 3 abas: **Administração · Marketing · Vendas**
- Botão para alternar tema claro/escuro à direita

## 2.1. Aba Administração

**Cards de métricas** (linha ou empilhados via media query):
- Total de leads (ícone)
- Leads dos últimos 7 dias
- Conversões dos últimos 7 dias

**Chat "Conselheiro de Administração"**  
- Layout:  
  - Esquerda: botão **"+ Nova conversa"**, lista das conversas anteriores (título + data), rolável/clicável, apenas deste domínio
  - Direita: janela de mensagens (balões user/assistant), campo de texto, botão enviar
- `dominio: "administracao"`

## 2.2. Aba Marketing

**Seção: Grade de Postagens**
- Ao abrir, carrega a grade (`carregar`).
  - Se `status` = `"vazia"`: mostra estado vazio, botão **"Gerar grade de 28 dias"**, campo "Direcionamento (opcional)" → `orientacoes`
  - Se carregada:
    - Renderiza `conteudo` (Markdown com tabela → HTML responsivo, scroll no mobile)
    - Selo de status: 
      - **"Proposta — aguardando aprovação" (amarelo)** 
      - **"Aprovada" (verde)** 
    - Data `atualizado_em`
  - Se status `"proposta"`:  
    - Campo texto **"O que você quer ajustar?"** + botão **"Pedir ajuste"** (`gerar`, `feedback`)
    - Botão **"Aprovar grade"** (`aprovar` com `grade_id`)
    - Botão **"Gerar do zero"** (confirmação)
  - Se status `"aprovada"`: botão discreto **"Gerar nova grade"** (confirmação)
  - Durante geração (30–120s): "Gerando sua grade..." + desabilitar botões

**Seção: Peças de divulgação**
- Linha: "Gere as peças da grade aprovada, um formato por vez"
- 4 botões:  
  - **"🎬 Reels/Shorts"**  
  - **"🖼️ Carrossel"**  
  - **"📷 Post de feed"**  
  - **"📱 Stories"**
  - Cada botão: POST com `{ tipo: ..., briefing: "" }`
- **Peça avulsa:** campo "Descreva a peça...", seletor formato, botão **"Gerar peça avulsa"**
- Resultado: renderiza `conteudo` (Markdown) + botão "Copiar conteúdo". Se resposta inclui `imagem_b64`: mostra imagem
- **Histórico:** lista das últimas peças (listar; tipo/título/data). Selecionou: carrega (carregar pelo `peca_id`).
- Durante geração: "Escrevendo suas peças..." + botões desabilitados. Se erro: mostra motivo.

**Seção: Arte de post**
- Campos: "Prompt de imagem" + "Texto na arte (opcional)" (usuário pode colar o post de feed)
- Botão **"Gerar arte"** (action `arte`)
- Aviso: "Consome crédito OpenAI (~US$ 0,25 por arte)"
- Resultado: mostra imagem (`imagem_b64`) + botão "Baixar imagem"
- Durante geração (1–3min): loading/botão desativado

**Cards das Fábricas** (lado a lado desktop, empilhados mobile):

- **🎬 Fábrica de Vídeos**  
  - Linha de apoio: "Cole um roteiro de Reels..."  
  - Textarea (mín. 6 linhas, placeholder com formato), botão **"Gerar vídeo"**
  - Aviso: "Cada envio consome ~US$ 1 do seu crédito HeyGen"
  - Validação: só habilitar botão se textarea não está vazia. Durante envio: desabilitado.
  - Após envio com sucesso 2xx: limpa textarea, mostra "✅ Pedido enviado! Chega no seu WhatsApp em ~3 minutos".
  - Falha: mantém texto, mostra "⚠️ Não consegui falar com a Fábrica..."

- **🖼️ Fábrica de Carrosséis**  
  - Igual ao vídeo, mudando apenas a orientação ("Cole as linhas de UM carrossel..."), placeholder, endpoint e label do botão.
  - Aviso: "Cada envio consome ~US$ 1 do seu crédito OpenAI"

**Chat "Conselheiro de Marketing"**  
- Mesmo layout acima, `dominio: "marketing"`

## 2.3. Aba Vendas

**Cards:**  
- Leads dos últimos 7 dias
- Conversões dos últimos 7 dias

**Tabela (últimos 10 leads):**
- Nome | E-mail | WhatsApp | Mensagem | Data

**Chat "Conselheiro de Vendas"**  
- Mesmo layout, `dominio: "vendas"`

## Layout padrão dos chats (todas as abas)
- Esquerda: botão "+ Nova conversa", lista (título+data de cada conversa anterior de domínio)
- Direita: janela de conversa atual (balões user/assistant formatados, com destaque de **negrito** se vier marcado no Markdown), enviar mensagem, campo texto

---

# 3. Integrações

**Métricas**  
- GET `https://workflows.axnconsult.com/webhook/painel-metricas`  
- Resposta JSON:
  ```
  {
    "total_leads": ...,
    "leads_7d": ...,
    "conversoes_7d": ...,
    "ultimos": [{nome, email, whatsapp, mensagem, data}, ...]
  }
  ```
- Usar nos cards da aba Administração e Vendas; tabela Vendas mostra só os 10 mais recentes de `ultimos`.

**Conselho**  
- POST `https://workflows.axnconsult.com/webhook/conselho`
- Payloads:
  - Listar conversas: `{ "action": "listar", "dominio": "..." }`
      → `{ "conversas": [{ id, titulo, atualizado_em }] }`
  - Carregar mensagens: `{ "action": "carregar", "conversation_id": <id> }`
      → `{ "mensagens": [{ papel, conteudo }] }`
  - Perguntar: `{ "action": "perguntar", "dominio": "...", "pergunta": "...", "conversation_id": <id ou 0> }`
      → `{ "resposta": "...", "conversation_id": <id> }`
      - Use `0` para conversa nova
      - Mostre "pensando..." (10–30s); destaque **negrito** que vier marcado
  - "+ Nova conversa" só zera janela e current id.

**Grade de Postagens**  
- POST `https://workflows.axnconsult.com/webhook/grade-postagens`
  - Carregar: `{ "action": "carregar" }` → `{ "grade": { grade_id, conteudo, status, atualizado_em } }`
  - Gerar: `{ "action": "gerar", "orientacoes": "<opcional>" }` → `{ "grade_id": <id>, "conteudo": "<markdown>", "status": "proposta" }`
  - Ajustar: `{ "action": "gerar", "feedback": "<ajuste>" }` → (grade regenerada)
  - Aprovar: `{ "action": "aprovar", "grade_id": <id> }` → `{ "grade_id": <id>, "status": "aprovada" }`
  - **Nunca gere automáticamente fora da ação do usuário.**

**Peças**  
- POST `https://workflows.axnconsult.com/webhook/pecas`
  - Gerar: `{ "action": "gerar", "tipo": "reels|carrossel|feed|stories", "briefing": "<só peça avulsa>" }`
      → `{ "peca_id", "tipo", "titulo", "conteudo" }` (30–120s)
  - Listar: `{ "action": "listar" }` → `{ "pecas": [{ id, tipo, titulo, criado_em }] }`
  - Carregar: `{ "action": "carregar", "peca_id": <id> }` → `{ "peca": { peca_id, tipo, titulo, conteudo, imagem_b64 } }`
  - Arte: `{ "action": "arte", "prompt": "<prompt>", "texto": "<headline, opcional>" }`
      → `{ "peca_id", "titulo", "imagem_b64" }` (imagem PNG 4:5 base64 em até 3min)

**Fábricas**
- Vídeos: POST `https://workflows.axnconsult.com/webhook/fabrica-videos` com `{ "roteiro": "<textarea>" }`
- Carrosséis: POST `https://workflows.axnconsult.com/webhook/fabrica-carrosseis` com `{ "carrossel": "<textarea>" }`
- Confere status HTTP; não processa resposta.
- 2xx: confirma ao usuário
- Erro: mantém textarea, mostra alerta.

---

# 4. Proteção por senha (basicauth Traefik)

- Peça ao usuário usuário e senha desejados para o painel.
- Gere o hash htpasswd:
  ```
  docker run --rm httpd:alpine htpasswd -nbB usuario 'senha'
  ```
  Escapar `$` para `$$` no YAML.
- Inclua o hash em:
  ```
  traefik.http.middlewares.gestao-auth.basicauth.users
  ```
- Anexar o middleware ao router do painel.

---

# 5. Contexto estratégico no banco

- No Postgres do container `axon_postgres`, base de dados `negocio`, user `axon_app`:
  - Criar tabela se não existe:
    ```
    create table if not exists conselho_contexto (id serial primary key, conteudo text, criado_em timestamptz default now());
    ```
  - Inserir o **conteúdo COMPLETO do arquivo de planejamento estratégico (.md da pasta do projeto)** como 1 linha em `conselho_contexto`.  
    - Use arquivo temp + `\copy` ou heredoc seguro (atenção a aspas simples; ajustar `psql` conforme sintaxe Windows).

---

# 6. Publicação na VPS

- Deploy na pasta `/opt/stacks/gestao/html/`, envie `index.html`, `styles.css` e `script.js` via `pscp -batch`.
- Crie `/opt/stacks/gestao/stack.yml` com:
  - Serviço: `nginx:alpine`
  - Volume: bind read-only apontando para pasta HTML.
  - Network: `network_swarm_public` (external)
  - Labels Traefik:
    - Host(`gestao.axnconsult.com`)
    - Entrypoint: `websecure`
    - Certresolver: `letsencryptresolver`
    - Middleware: basicauth (como acima)
  - Porta: 80
- Deploy do serviço:
  ```
  docker stack deploy -c /opt/stacks/gestao/stack.yml gestao
  ```
- **IMPORTANTE:** não modifique stacks existentes (traefik, portainer, postgres, n8n, evolution, chatwoot, axon-site, site_negocio).

---

# 7. Validação

- `docker service ls` — deve mostrar o novo serviço 1/1
- Teste:
  - `curl -I https://gestao.axnconsult.com` → HTTP 401 (basicauth)
  - Com credenciais: HTTP 200
  - Se não houver HTTPS após 3min (e DNS ok):  
    ```
    docker service update --force gestao_gestao
    ```
    (ajuste para o nome real do serviço mostrado pelo docker)
- Peça ao usuário para abrir no navegador, logar e navegar nas 3 abas:
  - Métricas carregam em Administração
  - Grade aparece (ou botão de gerar, se vazia) em Marketing
  - Tabela de leads na aba Vendas
  - Envie uma pergunta-teste a um conselheiro
  - Primeira geração da grade é feita **PELO USUÁRIO** (consome crédito dele; só acompanhe e informe)
- Cards das Fábricas: só confira se aparecem, botões desabilitam se textarea vazia. **NÃO envie teste real** — isto consome crédito do usuário (~US$ 1 cada envio). O próprio usuário realiza envios reais posteriormente.