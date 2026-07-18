Você vai construir e publicar uma landing page estática conforme este PRD. Os documentos do negócio estão na pasta deste projeto. Siga este PRD à risca e confirme com o usuário antes de cada comando que altere o servidor.

**1. O negócio**  
Deploy: programa de implementação digital rápida, online e ao vivo, criado para autônomos e pequenos negócios de serviço que vivem presos no WhatsApp. Em 5 dias, a turma de até 8 pessoas aprende e monta junto, com apoio do empreendedor, uma operação enxuta com IA e automações que devolve horas de vida toda semana, organizando atendimento, agenda, cobrança e conteúdo sem depender de agência ou tecnologia complexa.

**2. A página**  
Estrutura mobile-first, single-page (index.html, styles.css e script.js mínimos), com estas seções:

- **Hero**  
  Headline: "Libere horas do seu tempo. De verdade."  
  Subheadline: "Deploy: a implementação prática em grupo para autônomos e pequenos negócios que vivem no WhatsApp – em 5 dias, saia do caos operacional com IA, automações e uma estrutura digital sob medida, pronta para você."  
  CTA primário: botão "Quero Organizar Meu Negócio" rolando para o checkout. Use a peça de campanha (arquivo .png na pasta) como imagem de apoio, mostrando contraste entre caos de notificações e um painel organizado.

- **Dores**
  1. Cansado(a) de perder tempo repetindo respostas no WhatsApp, marcando horário e cobrando manualmente?
  2. Falta tempo para vender, atender bem e ainda manter as contas, sentindo que está sempre apagando incêndio?
  3. Já comprou curso ou mentoria que ficou só na teoria, sem conseguir implementar nada na prática?

- **Solução**
  O Deploy é um programa em grupo pequeno, online e ao vivo, que em 5 dias ajuda você, dono(a) de serviço local, a montar tudo o que precisa para deixar de ser refém do WhatsApp. Você sai com site pronto, conteúdos planejados, automações de atendimento, cobranças e agendamento, além de um painel simples para acompanhar leads e vendas. Não é só aprender sobre IA – é transformar a rotina e ganhar horas livres toda semana.

- **Diferencial/Prova**
  Enquanto outros prometem “robô no Whats” ou cursos cheios de ferramenta isolada, o Deploy monta junto com você uma operação digital completa, do zero, personalizada para o seu negócio. Grupo pequeno: atenção real em cada caso. Stack enxuta, fácil de manter. Resultados práticos desde o primeiro encontro – você vê a mudança e aprende a expandir depois, sem depender de agência ou tecnologia complicada.

- **Oferta e checkout**
  Participe do Deploy – programa ao vivo em grupo pequeno (até 8 pessoas)
  Inclui:
    - 5 encontros online, mão na massa (2h/dia)
    - Implementação completa: site, automações de WhatsApp, agendamento, cobranças, painel de leads/vendas
    - Materiais práticos e roteiros de uso
    - Suporte no grupo durante a semana
    - Acesso ao Conselho de IA para dúvidas de marketing e operação
  Valor: R$ 2.000 à vista (ou em até 12x pela Stripe)
  [Botão] "Reservar Minha Vaga"  
  Botão abre `https://buy.stripe.com/28E9AS5423QDaVX1Do2Fa00` em nova aba.

- **Formulário de interesse**  
  “Ainda tem dúvida? Fale com a equipe e saiba se o Deploy é para você.”  
    - Nome (obrigatório)
    - E-mail (obrigatório)
    - WhatsApp (obrigatório)
    - Mensagem (opcional)  
  Instrução: “Entraremos em contato para tirar suas dúvidas.”  
  Envio por POST via fetch para `https://workflows.axnconsult.com/webhook/leads` com os campos em JSON. Ao enviar, mostre mensagem genérica de sucesso (“Mensagem enviada! Responderemos em até 24h.”).  
  AVISO AO USUÁRIO: Este endpoint será ativado no módulo 6 do curso – o formulário deve funcionar perfeitamente, mas leads ainda NÃO são registrados.

- **Rodapé**
  Deploy – uma solução Axn  
  Contato: contato@axnconsult.com  
  Links:  
    - Termos de Uso  
    - Política de Privacidade  
  (Ambas as páginas são simples, geradas junto, com textos padrão de adequação genérica)

**3. Identidade visual**
- Paleta:
    - Cor principal: #0F3B57 (azul petróleo confiável)
    - Secundária: #E4F2FF (azul claro de organização)
    - Destaque: #FFC857 (amarelo tempo, botões/CTAs)
    - Apoio: #2BB673 (verde eficiência, ícones e sinais de resultados)
    - Muito branco nos fundos e blocos
- Tipografia (Google Fonts):
    - Títulos/headlines: Poppins 700/600
    - Subtítulos: Poppins 500
    - Textos corridos: Poppins 400
- Tom de voz: claro, leve, profissional, prático, evitando termos técnicos e promessas exageradas; frases curtas, didáticas, tom de conversa com autonomia e confiança, com foco em ganho de tempo e organização.  
- Visual: hero com fundo branco e faixa azul petróleo, CTA amarelo, cards com borda leve e ícones minimalistas outline (agenda, relógio, celular, checklist). Nada de degrade neon, fundo escuro, verde WhatsApp ou excesso de elementos; sempre aspecto organizado, leve e com ar de “tempo recuperado”.

**4. Integrações**
- Botão de compra: abre `https://buy.stripe.com/28E9AS5423QDaVX1Do2Fa00` em nova aba. 
- (Esta URL não possui `/test_`; se receber uma URL de checkout Stripe com `/test_`, AVISE: site em modo de teste – trocar pelo link definitivo antes de divulgar.)
- Formulário de interesse: POST para `https://workflows.axnconsult.com/webhook/leads` como JSON, mostrar mensagem de sucesso. AVISE: endpoint será ativado apenas no módulo 6 do curso – formulário deve estar pronto, mesmo sem registro real por ora.
- Pixels: peça ao usuário o arquivo de texto com os códigos do Google Tag e Meta Pixel (pasta do projeto); insira ambos no `<head>`. Se usuário não fornecer, prossiga sem pixel e AVISE.

**5. Pré-checagens (ANTES de qualquer alteração no servidor)**
- DNS: rode `nslookup axnconsult.com` e `nslookup www.axnconsult.com` verificando se ambos resolvem para 187.77.239.134.  
    - Se algum não resolver: PARE e avise o usuário para criar na Cloudflare os registros A `@` e `www` apontando para 187.77.239.134 (modo DNS only). Aguarde propagação, verifique novamente antes de seguir. Sem DNS correto o SSL falha.
- SSH não-interativo (Windows):  
    - Instale PuTTY: `winget install PuTTY.PuTTY` — AVISE antes que abrirá uma janela UAC para o usuário aprovar.
    - Capture a chave do host UMA vez: `echo y | plink -ssh root@187.77.239.134 "exit"`
    - TODOS os comandos `plink` e `pscp` devem usar `-batch`. NUNCA espere confirmação interativa (evita travamento sem mensagem).
- Peça ao usuário a senha root da VPS (está no gerenciador de senhas; IP no documento de infra da pasta).

**6. Publicação na VPS**
- VPS roda Docker Swarm com Traefik (rede `network_swarm_public`, certresolver `letsencryptresolver`)
- No servidor: crie `/opt/stacks/site-negocio/html`, envie via scp os arquivos do site.
- Crie `/opt/stacks/site-negocio/stack.yml` com serviço `nginx:alpine`, volume bind com html, conectado à `network_swarm_public`, labels Traefik:  
  ```
  traefik.enable=true
  traefik.http.routers.site-negocio.rule=Host(`axnconsult.com`) || Host(`www.axnconsult.com`)
  traefik.http.routers.site-negocio.entrypoints=websecure
  traefik.http.routers.site-negocio.tls.certresolver=letsencryptresolver
  ```
  Serviço expõe porta 80.
- Deploy:  
  `docker stack deploy -c /opt/stacks/site-negocio/stack.yml site_negocio`
- REGRA CRÍTICA: NÃO altere, reinicie ou remova NENHUM serviço ou stack existente (traefik, portainer, postgres, n8n, evolution, chatwoot, axon-site). Apenas crie a stack nova.

**7. Validação**
- Cheque: `docker service ls` (serviço novo com 1/1 réplica)
- Teste: `curl -I https://axnconsult.com` esperando HTTP 200; aguarde até 2 minutos para emissão do SSL.
- Se SSL não sair em ~3 minutos: revalide DNS; se recente, force nova tentativa:  
  `docker service update --force site_negocio_site`
- Peça ao usuário para abrir no navegador (desktop e celular), testando identidade visual, botão de compra e formulário.

