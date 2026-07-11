const COURSE_MODULES = [
  {
    id: "module-1",
    number: 1,
    title: "Modelagem de Negocio",
    summary: "Explore seu perfil, habilidades e o mercado para chegar a uma hipotese de negocio viavel e validada.",
    result: "Hipotese de negocio validada",
    stages: [
      ["Modelagem do negocio", "Transforme ideia, habilidades e restricoes em uma hipotese de negocio viavel.", "Vamos identificar o que o negocio vende, quais sinais de mercado existem e qual ideia principal faz mais sentido validar primeiro.", "business_modeling"]
    ]
  },
  {
    id: "module-2",
    number: 2,
    title: "Diagnostico Estrategico",
    summary: "Com a hipotese definida, aprofunde publico, diferencial, precificacao, produto e identidade visual.",
    result: "Planejamento Estrategico Operacional",
    stages: [
      ["Publico-alvo", "Defina quem tem maior probabilidade de comprar essa solucao.", "Vamos sair de uma audiencia vaga para um comprador possivel, com dores, desejos, contexto de compra e objecoes claras.", "target_audience"],
      ["Diferencial estrategico", "Encontre uma posicao clara para competir sem depender apenas de preco.", "Vamos comparar alternativas reais e definir um diferencial simples, relevante e comunicavel.", "strategic_differentiation"],
      ["Precificacao estrategica", "Defina uma faixa inicial de preco coerente com mercado, valor e meta financeira.", "Vamos ligar preco a resultado, volume necessario de vendas e capacidade real de entrega.", "strategic_pricing"],
      ["Conceito do produto", "Defina nome, promessa, formato e entregaveis centrais.", "Transforme a estrategia em um produto compreensivel, com promessa clara e formato vendavel.", "product_concept"],
      ["Identidade visual inicial", "Defina a direcao visual para pagina, posts e materiais.", "Converta posicionamento, publico e conceito em uma identidade visual aplicavel.", "visual_identity"]
    ]
  },
  {
    id: "module-3",
    number: 3,
    title: "Estrutura Digital",
    summary: "Coloque toda a infraestrutura no ar: dominio, VPS, servicos base, atendimento automatico e credenciais prontas para uso.",
    result: "Infraestrutura digital operacional com credenciais documentadas",
    stages: [
      ["Dominio, VPS e DNS", "Compre o dominio e a VPS, conecte na Cloudflare e aponte os registros DNS.", "technical", null, ["domain", "vps-compra", "dns", "email"]],
      ["Configuracao automatica", "Um script instala tudo: Docker, Swarm, Traefik, Portainer, Postgres, n8n, Evolution API e Chatwoot.", "technical", null, ["infra-auto"]],
      ["Chaves e contas", "Crie contas no Google Ads e Meta Ads, copie os pixels e as chaves de OpenAI e Anthropic.", "technical", null, ["api-keys", "midia-paga"]],
      ["Documento de infra", "Anote URLs de acesso, credenciais e pixels em um unico documento. Sem comandos — so revisao e registro.", "technical", null, ["infra-dados"]]
    ]
  },
  {
    id: "module-4",
    number: 4,
    title: "Presenca Comercial",
    summary: "Use IA para criar grade de postagens, roteiros por formato e a primeira peca de campanha — tudo a partir do seu planejamento dos modulos 1 e 2.",
    result: "Grade, roteiros e peca de campanha criados e exportados",
    stages: [
      ["Estrategia de divulgacao", "Agentes leem seu planejamento e geram uma grade estrategica de 28 dias.", "technical", null, ["grade-postagens"]],
      ["Roteiros e textos", "Agente converte a grade em roteiros prontos para producao por formato.", "technical", null, ["roteiros-textos"]],
      ["Peca de campanha", "IA gera a primeira arte visual de divulgacao para aprovacao.", "technical", null, ["peca-campanha"]],
      ["Fabrica de Videos — setup", "Crie sua conta HeyGen, escolha apresentador e voz, e valide a configuracao.", "technical", null, ["heygen-setup"]]
    ]
  },
  {
    id: "module-5",
    number: 5,
    title: "Site e Checkout",
    summary: "Instale o Claude, gere o PRD do seu site com um agente e publique a pagina com formulario de leads e checkout na sua VPS.",
    result: "Site no ar recebendo leads e vendas",
    stages: [
      ["Instalar o Claude", "Crie a conta na Anthropic, instale o app e prepare a pasta do projeto com seus documentos.", "technical", null, ["claude-setup"]],
      ["Pagamento e PRD do site", "Escolha a plataforma de pagamento, crie o link de checkout e gere o PRD personalizado do seu site.", "technical", null, ["site-prd"]],
      ["Publicar e validar", "Cole o PRD no Claude, acompanhe a construcao e a publicacao do site na sua VPS.", "technical", null, ["site-deploy"]]
    ]
  },
  {
    id: "module-6",
    number: 6,
    title: "Operacao Assistida",
    summary: "Conecte o WhatsApp ao atendimento automatico, registre os leads do site, ative a Fabrica de Videos e ganhe um Conselho de IA para decidir com dados.",
    result: "Atendimento automatico no ar, Fabrica de Videos ativa e Conselho de IA acompanhando o negocio",
    stages: [
      ["Conectar o WhatsApp", "Crie a instancia na Evolution API, escaneie o QR code e integre ao Chatwoot.", "technical", null, ["whatsapp-connect"]],
      ["Leads e vendas do site", "Ative os webhooks que registram leads do formulario e vendas do checkout no seu banco.", "technical", null, ["leads-webhook", "crm"]],
      ["Agente de atendimento", "Gere o prompt personalizado do seu atendente de IA e ative o fluxo que responde o WhatsApp.", "technical", null, ["atendimento-agente"]],
      ["Fabrica de Videos — ativar", "Ative o fluxo que transforma os roteiros do Modulo 4 em videos prontos, entregues no seu WhatsApp.", "technical", null, ["fabrica-videos-ativar"]],
      ["Painel e Conselho de IA", "Publique o painel de gestao no seu dominio com dashboard de leads e o Conselho de 3 especialistas.", "technical", null, ["painel-conselho"]]
    ]
  }
];

const WIZARD_STEPS = [
  {
    id: "domain",
    title: "Preparar dominio",
    objective: "Comprar o dominio, adicionar na Cloudflare e validar que a Cloudflare assumiu o DNS.",
    tutorial: [
      {
        heading: "1. Compre o dominio",
        body: `<p>Escolha a extensão do seu domínio:</p>
<ul>
  <li><strong>.com.br</strong> — compre no <a href="https://registro.br" target="_blank" rel="noopener">Registro.br</a>. Crie uma conta, busque o domínio desejado e finalize a compra. O processo leva menos de 10 minutos.</li>
  <li><strong>.com</strong> — compre direto na <a href="https://www.cloudflare.com/products/registrar/" target="_blank" rel="noopener">Cloudflare Registrar</a>. Vantagem: o domínio já nasce dentro da Cloudflare, sem precisar trocar nameservers.</li>
</ul>
<p>Se comprou na Cloudflare, pule para o passo 3.</p>`
      },
      {
        heading: "2. Adicione o domínio na Cloudflare",
        body: `<p>Acesse <a href="https://dash.cloudflare.com" target="_blank" rel="noopener">dash.cloudflare.com</a> e crie uma conta gratuita se ainda não tiver.</p>
<ol>
  <li>Na tela inicial, clique em <strong>Add a domain</strong>.</li>
  <li>Digite seu domínio (ex: <code>seudominio.com.br</code>) e clique em <strong>Continue</strong>.</li>
  <li>Selecione o plano <strong>Free</strong> e clique em <strong>Continue</strong>.</li>
  <li>A Cloudflare vai escanear os registros existentes — clique em <strong>Continue</strong> para aceitar.</li>
  <li>Anote os dois <strong>nameservers</strong> que a Cloudflare exibir (ex: <code>aria.ns.cloudflare.com</code> e <code>bob.ns.cloudflare.com</code>).</li>
</ol>`
      },
      {
        heading: "3. Troque os nameservers no registrador",
        body: `<p><strong>Se comprou no Registro.br:</strong></p>
<ol>
  <li>Acesse <a href="https://registro.br" target="_blank" rel="noopener">registro.br</a> → Painel → seu domínio.</li>
  <li>Clique em <strong>Editar</strong> na seção de servidores DNS.</li>
  <li>Substitua os nameservers atuais pelos dois da Cloudflare.</li>
  <li>Salve. A propagação leva entre 30 minutos e 24 horas — normalmente menos de 1 hora.</li>
</ol>
<p><strong>Se comprou na Cloudflare:</strong> os nameservers já estão corretos. Nada a fazer.</p>`
      },
      {
        heading: "4. Confirme que a Cloudflare assumiu o DNS",
        body: `<p>Em <a href="https://dash.cloudflare.com" target="_blank" rel="noopener">dash.cloudflare.com</a>, o domínio deve aparecer com status <strong>Active</strong> (faixa verde). A propagação leva de 30 minutos a 24 horas — normalmente menos de 1 hora.</p>
<p>Registre seu domínio no campo abaixo — os próximos passos usam esse dado.</p>`
      }
    ],
    validation: "A Cloudflare mostrar o dominio como ativo.",
    done: "A Cloudflare mostrar o dominio como ativo.",
    fields: [{ key: "domain", label: "Seu dominio", placeholder: "seudominio.com.br" }]
  },
  {
    id: "vps-compra",
    title: "Contratar a VPS",
    objective: "Contratar o servidor e anotar o IP publico — o DNS do proximo passo aponta para ele.",
    tutorial: [
      {
        heading: "1. Contrate a VPS",
        body: `<p>Recomendamos a <a href="https://www.hostinger.com/br/cart?product=vps%3Avps_kvm_2&period=12&referral_type=cart_link&REFERRALCODE=5JMAXNCONSMV&referral_id=019eff18-e879-7085-9be4-4eb1848f1cc0" target="_blank" rel="noopener">Hostinger VPS</a> pelo custo-benefício e suporte em português. O plano <strong>KVM 2</strong> (2 vCPU, 8 GB RAM) é suficiente para toda a infraestrutura.</p>
<ol>
  <li>Acesse <a href="https://www.hostinger.com/br/cart?product=vps%3Avps_kvm_2&period=12&referral_type=cart_link&REFERRALCODE=5JMAXNCONSMV&referral_id=019eff18-e879-7085-9be4-4eb1848f1cc0" target="_blank" rel="noopener">esse link com desconto</a> e escolha o plano <strong>KVM 2</strong>.</li>
  <li>Na configuração, selecione sistema operacional <strong>Ubuntu 24.04</strong>.</li>
  <li>Escolha a região <strong>São Paulo</strong> — menor latência para o Brasil.</li>
  <li>Conclua a compra. O painel de controle da VPS aparece em alguns minutos.</li>
</ol>
<p>A senha root chega por e-mail ou é definida no próprio painel — guarde-a, você vai usá-la para acessar o servidor.</p>`
      },
      {
        heading: "2. Anote o IP público",
        body: `<p>No painel da Hostinger, acesse <strong>VPS → Gerenciar</strong> e copie o <strong>IP público</strong>. Registre no campo abaixo — a configuração de DNS usa esse IP.</p>`
      }
    ],
    validation: "O painel da VPS mostrar o servidor ativo com IP publico.",
    done: "Tiver o IP publico e a senha root em maos.",
    fields: [{ key: "serverIp", label: "IP da VPS", placeholder: "123.123.123.123" }]
  },
  {
    id: "dns",
    title: "Configurar DNS",
    objective: "Criar os registros que levam site, painel, workflows e webhooks para a VPS.",
    tutorial: [
      {
        heading: "1. Acesse o painel de DNS da Cloudflare",
        body: `<p>Em <a href="https://dash.cloudflare.com" target="_blank" rel="noopener">dash.cloudflare.com</a>, clique no seu domínio e depois em <strong>DNS → Records</strong> no menu lateral.</p>`
      },
      {
        heading: "2. Crie os registros A dos serviços",
        body: `<p>Repita <strong>Add record</strong> para cada linha abaixo:</p>
<table style="width:100%;border-collapse:collapse;font-size:0.85rem">
  <tr style="text-align:left"><th>Type</th><th>Name</th><th>IPv4 address</th><th>Proxy</th></tr>
  <tr><td>A</td><td><code>@</code></td><td><code>{{serverIp}}</code></td><td>DNS only</td></tr>
  <tr><td>A</td><td><code>painel</code></td><td><code>{{serverIp}}</code></td><td>DNS only</td></tr>
  <tr><td>A</td><td><code>workflows</code></td><td><code>{{serverIp}}</code></td><td>DNS only</td></tr>
  <tr><td>A</td><td><code>webhooks</code></td><td><code>{{serverIp}}</code></td><td>DNS only</td></tr>
  <tr><td>A</td><td><code>chat</code></td><td><code>{{serverIp}}</code></td><td>DNS only</td></tr>
  <tr><td>A</td><td><code>evo</code></td><td><code>{{serverIp}}</code></td><td>DNS only</td></tr>
</table>
<p style="margin-top:8px">O registro <code>@</code> aponta o domínio raiz (<code>{{domain}}</code>) para a VPS — o site ficará aqui no módulo 4. Mantenha todos como <strong>DNS only</strong> (nuvem cinza). O Traefik cuida do HTTPS — não deixe a Cloudflare proxiar.</p>`
      }
    ],
    validation: "Os 6 registros A aparecerem na lista de DNS da Cloudflare.",
    done: "Registros A criados — dominio raiz e todos os subdominios apontando para a VPS."
  },
  {
    id: "email",
    title: "E-mail para certificados",
    objective: "Registrar o e-mail do negocio para geracao dos certificados HTTPS.",
    tutorial: [
      {
        heading: "1. Informe o e-mail do negócio",
        body: `<p>Preencha o campo abaixo com o e-mail do seu negócio. Ele será usado pela infraestrutura para gerar e renovar automaticamente os certificados de segurança HTTPS de todos os seus subdomínios.</p>
<p>Use um e-mail real que você acessa — avisos de renovação de certificado chegam por aqui.</p>`
      }
    ],
    validation: "E-mail preenchido.",
    done: "E-mail tecnico registrado.",
    fields: [{ key: "technicalEmail", label: "E-mail do negócio", placeholder: "voce@seudominio.com.br" }]
  },
  {
    id: "infra-auto",
    title: "Configuracao automatica",
    objective: "Um script baixa, instala e configura toda a infraestrutura: Docker, Swarm, Traefik, Portainer, Postgres e n8n.",
    tutorial: [
      {
        heading: "1. Crie a senha do banco de dados",
        body: `<p>Acesse <a href="https://randomkeygen.com/" target="_blank" rel="noopener">randomkeygen.com</a>, selecione uma senha da seção <strong>128-bit Hex</strong> e cole no campo abaixo. Ela será usada em todas as stacks — guarde-a em lugar seguro.</p>`,
        field: "postgresPassword"
      },
      {
        heading: "2. Baixe e envie o script para a VPS",
        body: `<p>Clique no botão abaixo para baixar o script com seus dados já preenchidos. O arquivo será salvo na pasta de Downloads ou Desktop do seu computador.</p>
<p><button class="button button-primary" type="button" id="download-infra-script">Baixar script de configuração (axn-setup.sh)</button></p>
<p>Agora envie o arquivo para a VPS. Abra um <strong>novo terminal no seu computador</strong> (PowerShell ou CMD) — <strong>não abra o SSH da VPS</strong>. Cole o comando abaixo substituindo o caminho pelo local onde o arquivo foi salvo:</p>`,
        command: `scp C:\\Users\\SeuUsuario\\Desktop\\axn-setup.sh root@{{serverIp}}:/root/`
      },
      {
        heading: "3. Conecte na VPS via SSH",
        body: `<p>No terminal do seu computador (PowerShell ou CMD), conecte na VPS:</p>`,
        command: `ssh root@{{serverIp}}`
      },
      {
        heading: "4. Execute o script",
        body: `<p>Já dentro do terminal SSH da VPS, rode:</p>`,
        command: `bash /root/axn-setup.sh`
      },
      {
        heading: "5. Crie o usuário admin no Portainer",
        body: `<p>Quando o script terminar, ele vai exibir a <strong>Chave da Evolution API</strong> — copie e guarde no documento de infra.</p>
<p>Abra o Portainer no navegador, defina usuário e senha e clique em <strong>Create user</strong>. Não será pedido nenhum token.</p>
<p>Se a página exibir "timeout", rode o comando abaixo e acesse novamente:</p>`,
        command: `docker service update --force portainer_portainer`
      },
      {
        heading: "6. Verifique os serviços no ar",
        body: `<p>Quando o script terminar, esses são os endereços da sua infraestrutura. Abra cada um e confirme que carrega:</p>
<ul>
  <li><strong>Portainer</strong> (painel): <a href="https://painel.{{domain}}" target="_blank">https://painel.{{domain}}</a></li>
  <li><strong>n8n</strong> (workflows): <a href="https://workflows.{{domain}}" target="_blank">https://workflows.{{domain}}</a></li>
  <li><strong>Chatwoot</strong> (atendimento): <a href="https://chat.{{domain}}" target="_blank">https://chat.{{domain}}</a></li>
  <li><strong>Evolution API</strong> (WhatsApp): <a href="https://evo.{{domain}}/manager" target="_blank">https://evo.{{domain}}/manager</a></li>
</ul>
<p><strong>Chave da Evolution API:</strong> <code>{{evolutionApiKey}}</code><br>Anote no documento de infra do módulo 3.</p>
<p>Se algum serviço demorar para abrir, aguarde 2 minutos e recarregue — os certificados SSL podem levar um instante para ser emitidos.</p>`
      }
    ],
    fields: [
      { key: "postgresPassword", label: "Senha do banco Postgres (usada em todas as stacks)", placeholder: "SuaSenhaForteAqui", inline: true }
    ],
    validation: "docker service ls mostrar todos os serviços (traefik, postgres, n8n, chatwoot, evolution, portainer) com replica 1/1.",
    done: "Infraestrutura completa no ar. Admin criado no Portainer."
  },
  {
    id: "vps",
    title: "Acessar VPS",
    objective: "Entrar no servidor e preparar a base do sistema.",
    tutorial: [
      {
        heading: "1. Acesse via SSH",
        body: `<p>No seu terminal local (PowerShell, CMD, Terminal, etc.), conecte no servidor. A senha é a senha root definida na contratação da VPS:</p>`,
        command: "ssh root@{{serverIp}}"
      },
      {
        heading: "2. Atualize os pacotes do servidor",
        body: `<p>Na primeira vez que entrar no servidor, atualize tudo antes de instalar qualquer coisa:</p>`,
        command: "apt update && apt upgrade -y"
      },
      {
        heading: "3. Configure o firewall básico",
        body: `<p>Libere as portas necessárias e bloqueie o resto:</p>`,
        command: "ufw allow 22/tcp\nufw allow 80/tcp\nufw allow 443/tcp\nufw --force enable"
      }
    ],
    validation: "O ufw responder com as portas 22, 80 e 443 liberadas.",
    done: "Conectado via SSH com pacotes atualizados e firewall ativo."
  },
  {
    id: "swarm",
    title: "Docker Swarm",
    objective: "Instalar Docker, iniciar Swarm e criar a rede publica da infra.",
    tutorial: [
      {
        heading: "1. Instale o Docker",
        body: `<p>Execute o instalador oficial do Docker no servidor:</p>`,
        command: "curl -fsSL https://get.docker.com | sh"
      },
      {
        heading: "2. Inicialize o Swarm",
        body: `<p>Transforme o servidor em um nó manager do Docker Swarm. Use o IP público da sua VPS:</p>`,
        command: "docker swarm init --advertise-addr {{serverIp}}"
      },
      {
        heading: "3. Crie a rede pública",
        body: `<p>Todos os serviços que precisam se comunicar com o Traefik (o proxy reverso) precisam estar nessa rede:</p>`,
        command: "docker network create --driver=overlay --attachable network_swarm_public"
      },
      {
        heading: "4. Crie os volumes de dados",
        body: `<p>Volumes são onde os dados persistem mesmo que os containers sejam reiniciados. Cada comando responde com o nome do volume criado:</p>`,
        command: "docker volume create volume_swarm_certificates\ndocker volume create portainer_data\ndocker volume create postgres_data\ndocker volume create redis_n8n_data"
      }
    ],
    validation: "O swarm init responder 'This node is now a manager' e os volumes serem criados sem erro.",
    done: "Docker instalado, Swarm ativo, rede e volumes criados."
  },
  {
    id: "traefik",
    title: "Subir Traefik",
    objective: "Publicar o proxy publico unico com HTTP, HTTPS e Let's Encrypt.",
    tutorial: [
      {
        heading: "1. Crie o arquivo da stack no servidor",
        body: `<p>O Portainer ainda não existe — então o Traefik precisa ser deployado diretamente via SSH. No terminal conectado ao servidor, crie o arquivo YAML:</p>`,
        command: "mkdir -p /opt/stacks/traefik\nnano /opt/stacks/traefik/stack.yml"
      },
      {
        heading: "2. Cole o YAML no editor",
        body: `<p>Copie o conteúdo do bloco <strong>traefik — stack.yml</strong> abaixo e cole no nano. Confira que a linha <code>acme.email</code> mostra seu e-mail real — o Let's Encrypt usa esse endereço para avisos de certificado.</p>
<p>Salve com <kbd>Ctrl+O</kbd> → <kbd>Enter</kbd> e feche com <kbd>Ctrl+X</kbd>.</p>`
      },
      {
        heading: "3. Faça o deploy da stack",
        body: `<p>Ainda no terminal SSH, execute:</p>`,
        command: "docker stack deploy -c /opt/stacks/traefik/stack.yml traefik"
      },
      {
        heading: "4. Confirme que o Traefik subiu",
        body: `<p>Aguarde ~20 segundos e verifique. O serviço deve mostrar <strong>1/1</strong> na coluna REPLICAS:</p>`,
        command: "docker service ls"
      }
    ],
    validation: "docker service ls mostrar o traefik com replica 1/1.",
    done: "Traefik rodando com replica 1/1.",
    yaml: [{ name: "traefik — stack.yml", note: "Copie e cole no nano aberto no passo 1. Salve com Ctrl+O e feche com Ctrl+X.", content: `version: "3.7"

services:
  traefik:
    image: traefik:v3.3
    command:
      - "--api.dashboard=true"
      - "--providers.swarm.endpoint=unix:///var/run/docker.sock"
      - "--providers.swarm.exposedbydefault=false"
      - "--providers.swarm.network=network_swarm_public"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--entrypoints.web.http.redirections.entrypoint.permanent=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencryptresolver.acme.email={{technicalEmail}}"
      - "--certificatesresolvers.letsencryptresolver.acme.storage=/etc/traefik/letsencrypt/acme.json"
      - "--log.level=INFO"
      - "--accesslog=true"
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
        - "traefik.http.middlewares.redirect-https.redirectscheme.permanent=true"
        - "traefik.http.routers.http-catchall.rule=hostregexp(\`{host:.+}\`)"
        - "traefik.http.routers.http-catchall.entrypoints=web"
        - "traefik.http.routers.http-catchall.middlewares=redirect-https@swarm"
        - "traefik.http.routers.http-catchall.priority=1"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "vol_certificates:/etc/traefik/letsencrypt"
    networks:
      - network_swarm_public
    ports:
      - target: 80
        published: 80
        mode: host
      - target: 443
        published: 443
        mode: host

volumes:
  vol_certificates:
    external: true
    name: volume_swarm_certificates

networks:
  network_swarm_public:
    external: true
    name: network_swarm_public` }]
  },
  {
    id: "portainer",
    title: "Subir Portainer",
    objective: "Abrir o painel operacional em HTTPS.",
    tutorial: [
      {
        heading: "1. Crie e faça deploy da stack via SSH",
        body: `<p>Assim como no Traefik, esse deploy também é feito via SSH porque o Portainer ainda não está no ar:</p>`,
        command: "mkdir -p /opt/stacks/portainer\nnano /opt/stacks/portainer/stack.yml"
      },
      {
        heading: "2. Cole o YAML e faça o deploy",
        body: `<p>Copie o conteúdo do bloco <strong>portainer — stack.yml</strong> abaixo, cole no nano e salve. Depois execute:</p>`,
        command: "docker stack deploy -c /opt/stacks/portainer/stack.yml portainer"
      },
      {
        heading: "3. Aguarde o DNS propagar e acesse o painel",
        body: `<p>O DNS do subdomínio <code>painel.{{domain}}</code> precisa estar propagado (etapa anterior). Aguarde 1-2 minutos após o deploy e acesse pelo navegador:</p>`,
        command: "https://painel.{{domain}}"
      },
      {
        heading: "4. Crie o usuário administrador",
        body: `<p>Na primeira vez que abrir o Portainer, ele vai pedir para criar o usuário admin. Defina um nome de usuário e uma senha forte. Depois clique em <strong>Get Started</strong> e depois em <strong>local</strong> para conectar ao Swarm local.</p>
<p>A partir de agora, todos os deploys podem ser feitos pelo painel do Portainer via <strong>Stacks → Add stack</strong>.</p>`
      }
    ],
    validation: "O painel abrir em https://painel.{{domain}} com cadeado HTTPS valido.",
    done: "Usuario admin criado e ambiente Swarm visivel no Portainer.",
    yaml: [{ name: "portainer — stack.yml", note: "Copie e cole no nano aberto no passo 1. Salve com Ctrl+O e feche com Ctrl+X.", content: `version: "3.7"

services:
  agent:
    image: portainer/agent:sts
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    networks:
      - network_swarm_public
    deploy:
      mode: global
      placement:
        constraints:
          - node.platform.os == linux

  portainer:
    image: portainer/portainer-ce:sts
    command: -H tcp://tasks.agent:9001 --tlsskipverify
    volumes:
      - portainer_data:/data
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=network_swarm_public"
        - "traefik.http.routers.portainer.rule=Host(\`painel.{{domain}}\`)"
        - "traefik.http.routers.portainer.entrypoints=websecure"
        - "traefik.http.routers.portainer.tls.certresolver=letsencryptresolver"
        - "traefik.http.routers.portainer.service=portainer"
        - "traefik.http.services.portainer.loadbalancer.server.port=9000"

networks:
  network_swarm_public:
    external: true
    attachable: true
    name: network_swarm_public

volumes:
  portainer_data:
    external: true
    name: portainer_data` }]
  },
  {
    id: "site",
    title: "Publicar site",
    objective: "Publicar uma imagem Docker como site em dominio proprio.",
    tutorial: [
      {
        heading: "1. Crie a stack no Portainer",
        body: `<p>No Portainer, acesse <strong>Stacks → Add stack</strong>. Dê o nome <code>site</code> e cole o conteúdo do YAML abaixo no editor.</p>
<p>Confirme se a variável <code>DATABASE_URL</code> no YAML contém a senha real do seu Postgres (ela deve aparecer preenchida automaticamente se você a salvou no passo anterior).</p>`
      },
      {
        heading: "2. Configure a imagem Docker",
        body: `<p>A variável <code>{{siteImage}}</code> no YAML deve ser substituída pelo endereço real da sua imagem Docker (ex: <code>registry.hub.docker.com/seunome/seusite:latest</code>). Se ainda não tem uma imagem, use a imagem de placeholder da Axon para testar o deploy.</p>`
      },
      {
        heading: "3. Faça o deploy e aguarde",
        body: `<p>Clique em <strong>Deploy the stack</strong>. Aguarde ~30 segundos e verifique se o container está rodando sem reiniciar (status <strong>Running</strong>, não <strong>Starting</strong> em loop).</p>`
      },
      {
        heading: "4. Valide o site e o health check",
        body: `<p>Confirme que o site abre com HTTPS e que o health check responde:</p>`,
        command: "curl -I https://{{domain}}\ncurl https://{{domain}}/health"
      }
    ],
    checklist: ["Stack criada no Portainer com DATABASE_URL correta", "Container rodando sem reiniciar em loop", "https://{{domain}} abre o site com HTTPS", "/health responde 'ok'"],
    yaml: [{ name: "site — stack.yml", content: `version: "3.7"

services:
  site:
    image: {{siteImage}}
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    environment:
      NODE_ENV: production
      PORT: "80"
      DATABASE_URL: "postgres://axon_app:{{postgresPassword}}@postgres:5432/axon_ops"
    networks:
      - network_swarm_public
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1/health | grep -q ok"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.25"
          memory: 128M
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=network_swarm_public"
        - "traefik.http.routers.site.rule=Host(\`{{domain}}\`) || Host(\`www.{{domain}}\`)"
        - "traefik.http.routers.site.entrypoints=websecure"
        - "traefik.http.routers.site.tls.certresolver=letsencryptresolver"
        - "traefik.http.routers.site.service=site"
        - "traefik.http.services.site.loadbalancer.server.port=80"
        - "traefik.http.services.site.loadbalancer.passHostHeader=true"
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
        failure_action: rollback
      rollback_config:
        parallelism: 1
        order: stop-first

networks:
  network_swarm_public:
    external: true
    name: network_swarm_public` }]
  },
  {
    id: "postgres",
    title: "Subir Postgres",
    objective: "Criar banco operacional para o site e automacoes.",
    tutorial: [
      {
        heading: "1. Crie a stack no Portainer",
        body: `<p>No Portainer, acesse <strong>Stacks → Add stack</strong>. Dê o nome <code>postgres</code> e cole o YAML abaixo. Antes de criar, insira a senha do banco no campo abaixo do tutorial para preenchê-la automaticamente no YAML.</p>
<p>Clique em <strong>Deploy the stack</strong> e aguarde o container subir.</p>`
      },
      {
        heading: "2. Conecte no banco",
        body: `<p>Com o Postgres rodando, conecte no banco a partir do terminal SSH do servidor:</p>`,
        command: "docker exec -it $(docker ps -qf name=postgres) psql -U postgres"
      },
      {
        heading: "3. Crie o banco e o usuário da aplicação",
        body: `<p>Dentro do prompt <code>postgres=#</code>, execute os comandos abaixo (um de cada vez). Ela usará a senha que você digitou no campo abaixo:</p>`,
        command: "CREATE DATABASE axon_ops;\nCREATE USER axon_app WITH ENCRYPTED PASSWORD '{{postgresPassword}}';\nGRANT ALL PRIVILEGES ON DATABASE axon_ops TO axon_app;\n\\q"
      }
    ],
    validation: "Os comandos SQL responderem CREATE DATABASE, CREATE ROLE e GRANT sem erro.",
    done: "Banco axon_ops e usuario axon_app criados.",
    fields: [
      { key: "postgresPassword", label: "Senha do banco Postgres (para uso em todas as stacks)", placeholder: "SuaSenhaForteAqui" }
    ],
    yaml: [{ name: "postgres — stack.yml", content: `version: "3.7"

services:
  postgres:
    image: pgvector/pgvector:pg16
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    networks:
      - network_swarm_public
    command:
      - postgres
      - --max_connections=200
      - --port=5432
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: {{postgresPassword}}
      POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256"
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "1"
          memory: 1024M

volumes:
  postgres_data:
    external: true
    name: postgres_data

networks:
  network_swarm_public:
    external: true
    name: network_swarm_public` }]
  },
  {
    id: "n8n",
    title: "n8n em fila",
    objective: "Subir editor, webhooks, worker, runners e Redis. Suba uma stack por vez, na ordem abaixo.",
    tutorial: [
      {
        heading: "1. Gere as credenciais necessárias",
        body: `<p>Antes de criar as stacks, você precisa de dois tokens aleatórios. Execute no terminal SSH do servidor para gerar cada um:</p>`,
        command: "openssl rand -hex 32"
      },
      {
        heading: "2. Anote os valores",
        body: `<p>Execute o comando acima <strong>duas vezes</strong> e anote os resultados:</p>
<ul>
  <li><strong>N8N_ENCRYPTION_KEY</strong> — chave de criptografia das credenciais salvas no n8n</li>
  <li><strong>N8N_RUNNERS_AUTH_TOKEN</strong> — token de autenticação entre worker e runners</li>
</ul>
<p>Você vai substituir <code>{{n8nEncryptionKey}}</code> e <code>{{n8nRunnersAuthToken}}</code> por esses valores em todas as stacks abaixo.</p>`
      },
      {
        heading: "3. Suba as stacks em ordem",
        body: `<p>No Portainer (<strong>Stacks → Add stack</strong>), suba as 5 stacks na sequência exata abaixo. Aguarde o status <strong>Running</strong> antes de passar para a próxima:</p>
<ol>
  <li><strong>redis-n8n</strong> — banco de filas em memória</li>
  <li><strong>n8n-editor</strong> — interface visual (preencha todos os placeholders antes de criar)</li>
  <li><strong>n8n-webhook</strong> — recebe webhooks externos</li>
  <li><strong>n8n-worker</strong> — executa os jobs da fila</li>
  <li><strong>n8n-runners</strong> — executa código JavaScript e Python</li>
</ol>`
      },
      {
        heading: "4. Teste com um workflow manual",
        body: `<p>Acesse o editor em <a href="https://workflows.{{domain}}" target="_blank" rel="noopener">workflows.{{domain}}</a>. Crie um workflow com um nó <strong>Manual Trigger</strong> e um nó <strong>Set</strong>. Execute e confirme que a execução aparece no histórico sem erros.</p>`
      }
    ],
    validation: "O workflow manual executar e aparecer no historico sem erros.",
    done: "Editor no ar e workflow de teste executado com sucesso.",
    yaml: [
      { name: "1 — redis-n8n (stack.yml)", content: `version: "3.7"

services:
  redis_n8n:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    networks:
      - network_swarm_public
    volumes:
      - redis_n8n_data:/data
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.25"
          memory: 256M

volumes:
  redis_n8n_data:
    external: true
    name: redis_n8n_data

networks:
  network_swarm_public:
    external: true
    name: network_swarm_public` },
      { name: "2 — n8n-editor (stack.yml)", content: `version: "3.7"

services:
  n8n_editor:
    image: n8nio/n8n:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: start
    networks:
      - network_swarm_public
    environment:
      - N8N_ENCRYPTION_KEY={{n8nEncryptionKey}}
      - NODE_ENV=production
      - N8N_METRICS=true
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_LOG_LEVEL=info
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_RUNNERS_ENABLED=true
      - N8N_RUNNERS_MODE=external
      - N8N_RUNNERS_BROKER_LISTEN_ADDRESS=0.0.0.0
      - N8N_RUNNERS_AUTH_TOKEN={{n8nRunnersAuthToken}}
      - N8N_NATIVE_PYTHON_RUNNER=true
      - OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS=true
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=axon_postgres_axon_postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=axon_app
      - DB_POSTGRESDB_PASSWORD={{postgresPassword}}
      - N8N_PORT=5678
      - N8N_HOST=workflows.{{domain}}
      - N8N_EDITOR_BASE_URL=https://workflows.{{domain}}/
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://webhooks.{{domain}}/
      - N8N_ENDPOINT_WEBHOOK=webhook
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis_n8n_redis_n8n
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=2
      - EXECUTIONS_TIMEOUT=3600
      - EXECUTIONS_TIMEOUT_MAX=7200
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=336
      - EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000
      - EXECUTIONS_DATA_SAVE_ON_ERROR=all
      - EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
      - EXECUTIONS_DATA_SAVE_ON_PROGRESS=true
      - EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
      - NODE_FUNCTION_ALLOW_BUILTIN=*
      - NODE_FUNCTION_ALLOW_EXTERNAL=lodash
      - N8N_COMMUNITY_PACKAGES_ENABLED=true
      - N8N_REINSTALL_MISSING_PACKAGES=true
      - N8N_NODE_PATH=/home/node/.n8n/nodes
      - N8N_AI_ENABLED=false
      - N8N_ONBOARDING_FLOW_DISABLED=true
      - N8N_EMAIL_MODE=smtp
      - N8N_SMTP_HOST=smtp.mailersend.net
      - N8N_SMTP_PORT=587
      - N8N_SMTP_USER=MAILERSEND_SMTP_USER_AQUI
      - N8N_SMTP_PASS=MAILERSEND_SMTP_PASS_AQUI
      - N8N_SMTP_SENDER=contato@{{domain}}
      - N8N_SMTP_SSL=false
      - N8N_SECURE_COOKIE=false
      - N8N_BLOCK_ENV_ACCESS_IN_NODE=false
      - N8N_RESTRICT_FILE_ACCESS_TO=~/.n8n-files
      - N8N_DEFAULT_BINARY_DATA_MODE=default
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "1"
          memory: 1024M
      labels:
        - traefik.enable=true
        - traefik.http.routers.n8n_editor.rule=Host(\`workflows.{{domain}}\`)
        - traefik.http.routers.n8n_editor.entrypoints=websecure
        - traefik.http.routers.n8n_editor.tls.certresolver=letsencryptresolver
        - traefik.http.routers.n8n_editor.service=n8n_editor
        - traefik.http.services.n8n_editor.loadbalancer.server.port=5678
        - traefik.http.services.n8n_editor.loadbalancer.passHostHeader=true
      update_config:
        parallelism: 1
        delay: 30s
        order: start-first
        failure_action: rollback

networks:
  network_swarm_public:
    name: network_swarm_public
    external: true` },
      { name: "3 — n8n-webhook (stack.yml)", content: `version: "3.7"

services:
  n8n_webhook:
    image: n8nio/n8n:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: webhook
    networks:
      - network_swarm_public
    environment:
      - N8N_ENCRYPTION_KEY={{n8nEncryptionKey}}
      - NODE_ENV=production
      - N8N_METRICS=true
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_LOG_LEVEL=info
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_RUNNERS_ENABLED=true
      - N8N_RUNNERS_MODE=external
      - N8N_RUNNERS_AUTH_TOKEN={{n8nRunnersAuthToken}}
      - N8N_NATIVE_PYTHON_RUNNER=true
      - OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS=true
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=axon_postgres_axon_postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=axon_app
      - DB_POSTGRESDB_PASSWORD={{postgresPassword}}
      - N8N_PORT=5678
      - N8N_HOST=workflows.{{domain}}
      - N8N_EDITOR_BASE_URL=https://workflows.{{domain}}/
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://webhooks.{{domain}}/
      - N8N_ENDPOINT_WEBHOOK=webhook
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis_n8n_redis_n8n
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=2
      - EXECUTIONS_TIMEOUT=3600
      - EXECUTIONS_TIMEOUT_MAX=7200
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=336
      - EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000
      - EXECUTIONS_DATA_SAVE_ON_ERROR=all
      - EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
      - EXECUTIONS_DATA_SAVE_ON_PROGRESS=true
      - EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
      - NODE_FUNCTION_ALLOW_BUILTIN=*
      - N8N_BLOCK_ENV_ACCESS_IN_NODE=false
      - N8N_RESTRICT_FILE_ACCESS_TO=~/.n8n-files
      - N8N_DEFAULT_BINARY_DATA_MODE=default
    deploy:
      mode: replicated
      replicas: 3
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "1"
          memory: 1024M
      labels:
        - traefik.enable=true
        - traefik.http.routers.n8n_webhook.rule=Host(\`webhooks.{{domain}}\`)
        - traefik.http.routers.n8n_webhook.entrypoints=websecure
        - traefik.http.routers.n8n_webhook.tls.certresolver=letsencryptresolver
        - traefik.http.routers.n8n_webhook.service=n8n_webhook
        - traefik.http.services.n8n_webhook.loadbalancer.server.port=5678
        - traefik.http.services.n8n_webhook.loadbalancer.passHostHeader=true
      update_config:
        parallelism: 1
        delay: 30s
        order: start-first
        failure_action: rollback

networks:
  network_swarm_public:
    name: network_swarm_public
    external: true` },
      { name: "4 — n8n-worker (stack.yml)", content: `version: "3.7"

services:
  n8n_worker:
    image: n8nio/n8n:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: worker --concurrency=10
    networks:
      - network_swarm_public
    environment:
      - N8N_ENCRYPTION_KEY={{n8nEncryptionKey}}
      - NODE_ENV=production
      - N8N_METRICS=true
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_LOG_LEVEL=info
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_RUNNERS_ENABLED=true
      - N8N_RUNNERS_MODE=external
      - N8N_RUNNERS_BROKER_LISTEN_ADDRESS=0.0.0.0
      - N8N_RUNNERS_AUTH_TOKEN={{n8nRunnersAuthToken}}
      - N8N_NATIVE_PYTHON_RUNNER=true
      - OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS=true
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=axon_postgres_axon_postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=axon_app
      - DB_POSTGRESDB_PASSWORD={{postgresPassword}}
      - N8N_PORT=5678
      - N8N_HOST=workflows.{{domain}}
      - N8N_EDITOR_BASE_URL=https://workflows.{{domain}}/
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://webhooks.{{domain}}/
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis_n8n_redis_n8n
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=2
      - EXECUTIONS_TIMEOUT=3600
      - EXECUTIONS_TIMEOUT_MAX=7200
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=336
      - EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000
      - EXECUTIONS_DATA_SAVE_ON_ERROR=all
      - EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
      - EXECUTIONS_DATA_SAVE_ON_PROGRESS=true
      - EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
      - NODE_FUNCTION_ALLOW_BUILTIN=*
      - N8N_BLOCK_ENV_ACCESS_IN_NODE=false
      - N8N_RESTRICT_FILE_ACCESS_TO=~/.n8n-files
      - N8N_DEFAULT_BINARY_DATA_MODE=default
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "1"
          memory: 1024M
      update_config:
        parallelism: 1
        delay: 30s
        order: start-first
        failure_action: rollback

networks:
  network_swarm_public:
    name: network_swarm_public
    external: true` },
      { name: "5 — n8n-runners (stack.yml)", content: `version: "3.7"

services:
  n8n_runners:
    image: n8nio/runners:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: ["javascript", "python"]
    networks:
      - network_swarm_public
    environment:
      N8N_RUNNERS_TASK_BROKER_URI: http://n8n_worker_n8n_worker:5679
      N8N_RUNNERS_AUTH_TOKEN: {{n8nRunnersAuthToken}}
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "1"
          memory: 1024M
      update_config:
        parallelism: 1
        delay: 30s
        order: start-first
        failure_action: rollback

networks:
  network_swarm_public:
    external: true
    name: network_swarm_public` }
    ]
  },
  {
    id: "ops",
    title: "Operacao minima",
    objective: "Aprender a ver saude, logs, atualizacao e rollback.",
    tutorial: [
      {
        heading: "1. Liste todos os serviços",
        body: `<p>Esse comando mostra o estado de todos os serviços rodando no Swarm. A coluna <strong>REPLICAS</strong> mostra <code>1/1</code> quando está saudável — se mostrar <code>0/1</code>, algo está errado:</p>`,
        command: "docker service ls"
      },
      {
        heading: "2. Veja os logs de um serviço",
        body: `<p>Substitua <code>NOME_DO_SERVICO</code> pelo nome real (ex: <code>traefik_traefik</code>, <code>n8n_worker</code>). A flag <code>-f</code> mostra os logs em tempo real:</p>`,
        command: "docker service logs NOME_DO_SERVICO --tail 100 -f"
      },
      {
        heading: "3. Veja o estado das tasks de uma stack",
        body: `<p>Mostra o histórico de containers iniciados e parados em uma stack — útil para ver se há crash loop:</p>`,
        command: "docker stack ps NOME_DA_STACK --no-trunc"
      },
      {
        heading: "4. Faça rollback pelo Portainer",
        body: `<p>Se um deploy quebrou algum serviço, você pode reverter pelo Portainer sem precisar do terminal:</p>
<ol>
  <li>Acesse <strong>Stacks</strong> no Portainer.</li>
  <li>Clique na stack com problema.</li>
  <li>No topo, clique em <strong>Editor</strong> para ver o YAML atual.</li>
  <li>Edite o YAML (ex: reverta a tag da imagem) e clique em <strong>Update the stack</strong>.</li>
</ol>
<p>Para rollback direto via comando:</p>`,
        command: "docker service rollback NOME_DO_SERVICO"
      }
    ],
    validation: "Conseguir ver servicos, logs e tasks da sua infra.",
    done: "Souber checar saude e fazer rollback quando precisar."
  },
  {
    id: "infra-dados",
    title: "Dados tecnicos",
    objective: "Conferir e guardar os dados da infraestrutura criada neste modulo.",
    tutorial: [
      {
        heading: "1. Baixe o documento da infraestrutura",
        body: `<p>Gere um documento com os dados e endereços da sua infra e guarde junto do seu planejamento estratégico.</p>
<p>As senhas <strong>não</strong> ficam salvas no app — confira se você anotou a senha root da VPS, a do Portainer, a do Postgres e as chaves do n8n no seu gerenciador de senhas.</p>
<p><button class="button button-primary" type="button" id="download-infra-doc">Baixar documento da infra (.md)</button></p>`
      }
    ],
    validation: "Os tres campos conferidos e o documento baixado.",
    done: "Dados conferidos e documento guardado com o planejamento.",
    fields: [
      { key: "domain", label: "Dominio", placeholder: "seudominio.com.br" },
      { key: "serverIp", label: "IP da VPS", placeholder: "123.123.123.123" },
      { key: "technicalEmail", label: "E-mail tecnico", placeholder: "voce@seudominio.com.br" }
    ]
  },
  {
    id: "api-keys",
    title: "Chaves e credenciais",
    objective: "Configurar chaves de API da OpenAI e Anthropic no n8n e preparar as variaveis de ambiente para as automacoes.",
    tutorial: [
      {
        heading: "1. Gere a chave da OpenAI",
        body: `<p>Acesse <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">platform.openai.com/api-keys</a>. Clique em <strong>Create new secret key</strong>, dê um nome descritivo (ex: <code>automacoes-{{domain}}</code>) e copie a chave — ela aparece uma única vez.</p>
<p>Se ainda não tem conta, crie em <a href="https://platform.openai.com" target="_blank" rel="noopener">platform.openai.com</a> e adicione crédito em <strong>Billing → Add payment method</strong>.</p>`
      },
      {
        heading: "2. Gere a chave da Anthropic",
        body: `<p>Acesse <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com/settings/keys</a>. Clique em <strong>Create Key</strong>, dê um nome (ex: <code>automacoes-{{domain}}</code>) e copie a chave.</p>
<p>Se não tem conta, crie em <a href="https://console.anthropic.com" target="_blank" rel="noopener">console.anthropic.com</a> e adicione crédito em <strong>Plans &amp; Billing</strong>.</p>`
      },
      {
        heading: "3. Adicione as credenciais no n8n",
        body: `<p>No editor do n8n (<a href="https://workflows.{{domain}}" target="_blank" rel="noopener">workflows.{{domain}}</a>), acesse <strong>Credentials</strong> no menu lateral.</p>
<ol>
  <li>Clique em <strong>Add credential</strong> → busque <strong>OpenAI</strong> → cole a chave no campo <strong>API Key</strong> → salve.</li>
  <li>Repita o processo para <strong>Anthropic</strong>.</li>
</ol>
<p>As credenciais ficam salvas com a criptografia da <code>N8N_ENCRYPTION_KEY</code> configurada no módulo anterior — não ficam visíveis nos YAMLs das stacks.</p>`
      },
      {
        heading: "4. Teste com um nó simples",
        body: `<p>No n8n, crie um workflow de teste:</p>
<ol>
  <li>Adicione um nó <strong>Manual Trigger</strong>.</li>
  <li>Conecte um nó <strong>OpenAI</strong>, modo <strong>Message a Model</strong>, com o prompt <em>"Responda apenas com 'ok'."</em></li>
  <li>Execute e confirme que a resposta volta sem erro de autenticação.</li>
</ol>`
      }
    ],
    validation: "O no de OpenAI ou Anthropic no n8n responder sem erro de autenticacao.",
    done: "Credenciais de OpenAI e Anthropic ativas no n8n."
  },
  {
    id: "midia-paga",
    title: "Pixels e midia paga",
    objective: "Criar contas no Google Ads e Meta Ads e copiar os pixels de rastreamento para instalar no site.",
    tutorial: [
      {
        heading: "1. Crie a conta no Google Ads",
        body: `<p>Acesse <a href="https://ads.google.com" target="_blank" rel="noopener">ads.google.com</a> e crie uma conta com o e-mail do negócio.</p>
<ol>
  <li>Selecione o modo <strong>Expert</strong> na configuração inicial — evita o modo Inteligente que oculta controles avançados.</li>
  <li>Pule a criação de campanha: clique em <strong>Explorar a conta</strong> quando a opção aparecer.</li>
  <li>Anote o <strong>ID do cliente</strong> (formato XXX-XXX-XXXX) exibido no canto superior direito.</li>
</ol>`
      },
      {
        heading: "2. Copie o pixel do Google (Google Tag)",
        body: `<p>No Google Ads, acesse <strong>Metas → Conversões → Criar conversão → Site</strong>.</p>
<ol>
  <li>Siga o assistente até o passo de instalação da tag.</li>
  <li>Copie o bloco de código da <strong>Google Tag</strong> (começa com <code>&lt;script async src="https://www.googletagmanager.com/...</code>).</li>
  <li>Guarde esse código — ele será colado no <code>&lt;head&gt;</code> do site no módulo seguinte.</li>
</ol>`
      },
      {
        heading: "3. Crie a conta no Meta Ads",
        body: `<p>Acesse <a href="https://business.facebook.com" target="_blank" rel="noopener">business.facebook.com</a> e crie uma conta de negócios.</p>
<ol>
  <li>Clique em <strong>Criar conta</strong> e preencha nome da empresa, nome e e-mail.</li>
  <li>Dentro do Business Manager, acesse <strong>Configurações do negócio → Contas de anúncio → Adicionar</strong> e crie a conta.</li>
  <li>Adicione um método de pagamento em <strong>Faturamento → Formas de pagamento</strong>.</li>
</ol>`
      },
      {
        heading: "4. Copie o pixel do Meta",
        body: `<p>No Business Manager, acesse <strong>Gerenciador de Eventos</strong> (Events Manager).</p>
<ol>
  <li>Clique em <strong>Conectar fontes de dados → Web → Pixel do Meta → Conectar</strong>.</li>
  <li>Dê um nome ao pixel (ex: <code>Site {{domain}}</code>) e clique em <strong>Criar pixel</strong>.</li>
  <li>Escolha <strong>Instalar o código manualmente</strong> e copie o bloco de código base.</li>
  <li>Anote o <strong>ID do Pixel</strong> exibido no painel.</li>
</ol>`
      },
      {
        heading: "5. Guarde os pixels para instalação",
        body: `<p>Você agora tem dois blocos de código para instalar no site no módulo seguinte:</p>
<ul>
  <li><strong>Google Tag:</strong> vai no <code>&lt;head&gt;</code> do HTML do site.</li>
  <li><strong>Meta Pixel:</strong> vai logo após a abertura do <code>&lt;head&gt;</code>.</li>
</ul>
<p>Guarde os dois blocos num arquivo de texto seguro junto com o ID do Pixel do Meta.</p>`
      }
    ],
    validation: "Google Tag e Meta Pixel copiados e guardados para instalacao no site.",
    done: "Contas de Google Ads e Meta Ads criadas e pixels prontos para instalacao."
  },
  {
    id: "crm",
    title: "Funil no Chatwoot",
    objective: "Organizar o Chatwoot como um CRM leve: etiquetas de funil e campos de contato para acompanhar cada lead.",
    tutorial: [
      {
        heading: "1. Crie as etiquetas do funil",
        body: `<p>No Chatwoot, acesse <strong>Configurações → Marcadores → Adicionar marcador</strong> e crie uma etiqueta para cada fase do funil:</p>
<ul>
  <li><code>novo-lead</code> — chegou agora, ainda não foi atendido</li>
  <li><code>em-contato</code> — conversa em andamento</li>
  <li><code>proposta-enviada</code> — já recebeu preço/oferta</li>
  <li><code>fechado</code> — comprou 🎉</li>
  <li><code>perdido</code> — não avançou</li>
</ul>
<p>Essas etiquetas são o seu funil de vendas dentro do Chatwoot.</p>`
      },
      {
        heading: "2. Crie os campos de contato",
        body: `<p>No Chatwoot, acesse <strong>Configurações → Atributos personalizados → Contato</strong> e clique em <strong>Adicionar atributo personalizado</strong>. Em <strong>"Aplica-se a"</strong>, selecione <strong>Contact</strong> (não Conversation) e crie estes três, tipo <em>Text</em>:</p>
<ul>
  <li><strong>Empresa</strong></li>
  <li><strong>Interesse</strong></li>
  <li><strong>Canal de origem</strong></li>
</ul>
<p>Eles aparecem no perfil de cada pessoa e ficam guardados para sempre — quando o mesmo lead voltar a falar com você, a informação continua lá.</p>`
      },
      {
        heading: "3. Use o funil no dia a dia",
        body: `<p>Quando uma conversa nova chega no Chatwoot (do WhatsApp ou anotada de um lead do site), você trabalha o lead assim:</p>
<ol>
  <li>Abra a conversa e, no painel da direita, aplique a etiqueta <code>novo-lead</code>.</li>
  <li>Preencha o que souber nos campos <strong>Empresa</strong>, <strong>Interesse</strong> e <strong>Canal de origem</strong>.</li>
  <li>Conforme o lead avança, troque a etiqueta (<code>em-contato</code> → <code>proposta-enviada</code> → <code>fechado</code> ou <code>perdido</code>).</li>
</ol>
<p>Simples e visual: a qualquer momento você filtra por etiqueta e vê quantos leads estão em cada fase. É o seu CRM funcionando, sem planilha.</p>`
      }
    ],
    validation: "Etiquetas do funil e os tres campos de contato criados no Chatwoot.",
    done: "Chatwoot organizado como CRM leve, pronto para acompanhar os leads."
  },

  // ─── Módulo 4 — Presença Comercial ──────────────────────────────────────────

  {
    id: "grade-postagens",
    title: "Grade de Postagens",
    objective: "Gerar uma grade estrategica de 28 dias com base no planejamento dos modulos 1 e 2.",
    tutorial: [
      {
        heading: "1. Como funciona",
        body: `<p>O agente lê o seu planejamento estratégico e monta uma grade de conteúdo para 28 dias, com tema, formato, plataforma e pilar de conteúdo definidos para cada postagem.</p>
<p>Você não precisa preencher nada — o agente usa o que você já construiu nos módulos anteriores.</p>`
      },
      {
        heading: "2. Gerar grade de 28 dias",
        body: `<p>Clique para gerar. O processo leva alguns segundos.</p>`,
        generate: {
          id: "grade_postagens",
          type: "text",
          label: "Gerar grade de postagens",
          loadingMessage: "Criando sua grade de 28 dias..."
        }
      }
    ],
    validation: "Grade revisada e aprovada.",
    done: "Grade de 28 dias criada."
  },
  {
    id: "roteiros-textos",
    title: "Roteiros e Textos",
    objective: "Converter a grade em roteiros e textos prontos para producao por formato.",
    tutorial: [
      {
        heading: "1. Reels e Shorts",
        body: `<p>O mesmo roteiro serve para Instagram Reels e YouTube Shorts — fala direta para a câmera, sem descrição de cenas.</p>`,
        generate: {
          id: "roteiros_reels",
          type: "text",
          label: "Gerar roteiros de Reels / Shorts",
          loadingMessage: "Escrevendo os roteiros de Reels..."
        }
      },
      {
        heading: "2. Carrossel",
        body: `<p>Conteúdo slide a slide com prompt de imagem para geração por IA.</p>`,
        generate: {
          id: "roteiros_carrossel",
          type: "text",
          label: "Gerar roteiros de Carrossel",
          loadingMessage: "Montando os carrosseis..."
        }
      },
      {
        heading: "3. Feed (post único)",
        body: `<p>Headline, prompt de imagem e legenda para cada post de feed da grade.</p>`,
        generate: {
          id: "roteiros_feed",
          type: "text",
          label: "Gerar posts de Feed",
          loadingMessage: "Criando os posts de feed..."
        }
      },
      {
        heading: "4. Stories",
        body: `<p>Sequências de 3 a 5 stories com sugestão de interação para cada dia programado.</p>`,
        generate: {
          id: "roteiros_stories",
          type: "text",
          label: "Gerar Stories",
          loadingMessage: "Escrevendo as sequencias de stories..."
        }
      }
    ],
    validation: "Roteiros revisados para todos os formatos.",
    done: "Roteiros gerados para todos os formatos."
  },
  {
    id: "peca-campanha",
    title: "Peca de Campanha",
    objective: "Gerar a primeira arte visual de divulgacao com base na identidade da sua marca.",
    tutorial: [
      {
        heading: "1. O que sera gerado",
        body: `<p>O agente lê a Identidade Visual do seu planejamento e cria um prompt detalhado para gerar uma imagem vertical — formato Stories e Reels.</p>
<p>Se a primeira versão não agradar, você pode pedir ajustes e gerar uma nova versão.</p>`
      },
      {
        heading: "2. Gerar peca de campanha",
        body: `<p>Clique para gerar. A criação leva de 1 a 2 minutos — aguarde na página.</p>`,
        generate: {
          id: "campanha_image",
          type: "image",
          label: "Gerar peca de campanha",
          loadingMessage: "Criando sua peca... isso leva de 1 a 2 minutos. Pode deixar a pagina aberta e aguardar."
        }
      }
    ],
    validation: "Peca aprovada e baixada.",
    done: "Peca de campanha criada e aprovada."
  },
  {
    id: "heygen-setup",
    title: "Fabrica de Videos — setup",
    objective: "Criar sua conta no HeyGen, escolher o apresentador virtual e a voz dos seus videos, e validar tudo com um video de teste.",
    tutorial: [
      {
        heading: "1. O que e a Fabrica de Videos",
        body: `<p>A Fabrica de Videos transforma os roteiros gerados nas etapas anteriores em <strong>videos prontos para Reels e Shorts</strong> — com um apresentador virtual, voz em portugues e legenda automatica.</p>
<p>Quem gera os videos e o <strong>HeyGen</strong>, um servico especializado em video com IA. Nesta etapa voce cria sua conta la e escolhe o apresentador e a voz. <strong>Custo transparente:</strong> cada video de ~20 segundos custa cerca de <strong>US$ 1</strong> (cobrado pelo HeyGen, direto na sua conta — sem intermediarios).</p>`
      },
      {
        heading: "2. Crie sua conta no HeyGen",
        body: `<p>Acesse <a href="https://app.heygen.com" target="_blank" rel="noopener">app.heygen.com</a> e crie uma conta gratuita (pode usar o e-mail do seu negocio). <strong>Nao precisa assinar nenhum plano</strong> — os videos da Fabrica sao pagos por uso, via API.</p>`
      },
      {
        heading: "3. Ative o credito de API e copie sua chave",
        body: `<p>No HeyGen, abra as configuracoes da conta e procure a area de <strong>API</strong>:</p>
<p>1. Em <strong>Billing / API</strong>, adicione credito inicial (minimo US$ 5 — rende cerca de 5 videos).<br>
2. Em <strong>Settings → API</strong>, copie o seu <strong>API Token</strong> (comeca com letras e numeros longos).</p>
<p>Cole a chave abaixo. Ela fica salva <strong>apenas neste navegador</strong> — nao enviamos sua chave para o nosso banco de dados.</p>`,
        field: "heygenApiKey"
      },
      {
        heading: "4. Escolha seu apresentador virtual",
        body: `<p>Na barra lateral do HeyGen, abra <strong>Avatars</strong> e navegue pela biblioteca publica. Escolha o apresentador com a cara do seu negocio (ha centenas — formais, casuais, jovens, maduros).</p>
<p>Ao abrir a pagina do avatar escolhido, olhe a <strong>barra de endereco do navegador</strong>: o codigo do avatar e o trecho de letras e numeros depois de <code>avatars/</code>. Copie e cole abaixo — no proximo passo o app confere se esta certo.</p>`,
        field: "heygenAvatarId"
      },
      {
        heading: "5. Escolha a voz do seu apresentador",
        body: `<p>Selecionamos vozes em portugues do Brasil que funcionam bem com os roteiros da Fabrica. Clique para ouvir e marque a sua preferida:</p>
<div class="wizard-data-fields heygen-voice-list">
  <div class="wizard-data-field"><label><input type="radio" name="heygenVoice" data-project-field="heygenVoiceId" value="94ec497104a04c87904a8aa138d6e46c"> Sofia — feminina, natural</label><audio controls preload="none" src="https://resource.heygen.ai/text_to_speech/ZSSfa8Hoy3vNvwMyE47P99.mp3"></audio></div>
  <div class="wizard-data-field"><label><input type="radio" name="heygenVoice" data-project-field="heygenVoiceId" value="6c0a95599317428a8151293305deceba"> Ana — feminina, simpatica</label><audio controls preload="none" src="https://resource2.heygen.ai/text_to_speech/21e28514b7994f46b907b74914a3ca6e/6c0a95599317428a8151293305deceba/id=4df9deb9-463b-45ec-9640-00935f7bddd6.wav"></audio></div>
  <div class="wizard-data-field"><label><input type="radio" name="heygenVoice" data-project-field="heygenVoiceId" value="15ea92317dfe4abc858b08be62bd8e93"> Ricardo — masculina, calma</label><audio controls preload="none" src="https://static.heygen.ai/voice_preview/47d1469c5c434e6ab153fe69904687ac.wav"></audio></div>
  <div class="wizard-data-field"><label><input type="radio" name="heygenVoice" data-project-field="heygenVoiceId" value="cfdb383951144f56a5198869636ccd17"> Antonio — masculina, natural</label><audio controls preload="none" src="https://static.heygen.ai/voice_preview/82871b89da0d42f0bc9c64681f00ae48.wav"></audio></div>
</div>`
      },
      {
        heading: "6. Valide a configuracao",
        body: `<p>Clique para conferir se a chave e o apresentador estao corretos (nao gasta credito):</p>
<div class="generate-block">
  <button class="button button-primary" type="button" id="btn-heygen-validate">Validar configuracao</button>
  <div class="generate-status hidden" id="heygen-validate-status"></div>
  <div class="generate-image-result hidden" id="heygen-validate-result">
    <img class="generated-image" id="heygen-avatar-thumb" src="" alt="Apresentador escolhido" />
    <p id="heygen-validate-name"></p>
  </div>
</div>`
      },
      {
        heading: "7. Gere um video de teste (opcional)",
        body: `<p>Para ver seu apresentador falando, gere um video curto de teste. <strong>Custa cerca de US$ 0,35</strong> do seu credito HeyGen e leva 1 a 2 minutos.</p>
<div class="generate-block">
  <button class="button button-secondary" type="button" id="btn-heygen-test">Gerar video de teste</button>
  <div class="generate-status hidden" id="heygen-test-status"></div>
  <div class="generate-image-result hidden" id="heygen-test-result">
    <video controls playsinline style="max-width: 260px; border-radius: 12px;" id="heygen-test-video"></video>
  </div>
</div>`
      }
    ],
    fields: [
      { key: "heygenApiKey", label: "API Token do HeyGen", placeholder: "cole aqui o token copiado" },
      { key: "heygenAvatarId", label: "Codigo do apresentador (avatar)", placeholder: "trecho apos avatars/ na URL" }
    ],
    validation: "Validacao da configuracao retornou o nome e a foto do apresentador.",
    done: "Conta HeyGen configurada: apresentador e voz escolhidos e validados."
  },

  // ─── Módulo 5 — Site e Checkout ─────────────────────────────────────────────

  {
    id: "claude-setup",
    title: "Instalar o Claude",
    objective: "Criar a conta na Anthropic, instalar o app Claude e preparar a pasta do projeto.",
    tutorial: [
      {
        heading: "1. Crie sua conta na Anthropic",
        body: `<p>Acesse <a href="https://claude.ai" target="_blank" rel="noopener">claude.ai</a> e crie uma conta (pode usar o login do Google).</p>
<p>Assine o plano <strong>Pro</strong> em <strong>Settings → Billing</strong> (~US$20/mês). É ele que dá acesso ao Claude Code, o modo do Claude que escreve e executa código no seu computador — seu "desenvolvedor contratado" deste módulo.</p>`
      },
      {
        heading: "2. Instale o app no computador",
        body: `<p>Baixe o app do Claude para desktop em <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a> (Windows ou Mac), instale e entre com a sua conta.</p>`
      },
      {
        heading: "3. Prepare a pasta do projeto",
        body: `<p>Crie uma pasta no seu computador (ex: <code>Documentos/meu-site</code>) e coloque dentro dela os arquivos que você baixou nos módulos anteriores:</p>
<ul>
  <li><strong>Planejamento estratégico</strong> (.md — módulo 2)</li>
  <li><strong>Documento da infraestrutura</strong> (.md — módulo 3)</li>
  <li><strong>Peça de campanha</strong> (.png — módulo 4)</li>
  <li><strong>Pixels</strong> — o arquivo de texto com os códigos do Google Tag e Meta Pixel (módulo 3)</li>
</ul>
<p>No app do Claude, abra essa pasta como projeto. Assim ele enxerga todos os seus documentos ao construir o site.</p>`
      }
    ],
    validation: "App do Claude instalado, logado, e pasta do projeto com os 4 arquivos.",
    done: "Claude pronto para trabalhar com os documentos do seu negocio."
  },
  {
    id: "site-prd",
    title: "Pagamento e PRD",
    objective: "Escolher a plataforma de pagamento, criar o link de checkout e gerar o PRD do site.",
    tutorial: [
      {
        heading: "1. Escolha a plataforma de pagamento",
        body: `<p>Responda uma pergunta: <strong>você pretende vender para fora do Brasil?</strong></p>
<ul>
  <li><strong>Sim</strong> → use a <a href="https://stripe.com/br" target="_blank" rel="noopener">Stripe</a> — a melhor para moedas e cartões internacionais.</li>
  <li><strong>Não</strong> → use o <a href="https://www.mercadopago.com.br" target="_blank" rel="noopener">Mercado Pago</a> — Pix com a menor taxa (0,99%), marca que o comprador brasileiro confia e configuração mais simples.</li>
</ul>
<p>Crie a conta na plataforma escolhida e complete a verificação (documentos e dados bancários).</p>`,
        field: "paymentPlatform"
      },
      {
        heading: "2. Crie o link de pagamento do seu produto",
        body: `<p>Nas duas plataformas o caminho é parecido — você cadastra o produto com preço e recebe um <strong>link de checkout</strong> pronto (o comprador paga numa página da própria plataforma, sem código):</p>
<ul>
  <li><strong>Stripe:</strong> Dashboard → <strong>Payment Links</strong> → Create payment link → cadastre produto e preço → copie o link. <strong>Atenção:</strong> confira que o Dashboard está em modo <strong>produção</strong> (chave "Test mode" desligada) — link de teste começa com <code>buy.stripe.com/test_</code> e não processa vendas reais.</li>
  <li><strong>Mercado Pago:</strong> Seu negócio → <strong>Link de pagamento</strong> → crie o link com o valor do seu produto → copie o link.</li>
</ul>
<p>💡 No módulo 6, as vendas deste link serão conectadas automaticamente ao seu painel de gestão.</p>
<p>Cole o link abaixo:</p>`,
        field: "paymentLink"
      },
      {
        heading: "3. Gere o PRD do seu site",
        body: `<p>O agente vai ler seu planejamento estratégico e montar o <strong>PRD</strong> — o prompt completo que você vai colar no Claude para ele construir e publicar o site: textos da página, identidade visual, formulário de interesse, botão de checkout e instruções técnicas de publicação na sua VPS.</p>`,
        generate: {
          id: "site_prd",
          type: "text",
          label: "Gerar PRD do site",
          loadingMessage: "Montando o PRD do seu site... isso leva cerca de 1 minuto."
        }
      }
    ],
    validation: "Conta de pagamento ativa, link de checkout criado e PRD gerado.",
    done: "PRD pronto para colar no Claude.",
    fields: [
      { key: "paymentPlatform", label: "Plataforma de pagamento", placeholder: "Stripe ou Mercado Pago", inline: true },
      { key: "paymentLink", label: "Link de pagamento (checkout)", placeholder: "https://...", inline: true }
    ]
  },
  {
    id: "site-deploy",
    title: "Publicar e validar",
    objective: "Colar o PRD no Claude, acompanhar a construcao e validar o site publicado.",
    tutorial: [
      {
        heading: "1. Confira o DNS antes de começar",
        body: `<p>Na <a href="https://dash.cloudflare.com" target="_blank" rel="noopener">Cloudflare</a>, confirme que existem registros <strong>A</strong> para a raiz (<code>@</code>) e para <code>www</code> apontando para <code>{{serverIp}}</code>, ambos <strong>DNS only</strong> (nuvem cinza). Se faltar algum, crie agora.</p>
<p>Sem esses dois registros, o certificado de segurança (HTTPS) do site falha na publicação — conferir antes evita retrabalho.</p>`
      },
      {
        heading: "2. Cole o PRD no Claude",
        body: `<p>Abra o app do Claude na pasta do projeto (etapa anterior) e cole o PRD completo que você copiou.</p>
<p>O Claude vai construir o site e publicar na sua VPS. Durante o processo, é normal ele pedir algumas coisas:</p>
<ul>
  <li>Uma <strong>janela de administrador do Windows (UAC)</strong> pode aparecer quando ele instalar as ferramentas de conexão — clique em <strong>Sim</strong></li>
  <li>A <strong>senha root da VPS</strong> — está no seu gerenciador de senhas (módulo 3)</li>
  <li>Confirmações antes de executar comandos no servidor — leia e aprove</li>
</ul>
<p>Acompanhe a conversa. Se algo ficar parado por mais de 5 minutos sem novidade, ou der erro, copie a mensagem e cole aqui no assistente da etapa que eu ajudo.</p>`
      },
      {
        heading: "3. Valide o site no ar",
        body: `<p>Checklist final — abra <a href="https://{{domain}}" target="_blank" rel="noopener">https://{{domain}}</a> e confirme:</p>
<ul>
  <li>A página carrega com cadeado (HTTPS) e o visual segue sua identidade</li>
  <li>O site abre bem no celular</li>
  <li>O <strong>botão de compra</strong> abre o checkout da plataforma de pagamento</li>
  <li>O <strong>formulário de interesse</strong> aparece (ele será ativado de verdade no módulo 6, quando conectarmos o n8n)</li>
  <li>Os pixels disparam — teste com as extensões <strong>Meta Pixel Helper</strong> e <strong>Tag Assistant</strong> no Chrome</li>
</ul>
<p>Quer mudar algo no site depois? É só abrir o Claude na mesma pasta e pedir com suas palavras. O site é seu, o desenvolvedor também. 😉</p>`
      }
    ],
    validation: "Site abrindo em https com checkout funcional e formulario visivel.",
    done: "Site publicado, recebendo visitantes e pronto para vender."
  },

  // ─── Módulo 6 — Operação Assistida ──────────────────────────────────────────

  {
    id: "whatsapp-connect",
    title: "Conectar o WhatsApp",
    objective: "Criar a instancia na Evolution API, conectar o numero via QR code e integrar ao Chatwoot.",
    tutorial: [
      {
        heading: "1. Crie sua conta no Chatwoot",
        body: `<p>Acesse <a href="https://chat.{{domain}}" target="_blank" rel="noopener">chat.{{domain}}</a> e crie a conta de administrador (nome, e-mail, senha e nome da empresa). Guarde a senha no seu gerenciador.</p>
<p>É aqui que todas as conversas do WhatsApp vão aparecer organizadas.</p>`
      },
      {
        heading: "2. Copie o token e o ID da conta do Chatwoot",
        body: `<p>Dois dados para a integração — cole-os nos campos abaixo (o app usa nos fluxos de automação):</p>
<ul>
  <li><strong>Token:</strong> no Chatwoot, clique no seu avatar → <strong>Configurações do perfil</strong> → role até <strong>Token de acesso</strong> e copie.</li>
  <li><strong>ID da conta:</strong> é o número que aparece na URL depois de <code>/accounts/</code> (ex: <code>chat.{{domain}}/app/accounts/<strong>1</strong>/...</code> → ID é <code>1</code>).</li>
</ul>`,
        field: "chatwootAccountId"
      },
      {
        heading: "2b. Token de acesso",
        body: `<p>Cole o token copiado do seu perfil:</p>`,
        field: "chatwootToken"
      },
      {
        heading: "3. Crie a instância na Evolution",
        body: `<p>Acesse <a href="https://evo.{{domain}}/manager" target="_blank" rel="noopener">evo.{{domain}}/manager</a> e entre com a chave da API:</p>
<p><code>{{evolutionApiKey}}</code></p>
<ol>
  <li>Clique em <strong>Instance +</strong> (criar instância).</li>
  <li>Nome da instância: <strong>atendimento</strong> (sugestão — o fluxo de automação funciona com qualquer nome).</li>
  <li>Channel: <strong>Baileys</strong>. Salve.</li>
</ol>`
      },
      {
        heading: "4. Ative a integração com o Chatwoot",
        body: `<p>Ainda no manager, abra a instância <strong>atendimento</strong> → aba/menu <strong>Chatwoot</strong> e preencha:</p>
<ul>
  <li><strong>Enabled:</strong> ativado</li>
  <li><strong>URL:</strong> <code>https://chat.{{domain}}</code> (sem barra no final)</li>
  <li><strong>Account ID:</strong> o número do passo 2</li>
  <li><strong>Token:</strong> o token do passo 2</li>
  <li><strong>Sign messages:</strong> desativado · <strong>Reopen conversation:</strong> ativado · <strong>Conversation pending:</strong> desativado</li>
</ul>
<p>Salve. A Evolution cria automaticamente uma caixa de entrada no Chatwoot para o WhatsApp.</p>
<p>Aproveite e ajuste também em <strong>Configurações → Comportamento</strong> da instância: ative <strong>Ignorar Grupos</strong> (senão o atendente de IA vai responder em grupos!) e, se quiser, <strong>Rejeitar Chamadas</strong> com uma mensagem educada e <strong>Sempre Online</strong>. Deixe <strong>Sincronizar Histórico Completo</strong> desligado.</p>`
      },
      {
        heading: "5. Conecte o número via QR code",
        body: `<p>Na instância <strong>atendimento</strong>, clique em <strong>Connect / Get QR Code</strong>.</p>
<ol>
  <li>No celular com o número do negócio: WhatsApp → <strong>Configurações → Dispositivos conectados → Conectar dispositivo</strong>.</li>
  <li>Escaneie o QR da tela. O status da instância muda para <strong>open</strong> (conectado).</li>
</ol>
<p><strong>Teste:</strong> peça para alguém mandar uma mensagem para o número. Ela deve aparecer no Chatwoot em <strong>Conversas</strong>.</p>`
      }
    ],
    validation: "Instancia 'atendimento' com status open e mensagem de teste aparecendo no Chatwoot.",
    done: "WhatsApp conectado e conversas espelhando no Chatwoot.",
    fields: [
      { key: "chatwootAccountId", label: "ID da conta do Chatwoot", placeholder: "1", inline: true },
      { key: "chatwootToken", label: "Token de acesso do Chatwoot", placeholder: "cole o token do seu perfil", inline: true }
    ]
  },
  {
    id: "leads-webhook",
    title: "Leads do site",
    objective: "Criar o banco de leads e ativar o webhook que registra o formulario do site.",
    tutorial: [
      {
        heading: "1. Crie o banco de dados do negócio",
        body: `<p>Conecte no SSH da VPS (como no módulo 3) e rode o comando abaixo — ele cria o banco <code>negocio</code>, onde seus leads e dados de gestão vão morar:</p>`,
        command: `docker exec -t $(docker ps -q -f name=axon_postgres) sh -c 'psql -U "\${POSTGRES_USER:-postgres}" -c "CREATE DATABASE negocio OWNER axon_app;"'`
      },
      {
        heading: "2. Crie a credencial do Postgres no n8n",
        body: `<p>No n8n (<a href="https://workflows.{{domain}}" target="_blank" rel="noopener">workflows.{{domain}}</a>): <strong>Credentials → Add credential → Postgres</strong> e preencha:</p>
<ul>
  <li><strong>Host:</strong> <code>axon_postgres_axon_postgres</code></li>
  <li><strong>Database:</strong> <code>negocio</code></li>
  <li><strong>User:</strong> <code>axon_app</code></li>
  <li><strong>Password:</strong> <code>{{postgresPassword}}</code></li>
  <li><strong>Port:</strong> <code>5432</code> · <strong>SSL:</strong> disable</li>
</ul>
<p>Salve com o nome <strong>Postgres negocio</strong>.</p>`
      },
      {
        heading: "3. Importe o fluxo de leads",
        body: `<p>Baixe o fluxo pronto e importe no n8n em <strong>Workflows → Add workflow → ⋮ (menu) → Import from file</strong>:</p>
<p><button class="button button-primary" type="button" id="download-n8n-leads">Baixar fluxo de leads (.json)</button></p>
<p>Depois de importar, abra o nó <strong>Salvar lead</strong> e selecione a credencial <strong>Postgres negocio</strong>.</p>`
      },
      {
        heading: "4. ATIVE o workflow (importante!)",
        body: `<p>No topo do editor do workflow, ligue a chave <strong>Active</strong> (Inactive → Active).</p>
<p><strong>Pegadinha clássica do n8n:</strong> sem ativar, o webhook só funciona no modo de teste (URL de teste, que muda toda hora). O formulário do seu site usa a URL de <strong>produção</strong> — que só existe com o workflow ATIVO.</p>`
      },
      {
        heading: "5. Teste com o formulário do site",
        body: `<p>Abra <a href="https://{{domain}}" target="_blank" rel="noopener">https://{{domain}}</a>, preencha o formulário de interesse e envie.</p>
<p>No n8n, abra <strong>Executions</strong> do workflow: deve aparecer uma execução verde. Pronto — cada lead do site agora fica registrado no seu banco.</p>`
      },
      {
        heading: "6. Importe o fluxo de vendas (conversões)",
        body: `<p>Agora as <strong>vendas</strong>: quando alguém paga no seu checkout, a plataforma avisa o seu n8n e a venda entra no banco — é o dado de conversão do seu painel de gestão.</p>
<p>Baixe o fluxo da <strong>sua</strong> plataforma de pagamento (a que você escolheu no módulo 5), importe no n8n e selecione a credencial <strong>Postgres negocio</strong> no nó de banco:</p>
<p><button class="button button-primary" type="button" id="download-n8n-vendas-stripe">Baixar fluxo de vendas — Stripe (.json)</button></p>
<p><button class="button button-primary" type="button" id="download-n8n-vendas-mp">Baixar fluxo de vendas — Mercado Pago (.json)</button></p>
<p><strong>Só para Mercado Pago:</strong> o fluxo também precisa de uma credencial <em>Header Auth</em> no nó "Consulta pagamento": Name = <code>Authorization</code>, Value = <code>Bearer SEU_ACCESS_TOKEN</code> (pegue o Access Token de produção em <a href="https://www.mercadopago.com.br/developers" target="_blank" rel="noopener">mercadopago.com.br/developers</a> → Suas integrações → criar aplicação → Credenciais de produção).</p>
<p><strong>ATIVE o workflow</strong> depois de importar (mesma regra de sempre).</p>`
      },
      {
        heading: "7. Aponte a plataforma para o seu n8n",
        body: `<p>Agora avise a plataforma de pagamento para onde mandar as vendas — a URL é a mesma nas duas:</p>
<p><code>https://workflows.{{domain}}/webhook/vendas</code></p>
<ul>
  <li><strong>Stripe:</strong> Dashboard → <strong>Developers → Webhooks → Add endpoint</strong> → cole a URL → em eventos, selecione <code>checkout.session.completed</code> → salve.</li>
  <li><strong>Mercado Pago:</strong> <a href="https://www.mercadopago.com.br/developers" target="_blank" rel="noopener">developers</a> → sua aplicação → <strong>Webhooks</strong> → modo produção → cole a URL → em eventos, marque <strong>Pagamentos</strong> → salve.</li>
</ul>
<p><strong>Teste:</strong> faça uma compra de teste no seu checkout (na Stripe, pode usar o modo teste com o cartão <code>4242 4242 4242 4242</code> — nesse caso configure o webhook no modo teste também). A venda deve aparecer como execução verde no n8n.</p>`
      }
    ],
    validation: "Lead do formulario e venda de teste gerando execucoes verdes no n8n.",
    done: "Leads e vendas registrados automaticamente no banco."
  },
  {
    id: "atendimento-agente",
    title: "Agente de atendimento",
    objective: "Gerar o prompt personalizado do atendente de IA e ativar o fluxo que responde o WhatsApp.",
    tutorial: [
      {
        heading: "1. Gere o prompt do seu atendente",
        body: `<p>O agente lê o seu planejamento estratégico e escreve as instruções do atendente de IA: tom da sua marca, conhecimento do produto e da oferta, respostas às objeções mais comuns — e a missão de direcionar o interessado para o seu site.</p>
<p>Depois de gerar, o texto fica <strong>editável</strong> — ajuste o que quiser antes de seguir.</p>`,
        generate: {
          id: "atendimento_prompt",
          type: "text",
          label: "Gerar prompt do atendente",
          loadingMessage: "Escrevendo as instrucoes do seu atendente..."
        }
      },
      {
        heading: "2. Baixe e importe o fluxo de atendimento",
        body: `<p>Baixe o fluxo — o prompt gerado acima já vai embutido nele:</p>
<p><button class="button button-primary" type="button" id="download-n8n-atendimento">Baixar fluxo de atendimento (.json)</button></p>
<p>Importe no n8n (<strong>Import from file</strong>) e selecione as credenciais:</p>
<ul>
  <li>Nó <strong>Agente IA</strong> → credencial <strong>OpenAI</strong> (módulo 3)</li>
  <li>Nó <strong>Dedup mensagem</strong> → credencial <strong>Postgres negocio</strong> (etapa anterior)</li>
</ul>
<p>O atendente responde com memória da conversa, e quando o cliente pede humano, parceria ou desconto, ele <strong>transfere de verdade</strong>: atribui a conversa a você no Chatwoot (que te notifica) e para de responder sozinho.</p>`
      },
      {
        heading: "3. Aponte a Evolution para o fluxo",
        body: `<p>No manager da Evolution (<a href="https://evo.{{domain}}/manager" target="_blank" rel="noopener">evo.{{domain}}/manager</a>), abra a instância <strong>atendimento</strong> → <strong>Webhook</strong> (em Events/Integrations) e configure:</p>
<ul>
  <li><strong>Enabled:</strong> ativado</li>
  <li><strong>URL:</strong> <code>https://workflows.{{domain}}/webhook/atendimento</code></li>
  <li><strong>Events:</strong> marque apenas <code>MESSAGES_UPSERT</code></li>
</ul>
<p>Salve.</p>`
      },
      {
        heading: "4. ATIVE o workflow e teste",
        body: `<p>No n8n, ligue a chave <strong>Active</strong> do workflow de atendimento (mesma pegadinha da etapa anterior — sem ativar, nada acontece).</p>
<p><strong>Teste 1 — atendimento:</strong> peça para alguém (de outro número) mandar "Oi, quero saber mais". Em segundos chega a resposta do atendente — e a conversa aparece no Chatwoot.</p>
<p><strong>Teste 2 — transferência:</strong> na mesma conversa, mande "quero falar com um humano". O atendente confirma, e no Chatwoot a conversa aparece <strong>atribuída a você</strong> — a partir daí o bot fica em silêncio e a conversa é sua.</p>
<p><strong>Para devolver a conversa ao bot:</strong> remova a atribuição no Chatwoot (Agente atribuído → Nenhum).</p>`
      }
    ],
    validation: "Mensagem de teste respondida pela IA e conversa registrada no Chatwoot.",
    done: "Atendente de IA respondendo o WhatsApp do negocio."
  },
  {
    id: "fabrica-videos-ativar",
    title: "Fabrica de Videos — ativar",
    objective: "Ativar o fluxo que transforma um roteiro do Modulo 4 em video pronto, entregue no seu WhatsApp.",
    tutorial: [
      {
        heading: "1. O que voce esta ativando",
        body: `<p>A Fabrica de Videos fecha o ciclo que voce comecou no Modulo 4: voce <strong>cola um roteiro de Reels/Shorts</strong> em um formulario, e em ~3 minutos recebe no seu WhatsApp o <strong>video vertical pronto</strong> — seu apresentador falando o roteiro, com legenda embutida — mais a <strong>legenda do post</strong> pronta para copiar.</p>
<p>Por dentro, o fluxo: ajusta o roteiro para a fala soar natural (pausas e ritmo via pontuacao) → pede o video ao HeyGen → espera o render → entrega no WhatsApp → registra no seu banco. <strong>Custo transparente:</strong> ~US$ 1 por video de ~20s, direto do seu credito de API no HeyGen.</p>
<p><strong>Pre-requisito:</strong> a etapa "Fabrica de Videos — setup" do Modulo 4 concluida (conta HeyGen, apresentador e voz validados).</p>`
      },
      {
        heading: "2. Confira seus dados",
        body: `<p>O fluxo ja sai preenchido com o apresentador e a voz que voce validou no Modulo 4. Confirme os dois campos abaixo antes de baixar:</p>`,
        fields: ["ownerWhatsapp", "heygenApiKey"]
      },
      {
        heading: "3. Baixe, importe e ATIVE o fluxo",
        body: `<p><button class="button button-primary" type="button" id="download-n8n-fabrica-videos">Baixar fluxo da Fabrica de Videos (.json)</button></p>
<p>Importe no n8n (<strong>Import from file</strong>) e selecione as credenciais que voce ja criou:</p>
<ul>
  <li>No <strong>Prepara roteiro (IA)</strong> → credencial <strong>OpenAI</strong> (modulo 3)</li>
  <li>No <strong>Registra no banco</strong> → credencial <strong>Postgres negocio</strong> (etapa "Leads e vendas do site")</li>
</ul>
<p>Ligue a chave <strong>Active</strong> do workflow — sem ativar, o formulario nao existe.</p>`
      },
      {
        heading: "4. Pegue o endereco do seu formulario e gere o primeiro video",
        body: `<p>Ao importar, o n8n troca o endereco do formulario por um codigo aleatorio (comportamento padrao dele). Para deixar sua URL fixa e bonita: abra o no <strong>Formulario Fabrica</strong>, localize o campo <strong>Form Path</strong> e digite <code>fabrica-de-videos</code>. Salve. Seu formulario fica em:</p>
<p><code>https://workflows.{{domain}}/form/fabrica-de-videos</code></p>
<p>(Se preferir, use a <strong>Production URL</strong> exibida no proprio no — funciona do mesmo jeito.) <strong>Salve o endereco nos favoritos</strong> — e por aqui que voce gera video daqui em diante.</p>
<p>Abra o formulario, cole um <strong>bloco inteiro</strong> de roteiro de Reels do Modulo 4 (do 🎬 ate a legenda — a legenda vira o texto do post) e envie. Em ~3 minutos chegam no seu WhatsApp o video e a legenda. Cada envio consome ~US$ 1 do seu credito HeyGen.</p>
<p>Se nada chegar em 5 minutos, abra o n8n → <strong>Executions</strong> e veja onde o fluxo parou (o erro mais comum e credito de API zerado no HeyGen).</p>`
      },
      {
        heading: "5. Publique — do jeito manual ou automatico (Metricool)",
        body: `<p>Recomendamos o <strong>Metricool</strong> para agendar e publicar: no plano gratuito, baixe o video do WhatsApp, suba no planner com a legenda e agende — 2 minutos por post, e voce revisa tudo antes de ir ao ar.</p>
<p><strong>Opcional — rascunho automatico:</strong> se voce assinar o plano <strong>Advanced</strong> do Metricool (que libera a API), a Fabrica cria cada video como <strong>rascunho no seu planner</strong> automaticamente — voce so revisa e confirma. Para ativar, preencha os 3 campos abaixo (no Metricool: <strong>Configuracoes da conta → API</strong> mostra o userToken e o userId; o blogId e o numero da marca, visivel na URL quando voce abre a marca no painel) e <strong>baixe e reimporte o fluxo</strong> no passo 3:</p>`,
        fields: ["metricoolToken", "metricoolUserId", "metricoolBlogId"]
      }
    ],
    fields: [
      { key: "ownerWhatsapp", label: "Seu WhatsApp (com DDI, so numeros)", placeholder: "5511999998888", inline: true },
      { key: "heygenApiKey", label: "API Token do HeyGen (vem do Modulo 4)", placeholder: "cole o token se o campo estiver vazio", inline: true },
      { key: "metricoolToken", label: "userToken do Metricool (plano Advanced)", placeholder: "Configuracoes da conta → API", inline: true },
      { key: "metricoolUserId", label: "userId do Metricool", placeholder: "numero do usuario (secao API)", inline: true },
      { key: "metricoolBlogId", label: "blogId da marca no Metricool", placeholder: "numero da marca conectada", inline: true }
    ],
    validation: "Video de teste gerado pelo formulario e recebido no WhatsApp.",
    done: "Fabrica ativa: roteiro colado vira video no WhatsApp (e rascunho no Metricool, se configurado)."
  },
  {
    id: "painel-conselho",
    title: "Painel e Conselho de IA",
    objective: "Ativar os fluxos de dados e publicar o painel de gestao com o Conselho de IA no seu dominio.",
    tutorial: [
      {
        heading: "1. Importe e ative os dois fluxos do painel",
        body: `<p><strong>Pré-requisito:</strong> estes fluxos usam a credencial <strong>Postgres negocio</strong>, criada na etapa "Leads do site" (passo 2), e a credencial <strong>OpenAI</strong> do módulo 3. Se ainda não completou a etapa de leads, volte lá primeiro.</p>
<p>Baixe, importe no n8n e <strong>ative</strong> os dois fluxos (em ambos, selecione a credencial <strong>Postgres negocio</strong> nos nós de banco; no fluxo do Conselho, selecione também a credencial <strong>OpenAI</strong> no nó de IA):</p>
<p><button class="button button-primary" type="button" id="download-n8n-metricas">Baixar fluxo de metricas (.json)</button></p>
<p><button class="button button-primary" type="button" id="download-n8n-conselho">Baixar fluxo do Conselho (.json)</button></p>
<p>O primeiro alimenta o dashboard; o segundo é o Conselho de IA — três especialistas (administração, marketing e vendas) que analisam seus dados e fecham uma recomendação.</p>`
      },
      {
        heading: "2. Gere o PRD do painel",
        body: `<p>Como no módulo 5: o agente monta o PRD do seu painel de gestão — página protegida por senha em <code>gestao.{{domain}}</code> com os números do negócio e o chat do Conselho.</p>`,
        generate: {
          id: "painel_prd",
          type: "text",
          label: "Gerar PRD do painel",
          loadingMessage: "Montando o PRD do seu painel de gestao..."
        }
      },
      {
        heading: "3. Cole no Claude e acompanhe",
        body: `<p>Abra o app do Claude na pasta do projeto (a mesma do módulo 5) e cole o PRD.</p>
<p>O Claude vai verificar os fluxos, pedir a senha root da VPS, pedir para você escolher <strong>usuário e senha do painel</strong>, construir a página e publicar. Se algo ficar parado por mais de 5 minutos ou der erro, cole a mensagem aqui no assistente.</p>`
      },
      {
        heading: "4. Conheça seu Conselho",
        body: `<p>Abra <a href="https://gestao.{{domain}}" target="_blank" rel="noopener">https://gestao.{{domain}}</a>, entre com o usuário e senha que você escolheu e confirme:</p>
<ul>
  <li>Os números de leads carregam no dashboard</li>
  <li>O chat responde — experimente: <em>"Com os dados que temos até aqui, onde devo focar minha energia esta semana?"</em></li>
</ul>
<p>🎓 <strong>Jornada completa:</strong> estratégia validada, infraestrutura própria, conteúdo programado, site vendendo, atendimento automático e um conselho de especialistas de plantão. Agora é operar, medir e crescer.</p>`
      }
    ],
    validation: "Painel abrindo com login, metricas carregando e Conselho respondendo.",
    done: "Painel de gestao no ar com o Conselho de IA ativo."
  }
];

const DEFAULT_MEMBER_STATE = {
  project: {
    id: "",
    name: "",
    domain: "",
    serverIp: "",
    technicalEmail: "",
    hostName: "manager01",
    siteImage: "ghcr.io/axnconsult/site:main",
    postgresPassword: "",
    evolutionApiKey: "",
    chatwootSecretKey: "",
    n8nEncryptionKey: "",
    n8nRunnersAuthToken: "",
    paymentPlatform: "",
    paymentLink: "",
    chatwootAccountId: "",
    chatwootToken: ""
  },
  currentStep: "domain",
  currentModule: "module-1",
  currentLesson: "module-1.0",
  currentLessonStep: "main",
  completedSteps: [],
  checklist: {},
  assistantThreads: {},
  updatedAt: null
};

// Cache de conteúdo gerado no Módulo 4 — vive apenas na sessão, não é persistido
const contentCache = {};

const memberStoreKey = "axonMemberApp";
let memberApp = {
  mode: "login",
  token: "",
  member: null,
  activeView: "dashboard",
  state: structuredClone(DEFAULT_MEMBER_STATE)
};

bootMemberApp();

function bootMemberApp() {
  const root = document.querySelector("#members-app");
  if (!root) return;
  memberApp = loadMemberApp();
  wireAuth();
  wireMemberNavigation();
  wireModuleActions();
  hydrateSession();
  renderMemberApp();
}

function wireAuth() {
  const form = document.querySelector("#member-auth-form");
  const toggle = document.querySelector("#toggle-auth-mode");

  toggle?.addEventListener("click", () => {
    memberApp.mode = memberApp.mode === "login" ? "register" : "login";
    renderAuthMode();
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = formDataToObject(new FormData(form));
    const endpoint = memberApp.mode === "register" ? "/api/members/register" : "/api/members/login";

    setMemberStatus("auth", "Entrando...");
    try {
      const response = await postMemberApi(endpoint, payload, false);
      // Preserva threads locais antes de sobrescrever o state com o do servidor
      // (assistantThreads não é salvo no banco, só fica no localStorage)
      const localThreads = memberApp.state.assistantThreads || {};
      memberApp.token = response.token;
      memberApp.member = response.member;
      memberApp.state = normalizeMemberState({
        ...response.state,
        assistantThreads: Object.keys(localThreads).length ? localThreads : {}
      });
      saveMemberApp();
      setMemberStatus("auth", "");
      renderMemberApp();
    } catch {
      if (memberApp.mode === "login") {
        setMemberStatus(
          "auth",
          isLocalPreview()
            ? "Nao consegui entrar pelo servidor. Se o banco local nao estiver ativo, crie uma conta para testar em modo local."
            : "Nao consegui entrar pelo servidor. Confira /api/health, usuario/senha e logs da stack.",
          true
        );
        return;
      }

      if (!isLocalPreview()) {
        setMemberStatus("auth", "Nao consegui criar sua conta no servidor. Confira /api/health e os logs da stack antes de testar o assistente.", true);
        return;
      }

      memberApp.token = `local-${Date.now()}`;
      memberApp.member = {
        name: payload.name || "Membro Axon",
        email: payload.email,
        created_at: new Date().toISOString()
      };
      memberApp.state = normalizeMemberState(memberApp.state);
      saveMemberApp();
      setMemberStatus("auth", "");
      renderMemberApp();
    }
  });
}

function wireMemberNavigation() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => showMemberView(button.dataset.view));
  });

  document.querySelector("#member-logout")?.addEventListener("click", () => {
    memberApp = {
      mode: "login",
      token: "",
      member: null,
      activeView: "dashboard",
      state: structuredClone(DEFAULT_MEMBER_STATE)
    };
    saveMemberApp();
    renderMemberApp();
  });

  document.querySelector("#new-project-button")?.addEventListener("click", () => {
    window.location.href = checkoutUrl();
  });

  document.querySelector("#save-project-name")?.addEventListener("click", () => {
    saveProjectName(document.querySelector("#project-name-input")?.value);
  });

  document.querySelector("#project-name-input")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector("#save-project-name")?.click();
    }
  });

  document.querySelector("#save-settings-project-name")?.addEventListener("click", () => {
    saveProjectName(document.querySelector("#settings-project-name")?.value);
  });
}

function wireModuleActions() {
  document.querySelector("#previous-stage")?.addEventListener("click", () => moveStage(-1));
  document.querySelector("#next-stage")?.addEventListener("click", () => moveStage(1));

  document.querySelector("#assistant-submit")?.addEventListener("click", async () => {
    const module = currentModule();
    const stage = currentLesson();
    const input = document.querySelector("#assistant-input");
    const submit = document.querySelector("#assistant-submit");
    const value = input?.value.trim() || "Quero ajuda para executar esta etapa.";

    if (submit?.disabled) return;

    const key = currentLessonKey();
    const requestThread = (memberApp.state.assistantThreads[key] || []).slice(-20);
    addAssistantMessage("user", value);
    addAssistantMessage("assistant", "Estou organizando sua resposta e preparando o proximo passo.");
    const pendingIndex = memberApp.state.assistantThreads[key].length - 1;
    if (input) {
      input.value = "";
    }
    if (submit) submit.disabled = true;
    persistMemberState();
    renderAssistantThread();

    try {
      const result = await requestLessonAgentAnswer(module, stage, value, requestThread);
      updateAssistantMessage(pendingIndex, result.answer);
      applyAssistantProgress(result);
    } catch (error) {
      updateAssistantMessage(
        pendingIndex,
        error.message || "Nao consegui conectar ao assistente real agora. Confira a configuracao da OpenAI e os logs da stack."
      );
    } finally {
      if (submit) submit.disabled = false;
      persistMemberState();
      renderAssistantThread();
    }
  });

  document.querySelector("#assistant-input")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      document.querySelector("#assistant-submit")?.click();
    }
  });

  // Botão "Continuar" do overlay de transição entre agentes
  document.querySelector("#transition-continue")?.addEventListener("click", () => {
    const overlay = document.querySelector("#agent-transition-overlay");
    if (!overlay) return;

    // Conclusão do Módulo 1 → vai para Módulo 2
    if (overlay.dataset.isModule1Completion === "true") {
      goToModule2();
      return;
    }

    const nextStageKey = overlay.dataset.nextStageKey || "";
    overlay.classList.add("hidden");
    overlay.dataset.nextStageKey = "";
    overlay.dataset.completedAgentId = "";

    if (nextStageKey) {
      markCurrentStageComplete();
      memberApp.state.currentLesson = normalizeStageKey(memberApp.state.currentModule, nextStageKey);
      memberApp.state.currentLessonStep = "main";
      ensureAssistantThread(currentModule(), currentLesson());
      persistMemberState();
      renderModuleDetail();
    }
  });

  // Botão de download do overlay de conclusão do módulo
  document.querySelector("#completion-download")?.addEventListener("click", async () => {
    const button = document.querySelector("#completion-download");
    const status = document.querySelector("#completion-status");

    if (button) button.disabled = true;
    if (status) {
      status.textContent = "Gerando seu planejamento...";
      status.classList.remove("hidden");
    }

    try {
      const response = await fetch("/api/operation/plan/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: memberApp.token,
          project: memberApp.state.project
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "download_failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const projectName = memberApp.state.project?.name || "meu-negocio";
      a.href = url;
      a.download = `planejamento-estrategico-${projectName.toLowerCase().replace(/\s+/g, "-")}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (status) status.classList.add("hidden");

      // Transforma o botão em "Dashboard"
      if (button) {
        button.disabled = false;
        button.textContent = "Dashboard";
        button.onclick = () => {
          document.querySelector("#module-completion-overlay")?.classList.add("hidden");
          showMemberView("dashboard");
        };
      }
    } catch (error) {
      if (status) {
        status.textContent = `Erro ao gerar o arquivo: ${error.message}`;
      }
      if (button) button.disabled = false;
    }
  });

  // Clique fora do card fecha o overlay
  document.querySelector("#module-completion-overlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.add("hidden");
    }
  });
}

const AGENT_TRANSITION_LABELS = {
  "business_modeling":        { done: "Você definiu sua hipótese de negócio.",      next: "Agora vamos descobrir quem é o seu cliente ideal." },
  "target_audience":          { done: "Você definiu seu público-alvo.",              next: "Agora vamos encontrar o seu diferencial no mercado." },
  "strategic_differentiation":{ done: "Você definiu seu diferencial estratégico.",   next: "Agora vamos construir sua estratégia de preços." },
  "strategic_pricing":        { done: "Você definiu sua precificação.",              next: "Agora vamos dar forma ao seu conceito de produto." },
  "product_concept":          { done: "Você definiu o conceito do seu produto.",     next: "Agora vamos criar a identidade visual do seu negócio." }
};

function applyAssistantProgress(result) {
  if (!result || !["completed", "result"].includes(result.status)) {
    return;
  }

  const nextStageKey = result.nextStageKey || stageKeyForAgentId(result.nextAgentId);
  const completedAgentId = result.agentId || "";

  // Módulo 1 concluído — Agente 01 (business_modeling) entregou a hipótese
  if (completedAgentId === "business_modeling") {
    markCurrentStageComplete();
    persistMemberState();
    showModule1CompletionOverlay();
    return;
  }

  // Fim do Módulo 2 — visual_identity (último agente) concluiu
  if (completedAgentId === "visual_identity") {
    markCurrentStageComplete();
    persistMemberState();
    showModuleCompletionOverlay();
    return;
  }

  // Transição entre agentes do Módulo 2
  if (nextStageKey && currentModule()?.id === "module-2") {
    showAgentTransitionOverlay(completedAgentId, nextStageKey);
    return;
  }

  // Comportamento padrão (outros módulos)
  markCurrentStageComplete();
  if (nextStageKey) {
    memberApp.state.currentLesson = normalizeStageKey(memberApp.state.currentModule, nextStageKey);
    memberApp.state.currentLessonStep = "main";
    ensureAssistantThread(currentModule(), currentLesson());
  }
}

function showModule1CompletionOverlay() {
  // Reutiliza o overlay de transição com conteúdo específico do Módulo 1
  const overlay = document.querySelector("#agent-transition-overlay");
  if (!overlay) {
    // Fallback: banner inline no thread do chat
    const thread = document.querySelector("#assistant-thread");
    if (thread) {
      thread.insertAdjacentHTML("beforeend", `
        <div class="module1-completion-banner">
          <p class="eyebrow">Modulo 1 concluido</p>
          <h3>Hipotese de negocio validada!</h3>
          <p>Baixe o resumo e avance para o Modulo 2 quando estiver pronto.</p>
          <button class="button button-primary" type="button" id="module1-go-to-2">Ir para o Modulo 2</button>
        </div>
      `);
      document.querySelector("#module1-go-to-2")?.addEventListener("click", goToModule2);
      thread.scrollTop = thread.scrollHeight;
    }
    return;
  }

  // Usa o overlay existente com texto do Módulo 1
  const title = document.querySelector("#transition-title");
  const subtitle = document.querySelector("#transition-subtitle");
  const btn = document.querySelector("#transition-continue");

  if (title) title.textContent = "Hipotese de negocio validada!";
  if (subtitle) subtitle.textContent = "Seu Modulo 1 esta concluido. Avance para o Modulo 2 quando estiver pronto.";
  if (btn) btn.textContent = "Ir para o Modulo 2";

  overlay.dataset.nextStageKey = "";
  overlay.dataset.isModule1Completion = "true";
  overlay.classList.remove("hidden");
  fireConfetti(false);
}

function goToModule2() {
  const overlay = document.querySelector("#agent-transition-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
    overlay.dataset.isModule1Completion = "";
    // Restaura texto padrão do botão
    const btn = document.querySelector("#transition-continue");
    if (btn) btn.textContent = "Continuar";
  }
  openModule("module-2");
}

function showAgentTransitionOverlay(completedAgentId, nextStageKey) {
  const labels = AGENT_TRANSITION_LABELS[completedAgentId] || {
    done: "Etapa concluída.",
    next: "Avançando para a próxima etapa."
  };

  const overlay = document.querySelector("#agent-transition-overlay");
  if (!overlay) return;

  document.querySelector("#transition-title").textContent = `🎉 Parabéns! ${labels.done}`;
  document.querySelector("#transition-subtitle").textContent = labels.next + " Preparado?";

  overlay.classList.remove("hidden");
  fireConfetti(false);

  // Armazena callback no dataset para o listener do botão
  overlay.dataset.nextStageKey = nextStageKey;
  overlay.dataset.completedAgentId = completedAgentId;
}

function showModuleCompletionOverlay() {
  const overlay = document.querySelector("#module-completion-overlay");
  if (!overlay) return;
  overlay.classList.remove("hidden");
  fireConfetti(true);
  const status = document.querySelector("#completion-status");
  if (status) status.classList.add("hidden");
}

function fireConfetti(intense) {
  if (typeof confetti !== "function") return;

  const baseOpts = {
    particleCount: intense ? 180 : 90,
    spread: intense ? 100 : 70,
    origin: { y: 0.55 },
    colors: ["#ccff00", "#ffffff", "#b8bdc7", "#111111", "#ccff00"]
  };

  confetti(baseOpts);

  if (intense) {
    setTimeout(() => confetti({ ...baseOpts, origin: { x: 0.2, y: 0.6 } }), 200);
    setTimeout(() => confetti({ ...baseOpts, origin: { x: 0.8, y: 0.6 } }), 400);
  }
}

async function hydrateSession() {
  if (!memberApp.token || memberApp.token.startsWith("local-")) return;

  try {
    const response = await postMemberApi("/api/members/session", { token: memberApp.token });
    const localThreads = memberApp.state.assistantThreads || {};
    const localLessonStep = memberApp.state.currentLessonStep;
    memberApp.member = response.member;
    memberApp.state = normalizeMemberState({
      ...response.state,
      currentLessonStep: response.state?.currentLessonStep || localLessonStep,
      assistantThreads: Object.keys(response.state?.assistantThreads || {}).length
        ? response.state.assistantThreads
        : localThreads
    });
    saveMemberApp();
    renderMemberApp();
  } catch {
    memberApp.token = "";
    memberApp.member = null;
    saveMemberApp();
    renderMemberApp();
  }
}

function renderMemberApp() {
  const isAuthed = Boolean(memberApp.member);
  document.querySelector("[data-auth-view]")?.classList.toggle("hidden", isAuthed);
  document.querySelectorAll("[data-app-view]").forEach((element) => element.classList.toggle("hidden", !isAuthed));
  renderAuthMode();

  if (!isAuthed) return;

  document.querySelector("#member-initials").textContent = initials(memberApp.member.name || memberApp.member.email);
  document.querySelector("#profile-photo-preview").textContent = initials(memberApp.member.name || memberApp.member.email);
  document.querySelector("#profile-name").value = memberApp.member.name || "";
  document.querySelector("#profile-email").value = memberApp.member.email || "";

  renderDashboard();
  renderModules();
  renderHistory();
  showMemberView(memberApp.activeView || "dashboard");
}

function renderAuthMode() {
  const isRegister = memberApp.mode === "register";
  document.querySelector("#name-field")?.classList.toggle("hidden", !isRegister);
  document.querySelector("#auth-mode-label").textContent = isRegister ? "Criar conta" : "Entrar";
  document.querySelector("#auth-title").textContent = isRegister ? "Comecar Operacao Comercial" : "Acessar Operacao Comercial";
  document.querySelector("#auth-submit").textContent = isRegister ? "Criar conta" : "Entrar";
  document.querySelector("#toggle-auth-mode").textContent = isRegister ? "Ja tenho conta" : "Criar uma conta";
}

function renderDashboard() {
  const totalStages = totalCourseStages();
  const completed = completedStageCount();
  const progress = totalStages ? Math.round((completed / totalStages) * 100) : 0;
  document.querySelector("#metric-completed").textContent = completed;
  document.querySelector("#metric-progress").textContent = `${progress}%`;
  document.querySelector("#metric-current").textContent = `Modulo ${currentModule()?.number || 1}`;
  const projectName = memberApp.state.project.name || "";
  const nameEditor = document.querySelector("#project-name-editor");
  const nameDisplay = document.querySelector("#project-name");
  const nameInput = document.querySelector("#project-name-input");
  const settingsNameInput = document.querySelector("#settings-project-name");
  nameEditor?.classList.toggle("hidden", Boolean(projectName));
  nameDisplay?.classList.toggle("hidden", !projectName);
  if (nameDisplay) nameDisplay.textContent = projectName;
  if (nameInput && !nameInput.value) nameInput.value = projectName;
  if (settingsNameInput) settingsNameInput.value = projectName;
}

function isModuleComplete(module) {
  return module.stages.every((_, index) =>
    memberApp.state.completedSteps.includes(`${module.id}.${index}`)
  );
}

function renderModules() {
  const root = document.querySelector("#module-grid");
  if (!root) return;

  root.innerHTML = COURSE_MODULES.map((module) => {
    const done = isModuleComplete(module);
    return `
    <article class="module-card${done ? " module-card--done" : ""}">
      <span>Modulo ${module.number}</span>
      <h3>${escapeHtml(module.title)}</h3>
      <p>${escapeHtml(module.summary)}</p>
      <small>${module.stages.length} etapas</small>
      ${done
        ? `<button class="button button-secondary module-card__done-btn" type="button" data-module-id="${module.id}">✓ Concluido</button>`
        : `<button class="button button-secondary" type="button" data-module-id="${module.id}">Abrir modulo</button>`
      }
    </article>`;
  }).join("");

  root.querySelectorAll("[data-module-id]").forEach((button) => {
    button.addEventListener("click", () => openModule(button.dataset.moduleId));
  });
}

function openModule(moduleId) {
  memberApp.state.currentModule = moduleId;
  const module = currentModule();
  // Preserva o progresso: só vai para .0 se o usuário ainda não tem etapa salva neste módulo
  const alreadyInModule = String(memberApp.state.currentLesson || "").startsWith(moduleId + ".");
  if (!alreadyInModule) {
    memberApp.state.currentLesson = `${module.id}.0`;
  }
  memberApp.state.currentLessonStep = "main";
  persistMemberState();
  renderModuleDetail();
  showMemberView("module");
}

function renderModuleDetail() {
  const module = currentModule();
  if (!module) return;
  window.scrollTo(0, 0);
  document.querySelector("#module-kicker").textContent = `Modulo ${module.number}`;
  document.querySelector("#module-title").textContent = module.title;
  document.querySelector("#module-summary").textContent = module.summary;
  renderLessonDetail(module, getStageIndex(module));
}

function renderLessonDetail(module, index) {
  const stage = module.stages[index] || module.stages[0];
  const isModule1 = module.id === "module-1";

  // Módulo 1: navegação é controlada exclusivamente pelos agentes — esconde os botões
  const nav = document.querySelector(".stage-navigation");
  if (nav) nav.classList.toggle("hidden", isModule1);

  // Kicker: no Módulo 1 mostra só o nome da etapa, sem "X de Y" para não sugerir navegação livre
  document.querySelector("#stage-kicker").textContent = isModule1
    ? `Modulo ${module.number} — ${stage[0]}`
    : `Modulo ${module.number} - Etapa ${index + 1} de ${module.stages.length}`;

  document.querySelector("#stage-title").textContent = stage[0];
  document.querySelector("#stage-summary").textContent = stage[1];
  document.querySelector("#stage-content").innerHTML = buildStageContent(stage, module);
  document.querySelector("#stage-progress-label").textContent = `Etapa ${index + 1} de ${module.stages.length}`;
  document.querySelector("#previous-stage").disabled = index === 0;
  document.querySelector("#next-stage").textContent = index === module.stages.length - 1 ? "Concluir modulo" : "Avancar";

  const isModule3 = isWizardModule(module);
  document.querySelector("#stage-video-placeholder")?.classList.toggle("hidden", isModule3);
  // No Módulo 3 a navegação fica entre as etapas e o assistente (via CSS order)
  document.querySelector(".stage-layout")?.classList.toggle("is-wizard", isModule3);

  if (isModule3) {
    const steps = getLessonSteps(stage);
    ensureValidLessonStep(steps);
    renderLessonSteps(steps);
    renderLessonStage(stage, steps);
  }

  ensureAssistantThread(module, stage);
  renderAssistantThread();
}

function renderHistory() {
  const project = memberApp.state.project;
  document.querySelector("#history-list").innerHTML = `
    <article class="history-item">
      <strong>${escapeHtml(project.name || "Projeto sem nome")}</strong>
      <span>${completedStageCount()} de ${totalCourseStages()} etapas concluidas</span>
      <small>Atualizado em ${formatDate(memberApp.state.updatedAt)}</small>
    </article>
  `;
}

function showMemberView(view) {
  memberApp.activeView = view;
  if (view === "module") {
    renderModuleDetail();
  }

  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.viewPanel !== view);
  });
  document.querySelectorAll(".members-top-actions [data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
}

function saveProjectName(value) {
  const name = String(value || "").trim();
  if (!name) return;
  memberApp.state.project = {
    ...memberApp.state.project,
    name
  };
  persistMemberState();
  renderDashboard();
  renderHistory();
}

function checkoutUrl() {
  const config = typeof AXON_CONFIG !== "undefined" ? AXON_CONFIG : window.AXON_RUNTIME_CONFIG;
  return config?.checkout?.operacaoComercial || "./operacao-comercial.html#checkout";
}

function fillTemplate(template) {
  const project = memberApp.state.project;
  return template
    .replaceAll("{{domain}}", project.domain || "SEU_DOMINIO.com")
    .replaceAll("{{serverIp}}", project.serverIp || "SEU_IP_DA_VPS")
    .replaceAll("{{technicalEmail}}", project.technicalEmail || "SEU_EMAIL_REAL")
    .replaceAll("{{siteImage}}", project.siteImage || "IMAGEM_DO_SITE_AQUI")
    .replaceAll("{{postgresPassword}}", project.postgresPassword || "SENHA_POSTGRES_AQUI")
    .replaceAll("{{evolutionApiKey}}", project.evolutionApiKey || "CHAVE_EVOLUTION_AQUI")
    .replaceAll("{{chatwootSecretKey}}", project.chatwootSecretKey || "CHAVE_SECRETA_64_CHARS_AQUI")
    .replaceAll("{{n8nEncryptionKey}}", project.n8nEncryptionKey || "{{n8nEncryptionKey}}")
    .replaceAll("{{n8nRunnersAuthToken}}", project.n8nRunnersAuthToken || "{{n8nRunnersAuthToken}}")
    .replaceAll("{{chatwootAccountId}}", project.chatwootAccountId || "1")
    .replaceAll("{{chatwootToken}}", project.chatwootToken || "COLE_SEU_TOKEN_CHATWOOT");
}

// Módulos com layout de wizard técnico (passos guiados + assistente técnico)
function isWizardModule(module) {
  return ["module-3", "module-4", "module-5", "module-6"].includes(module?.id);
}

function currentModule() {
  return COURSE_MODULES.find((module) => module.id === memberApp.state.currentModule) || COURSE_MODULES[0];
}

function currentLesson() {
  const module = currentModule();
  return module.stages[getStageIndex(module)] || module.stages[0];
}

function currentLessonKey() {
  const module = currentModule();
  return `${module.id}.${getStageIndex(module)}`;
}

function ensureProjectId() {
  if (!memberApp.state.project.id && window.crypto?.randomUUID) {
    memberApp.state.project.id = window.crypto.randomUUID();
    saveMemberApp();
  }
  return memberApp.state.project.id || "";
}

function getLessonSteps(lesson) {
  if (lesson[2] === "technical") {
    const stepIds = Array.isArray(lesson[4]) ? lesson[4] : null;
    const source = stepIds ? WIZARD_STEPS.filter((step) => stepIds.includes(step.id)) : WIZARD_STEPS;
    return source.map((step) => ({
      id: step.id,
      title: step.title,
      content: step.objective,
      command: step.command,
      validation: step.validation,
      done: step.done,
      tutorial: step.tutorial,
      yaml: step.yaml,
      fields: step.fields
    }));
  }

  return [
    {
      id: "overview",
      title: "Contexto",
      content: lesson[1],
      checklist: ["Entendi o objetivo da aula", "Tenho o contexto do meu negocio em mente"]
    },
    {
      id: "input",
      title: "Responder ao assistente",
      content: "Converse com o assistente para transformar seu contexto em uma entrega objetiva.",
      checklist: ["Enviei o contexto", "Recebi uma orientacao aplicavel"]
    },
    {
      id: "transfer",
      title: "Bloco de transferencia",
      content: "Copie a entrega gerada e salve no documento do projeto para continuar nas proximas aulas.",
      checklist: ["Registrei a decisao", "Anotei pendencias e proximo passo"]
    }
  ];
}

function moveStage(direction) {
  const module = currentModule();

  // Módulo 1: navegação manual bloqueada — progressão só via agentes
  if (module.id === "module-1") return;

  const index = getStageIndex(module);

  if (direction > 0) {
    markCurrentStageComplete();
  }

  const nextIndex = index + direction;
  if (nextIndex < 0) return;

  if (nextIndex >= module.stages.length) {
    showMemberView("dashboard");
    renderDashboard();
    renderHistory();
    return;
  }

  memberApp.state.currentLesson = `${module.id}.${nextIndex}`;
  memberApp.state.currentLessonStep = "main";
  persistMemberState();
  renderModuleDetail();
}

function markCurrentStageComplete() {
  const key = currentLessonKey();
  if (!memberApp.state.completedSteps.includes(key)) {
    memberApp.state.completedSteps.push(key);
  }
}

function completedStageCount() {
  const validKeys = new Set(
    COURSE_MODULES.flatMap((module) => module.stages.map((_, index) => `${module.id}.${index}`))
  );
  return memberApp.state.completedSteps.filter((key) => validKeys.has(key)).length;
}

function totalCourseStages() {
  return COURSE_MODULES.reduce((total, module) => total + module.stages.length, 0);
}

function ensureValidLessonStep(steps) {
  if (!steps.some((step) => step.id === memberApp.state.currentLessonStep)) {
    memberApp.state.currentLessonStep = steps[0]?.id || "overview";
  }
}

function currentLessonStep(steps) {
  return steps.find((step) => step.id === memberApp.state.currentLessonStep) || steps[0];
}

function renderLessonSteps(steps) {
  const root = document.querySelector("#lesson-steps");
  if (!root) return;
  root.innerHTML = renderLessonStepButtons(steps);

  root.querySelectorAll("[data-lesson-step-id]").forEach((button) => {
    button.addEventListener("click", () => {
      memberApp.state.currentLessonStep = button.dataset.lessonStepId;
      persistMemberState();
      renderModuleDetail();
    });
  });
}

function renderLessonStepButtons(steps) {
  const activeStep = currentLessonStep(steps);
  return steps.map((step, index) => {
    const isActive = step.id === activeStep.id;
    const isDone = memberApp.state.checklist[`${currentLessonKey()}.${step.id}.done`];
    return `
      <button type="button" class="${isActive ? "is-active" : ""}" data-lesson-step-id="${step.id}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        ${escapeHtml(step.title)}
        ${isDone ? "<small>feito</small>" : ""}
      </button>
    `;
  }).join("");
}

function renderLessonStage(lesson, steps) {
  const step = currentLessonStep(steps);
  document.querySelector("#lesson-step-kicker").textContent = lesson[2] === "technical" ? "Configuracao guiada" : "Etapa da aula";
  document.querySelector("#lesson-step-title").textContent = step.title;
  document.querySelector("#lesson-step-content").innerHTML = buildLessonStepContent(step, lesson);

  document.querySelectorAll("[data-copy-command], [data-copy-yaml]").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.closest(".technical-command")?.querySelector("code")?.textContent || "";
      try {
        await navigator.clipboard?.writeText(text);
        const label = button.textContent;
        button.textContent = "Copiado!";
        setTimeout(() => { button.textContent = label; }, 1800);
      } catch {
        // clipboard indisponivel — usuario pode selecionar manualmente
      }
    });
  });

  document.querySelectorAll(".btn-copy-inline").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.closest(".inline-command")?.querySelector("code")?.textContent || "";
      try {
        await navigator.clipboard?.writeText(text);
        button.classList.add("copied");
        setTimeout(() => button.classList.remove("copied"), 1800);
      } catch { /* silencioso */ }
    });
  });

  document.querySelectorAll("[data-project-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const value = input.value.trim();
      memberApp.state.project[input.dataset.projectField] = value;
      persistMemberState();
      input.closest(".wizard-data-field")?.classList.toggle("is-filled", Boolean(value));
    });
  });

  document.querySelector("#download-infra-doc")?.addEventListener("click", () => {
    const domain = memberApp.state.project.domain || "axon";
    const blob = new Blob([buildInfraDocument()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `infraestrutura-${domain.replace(/[^a-z0-9.-]/gi, "")}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  document.querySelector("#download-infra-script")?.addEventListener("click", () => {
    const blob = new Blob([buildInfraSetupScript()], { type: "text/x-shellscript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "axn-setup.sh";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  document.querySelector("#copy-evolution-yaml")?.addEventListener("click", async () => {
    const btn = document.querySelector("#copy-evolution-yaml");
    const yamlContent = step.yaml?.[0]?.content || "";
    try {
      await navigator.clipboard?.writeText(fillTemplate(yamlContent));
      const label = btn.textContent;
      btn.textContent = "Copiado!";
      setTimeout(() => { btn.textContent = label; }, 1800);
    } catch { /* silencioso */ }
  });

  const workflowDownloads = [
    ["#download-n8n-atendimento", buildAtendimentoWorkflowJson, "agente-atendimento.json"],
    ["#download-n8n-leads", buildLeadsWorkflowJson, "leads-do-site.json"],
    ["#download-n8n-vendas-stripe", buildVendasStripeWorkflowJson, "vendas-stripe.json"],
    ["#download-n8n-vendas-mp", buildVendasMPWorkflowJson, "vendas-mercadopago.json"],
    ["#download-n8n-metricas", buildMetricsWorkflowJson, "painel-metricas.json"],
    ["#download-n8n-conselho", buildConselhoWorkflowJson, "conselho-de-ia.json"],
    ["#download-n8n-fabrica-videos", buildFabricaVideosWorkflowJson, "fabrica-de-videos.json"]
  ];
  workflowDownloads.forEach(([selector, builder, filename]) => {
    document.querySelector(selector)?.addEventListener("click", () => {
      const blob = new Blob([builder()], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  });

  // Botões de geração de conteúdo (Módulo 4)
  document.querySelectorAll(".btn-generate").forEach((button) => {
    button.addEventListener("click", () => handleGenerateClick(button));
  });

  // Fábrica de Vídeos (Módulo 4) — restaura a voz escolhida e liga os botões
  const savedVoice = memberApp.state.project.heygenVoiceId || "";
  document.querySelectorAll('input[name="heygenVoice"]').forEach((radio) => {
    radio.checked = radio.value === savedVoice;
  });
  document.querySelector("#btn-heygen-validate")?.addEventListener("click", handleHeygenValidateClick);
  document.querySelector("#btn-heygen-test")?.addEventListener("click", handleHeygenTestClick);

  // Reexibe conteúdo de texto já gerado nesta sessão ao voltar para a etapa
  (step.tutorial || []).forEach((block) => {
    if (block.generate?.type === "text" && contentCache[block.generate.id]) {
      renderGenerateResult(block.generate.id);
    }
  });

  document.querySelectorAll(".btn-generate-feedback").forEach((button) => {
    button.addEventListener("click", () => {
      const genId = button.dataset.generateId;
      document.querySelector(`#generate-feedback-${genId}`)?.classList.toggle("hidden");
    });
  });

  document.querySelectorAll(".btn-approve-image").forEach((button) => {
    button.addEventListener("click", async () => {
      const genId = button.dataset.generateId;
      const imageUrl = contentCache[genId];
      if (!imageUrl) return;
      try {
        // data URLs baixam direto; URLs remotas passam por blob para forçar o download
        const href = imageUrl.startsWith("data:")
          ? imageUrl
          : URL.createObjectURL(await (await fetch(imageUrl)).blob());
        const link = document.createElement("a");
        link.href = href;
        link.download = "peca-campanha.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        if (!imageUrl.startsWith("data:")) URL.revokeObjectURL(href);
      } catch {
        // fetch bloqueado por CORS — abre em nova aba para salvar manualmente
        window.open(imageUrl, "_blank");
      }
    });
  });

  document.querySelectorAll(".btn-regenerate").forEach((button) => {
    button.addEventListener("click", () => handleGenerateClick(button));
  });

}

async function handleGenerateClick(button) {
  const genId = button.dataset.generateId;
  const genType = button.dataset.generateType;
  const loadingMsg = button.dataset.generateLoading || "Gerando...";

  const statusEl = document.querySelector(`#generate-status-${genId}`);
  const resultEl = document.querySelector(`#generate-result-${genId}`);

  if (!genId || button.disabled) return;

  const originalLabel = button.textContent;
  button.disabled = true;
  button.textContent = "Gerando...";

  const showStatus = (text, kind) => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.remove("hidden", "is-loading", "is-error");
    statusEl.classList.add(kind);
  };

  showStatus(loadingMsg, "is-loading");
  if (resultEl) resultEl.classList.add("hidden");

  try {
    if (genType === "text") {
      let accumulated = "";

      const response = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: memberApp.token,
          project: memberApp.state.project,
          agentType: genId,
          context: { grade: contentCache.grade_postagens || "" }
        })
      });

      if (response.status === 404) {
        throw new Error("O servidor ainda nao tem esta funcao. Atualize a stack do site (deploy da versao mais recente) e tente de novo.");
      }
      if (!response.ok || !response.body) {
        throw new Error("Nao consegui conectar ao servidor. Confira /api/health e tente novamente.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      // Linhas SSE podem chegar cortadas entre chunks — o resto fica no buffer
      let lineBuffer = "";

      // O texto bruto não é exibido durante o streaming — só o resultado final,
      // renderizado. Durante a geração o usuário vê o spinner de status.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const dataStr = line.slice(6).trim();
          let event;
          try { event = JSON.parse(dataStr); } catch { continue; }
          if (event.type === "delta" && event.text) {
            accumulated += event.text;
          } else if (event.type === "done") {
            if (event.ok === false) {
              throw new Error(errorMessageForCode(event.error || "generate_failed"));
            }
            contentCache[genId] = accumulated;
          } else if (event.type === "error") {
            throw new Error(errorMessageForCode(event.code || event.message || "generate_failed"));
          }
        }
      }

      if (!accumulated) {
        throw new Error("O agente nao retornou conteudo. Tente novamente em instantes.");
      }

      renderGenerateResult(genId);
      statusEl?.classList.add("hidden");
    } else if (genType === "image") {
      const feedbackEl = document.querySelector(`#generate-feedback-${genId}`);
      const feedbackInput = feedbackEl?.querySelector(".generate-feedback-input");
      const feedback = feedbackInput?.value?.trim() || "";

      // Com feedback + imagem anterior, o servidor edita a peça preservando a
      // composição (images/edits) em vez de gerar tudo do zero
      const previous = String(contentCache[genId] || "");
      const customBrief = document.querySelector(`#generate-brief-${genId}`)?.value?.trim() || "";
      const response = await fetch("/api/content/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: memberApp.token,
          project: memberApp.state.project,
          feedback,
          customBrief,
          previousImage: feedback && previous.startsWith("data:") ? previous : ""
        })
      });

      if (response.status === 404) {
        throw new Error("O servidor ainda nao tem esta funcao. Atualize a stack do site (deploy da versao mais recente) e tente de novo.");
      }

      const data = await response.json().catch(() => ({}));

      if (!data.ok || !data.url) {
        const base = errorMessageForCode(data.error || "image_generation_failed");
        throw new Error(data.detail ? `${base} (${data.detail})` : base);
      }

      contentCache[genId] = data.url;

      const imgEl = document.querySelector(`#generate-image-${genId}`);
      if (imgEl) imgEl.src = data.url;
      if (resultEl) resultEl.classList.remove("hidden");
      if (feedbackEl) feedbackEl.classList.add("hidden");
      if (feedbackInput) feedbackInput.value = "";

      statusEl?.classList.add("hidden");
    }
  } catch (error) {
    // Mantém a mensagem de erro visível — não esconder no finally
    showStatus(error.message || "Nao consegui gerar agora. Tente novamente.", "is-error");
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
}

// ─── Fábrica de Vídeos (Módulo 4) — setup HeyGen ────────────────────────────

function heygenErrorMessage(code, detail) {
  const messages = {
    heygen_key_missing: "Cole o API Token do HeyGen no passo 3 antes de continuar.",
    heygen_key_invalid: "O HeyGen nao aceitou este API Token. Confira se copiou o token completo em Settings → API.",
    heygen_avatar_missing: "Cole o codigo do apresentador no passo 4 antes de continuar.",
    heygen_avatar_not_found: "Nao encontrei um apresentador com esse codigo. Abra a pagina do avatar no HeyGen e copie o trecho apos avatars/ na barra de endereco.",
    heygen_config_incomplete: "Complete os passos anteriores: API Token, apresentador e voz.",
    heygen_unreachable: "Nao consegui falar com o HeyGen agora. Tente novamente em instantes.",
    heygen_video_create_failed: "O HeyGen nao aceitou o pedido de video. Confira se ha credito de API na sua conta (Billing → API).",
    heygen_status_failed: "Nao consegui consultar o andamento do video. Tente novamente.",
    auth_failed: "Sua sessao expirou. Entre novamente para continuar."
  };
  const base = messages[code] || "Algo deu errado na comunicacao com o HeyGen. Tente novamente.";
  return detail ? `${base} (${detail})` : base;
}

async function postHeygen(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: memberApp.token, ...body })
  });
  if (response.status === 404) {
    throw new Error("O servidor ainda nao tem esta funcao. Atualize a stack do site (deploy da versao mais recente) e tente de novo.");
  }
  return response.json().catch(() => ({}));
}

async function handleHeygenValidateClick() {
  const button = document.querySelector("#btn-heygen-validate");
  const statusEl = document.querySelector("#heygen-validate-status");
  const resultEl = document.querySelector("#heygen-validate-result");
  const project = memberApp.state.project;

  const showStatus = (text, kind) => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = `generate-status ${kind || ""}`.trim();
  };

  if (!project.heygenApiKey) return showStatus(heygenErrorMessage("heygen_key_missing"), "is-error");
  if (!project.heygenAvatarId) return showStatus(heygenErrorMessage("heygen_avatar_missing"), "is-error");

  button.disabled = true;
  showStatus("Validando com o HeyGen...", "is-loading");
  resultEl?.classList.add("hidden");

  try {
    const data = await postHeygen("/api/heygen/validate", {
      apiKey: project.heygenApiKey,
      avatarId: project.heygenAvatarId
    });
    if (!data.ok) throw new Error(heygenErrorMessage(data.error, data.detail));

    // Se o aluno colou o id do grupo (da URL), o servidor resolve para o id
    // utilizavel na geracao — atualiza o campo e o projeto com o id certo
    if (data.avatarId && data.avatarId !== project.heygenAvatarId) {
      project.heygenAvatarId = data.avatarId;
      persistMemberState();
      const input = document.querySelector('input[data-project-field="heygenAvatarId"]');
      if (input) input.value = data.avatarId;
    }

    const thumb = document.querySelector("#heygen-avatar-thumb");
    const nameEl = document.querySelector("#heygen-validate-name");
    if (thumb) {
      thumb.src = data.thumbnail || "";
      thumb.classList.toggle("hidden", !data.thumbnail);
    }
    if (nameEl) {
      const voiceChecked = document.querySelector('input[name="heygenVoice"]:checked');
      const voiceLabel = voiceChecked ? voiceChecked.parentElement.textContent.trim() : "escolha uma voz no passo 5";
      nameEl.textContent = `Apresentador: ${data.name} ✓ · Voz: ${voiceLabel}`;
    }
    resultEl?.classList.remove("hidden");
    showStatus("Configuracao valida! Voce ja pode gerar o video de teste.");
  } catch (error) {
    showStatus(error.message, "is-error");
  } finally {
    button.disabled = false;
  }
}

async function handleHeygenTestClick() {
  const button = document.querySelector("#btn-heygen-test");
  const statusEl = document.querySelector("#heygen-test-status");
  const resultEl = document.querySelector("#heygen-test-result");
  const project = memberApp.state.project;

  const showStatus = (text, kind) => {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = `generate-status ${kind || ""}`.trim();
  };

  if (!project.heygenApiKey || !project.heygenAvatarId || !project.heygenVoiceId) {
    return showStatus(heygenErrorMessage("heygen_config_incomplete"), "is-error");
  }

  button.disabled = true;
  resultEl?.classList.add("hidden");
  showStatus("Pedindo o video ao HeyGen...", "is-loading");

  try {
    const created = await postHeygen("/api/heygen/test-video", {
      apiKey: project.heygenApiKey,
      avatarId: project.heygenAvatarId,
      voiceId: project.heygenVoiceId
    });
    if (!created.ok) throw new Error(heygenErrorMessage(created.error, created.detail));

    showStatus("Video em producao... leva de 1 a 2 minutos. Pode deixar a pagina aberta.", "is-loading");

    // Poll a cada 10s por ate 6 minutos — render de ~20s costuma levar 1-2 min
    let final = null;
    for (let attempt = 0; attempt < 36; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      const status = await postHeygen("/api/heygen/video-status", {
        apiKey: project.heygenApiKey,
        videoId: created.videoId
      });
      if (!status.ok) throw new Error(heygenErrorMessage(status.error, status.detail));
      if (status.status === "completed") { final = status; break; }
      if (status.status === "failed") {
        throw new Error(heygenErrorMessage("heygen_video_create_failed", status.error?.message));
      }
    }
    if (!final?.videoUrl) throw new Error("O video demorou mais que o esperado. Confira na sua conta HeyGen em alguns minutos.");

    const video = document.querySelector("#heygen-test-video");
    if (video) video.src = final.videoUrl;
    resultEl?.classList.remove("hidden");
    showStatus("Video de teste pronto! Esse e o padrao que a Fabrica vai produzir com seus roteiros.");
  } catch (error) {
    showStatus(error.message, "is-error");
  } finally {
    button.disabled = false;
  }
}

// ─── Renderização do conteúdo gerado (Módulo 4) ─────────────────────────────

function renderGenerateResult(genId) {
  const resultEl = document.querySelector(`#generate-result-${genId}`);
  const full = contentCache[genId];
  if (!resultEl || !full) return;

  resultEl.classList.remove("hidden");
  resultEl.classList.add("is-rendered");

  if (genId === "grade_postagens") {
    // A tabela de 28 dias vai para download em CSV; o app mostra só a parte narrativa
    const { narrative, tableMd } = splitGeneratedTable(full);
    const hasTable = tableMd.split("\n").length >= 3;
    resultEl.innerHTML = markdownToHtml(narrative) + (hasTable
      ? `<div class="generate-actions">
           <button class="button button-primary" type="button" data-download-grade>Baixar grade de 28 dias (.csv)</button>
           <p class="generate-note">A grade completa está no arquivo — abra no Excel ou Google Sheets.</p>
         </div>`
      : "");
    resultEl.querySelector("[data-download-grade]")?.addEventListener("click", () => {
      const grade = splitGeneratedTable(contentCache.grade_postagens || "");
      const blob = new Blob([gradeTableToCsv(grade.tableMd)], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "grade-postagens-28-dias.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  } else if (genId === "atendimento_prompt") {
    // Prompt do atendente: editável — a versão do campo é embutida no download do fluxo
    resultEl.innerHTML = `
      <p><strong>Prompt do atendente pronto.</strong> Revise e ajuste à vontade no campo abaixo — o texto que estiver aqui é o que será embutido no fluxo de atendimento que você baixa no próximo passo.</p>
      <textarea class="generate-feedback-input generate-prompt-editor"></textarea>
      <p class="generate-note">Quiser mudar depois de importar? No n8n, abra o nó <strong>Agente IA</strong> — o prompt fica no campo da mensagem <em>system</em>, editável a qualquer momento.</p>`;
    const editor = resultEl.querySelector(".generate-prompt-editor");
    if (editor) {
      editor.value = full;
      editor.addEventListener("input", () => {
        contentCache[genId] = editor.value;
      });
    }
  } else if (genId === "site_prd" || genId === "painel_prd") {
    // PRD (site ou painel): copiar para colar no Claude + download de backup
    const prdFile = genId === "painel_prd" ? "prd-painel.md" : "prd-site.md";
    resultEl.innerHTML = `
      <p><strong>PRD pronto.</strong> Copie e cole no Claude (na pasta do projeto que você preparou). Guarde também uma cópia com seus documentos.</p>
      <div class="generate-actions">
        <button class="button button-primary" type="button" data-copy-prd>Copiar PRD</button>
        <button class="button button-secondary" type="button" data-download-prd>Baixar (.md)</button>
      </div>`;
    resultEl.querySelector("[data-copy-prd]")?.addEventListener("click", async (event) => {
      const btn = event.currentTarget;
      try {
        await navigator.clipboard?.writeText(contentCache[genId] || "");
        const label = btn.textContent;
        btn.textContent = "Copiado!";
        setTimeout(() => { btn.textContent = label; }, 1800);
      } catch { /* clipboard indisponivel */ }
    });
    resultEl.querySelector("[data-download-prd]")?.addEventListener("click", () => {
      const blob = new Blob([contentCache[genId] || ""], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = prdFile;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  } else {
    // Roteiros: tela limpa — só confirmação + botão de download
    // (Carrossel vira planilha CSV; os demais formatos saem em .md)
    const downloads = {
      roteiros_reels:     { file: "roteiros-reels-shorts.md", label: "Baixar roteiros de Reels / Shorts (.md)", kind: "md", name: "Roteiros de Reels / Shorts" },
      roteiros_carrossel: { file: "carrosseis.csv",           label: "Baixar carrosseis (.csv)",                kind: "csv", name: "Carrosseis" },
      roteiros_feed:      { file: "posts-feed.md",            label: "Baixar posts de Feed (.md)",              kind: "md", name: "Posts de Feed" },
      roteiros_stories:   { file: "roteiros-stories.md",      label: "Baixar roteiros de Stories (.md)",        kind: "md", name: "Roteiros de Stories" }
    };
    const download = downloads[genId];
    if (!download) {
      resultEl.innerHTML = markdownToHtml(full);
      return;
    }
    resultEl.innerHTML = `
      <p><strong>${escapeHtml(download.name)} prontos.</strong> Baixe o arquivo, revise e guarde junto do seu planejamento — o conteúdo não fica salvo no app.</p>
      <div class="generate-actions">
        <button class="button button-primary" type="button" data-download-text>${escapeHtml(download.label)}</button>
      </div>`;
    resultEl.querySelector("[data-download-text]")?.addEventListener("click", () => {
      const raw = contentCache[genId] || "";
      const isCsv = download.kind === "csv";
      const content = isCsv ? gradeTableToCsv(splitGeneratedTable(raw).tableMd) : raw;
      const mime = isCsv ? "text/csv;charset=utf-8" : "text/markdown;charset=utf-8";
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = download.file;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }
}

function splitGeneratedTable(text) {
  const lines = String(text || "").split("\n");
  const table = [];
  const rest = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^\|.*\|$/.test(trimmed)) {
      table.push(trimmed);
    } else if (trimmed === "```" || trimmed === "```markdown") {
      // fences que às vezes cercam a tabela — descarta
    } else {
      rest.push(line);
    }
  }
  return {
    tableMd: table.join("\n"),
    narrative: rest.join("\n").replace(/\n{3,}/g, "\n\n").trim()
  };
}

function gradeTableToCsv(tableMd) {
  const rows = [];
  let headerRow = "";
  for (const line of String(tableMd || "").split("\n")) {
    if (!line.includes("|")) continue;
    // pula linha separadora do markdown (|---|---|)
    if (/^[\s|:-]+$/.test(line)) continue;
    const cells = line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim().replace(/\*\*/g, ""));
    const row = cells.map((cell) => (/[";\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell)).join(";");
    // se o agente emitir varias tabelas, o cabecalho repetido e descartado
    if (!headerRow) headerRow = row;
    else if (row === headerRow) continue;
    rows.push(row);
  }
  // BOM para o Excel abrir acentos corretamente; ';' é o separador padrão pt-BR
  return String.fromCharCode(0xfeff) + rows.join("\r\n");
}

function markdownToHtml(md) {
  const inline = (text) => escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");

  const html = [];
  let listOpen = false;
  let tableRows = [];

  const flushList = () => {
    if (listOpen) { html.push("</ul>"); listOpen = false; }
  };
  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows;
    tableRows = [];
    let out = "<table>";
    let headerDone = false;
    for (const row of rows) {
      if (/^[\s|:-]+$/.test(row)) continue;
      const cells = row.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const tag = headerDone ? "td" : "th";
      out += "<tr>" + cells.map((c) => `<${tag}>${inline(c)}</${tag}>`).join("") + "</tr>";
      headerDone = true;
    }
    html.push(out + "</table>");
  };

  for (const raw of String(md || "").split("\n")) {
    const line = raw.trim();
    if (/^\|.*\|$/.test(line)) { flushList(); tableRows.push(line); continue; }
    flushTable();
    if (!line) { flushList(); continue; }
    if (line === "```" || line === "```markdown") continue;
    if (/^#{1,6}\s/.test(line)) { flushList(); html.push(`<h4>${inline(line.replace(/^#+\s*/, ""))}</h4>`); continue; }
    if (/^---+$/.test(line)) { flushList(); html.push("<hr>"); continue; }
    if (/^>\s?/.test(line)) { flushList(); html.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`); continue; }
    if (/^[-*]\s+/.test(line)) {
      if (!listOpen) { html.push("<ul>"); listOpen = true; }
      html.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    flushList();
    html.push(`<p>${inline(line)}</p>`);
  }
  flushList();
  flushTable();
  return html.join("");
}

function buildInfraSetupScript() {
  const p = memberApp.state.project;
  const domain    = p.domain           || "SEU_DOMINIO.com";
  const serverIp  = p.serverIp         || "SEU_IP_DA_VPS";
  const email     = p.technicalEmail   || "SEU_EMAIL_REAL";
  const pgPass    = p.postgresPassword    || "SENHA_POSTGRES_AQUI";
  const n8nKey    = p.n8nEncryptionKey    || "N8N_ENCRYPTION_KEY_AQUI";
  const n8nToken  = p.n8nRunnersAuthToken || "N8N_RUNNERS_AUTH_TOKEN_AQUI";
  const evoKey    = p.evolutionApiKey     || "EVOLUTION_API_KEY_AQUI";

  return `#!/bin/bash
set -e

echo ""
echo "=== AXN — Configuracao da Infraestrutura ==="
echo ""

DOMAIN="${domain}"
SERVER_IP="${serverIp}"
EMAIL="${email}"
POSTGRES_PASS="${pgPass}"
N8N_KEY="${n8nKey}"
N8N_TOKEN="${n8nToken}"
EVO_KEY="${evoKey}"
CHATWOOT_SECRET=$(openssl rand -hex 32)

# ── 1. Sistema ────────────────────────────────────
echo "[1/9] Atualizando sistema e configurando firewall..."
apt-get update -y && apt-get upgrade -y
ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable

# ── 2. Docker ─────────────────────────────────────
echo "[2/9] Instalando Docker..."
curl -fsSL https://get.docker.com | sh

# Fix: Docker 29+ requer DOCKER_MIN_API_VERSION para compatibilidade com Traefik
mkdir -p /etc/systemd/system/docker.service.d
cat > /etc/systemd/system/docker.service.d/override.conf << 'DOCKER_OVERRIDE'
[Service]
Environment="DOCKER_MIN_API_VERSION=1.24"
DOCKER_OVERRIDE
systemctl daemon-reload
systemctl restart docker
sleep 5

# ── 3. Swarm e rede ───────────────────────────────
echo "[3/9] Inicializando Docker Swarm..."
docker swarm init --advertise-addr "$SERVER_IP"
docker network create --driver=overlay --attachable network_swarm_public
echo "[3/9] Criando volumes..."
docker volume create volume_swarm_certificates
docker volume create portainer_data
docker volume create postgres_data
docker volume create redis_n8n_data
docker volume create evolution_instances
docker volume create redis_chatwoot_data

# ── 4. Traefik ────────────────────────────────────
echo "[4/9] Subindo Traefik..."
mkdir -p /opt/stacks/traefik
cat > /opt/stacks/traefik/stack.yml << 'TRAEFIK_STACK'
version: "3.7"
services:
  traefik:
    image: traefik:v3.3
    command:
      - "--api.dashboard=true"
      - "--providers.swarm.endpoint=unix:///var/run/docker.sock"
      - "--providers.swarm.exposedbydefault=false"
      - "--providers.swarm.network=network_swarm_public"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--entrypoints.web.http.redirections.entrypoint.permanent=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencryptresolver.acme.email=__EMAIL__"
      - "--certificatesresolvers.letsencryptresolver.acme.storage=/etc/traefik/letsencrypt/acme.json"
      - "--log.level=INFO"
      - "--accesslog=true"
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
        - "traefik.http.middlewares.redirect-https.redirectscheme.permanent=true"
        - "traefik.http.routers.http-catchall.rule=hostregexp(\`{host:.+}\`)"
        - "traefik.http.routers.http-catchall.entrypoints=web"
        - "traefik.http.routers.http-catchall.middlewares=redirect-https@swarm"
        - "traefik.http.routers.http-catchall.priority=1"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "vol_certificates:/etc/traefik/letsencrypt"
    networks:
      - network_swarm_public
    ports:
      - target: 80
        published: 80
        mode: host
      - target: 443
        published: 443
        mode: host
volumes:
  vol_certificates:
    external: true
    name: volume_swarm_certificates
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
TRAEFIK_STACK
sed -i "s|__EMAIL__|$EMAIL|g" /opt/stacks/traefik/stack.yml
docker stack deploy -c /opt/stacks/traefik/stack.yml traefik
echo -n "Aguardando Traefik"
TRIES=0; until docker service ls --filter name=traefik_traefik --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 20 ]; do sleep 3; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

# ── 5. Postgres ───────────────────────────────────
echo "[5/9] Subindo Postgres..."
mkdir -p /opt/stacks/postgres
cat > /opt/stacks/postgres/stack.yml << 'POSTGRES_STACK'
version: "3.7"
services:
  axon_postgres:
    image: pgvector/pgvector:pg16
    networks:
      - network_swarm_public
    command:
      - postgres
      - --max_connections=200
      - --port=5432
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: __POSTGRES_PASS__
      POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256"
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
volumes:
  postgres_data:
    external: true
    name: postgres_data
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
POSTGRES_STACK
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/postgres/stack.yml
docker stack deploy -c /opt/stacks/postgres/stack.yml axon_postgres
echo -n "Aguardando Postgres"
sleep 10
TRIES=0
until [ $TRIES -ge 20 ]; do
  PG=$(docker ps -qf name=axon_postgres_axon_postgres 2>/dev/null)
  [ -n "$PG" ] && docker exec "$PG" pg_isready -U postgres 2>/dev/null && break
  sleep 3; TRIES=$((TRIES+1)); printf "."
done; echo " OK"
PG=$(docker ps -qf name=axon_postgres_axon_postgres)
docker exec -t "$PG" psql -U postgres -c "CREATE DATABASE axon_ops;" || true
docker exec -t "$PG" psql -U postgres -c "CREATE USER axon_app WITH ENCRYPTED PASSWORD '$POSTGRES_PASS';" || true
docker exec -t "$PG" psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE axon_ops TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d axon_ops -c "GRANT ALL ON SCHEMA public TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -c "CREATE DATABASE n8n;" || true
docker exec -t "$PG" psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE n8n TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d n8n -c "GRANT ALL ON SCHEMA public TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -c "CREATE DATABASE evolution;" || true
docker exec -t "$PG" psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE evolution TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d evolution -c "GRANT ALL ON SCHEMA public TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -c "CREATE DATABASE chatwoot;" || true
docker exec -t "$PG" psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE chatwoot TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d chatwoot -c "GRANT ALL ON SCHEMA public TO axon_app;" || true
docker exec -t "$PG" psql -U postgres -d chatwoot -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;" || true

# ── 7. n8n ────────────────────────────────────────
echo "[6/9] Subindo n8n (Redis + editor + webhook + worker + runners)..."

mkdir -p /opt/stacks/redis-n8n
cat > /opt/stacks/redis-n8n/stack.yml << 'REDIS_N8N_STACK'
version: "3.7"
services:
  redis_n8n:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    networks:
      - network_swarm_public
    volumes:
      - redis_n8n_data:/data
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
volumes:
  redis_n8n_data:
    external: true
    name: redis_n8n_data
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
REDIS_N8N_STACK
docker stack deploy -c /opt/stacks/redis-n8n/stack.yml redis_n8n

mkdir -p /opt/stacks/n8n-editor
cat > /opt/stacks/n8n-editor/stack.yml << 'N8N_EDITOR_STACK'
version: "3.7"
services:
  n8n_editor:
    image: n8nio/n8n:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: start
    networks:
      - network_swarm_public
    environment:
      - N8N_ENCRYPTION_KEY=__N8N_KEY__
      - NODE_ENV=production
      - N8N_METRICS=true
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_LOG_LEVEL=info
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_RUNNERS_ENABLED=true
      - N8N_RUNNERS_MODE=external
      - N8N_RUNNERS_BROKER_LISTEN_ADDRESS=0.0.0.0
      - N8N_RUNNERS_AUTH_TOKEN=__N8N_TOKEN__
      - N8N_NATIVE_PYTHON_RUNNER=true
      - OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS=true
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=axon_postgres_axon_postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=axon_app
      - DB_POSTGRESDB_PASSWORD=__POSTGRES_PASS__
      - N8N_PORT=5678
      - N8N_HOST=workflows.__DOMAIN__
      - N8N_EDITOR_BASE_URL=https://workflows.__DOMAIN__/
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://webhooks.__DOMAIN__/
      - N8N_ENDPOINT_WEBHOOK=webhook
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis_n8n_redis_n8n
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=2
      - EXECUTIONS_TIMEOUT=3600
      - EXECUTIONS_TIMEOUT_MAX=7200
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=336
      - EXECUTIONS_DATA_PRUNE_MAX_COUNT=10000
      - EXECUTIONS_DATA_SAVE_ON_ERROR=all
      - EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
      - EXECUTIONS_DATA_SAVE_ON_PROGRESS=true
      - EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
      - NODE_FUNCTION_ALLOW_BUILTIN=*
      - NODE_FUNCTION_ALLOW_EXTERNAL=lodash
      - N8N_COMMUNITY_PACKAGES_ENABLED=true
      - N8N_REINSTALL_MISSING_PACKAGES=true
      - N8N_NODE_PATH=/home/node/.n8n/nodes
      - N8N_AI_ENABLED=false
      - N8N_ONBOARDING_FLOW_DISABLED=true
      - N8N_EMAIL_MODE=smtp
      - N8N_SMTP_HOST=smtp.mailersend.net
      - N8N_SMTP_PORT=587
      - N8N_SMTP_USER=MAILERSEND_SMTP_USER_AQUI
      - N8N_SMTP_PASS=MAILERSEND_SMTP_PASS_AQUI
      - N8N_SMTP_SENDER=contato@__DOMAIN__
      - N8N_SMTP_SSL=false
      - N8N_SECURE_COOKIE=false
      - N8N_BLOCK_ENV_ACCESS_IN_NODE=false
      - N8N_RESTRICT_FILE_ACCESS_TO=~/.n8n-files
      - N8N_DEFAULT_BINARY_DATA_MODE=default
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - traefik.enable=true
        - traefik.http.routers.n8n_editor.rule=Host(\`workflows.__DOMAIN__\`)
        - traefik.http.routers.n8n_editor.entrypoints=websecure
        - traefik.http.routers.n8n_editor.tls.certresolver=letsencryptresolver
        - traefik.http.routers.n8n_editor.service=n8n_editor
        - traefik.http.services.n8n_editor.loadbalancer.server.port=5678
        - traefik.http.services.n8n_editor.loadbalancer.passHostHeader=true
networks:
  network_swarm_public:
    name: network_swarm_public
    external: true
N8N_EDITOR_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/n8n-editor/stack.yml
sed -i "s|__N8N_KEY__|$N8N_KEY|g" /opt/stacks/n8n-editor/stack.yml
sed -i "s|__N8N_TOKEN__|$N8N_TOKEN|g" /opt/stacks/n8n-editor/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/n8n-editor/stack.yml
docker stack deploy -c /opt/stacks/n8n-editor/stack.yml n8n_editor
echo -n "Aguardando n8n editor (migrations)"
TRIES=0; until docker service ls --filter name=n8n_editor_n8n_editor --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 40 ]; do sleep 5; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

mkdir -p /opt/stacks/n8n-webhook
cat > /opt/stacks/n8n-webhook/stack.yml << 'N8N_WEBHOOK_STACK'
version: "3.7"
services:
  n8n_webhook:
    image: n8nio/n8n:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: webhook
    networks:
      - network_swarm_public
    environment:
      - N8N_ENCRYPTION_KEY=__N8N_KEY__
      - NODE_ENV=production
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_LOG_LEVEL=info
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_RUNNERS_AUTH_TOKEN=__N8N_TOKEN__
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=axon_postgres_axon_postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=axon_app
      - DB_POSTGRESDB_PASSWORD=__POSTGRES_PASS__
      - N8N_PORT=5678
      - N8N_HOST=workflows.__DOMAIN__
      - N8N_EDITOR_BASE_URL=https://workflows.__DOMAIN__/
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://webhooks.__DOMAIN__/
      - N8N_ENDPOINT_WEBHOOK=webhook
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis_n8n_redis_n8n
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=2
    deploy:
      mode: replicated
      replicas: 3
      placement:
        constraints:
          - node.role == manager
      labels:
        - traefik.enable=true
        - traefik.http.routers.n8n_webhook.rule=Host(\`webhooks.__DOMAIN__\`)
        - traefik.http.routers.n8n_webhook.entrypoints=websecure
        - traefik.http.routers.n8n_webhook.tls.certresolver=letsencryptresolver
        - traefik.http.routers.n8n_webhook.service=n8n_webhook
        - traefik.http.services.n8n_webhook.loadbalancer.server.port=5678
        - traefik.http.services.n8n_webhook.loadbalancer.passHostHeader=true
networks:
  network_swarm_public:
    name: network_swarm_public
    external: true
N8N_WEBHOOK_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/n8n-webhook/stack.yml
sed -i "s|__N8N_KEY__|$N8N_KEY|g" /opt/stacks/n8n-webhook/stack.yml
sed -i "s|__N8N_TOKEN__|$N8N_TOKEN|g" /opt/stacks/n8n-webhook/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/n8n-webhook/stack.yml
docker stack deploy -c /opt/stacks/n8n-webhook/stack.yml n8n_webhook

mkdir -p /opt/stacks/n8n-worker
cat > /opt/stacks/n8n-worker/stack.yml << 'N8N_WORKER_STACK'
version: "3.7"
services:
  n8n_worker:
    image: n8nio/n8n:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: worker --concurrency=10
    networks:
      - network_swarm_public
    environment:
      - N8N_ENCRYPTION_KEY=__N8N_KEY__
      - NODE_ENV=production
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_LOG_LEVEL=info
      - GENERIC_TIMEZONE=America/Sao_Paulo
      - N8N_RUNNERS_ENABLED=true
      - N8N_RUNNERS_MODE=external
      - N8N_RUNNERS_BROKER_LISTEN_ADDRESS=0.0.0.0
      - N8N_RUNNERS_AUTH_TOKEN=__N8N_TOKEN__
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_HOST=axon_postgres_axon_postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=axon_app
      - DB_POSTGRESDB_PASSWORD=__POSTGRES_PASS__
      - N8N_PORT=5678
      - N8N_HOST=workflows.__DOMAIN__
      - N8N_EDITOR_BASE_URL=https://workflows.__DOMAIN__/
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://webhooks.__DOMAIN__/
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis_n8n_redis_n8n
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=2
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
networks:
  network_swarm_public:
    name: network_swarm_public
    external: true
N8N_WORKER_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/n8n-worker/stack.yml
sed -i "s|__N8N_KEY__|$N8N_KEY|g" /opt/stacks/n8n-worker/stack.yml
sed -i "s|__N8N_TOKEN__|$N8N_TOKEN|g" /opt/stacks/n8n-worker/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/n8n-worker/stack.yml
docker stack deploy -c /opt/stacks/n8n-worker/stack.yml n8n_worker

mkdir -p /opt/stacks/n8n-runners
cat > /opt/stacks/n8n-runners/stack.yml << 'N8N_RUNNERS_STACK'
version: "3.7"
services:
  n8n_runners:
    image: n8nio/runners:2.16.1
    hostname: "{{.Service.Name}}.{{.Task.Slot}}"
    command: ["javascript", "python"]
    networks:
      - network_swarm_public
    environment:
      N8N_RUNNERS_TASK_BROKER_URI: http://n8n_worker_n8n_worker:5679
      N8N_RUNNERS_AUTH_TOKEN: __N8N_TOKEN__
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
N8N_RUNNERS_STACK
sed -i "s|__N8N_TOKEN__|$N8N_TOKEN|g" /opt/stacks/n8n-runners/stack.yml
docker stack deploy -c /opt/stacks/n8n-runners/stack.yml n8n_runners

# ── 8. Chatwoot ───────────────────────────────────
echo "[7/9] Subindo Chatwoot (Redis + web + worker)..."
mkdir -p /opt/stacks/chatwoot
cat > /opt/stacks/chatwoot/stack.yml << 'CHATWOOT_STACK'
version: "3.7"
services:
  redis-chatwoot:
    image: redis:7-alpine
    volumes:
      - redis_chatwoot_data:/data
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
  chatwoot-web:
    image: chatwoot/chatwoot:v3.11.0
    environment:
      - SECRET_KEY_BASE=__CHATWOOT_SECRET__
      - FRONTEND_URL=https://chat.__DOMAIN__
      - DEFAULT_LOCALE=pt_BR
      - RAILS_ENV=production
      - RAILS_LOG_TO_STDOUT=true
      - REDIS_URL=redis://redis-chatwoot:6379
      - POSTGRES_HOST=axon_postgres_axon_postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DATABASE=chatwoot
      - POSTGRES_USERNAME=axon_app
      - POSTGRES_PASSWORD=__POSTGRES_PASS__
    command: sh -c "bundle exec rails db:chatwoot_prepare && bundle exec rails s -p 3000 -b 0.0.0.0"
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.chatwoot.rule=Host(\`chat.__DOMAIN__\`)"
        - "traefik.http.routers.chatwoot.entrypoints=websecure"
        - "traefik.http.routers.chatwoot.tls=true"
        - "traefik.http.routers.chatwoot.tls.certresolver=letsencryptresolver"
        - "traefik.http.services.chatwoot.loadbalancer.server.port=3000"
  chatwoot-worker:
    image: chatwoot/chatwoot:v3.11.0
    environment:
      - SECRET_KEY_BASE=__CHATWOOT_SECRET__
      - FRONTEND_URL=https://chat.__DOMAIN__
      - RAILS_ENV=production
      - REDIS_URL=redis://redis-chatwoot:6379
      - POSTGRES_HOST=axon_postgres_axon_postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DATABASE=chatwoot
      - POSTGRES_USERNAME=axon_app
      - POSTGRES_PASSWORD=__POSTGRES_PASS__
    command: bundle exec sidekiq -C config/sidekiq.yml
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
volumes:
  redis_chatwoot_data:
    external: true
    name: redis_chatwoot_data
CHATWOOT_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/chatwoot/stack.yml
sed -i "s|__CHATWOOT_SECRET__|$CHATWOOT_SECRET|g" /opt/stacks/chatwoot/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/chatwoot/stack.yml
docker stack deploy -c /opt/stacks/chatwoot/stack.yml chatwoot
echo -n "Aguardando Chatwoot"
TRIES=0; until docker service ls --filter name=chatwoot_chatwoot-web --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 40 ]; do sleep 5; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

# ── 9. Evolution API ──────────────────────────────
echo "[8/9] Subindo Evolution API..."
mkdir -p /opt/stacks/evolution
cat > /opt/stacks/evolution/stack.yml << 'EVOLUTION_STACK'
version: "3.7"
services:
  evolution:
    image: evoapicloud/evolution-api:v2.3.7
    environment:
      - SERVER_URL=https://evo.__DOMAIN__
      - AUTHENTICATION_API_KEY=__EVO_KEY__
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://axon_app:__POSTGRES_PASS__@axon_postgres_axon_postgres:5432/evolution
      - DATABASE_URL=postgresql://axon_app:__POSTGRES_PASS__@axon_postgres_axon_postgres:5432/evolution
      - REDIS_ENABLED=true
      - REDIS_URI=redis://chatwoot_redis-chatwoot:6379
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://chatwoot_redis-chatwoot:6379
      - CACHE_REDIS_PREFIX_KEY=evolution
      - CACHE_REDIS_SAVE_INSTANCES=true
      - CACHE_LOCAL_ENABLED=false
      - CHATWOOT_ENABLED=true
      - CHATWOOT_MESSAGE_READ=true
      - LOG_LEVEL=ERROR
      - DEL_INSTANCE=false
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.evolution.rule=Host(\`evo.__DOMAIN__\`)"
        - "traefik.http.routers.evolution.entrypoints=websecure"
        - "traefik.http.routers.evolution.tls=true"
        - "traefik.http.routers.evolution.tls.certresolver=letsencryptresolver"
        - "traefik.http.routers.evolution.middlewares=evolution-ws"
        - "traefik.http.services.evolution.loadbalancer.server.port=8080"
        - "traefik.http.middlewares.evolution-ws.headers.customrequestheaders.Upgrade=websocket"
        - "traefik.http.middlewares.evolution-ws.headers.customrequestheaders.Connection=Upgrade"
networks:
  network_swarm_public:
    external: true
    name: network_swarm_public
volumes:
  evolution_instances:
    external: true
    name: evolution_instances
EVOLUTION_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/evolution/stack.yml
sed -i "s|__EVO_KEY__|$EVO_KEY|g" /opt/stacks/evolution/stack.yml
sed -i "s|__POSTGRES_PASS__|$POSTGRES_PASS|g" /opt/stacks/evolution/stack.yml
docker stack deploy -c /opt/stacks/evolution/stack.yml evolution
echo -n "Aguardando Evolution"
TRIES=0; until docker service ls --filter name=evolution_evolution --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 20 ]; do sleep 3; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

# ── 9. Portainer ──────────────────────────────────
echo "[9/9] Subindo Portainer..."
mkdir -p /opt/stacks/portainer
cat > /opt/stacks/portainer/stack.yml << 'PORTAINER_STACK'
version: "3.7"
services:
  agent:
    image: portainer/agent:sts
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    networks:
      - network_swarm_public
    deploy:
      mode: global
      placement:
        constraints:
          - node.platform.os == linux
  portainer:
    image: portainer/portainer-ce:sts
    command: -H tcp://tasks.agent:9001 --tlsskipverify --no-setup-token
    volumes:
      - portainer_data:/data
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.portainer.rule=Host(\`painel.__DOMAIN__\`)"
        - "traefik.http.routers.portainer.entrypoints=websecure"
        - "traefik.http.routers.portainer.tls.certresolver=letsencryptresolver"
        - "traefik.http.routers.portainer.service=portainer"
        - "traefik.http.services.portainer.loadbalancer.server.port=9000"
networks:
  network_swarm_public:
    external: true
    attachable: true
    name: network_swarm_public
volumes:
  portainer_data:
    external: true
    name: portainer_data
PORTAINER_STACK
sed -i "s|__DOMAIN__|$DOMAIN|g" /opt/stacks/portainer/stack.yml
docker stack deploy -c /opt/stacks/portainer/stack.yml portainer
echo -n "Aguardando Portainer"
TRIES=0; until docker service ls --filter name=portainer_portainer --format '{{.Replicas}}' | grep -q "1/1" || [ $TRIES -ge 20 ]; do sleep 3; TRIES=$((TRIES+1)); printf "."; done; echo " OK"

echo ""
echo "============================================"
echo "  Infraestrutura no ar!"
echo ""
echo "  Portainer  : https://painel.$DOMAIN"
echo "  n8n        : https://workflows.$DOMAIN"
echo "  Chatwoot   : https://chat.$DOMAIN"
echo "  Evolution  : https://evo.$DOMAIN/manager"
echo ""
echo "  Chave Evolution API : $EVO_KEY"
echo "  (anote no documento de infra do modulo 3)"
echo "============================================"
echo ""
echo "Proximo passo: abra https://painel.$DOMAIN e crie o usuario admin."
echo "  Se aparecer timeout: docker service update --force portainer_portainer"
`;
}


// Webhook POST /webhook/atendimento — atendente de IA no WhatsApp (v3)
// Responde na hora (onReceived), deduplica por id de mensagem, lê o histórico
// da conversa no Chatwoot, responde em JSON {resposta, transferir} e, quando
// transferir=true, atribui a conversa a um humano via API (que também cala o bot).
function buildAtendimentoWorkflowJson() {
  const domain = memberApp.state.project.domain || "seudominio.com.br";
  const evoKey = memberApp.state.project.evolutionApiKey || "CHAVE_EVOLUTION_AQUI";
  const cwAccount = memberApp.state.project.chatwootAccountId || "1";
  const cwToken = memberApp.state.project.chatwootToken || "COLE_SEU_TOKEN_CHATWOOT";
  const cwBase = `https://chat.${domain}/api/v1/accounts/${cwAccount}`;

  const customPrompt = contentCache.atendimento_prompt
    || `Voce e o atendente de IA do negocio. Responda de forma direta, simpatica e objetiva, em mensagens curtas de WhatsApp. Direcione interessados para https://${domain}.`;

  // Contrato fixo anexado a qualquer prompt personalizado — garante o JSON e a transferência
  const systemPrompt = [
    customPrompt,
    "",
    "## CONTRATO DE RESPOSTA (OBRIGATORIO)",
    "Responda SEMPRE com um JSON valido, sem nenhum texto fora dele:",
    '{"resposta": "sua mensagem para o cliente", "transferir": true ou false}',
    "",
    "Defina transferir=true quando o cliente: pedir para falar com humano/pessoa/atendente; propuser parceria; quiser negociar desconto ou condicoes; fizer reclamacao ou pedir reembolso; ou trouxer assunto fora do escopo do atendimento.",
    "Quando transferir=true, a resposta deve dizer que o responsavel foi avisado e vai assumir esta conversa em breve — sem inventar nomes de pessoas nem prazos.",
    "Nos demais casos, transferir=false. Nunca invente nomes, precos ou dados que nao estejam nas suas instrucoes."
  ].join("\n");

  const cwHeaders = { parameters: [{ name: "api_access_token", value: cwToken }] };
  const pgCred = { postgres: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "Postgres negocio" } };

  const workflow = {
    name: "Agente de Atendimento",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "atendimento",
          responseMode: "onReceived",
          options: {}
        },
        id: "webhook-evolution",
        name: "Webhook Evolution",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [200, 300],
        webhookId: "atendimento-webhook"
      },
      {
        parameters: {
          conditions: {
            options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
            conditions: [
              { id: "cond-event", leftValue: "={{ $json.body.event }}", rightValue: "messages.upsert", operator: { type: "string", operation: "equals" } },
              { id: "cond-from-me", leftValue: "={{ $json.body.data.key.fromMe }}", rightValue: false, operator: { type: "boolean", operation: "false" } },
              { id: "cond-texto", leftValue: "={{ ($json.body.data.message && $json.body.data.message.conversation) || '' }}", rightValue: "", operator: { type: "string", operation: "notEquals" } }
            ],
            combinator: "and"
          },
          options: {}
        },
        id: "filtra-mensagem",
        name: "Filtra mensagem recebida",
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        position: [400, 300]
      },
      {
        parameters: {
          operation: "executeQuery",
          query: [
            "create table if not exists bot_mensagens (id text primary key, criado_em timestamptz default now());",
            "insert into bot_mensagens (id) values ($1) on conflict do nothing returning id;"
          ].join("\n"),
          options: { queryReplacement: "={{ $json.body.data.key.id }}" }
        },
        id: "dedup",
        name: "Dedup mensagem",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [600, 220],
        credentials: pgCred
      },
      {
        parameters: {
          conditions: {
            options: { caseSensitive: true, leftValue: "", typeValidation: "loose" },
            conditions: [
              { id: "cond-nova", leftValue: "={{ $json.id }}", rightValue: "", operator: { type: "string", operation: "notEquals" } }
            ],
            combinator: "and"
          },
          options: {}
        },
        id: "e-nova",
        name: "Mensagem inedita?",
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        position: [800, 220]
      },
      {
        parameters: {
          method: "GET",
          url: `=${cwBase}/contacts/search?q={{ $('Webhook Evolution').first().json.body.data.key.remoteJid.split('@')[0].replace(/\\D/g, '') }}`,
          sendHeaders: true,
          headerParameters: cwHeaders,
          options: {}
        },
        id: "busca-contato",
        name: "Busca contato no Chatwoot",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [1000, 220],
        onError: "continueRegularOutput"
      },
      {
        parameters: {
          method: "GET",
          url: `=${cwBase}/contacts/{{ ($json.payload && $json.payload[0] && $json.payload[0].id) || 0 }}/conversations`,
          sendHeaders: true,
          headerParameters: cwHeaders,
          options: {}
        },
        id: "busca-conversas",
        name: "Busca conversas do contato",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [1200, 220],
        onError: "continueRegularOutput"
      },
      {
        parameters: {
          jsCode: [
            "// Escolhe a conversa mais recente e verifica se um humano assumiu",
            "const convs = ($input.first().json && $input.first().json.payload) || [];",
            "let conv = null;",
            "for (const c of convs) { if (!conv || Number(c.id) > Number(conv.id)) conv = c; }",
            "const assignee = conv && conv.meta && conv.meta.assignee;",
            "return [{ json: { conversaId: conv ? conv.id : 0, humanoAssumiu: Boolean(assignee) } }];"
          ].join("\n")
        },
        id: "escolhe-conversa",
        name: "Escolhe conversa",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [1400, 220]
      },
      {
        parameters: {
          conditions: {
            options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
            conditions: [
              { id: "cond-livre", leftValue: "={{ $json.humanoAssumiu }}", rightValue: false, operator: { type: "boolean", operation: "false" } }
            ],
            combinator: "and"
          },
          options: {}
        },
        id: "bot-pode",
        name: "Bot pode responder",
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        position: [1600, 220]
      },
      {
        parameters: {
          method: "GET",
          url: `=${cwBase}/conversations/{{ $json.conversaId }}/messages`,
          sendHeaders: true,
          headerParameters: cwHeaders,
          options: {}
        },
        id: "busca-historico",
        name: "Busca historico",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [1800, 220],
        onError: "continueRegularOutput"
      },
      {
        parameters: {
          jsCode: [
            "const atual = String($('Webhook Evolution').first().json.body.data.message.conversation || '').trim();",
            "const brutas = ($input.first().json && $input.first().json.payload) || [];",
            "const hist = brutas",
            "  .filter((m) => !m.private && m.content && (m.message_type === 0 || m.message_type === 1))",
            "  .slice(-10)",
            "  .map((m) => ({ role: m.message_type === 0 ? 'user' : 'assistant', content: String(m.content) }));",
            "// Evita duplicar a mensagem atual se o espelhamento do Chatwoot ja a registrou",
            "if (hist.length && hist[hist.length - 1].role === 'user' && hist[hist.length - 1].content.trim() === atual) hist.pop();",
            "const system = " + JSON.stringify(systemPrompt) + ";",
            "const messages = [{ role: 'system', content: system }, ...hist, { role: 'user', content: atual }];",
            "return [{ json: { messages, conversaId: $('Escolhe conversa').first().json.conversaId } }];"
          ].join("\n")
        },
        id: "monta-mensagens",
        name: "Monta mensagens",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [2000, 220]
      },
      {
        parameters: {
          method: "POST",
          url: "https://api.openai.com/v1/responses",
          authentication: "predefinedCredentialType",
          nodeCredentialType: "openAiApi",
          sendBody: true,
          specifyBody: "json",
          jsonBody: "={{ JSON.stringify({ model: 'gpt-4o-mini', input: $json.messages, text: { format: { type: 'json_schema', name: 'atendimento', strict: true, schema: { type: 'object', additionalProperties: false, required: ['resposta', 'transferir'], properties: { resposta: { type: 'string' }, transferir: { type: 'boolean' } } } } } }) }}",
          options: {}
        },
        id: "agente-ia",
        name: "Agente IA",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [2200, 220],
        credentials: {
          openAiApi: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "OpenAi account" }
        }
      },
      {
        parameters: {
          jsCode: [
            "// Extrai o texto da Responses API (itens type=message > content > text)",
            "const r = $input.first().json;",
            "const bruto = (r.output || [])",
            "  .flatMap((item) => item.content || [])",
            "  .map((c) => c.text || '')",
            "  .join('').trim();",
            "let resposta = bruto; let transferir = false;",
            "try { const p = JSON.parse(bruto); resposta = String(p.resposta || bruto); transferir = Boolean(p.transferir); } catch {}",
            "if (!resposta) { resposta = 'Recebi sua mensagem! Ja te respondo.'; }",
            "return [{ json: { resposta, transferir, conversaId: $('Monta mensagens').first().json.conversaId } }];"
          ].join("\n")
        },
        id: "interpreta",
        name: "Interpreta resposta",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [2400, 220]
      },
      {
        parameters: {
          method: "POST",
          url: `=https://evo.${domain}/message/sendText/{{ $('Webhook Evolution').first().json.body.instance }}`,
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: "apikey", value: evoKey }]
          },
          sendBody: true,
          bodyParameters: {
            parameters: [
              { name: "number", value: "={{ $('Webhook Evolution').first().json.body.data.key.remoteJid }}" },
              { name: "text", value: "={{ $json.resposta }}" }
            ]
          },
          options: {}
        },
        id: "responder-evolution",
        name: "Responder via Evolution API",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [2600, 220]
      },
      {
        parameters: {
          conditions: {
            options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
            conditions: [
              { id: "cond-transferir", leftValue: "={{ $('Interpreta resposta').first().json.transferir }}", rightValue: true, operator: { type: "boolean", operation: "true" } },
              { id: "cond-tem-conversa", leftValue: "={{ $('Interpreta resposta').first().json.conversaId }}", rightValue: 0, operator: { type: "number", operation: "gt" } }
            ],
            combinator: "and"
          },
          options: {}
        },
        id: "deve-transferir",
        name: "Deve transferir?",
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        position: [2800, 220]
      },
      {
        parameters: {
          method: "GET",
          url: `${cwBase}/agents`,
          sendHeaders: true,
          headerParameters: cwHeaders,
          options: {}
        },
        id: "busca-agentes",
        name: "Busca agentes",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [3000, 140],
        onError: "continueRegularOutput"
      },
      {
        parameters: {
          jsCode: [
            "const todos = $input.all().map((i) => i.json);",
            "const primeiro = todos.find((a) => a && a.id);",
            "return [{ json: { assigneeId: primeiro ? primeiro.id : 1, conversaId: $('Interpreta resposta').first().json.conversaId } }];"
          ].join("\n")
        },
        id: "escolhe-agente",
        name: "Escolhe agente humano",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [3200, 140]
      },
      {
        parameters: {
          method: "POST",
          url: `=${cwBase}/conversations/{{ $json.conversaId }}/assignments`,
          sendHeaders: true,
          headerParameters: cwHeaders,
          sendBody: true,
          bodyParameters: {
            parameters: [{ name: "assignee_id", value: "={{ $json.assigneeId }}" }]
          },
          options: {}
        },
        id: "atribui-humano",
        name: "Atribui ao humano",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [3400, 140],
        onError: "continueRegularOutput"
      }
    ],
    connections: {
      "Webhook Evolution": { main: [[{ node: "Filtra mensagem recebida", type: "main", index: 0 }]] },
      "Filtra mensagem recebida": { main: [[{ node: "Dedup mensagem", type: "main", index: 0 }]] },
      "Dedup mensagem": { main: [[{ node: "Mensagem inedita?", type: "main", index: 0 }]] },
      "Mensagem inedita?": { main: [[{ node: "Busca contato no Chatwoot", type: "main", index: 0 }]] },
      "Busca contato no Chatwoot": { main: [[{ node: "Busca conversas do contato", type: "main", index: 0 }]] },
      "Busca conversas do contato": { main: [[{ node: "Escolhe conversa", type: "main", index: 0 }]] },
      "Escolhe conversa": { main: [[{ node: "Bot pode responder", type: "main", index: 0 }]] },
      "Bot pode responder": { main: [[{ node: "Busca historico", type: "main", index: 0 }]] },
      "Busca historico": { main: [[{ node: "Monta mensagens", type: "main", index: 0 }]] },
      "Monta mensagens": { main: [[{ node: "Agente IA", type: "main", index: 0 }]] },
      "Agente IA": { main: [[{ node: "Interpreta resposta", type: "main", index: 0 }]] },
      "Interpreta resposta": { main: [[{ node: "Responder via Evolution API", type: "main", index: 0 }]] },
      "Responder via Evolution API": { main: [[{ node: "Deve transferir?", type: "main", index: 0 }]] },
      "Deve transferir?": { main: [[{ node: "Busca agentes", type: "main", index: 0 }]] },
      "Busca agentes": { main: [[{ node: "Escolhe agente humano", type: "main", index: 0 }]] },
      "Escolhe agente humano": { main: [[{ node: "Atribui ao humano", type: "main", index: 0 }]] }
    },
    pinData: {},
    settings: { executionOrder: "v1" }
  };
  return JSON.stringify(workflow, null, 2);
}

// Webhook /webhook/leads — contrato com o formulário do site (Módulo 5)
function buildLeadsWorkflowJson() {
  const workflow = {
    name: "Leads do Site",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "leads",
          responseMode: "onReceived",
          options: { allowedOrigins: "*" }
        },
        id: "webhook-leads",
        name: "Webhook Leads",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [240, 300],
        webhookId: "leads-webhook"
      },
      {
        parameters: {
          jsCode: [
            "const b = $input.first().json.body || {};",
            "const clean = (v) => String(v || '').trim().slice(0, 500);",
            "const lead = { nome: clean(b.nome), email: clean(b.email), whatsapp: clean(b.whatsapp), mensagem: clean(b.mensagem) };",
            "if (!lead.nome && !lead.email && !lead.whatsapp) { return []; }",
            "return [{ json: lead }];"
          ].join("\n")
        },
        id: "valida-lead",
        name: "Valida lead",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [460, 300]
      },
      {
        parameters: {
          operation: "executeQuery",
          query: [
            "create table if not exists site_leads (",
            "  id serial primary key,",
            "  nome text, email text, whatsapp text, mensagem text,",
            "  criado_em timestamptz default now()",
            ");",
            "insert into site_leads (nome, email, whatsapp, mensagem)",
            "values ($1, $2, $3, $4);"
          ].join("\n"),
          options: {
            queryReplacement: "={{ $json.nome }},{{ $json.email }},{{ $json.whatsapp }},{{ $json.mensagem }}"
          }
        },
        id: "salvar-lead",
        name: "Salvar lead",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [680, 300],
        credentials: {
          postgres: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "Postgres negocio" }
        }
      }
    ],
    connections: {
      "Webhook Leads": { main: [[{ node: "Valida lead", type: "main", index: 0 }]] },
      "Valida lead": { main: [[{ node: "Salvar lead", type: "main", index: 0 }]] }
    },
    pinData: {},
    settings: { executionOrder: "v1" }
  };
  return JSON.stringify(workflow, null, 2);
}

// Tabela de conversões (compartilhada pelos fluxos de vendas)
const CONVERSOES_DDL = "create table if not exists conversoes (id serial primary key, plataforma text, valor numeric, moeda text, email text, nome text, referencia text, criado_em timestamptz default now());";

// Webhook POST /webhook/vendas — checkout do Stripe (checkout.session.completed)
function buildVendasStripeWorkflowJson() {
  const workflow = {
    name: "Vendas - Stripe",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "vendas",
          responseMode: "onReceived",
          options: { allowedOrigins: "*" }
        },
        id: "webhook-vendas",
        name: "Webhook Vendas",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [240, 300],
        webhookId: "vendas-webhook"
      },
      {
        parameters: {
          jsCode: [
            "const evt = $input.first().json.body || {};",
            "const obj = (evt.data && evt.data.object) || {};",
            "// So registra checkout concluido",
            "if (evt.type !== 'checkout.session.completed') { return []; }",
            "const cents = Number(obj.amount_total || 0);",
            "const det = obj.customer_details || {};",
            "return [{ json: {",
            "  plataforma: 'stripe',",
            "  valor: cents / 100,",
            "  moeda: String(obj.currency || 'brl').toUpperCase(),",
            "  email: det.email || obj.customer_email || '',",
            "  nome: det.name || '',",
            "  referencia: String(obj.id || '')",
            "} }];"
          ].join("\n")
        },
        id: "extrai-venda",
        name: "Extrai venda",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [460, 300]
      },
      {
        parameters: {
          operation: "executeQuery",
          query: [
            CONVERSOES_DDL,
            "insert into conversoes (plataforma, valor, moeda, email, nome, referencia)",
            "values ($1, $2, $3, $4, $5, $6);"
          ].join("\n"),
          options: {
            queryReplacement: "={{ $json.plataforma }},{{ $json.valor }},{{ $json.moeda }},{{ $json.email }},{{ $json.nome }},{{ $json.referencia }}"
          }
        },
        id: "salvar-venda",
        name: "Salvar venda",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [680, 300],
        credentials: {
          postgres: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "Postgres negocio" }
        }
      }
    ],
    connections: {
      "Webhook Vendas": { main: [[{ node: "Extrai venda", type: "main", index: 0 }]] },
      "Extrai venda": { main: [[{ node: "Salvar venda", type: "main", index: 0 }]] }
    },
    pinData: {},
    settings: { executionOrder: "v1" }
  };
  return JSON.stringify(workflow, null, 2);
}

// Webhook POST /webhook/vendas — notificação do Mercado Pago (consulta a API p/ confirmar)
function buildVendasMPWorkflowJson() {
  const workflow = {
    name: "Vendas - Mercado Pago",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "vendas",
          responseMode: "onReceived",
          options: { allowedOrigins: "*" }
        },
        id: "webhook-vendas",
        name: "Webhook Vendas",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [240, 300],
        webhookId: "vendas-webhook"
      },
      {
        parameters: {
          jsCode: [
            "const b = $input.first().json.body || {};",
            "const q = $input.first().json.query || {};",
            "const tipo = b.type || b.topic || q.topic || q.type || '';",
            "// A notificacao de pagamento traz o id do pagamento em data.id",
            "let id = (b.data && b.data.id) || q['data.id'] || q.id || b.resource || '';",
            "id = String(id).replace(/\\D/g, '');",
            "if (String(tipo).indexOf('payment') === -1 || !id) { return []; }",
            "return [{ json: { paymentId: id } }];"
          ].join("\n")
        },
        id: "extrai-id",
        name: "Extrai id do pagamento",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [460, 300]
      },
      {
        parameters: {
          method: "GET",
          url: "=https://api.mercadopago.com/v1/payments/{{ $json.paymentId }}",
          authentication: "genericCredentialType",
          genericAuthType: "httpHeaderAuth",
          options: {}
        },
        id: "consulta-pagamento",
        name: "Consulta pagamento",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [680, 300],
        credentials: {
          httpHeaderAuth: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "Mercado Pago" }
        }
      },
      {
        parameters: {
          jsCode: [
            "const p = $input.first().json || {};",
            "// So registra pagamento aprovado",
            "if (p.status !== 'approved') { return []; }",
            "const payer = p.payer || {};",
            "return [{ json: {",
            "  plataforma: 'mercadopago',",
            "  valor: Number(p.transaction_amount || 0),",
            "  moeda: String(p.currency_id || 'BRL'),",
            "  email: payer.email || '',",
            "  nome: payer.first_name || '',",
            "  referencia: String(p.id || '')",
            "} }];"
          ].join("\n")
        },
        id: "filtra-aprovado",
        name: "Filtra aprovado",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [900, 300]
      },
      {
        parameters: {
          operation: "executeQuery",
          query: [
            CONVERSOES_DDL,
            "insert into conversoes (plataforma, valor, moeda, email, nome, referencia)",
            "values ($1, $2, $3, $4, $5, $6);"
          ].join("\n"),
          options: {
            queryReplacement: "={{ $json.plataforma }},{{ $json.valor }},{{ $json.moeda }},{{ $json.email }},{{ $json.nome }},{{ $json.referencia }}"
          }
        },
        id: "salvar-venda",
        name: "Salvar venda",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [1120, 300],
        credentials: {
          postgres: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "Postgres negocio" }
        }
      }
    ],
    connections: {
      "Webhook Vendas": { main: [[{ node: "Extrai id do pagamento", type: "main", index: 0 }]] },
      "Extrai id do pagamento": { main: [[{ node: "Consulta pagamento", type: "main", index: 0 }]] },
      "Consulta pagamento": { main: [[{ node: "Filtra aprovado", type: "main", index: 0 }]] },
      "Filtra aprovado": { main: [[{ node: "Salvar venda", type: "main", index: 0 }]] }
    },
    pinData: {},
    settings: { executionOrder: "v1" }
  };
  return JSON.stringify(workflow, null, 2);
}

// Webhook GET /webhook/painel-metricas — alimenta o dashboard do painel de gestão
// Formulario /form/fabrica-de-videos — Fábrica de Vídeos (setup no Módulo 4, ativação no Módulo 6)
// Aluno cola um roteiro de Reels; IA junta as falas com direção por pontuação (sem tags),
// HeyGen /v3/videos gera o vídeo vertical legendado (callback_url acorda o nó Wait; se o
// callback não vier, o fluxo confere o status a cada 90s), entrega vídeo + legenda no
// WhatsApp do dono e, se houver token Metricool (Advanced), cria o post como rascunho
// no planner (normalize da mídia → POST /v2/scheduler/posts com draft: true).
function buildFabricaVideosWorkflowJson() {
  const project = memberApp.state.project;
  const domain = project.domain || "seudominio.com.br";
  const evoKey = project.evolutionApiKey || "CHAVE_EVOLUTION_AQUI";

  // Normaliza o WhatsApp do dono: só dígitos e DDI 55 obrigatório — número local
  // (DDD + telefone, 10-11 dígitos) ganha o 55 na frente; testado: sem DDI a
  // Evolution responde 400 {"exists": false} e o aluno não entende o porquê.
  const rawWhats = String(project.ownerWhatsapp || "").replace(/\D/g, "");
  const whatsappDono = rawWhats
    ? (rawWhats.length <= 11 ? `55${rawWhats}` : rawWhats)
    : "5511999998888";

  const promptFabrica = [
    "Você prepara roteiros para a Fábrica de Vídeos — vídeos verticais com apresentador virtual e voz sintética (HeyGen).",
    "Você recebe um bloco de roteiro de Reels/Shorts: falas numeradas (Fala 1, Fala 2...) e, às vezes, uma legenda após \"📝 Legenda:\".",
    "",
    "Produza:",
    "1. script — as falas unidas em um texto corrido de narração, na ordem, exatamente como devem ser faladas. Aplique direção por pontuação: reticências (...) para pausas, travessão (—) para mudança de tom, vírgulas para ritmo. PROIBIDO: tags de emoção (ex.: [excited]), emojis, hashtags, títulos, marcações como \"Fala 1:\" e descrições de cena. A legenda embutida do vídeo é gerada palavra a palavra deste texto — escreva somente o que deve ser dito.",
    "2. legenda — o texto que vem após \"📝 Legenda:\". Se o bloco não tiver legenda, crie uma curta e natural (2 a 3 frases) com 3 a 5 hashtags.",
    "3. titulo — título interno curto (máximo 6 palavras, sem emojis) para identificar o vídeo.",
    "",
    "Se o texto recebido não parecer um roteiro, use-o assim mesmo como base do script, sem inventar conteúdo novo."
  ].join("\n");
  const promptJs = JSON.stringify(promptFabrica);

  const cfg = (name) => `$('Config').first().json.${name}`;
  const heygenHeaders = {
    parameters: [
      { name: "X-Api-Key", value: `={{ ${cfg("heygenApiKey")} }}` },
      { name: "Content-Type", value: "application/json" }
    ]
  };
  const metricoolAuth = { parameters: [{ name: "X-Mc-Auth", value: `={{ ${cfg("metricoolToken")} }}` }] };
  const metricoolQuery = [
    { name: "userId", value: `={{ ${cfg("metricoolUserId")} }}` },
    { name: "blogId", value: `={{ ${cfg("metricoolBlogId")} }}` }
  ];
  const pgCred = { postgres: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "Postgres negocio" } };

  const workflow = {
    name: "Fabrica de Videos",
    nodes: [
      {
        parameters: {
          content: [
            "# 🎬 FÁBRICA DE VÍDEOS — LEIA PRIMEIRO",
            "",
            "Cole um roteiro de Reels no formulário e receba o vídeo pronto (seu apresentador + legenda embutida) no WhatsApp.",
            "",
            "✅ ATIVAÇÃO (uma vez)",
            "1. Nó 'Prepara roteiro (IA)' → credencial OpenAI",
            "2. Nó 'Registra no banco' → credencial Postgres negocio",
            "3. Confira o nó Config: WhatsApp, chaves e evolutionInstance",
            "   (o nome EXATO da sua instância no manager da Evolution)",
            "4. No nó 'Formulario Fabrica', digite 'fabrica-de-videos' no",
            "   campo Form Path (o n8n troca por um código aleatório ao",
            "   importar — este passo devolve a URL fixa)",
            "5. Ligue a chave ACTIVE do workflow",
            "",
            `🔗 Formulário: https://workflows.${domain}/form/fabrica-de-videos`,
            "   (ou a Production URL exibida no nó do formulário)",
            "",
            "💰 ~US$ 1 por vídeo de ~20s (crédito de API do HeyGen)",
            "⏱️ ~2 a 3 minutos por vídeo",
            "⚠️ O link do HeyGen expira em ~7 dias — o vídeo entregue no WhatsApp é seu para sempre."
          ].join("\n"),
          height: 560,
          width: 380,
          color: 4
        },
        id: "sticky-guia",
        name: "Guia de ativacao",
        type: "n8n-nodes-base.stickyNote",
        typeVersion: 1,
        position: [-240, 40]
      },
      {
        parameters: {
          content: [
            "# ⏳ COMO A ESPERA FUNCIONA",
            "",
            "O formulário responde na hora; o vídeo continua sendo gerado em segundo plano.",
            "O HeyGen avisa quando termina (callback acorda o nó 'Espera o render').",
            "Se o aviso não vier, o fluxo confere o status sozinho a cada 90 segundos.",
            "Se o HeyGen recusar o pedido (quase sempre crédito de API zerado), você recebe o aviso no WhatsApp."
          ].join("\n"),
          height: 260,
          width: 420,
          color: 5
        },
        id: "sticky-espera",
        name: "Nota da espera",
        type: "n8n-nodes-base.stickyNote",
        typeVersion: 1,
        position: [1240, 420]
      },
      {
        parameters: {
          content: [
            "# 🗓️ METRICOOL (OPCIONAL)",
            "",
            "SEM token: vídeo + legenda chegam no WhatsApp e você agenda manualmente no planner (qualquer plano).",
            "",
            "COM token (plano Advanced): o fluxo copia o vídeo para o Metricool e cria um RASCUNHO para amanhã às 10h — revise, ajuste a data e confirme no planner.",
            "",
            "Preencha metricoolToken / metricoolUserId / metricoolBlogId no nó Config (ou nos campos do app antes de baixar este arquivo)."
          ].join("\n"),
          height: 320,
          width: 400,
          color: 6
        },
        id: "sticky-metricool",
        name: "Nota do Metricool",
        type: "n8n-nodes-base.stickyNote",
        typeVersion: 1,
        position: [3020, -240]
      },
      {
        parameters: {
          path: "fabrica-de-videos",
          formTitle: "Fabrica de Videos",
          formDescription: "Cole um roteiro de Reels/Shorts do Modulo 4 (o bloco inteiro, do 🎬 ate a legenda). O video pronto chega no seu WhatsApp em ~3 minutos. Custo: ~US$ 1 do seu credito HeyGen.",
          formFields: {
            values: [
              {
                fieldLabel: "Roteiro do video",
                fieldType: "textarea",
                requiredField: true,
                placeholder: "🎬 REELS / SHORTS — [data] — [tema]  |  Fala 1: ...  Fala 2: ...  |  📝 Legenda: ..."
              }
            ]
          },
          responseMode: "onReceived",
          options: { appendAttribution: false, buttonLabel: "Gerar video" }
        },
        id: "form-fabrica",
        name: "Formulario Fabrica",
        type: "n8n-nodes-base.formTrigger",
        typeVersion: 2.2,
        position: [200, 140],
        webhookId: "fabrica-de-videos-form"
      },
      {
        parameters: {
          assignments: {
            assignments: [
              { id: "cfg-1", name: "heygenApiKey", type: "string", value: project.heygenApiKey || "COLE_SUA_CHAVE_HEYGEN" },
              { id: "cfg-2", name: "heygenAvatarId", type: "string", value: project.heygenAvatarId || "COLE_O_ID_DO_APRESENTADOR" },
              { id: "cfg-3", name: "heygenVoiceId", type: "string", value: project.heygenVoiceId || "COLE_O_ID_DA_VOZ" },
              { id: "cfg-4", name: "whatsappDono", type: "string", value: whatsappDono },
              { id: "cfg-8", name: "evolutionInstance", type: "string", value: "atendimento" },
              { id: "cfg-5", name: "metricoolToken", type: "string", value: project.metricoolToken || "" },
              { id: "cfg-6", name: "metricoolUserId", type: "string", value: project.metricoolUserId || "" },
              { id: "cfg-7", name: "metricoolBlogId", type: "string", value: project.metricoolBlogId || "" }
            ]
          },
          includeOtherFields: true,
          options: {}
        },
        id: "config-fabrica",
        name: "Config",
        type: "n8n-nodes-base.set",
        typeVersion: 3.4,
        position: [420, 140]
      },
      {
        parameters: {
          method: "POST",
          url: "https://api.openai.com/v1/responses",
          authentication: "predefinedCredentialType",
          nodeCredentialType: "openAiApi",
          sendBody: true,
          specifyBody: "json",
          jsonBody: "={{ JSON.stringify({ model: 'gpt-4o-mini', input: [{ role: 'system', content: " + promptJs + " }, { role: 'user', content: String($('Formulario Fabrica').first().json['Roteiro do video'] || '') }], text: { format: { type: 'json_schema', name: 'fabrica_videos', strict: true, schema: { type: 'object', additionalProperties: false, required: ['script', 'legenda', 'titulo'], properties: { script: { type: 'string' }, legenda: { type: 'string' }, titulo: { type: 'string' } } } } } }) }}",
          options: {}
        },
        id: "prepara-roteiro",
        name: "Prepara roteiro (IA)",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [640, 140],
        credentials: {
          openAiApi: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "OpenAi account" }
        }
      },
      {
        parameters: {
          jsCode: [
            "// Extrai o JSON da Responses API (itens type=message > content > text)",
            "const r = $input.first().json;",
            "const bruto = (r.output || [])",
            "  .flatMap((item) => item.content || [])",
            "  .map((c) => c.text || '')",
            "  .join('').trim();",
            "let script = bruto; let legenda = ''; let titulo = 'Video da Fabrica';",
            "try { const p = JSON.parse(bruto); script = String(p.script || bruto); legenda = String(p.legenda || ''); titulo = String(p.titulo || titulo); } catch {}",
            "if (!script) throw new Error('Roteiro vazio — cole o bloco completo no formulario.');",
            "if (!legenda) legenda = 'Video novo no ar!';",
            "return [{ json: { script, legenda, titulo } }];"
          ].join("\n")
        },
        id: "extrai-resultado",
        name: "Extrai resultado",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [860, 140]
      },
      {
        parameters: {
          method: "POST",
          url: "https://api.heygen.com/v3/videos",
          sendHeaders: true,
          headerParameters: heygenHeaders,
          sendBody: true,
          specifyBody: "json",
          jsonBody: `={{ JSON.stringify({ type: 'avatar', avatar_id: ${cfg("heygenAvatarId")}, script: $json.script, voice_id: ${cfg("heygenVoiceId")}, aspect_ratio: '9:16', resolution: '1080p', fit: 'cover', caption: { file_format: 'srt', style: 'default' }, title: 'Fabrica: ' + $json.titulo, callback_url: $execution.resumeUrl }) }}`,
          options: {}
        },
        id: "cria-video",
        name: "Cria video HeyGen",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [1080, 140],
        onError: "continueErrorOutput"
      },
      {
        parameters: {
          resume: "webhook",
          httpMethod: "POST",
          limitWaitTime: true,
          limitType: "afterTimeInterval",
          resumeAmount: 25,
          resumeUnit: "minutes",
          options: {}
        },
        id: "espera-render",
        name: "Espera o render",
        type: "n8n-nodes-base.wait",
        typeVersion: 1.1,
        position: [1300, 60],
        webhookId: "fabrica-espera-render"
      },
      {
        parameters: {
          url: "=https://api.heygen.com/v3/videos/{{ $('Cria video HeyGen').first().json.data.video_id }}",
          sendHeaders: true,
          headerParameters: { parameters: [{ name: "X-Api-Key", value: `={{ ${cfg("heygenApiKey")} }}` }] },
          options: {}
        },
        id: "consulta-status",
        name: "Consulta status",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [1520, 60]
      },
      {
        parameters: {
          rules: {
            values: [
              {
                conditions: {
                  options: { caseSensitive: true, leftValue: "", typeValidation: "loose" },
                  conditions: [{ leftValue: "={{ $json.data.status }}", rightValue: "completed", operator: { type: "string", operation: "equals" } }],
                  combinator: "and"
                },
                renameOutput: true,
                outputKey: "pronto"
              },
              {
                conditions: {
                  options: { caseSensitive: true, leftValue: "", typeValidation: "loose" },
                  conditions: [{ leftValue: "={{ $json.data.status }}", rightValue: "failed", operator: { type: "string", operation: "equals" } }],
                  combinator: "and"
                },
                renameOutput: true,
                outputKey: "falhou"
              }
            ]
          },
          options: { fallbackOutput: "extra", renameFallbackOutput: "renderizando" }
        },
        id: "status-video",
        name: "Status do video",
        type: "n8n-nodes-base.switch",
        typeVersion: 3.2,
        position: [1740, 60]
      },
      {
        parameters: { amount: 90, unit: "seconds" },
        id: "aguarda-mais",
        name: "Aguarda mais",
        type: "n8n-nodes-base.wait",
        typeVersion: 1.1,
        position: [1740, -140],
        webhookId: "fabrica-aguarda-mais"
      },
      {
        parameters: {
          jsCode: [
            "const d = $('Consulta status').first().json.data || {};",
            "const r = $('Extrai resultado').first().json;",
            "const videoUrl = d.captioned_video_url || d.video_url || '';",
            "if (!videoUrl) throw new Error('HeyGen concluiu sem URL de video.');",
            "// Rascunho do Metricool entra para amanha as 10h — o aluno reagenda no planner",
            "const alvo = new Date(Date.now() + 24 * 60 * 60 * 1000);",
            "const pad = (n) => String(n).padStart(2, '0');",
            "const dataAgendamento = alvo.getFullYear() + '-' + pad(alvo.getMonth() + 1) + '-' + pad(alvo.getDate()) + 'T10:00:00';",
            "return [{ json: { videoUrl, legenda: r.legenda, titulo: r.titulo, dataAgendamento } }];"
          ].join("\n")
        },
        id: "prepara-entrega",
        name: "Prepara entrega",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [1960, 40]
      },
      {
        parameters: {
          operation: "executeQuery",
          query: [
            "create table if not exists videos_gerados (id serial primary key, titulo text, legenda text, video_url text, criado_em timestamptz default now());",
            "insert into videos_gerados (titulo, legenda, video_url) values ($1, $2, $3);"
          ].join("\n"),
          options: { queryReplacement: "={{ [$json.titulo, $json.legenda, $json.videoUrl] }}" }
        },
        id: "registra-banco",
        name: "Registra no banco",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [2180, 40],
        credentials: pgCred,
        onError: "continueRegularOutput"
      },
      {
        parameters: {
          method: "POST",
          url: `=https://evo.${domain}/message/sendMedia/{{ $('Config').first().json.evolutionInstance }}`,
          sendHeaders: true,
          headerParameters: { parameters: [{ name: "apikey", value: evoKey }] },
          sendBody: true,
          specifyBody: "json",
          jsonBody: `={{ JSON.stringify({ number: ${cfg("whatsappDono")}, mediatype: 'video', mimetype: 'video/mp4', fileName: 'fabrica-video.mp4', caption: '🎬 Video pronto: ' + $('Prepara entrega').first().json.titulo, media: $('Prepara entrega').first().json.videoUrl }) }}`,
          options: {}
        },
        id: "envia-video",
        name: "Envia video no WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [2400, 40]
      },
      {
        parameters: {
          method: "POST",
          url: `=https://evo.${domain}/message/sendText/{{ $('Config').first().json.evolutionInstance }}`,
          sendHeaders: true,
          headerParameters: { parameters: [{ name: "apikey", value: evoKey }] },
          sendBody: true,
          specifyBody: "json",
          jsonBody: `={{ JSON.stringify({ number: ${cfg("whatsappDono")}, text: '📝 Legenda pronta — copie e cole ao publicar:\\n\\n' + $('Prepara entrega').first().json.legenda }) }}`,
          options: {}
        },
        id: "envia-legenda",
        name: "Envia legenda no WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [2620, 40]
      },
      {
        parameters: {
          conditions: {
            options: { caseSensitive: true, leftValue: "", typeValidation: "loose" },
            conditions: [
              { id: "cond-metricool", leftValue: `={{ ${cfg("metricoolToken")} }}`, rightValue: "", operator: { type: "string", operation: "notEmpty", singleValue: true } }
            ],
            combinator: "and"
          },
          options: {}
        },
        id: "tem-metricool",
        name: "Metricool configurado?",
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        position: [2840, 40]
      },
      {
        parameters: {
          url: "https://app.metricool.com/api/actions/normalize/image/url",
          sendQuery: true,
          queryParameters: {
            parameters: [
              { name: "url", value: "={{ $('Prepara entrega').first().json.videoUrl }}" },
              ...metricoolQuery
            ]
          },
          sendHeaders: true,
          headerParameters: metricoolAuth,
          options: {}
        },
        id: "copia-metricool",
        name: "Copia video para o Metricool",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [3060, -60]
      },
      {
        parameters: {
          method: "POST",
          url: "https://app.metricool.com/api/v2/scheduler/posts",
          sendQuery: true,
          queryParameters: { parameters: [...metricoolQuery] },
          sendHeaders: true,
          headerParameters: {
            parameters: [...metricoolAuth.parameters, { name: "Content-Type", value: "application/json" }]
          },
          sendBody: true,
          specifyBody: "json",
          jsonBody: "={{ JSON.stringify({ publicationDate: { dateTime: $('Prepara entrega').first().json.dataAgendamento, timezone: 'America/Sao_Paulo' }, text: $('Prepara entrega').first().json.legenda, providers: [{ network: 'instagram' }], media: [ $json.url || ($json.data && $json.data.url) || (typeof $json.data === 'string' ? $json.data : '') ], autoPublish: false, draft: true, saveExternalMediaFiles: false, shortener: false }) }}",
          options: {}
        },
        id: "rascunho-metricool",
        name: "Cria rascunho no Metricool",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [3280, -60]
      },
      {
        parameters: {
          method: "POST",
          url: `=https://evo.${domain}/message/sendText/{{ $('Config').first().json.evolutionInstance }}`,
          sendHeaders: true,
          headerParameters: { parameters: [{ name: "apikey", value: evoKey }] },
          sendBody: true,
          specifyBody: "json",
          jsonBody: `={{ JSON.stringify({ number: ${cfg("whatsappDono")}, text: '🗓️ Tambem criei o rascunho no Metricool (amanha, 10h). Abra o planner para revisar, ajustar a data e confirmar.' }) }}`,
          options: {}
        },
        id: "avisa-rascunho",
        name: "Avisa rascunho no WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [3500, -60]
      },
      {
        parameters: {
          method: "POST",
          url: `=https://evo.${domain}/message/sendText/{{ $('Config').first().json.evolutionInstance }}`,
          sendHeaders: true,
          headerParameters: { parameters: [{ name: "apikey", value: evoKey }] },
          sendBody: true,
          specifyBody: "json",
          jsonBody: `={{ JSON.stringify({ number: ${cfg("whatsappDono")}, text: '⚠️ A Fabrica nao conseguiu gerar este video. Confira o credito de API no HeyGen (app.heygen.com → Billing → API) e envie o roteiro de novo. Detalhe: ' + JSON.stringify(($json.data && $json.data.error) || $json.error || $json.message || 'sem detalhe').slice(0, 300) }) }}`,
          options: {}
        },
        id: "avisa-problema",
        name: "Avisa problema no WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [1960, 320]
      }
    ],
    connections: {
      "Formulario Fabrica": { main: [[{ node: "Config", type: "main", index: 0 }]] },
      "Config": { main: [[{ node: "Prepara roteiro (IA)", type: "main", index: 0 }]] },
      "Prepara roteiro (IA)": { main: [[{ node: "Extrai resultado", type: "main", index: 0 }]] },
      "Extrai resultado": { main: [[{ node: "Cria video HeyGen", type: "main", index: 0 }]] },
      "Cria video HeyGen": {
        main: [
          [{ node: "Espera o render", type: "main", index: 0 }],
          [{ node: "Avisa problema no WhatsApp", type: "main", index: 0 }]
        ]
      },
      "Espera o render": { main: [[{ node: "Consulta status", type: "main", index: 0 }]] },
      "Consulta status": { main: [[{ node: "Status do video", type: "main", index: 0 }]] },
      "Status do video": {
        main: [
          [{ node: "Prepara entrega", type: "main", index: 0 }],
          [{ node: "Avisa problema no WhatsApp", type: "main", index: 0 }],
          [{ node: "Aguarda mais", type: "main", index: 0 }]
        ]
      },
      "Aguarda mais": { main: [[{ node: "Consulta status", type: "main", index: 0 }]] },
      "Prepara entrega": { main: [[{ node: "Registra no banco", type: "main", index: 0 }]] },
      "Registra no banco": { main: [[{ node: "Envia video no WhatsApp", type: "main", index: 0 }]] },
      "Envia video no WhatsApp": { main: [[{ node: "Envia legenda no WhatsApp", type: "main", index: 0 }]] },
      "Envia legenda no WhatsApp": { main: [[{ node: "Metricool configurado?", type: "main", index: 0 }]] },
      "Metricool configurado?": {
        main: [
          [{ node: "Copia video para o Metricool", type: "main", index: 0 }],
          []
        ]
      },
      "Copia video para o Metricool": { main: [[{ node: "Cria rascunho no Metricool", type: "main", index: 0 }]] },
      "Cria rascunho no Metricool": { main: [[{ node: "Avisa rascunho no WhatsApp", type: "main", index: 0 }]] }
    },
    pinData: {},
    settings: { executionOrder: "v1" }
  };
  return JSON.stringify(workflow, null, 2);
}

function buildMetricsWorkflowJson() {
  const workflow = {
    name: "Painel - Metricas",
    nodes: [
      {
        parameters: {
          httpMethod: "GET",
          path: "painel-metricas",
          responseMode: "lastNode",
          options: { allowedOrigins: "*" }
        },
        id: "webhook-metricas",
        name: "Webhook Metricas",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [240, 300],
        webhookId: "painel-metricas-webhook"
      },
      {
        parameters: {
          operation: "executeQuery",
          query: [
            "create table if not exists site_leads (id serial primary key, nome text, email text, whatsapp text, mensagem text, criado_em timestamptz default now());",
            CONVERSOES_DDL,
            "select",
            "  (select count(*) from site_leads) as total_leads,",
            "  (select count(*) from site_leads where criado_em > now() - interval '7 days') as leads_7d,",
            "  (select count(*) from conversoes where criado_em > now() - interval '7 days') as conversoes_7d,",
            "  (select coalesce(json_agg(t), '[]'::json) from (",
            "    select nome, email, whatsapp, mensagem, to_char(criado_em, 'DD/MM/YYYY HH24:MI') as data",
            "    from site_leads order by criado_em desc limit 10",
            "  ) t) as ultimos;"
          ].join("\n"),
          options: {}
        },
        id: "consulta-metricas",
        name: "Consulta metricas",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [460, 300],
        credentials: {
          postgres: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "Postgres negocio" }
        }
      }
    ],
    connections: {
      "Webhook Metricas": { main: [[{ node: "Consulta metricas", type: "main", index: 0 }]] }
    },
    pinData: {},
    settings: { executionOrder: "v1" }
  };
  return JSON.stringify(workflow, null, 2);
}

// DDL das tabelas de conversas do Conselho (usado em várias queries)
const CONSELHO_DDL = [
  "create table if not exists conselho_contexto (id serial primary key, conteudo text, criado_em timestamptz default now());",
  "create table if not exists conselho_conversas (id serial primary key, titulo text, criado_em timestamptz default now(), atualizado_em timestamptz default now());",
  "create table if not exists conselho_mensagens (id serial primary key, conversa_id int, papel text, conteudo text, criado_em timestamptz default now());",
  "create table if not exists site_leads (id serial primary key, nome text, email text, whatsapp text, mensagem text, criado_em timestamptz default now());",
  CONVERSOES_DDL
].join("\n");

// Webhook POST /webhook/conselho — Conselho de IA persistente (roteador por action)
// actions: listar (conversas) · carregar (mensagens de uma conversa) · perguntar (default)
function buildConselhoWorkflowJson() {
  const projectName = memberApp.state.project.name || "o negócio";

  // Prompt do Conselho embutido no nó Code "Monta mensagens" (linhas de um array JS)
  const promptLines = [
    `Você é o Conselho de IA de ${projectName} — três especialistas seniores:`,
    "- Ana (Administração): fluxo de caixa, precificação, capacidade de entrega, organização da operação.",
    "- Marcos (Marketing): aquisição, conteúdo, tráfego, posicionamento e conversão.",
    "- Vera (Vendas): funil, follow-up de leads, atendimento, fechamento e recuperação.",
    "",
    "QUEM RESPONDE:",
    "- Se a pergunta cita um ou mais especialistas pelo nome (Ana, Marcos, Vera), APENAS os citados respondem.",
    "- Se nenhum nome é citado, os três respondem.",
    "- A linha 'Recomendação do Conselho' só aparece quando os três participam OU quando o usuário pede uma recomendação/decisão. Com um ou dois especialistas, encerre sem essa linha.",
    "",
    "Baseie-se no CONTEXTO ESTRATÉGICO e nas MÉTRICAS fornecidas — nunca invente números. Use o histórico da conversa para dar continuidade.",
    "",
    "Formato (WhatsApp-friendly, máx ~250 palavras): cada especialista que responde começa com o nome em negrito e escreve 1-3 frases. Quando aplicável, feche com '**Recomendação do Conselho**: UMA ação prioritária e executável, com o porquê.'",
    "Se faltar dado, diga o que medir e como coletar. Português, direto, sem jargões."
  ];
  // Serializa as linhas do prompt como um array JS literal para dentro do jsCode
  const promptJsArray = JSON.stringify(promptLines);

  const pgCred = { postgres: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "Postgres negocio" } };

  const workflow = {
    name: "Conselho de IA",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "conselho",
          responseMode: "lastNode",
          options: { allowedOrigins: "*" }
        },
        id: "webhook-conselho",
        name: "Webhook Conselho",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [200, 400],
        webhookId: "conselho-webhook"
      },
      {
        parameters: {
          rules: {
            values: [
              {
                conditions: {
                  options: { caseSensitive: true, leftValue: "", typeValidation: "loose" },
                  conditions: [{ leftValue: "={{ $json.body.action }}", rightValue: "listar", operator: { type: "string", operation: "equals" } }],
                  combinator: "and"
                },
                renameOutput: true,
                outputKey: "listar"
              },
              {
                conditions: {
                  options: { caseSensitive: true, leftValue: "", typeValidation: "loose" },
                  conditions: [{ leftValue: "={{ $json.body.action }}", rightValue: "carregar", operator: { type: "string", operation: "equals" } }],
                  combinator: "and"
                },
                renameOutput: true,
                outputKey: "carregar"
              }
            ]
          },
          options: { fallbackOutput: "extra", renameFallbackOutput: "perguntar" }
        },
        id: "roteia-acao",
        name: "Roteia acao",
        type: "n8n-nodes-base.switch",
        typeVersion: 3.2,
        position: [420, 400]
      },
      // ── Branch listar ──────────────────────────────────────────────
      {
        parameters: {
          operation: "executeQuery",
          query: [
            CONSELHO_DDL,
            "select coalesce(json_agg(json_build_object('id', id, 'titulo', titulo, 'atualizado_em', to_char(atualizado_em,'DD/MM HH24:MI')) order by atualizado_em desc), '[]'::json) as conversas from conselho_conversas;"
          ].join("\n"),
          options: {}
        },
        id: "lista-conversas",
        name: "Lista conversas",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [660, 220],
        credentials: pgCred
      },
      // ── Branch carregar ────────────────────────────────────────────
      {
        parameters: {
          operation: "executeQuery",
          query: [
            CONSELHO_DDL,
            "select coalesce(json_agg(json_build_object('papel', papel, 'conteudo', conteudo) order by id), '[]'::json) as mensagens from conselho_mensagens where conversa_id = $1;"
          ].join("\n"),
          options: { queryReplacement: "={{ $json.body.conversation_id }}" }
        },
        id: "carrega-mensagens",
        name: "Carrega mensagens",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [660, 400],
        credentials: pgCred
      },
      // ── Branch perguntar ───────────────────────────────────────────
      {
        parameters: {
          jsCode: [
            "const b = $input.first().json.body || {};",
            "const pergunta = String(b.pergunta || '').trim();",
            "const conversaId = Number(b.conversation_id || 0) || 0;",
            "const titulo = pergunta.slice(0, 48) || 'Nova conversa';",
            "return [{ json: { pergunta, conversaId, titulo } }];"
          ].join("\n")
        },
        id: "prep-pergunta",
        name: "Prep pergunta",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [660, 600]
      },
      {
        parameters: {
          operation: "executeQuery",
          query: [
            CONSELHO_DDL,
            "with nova as (",
            "  insert into conselho_conversas (titulo) select $1 where $2 = 0 returning id",
            "), cid as (",
            "  select coalesce((select id from nova), $2) as id",
            "), ins as (",
            "  insert into conselho_mensagens (conversa_id, papel, conteudo) select id, 'user', $3 from cid",
            ")",
            "select id as conversa_id from cid;"
          ].join("\n"),
          options: { queryReplacement: "={{ $json.titulo }},{{ $json.conversaId }},{{ $json.pergunta }}" }
        },
        id: "abre-conversa",
        name: "Abre conversa e salva pergunta",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [880, 600],
        credentials: pgCred
      },
      {
        parameters: {
          operation: "executeQuery",
          query: [
            "select",
            "  coalesce((select conteudo from conselho_contexto order by id desc limit 1), 'Contexto estrategico ainda nao cadastrado.') as contexto,",
            "  (select count(*) from site_leads) as total_leads,",
            "  (select count(*) from site_leads where criado_em > now() - interval '7 days') as leads_7d,",
            "  (select count(*) from conversoes where criado_em > now() - interval '7 days') as conversoes_7d,",
            "  coalesce((select json_agg(json_build_object('papel', papel, 'conteudo', conteudo) order by id) from conselho_mensagens where conversa_id = $1), '[]'::json) as historico;"
          ].join("\n"),
          options: { queryReplacement: "={{ $json.conversa_id }}" }
        },
        id: "carrega-contexto",
        name: "Carrega contexto e historico",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [1100, 600],
        credentials: pgCred
      },
      {
        parameters: {
          jsCode: [
            "const d = $input.first().json;",
            "const historico = d.historico || [];",
            "const promptLines = " + promptJsArray + ";",
            "const sys = promptLines.join('\\n')",
            "  + '\\n\\n## Contexto estrategico do negocio\\n' + (d.contexto || '')",
            "  + '\\n\\n## Metricas atuais\\n'",
            "  + 'Leads (total): ' + d.total_leads + ' | Leads 7 dias: ' + d.leads_7d + ' | Conversoes 7 dias: ' + d.conversoes_7d;",
            "const messages = [{ role: 'system', content: sys }];",
            "for (const m of historico) {",
            "  messages.push({ role: m.papel === 'assistant' ? 'assistant' : 'user', content: m.conteudo });",
            "}",
            "return [{ json: { model: 'gpt-4o', messages } }];"
          ].join("\n")
        },
        id: "monta-mensagens",
        name: "Monta mensagens",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [1320, 600]
      },
      {
        parameters: {
          method: "POST",
          url: "https://api.openai.com/v1/responses",
          authentication: "predefinedCredentialType",
          nodeCredentialType: "openAiApi",
          sendBody: true,
          specifyBody: "json",
          jsonBody: "={{ JSON.stringify({ model: $json.model, input: $json.messages }) }}",
          options: {}
        },
        id: "openai",
        name: "OpenAI",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [1540, 600],
        credentials: {
          openAiApi: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "OpenAi account" }
        }
      },
      {
        parameters: {
          jsCode: [
            "// Extrai o texto da Responses API (itens type=message > content > text)",
            "const r = $input.first().json;",
            "const resposta = ((r.output || [])",
            "  .flatMap((item) => item.content || [])",
            "  .map((c) => c.text || '')",
            "  .join('').trim()) || 'Nao consegui responder agora. Tente novamente.';",
            "const conversaId = $('Abre conversa e salva pergunta').first().json.conversa_id;",
            "return [{ json: { resposta, conversa_id: conversaId } }];"
          ].join("\n")
        },
        id: "extrai-resposta",
        name: "Extrai resposta",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [1760, 600]
      },
      {
        parameters: {
          operation: "executeQuery",
          query: [
            "insert into conselho_mensagens (conversa_id, papel, conteudo) values ($1, 'assistant', $2);",
            "update conselho_conversas set atualizado_em = now() where id = $1;"
          ].join("\n"),
          options: { queryReplacement: "={{ $json.conversa_id }},{{ $json.resposta }}" }
        },
        id: "salva-resposta",
        name: "Salva resposta",
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.4,
        position: [1980, 600],
        credentials: pgCred
      },
      {
        parameters: {
          assignments: {
            assignments: [
              { id: "r1", name: "resposta", value: "={{ $('Extrai resposta').first().json.resposta }}", type: "string" },
              { id: "r2", name: "conversation_id", value: "={{ $('Extrai resposta').first().json.conversa_id }}", type: "number" }
            ]
          },
          options: {}
        },
        id: "responde",
        name: "Responde",
        type: "n8n-nodes-base.set",
        typeVersion: 3.4,
        position: [2200, 600]
      }
    ],
    connections: {
      "Webhook Conselho": { main: [[{ node: "Roteia acao", type: "main", index: 0 }]] },
      "Roteia acao": {
        main: [
          [{ node: "Lista conversas", type: "main", index: 0 }],
          [{ node: "Carrega mensagens", type: "main", index: 0 }],
          [{ node: "Prep pergunta", type: "main", index: 0 }]
        ]
      },
      "Prep pergunta": { main: [[{ node: "Abre conversa e salva pergunta", type: "main", index: 0 }]] },
      "Abre conversa e salva pergunta": { main: [[{ node: "Carrega contexto e historico", type: "main", index: 0 }]] },
      "Carrega contexto e historico": { main: [[{ node: "Monta mensagens", type: "main", index: 0 }]] },
      "Monta mensagens": { main: [[{ node: "OpenAI", type: "main", index: 0 }]] },
      "OpenAI": { main: [[{ node: "Extrai resposta", type: "main", index: 0 }]] },
      "Extrai resposta": { main: [[{ node: "Salva resposta", type: "main", index: 0 }]] },
      "Salva resposta": { main: [[{ node: "Responde", type: "main", index: 0 }]] }
    },
    pinData: {},
    settings: { executionOrder: "v1" }
  };
  return JSON.stringify(workflow, null, 2);
}

function buildInfraDocument() {
  const project = memberApp.state.project;
  const domain = project.domain || "(nao registrado)";
  return [
    `# Infraestrutura Digital — ${domain}`,
    ``,
    `Gerado em ${new Date().toLocaleDateString("pt-BR")} pela area de membros Axon.`,
    ``,
    `## Dados principais`,
    ``,
    `- Dominio: ${domain}`,
    `- IP da VPS: ${project.serverIp || "(nao registrado)"}`,
    `- E-mail tecnico: ${project.technicalEmail || "(nao registrado)"}`,
    ``,
    `## Enderecos dos servicos`,
    ``,
    `- Painel (Portainer): https://painel.${project.domain || "SEU_DOMINIO"}`,
    `- Workflows (n8n): https://workflows.${project.domain || "SEU_DOMINIO"}`,
    `- Webhooks: https://webhooks.${project.domain || "SEU_DOMINIO"}`,
    `- Site: https://${project.domain || "SEU_DOMINIO"} (publicacao no Modulo 5)`,
    ``,
    `## Stack instalada`,
    ``,
    `- VPS Ubuntu 24.04 (Hostinger KVM 2, regiao Sao Paulo)`,
    `- Docker Swarm (no manager: manager01)`,
    `- Traefik (proxy publico com HTTPS Let's Encrypt)`,
    `- Portainer (painel de operacao)`,
    `- PostgreSQL 16 + pgvector (banco axon_ops, usuario axon_app)`,
    `- n8n em fila (editor, webhook, worker, runners) + Redis`,
    ``,
    `## Acessos que voce deve guardar por conta propria`,
    ``,
    `As senhas nao ficam salvas na area de membros. Garanta que voce anotou:`,
    ``,
    `- Senha root da VPS`,
    `- Usuario e senha do Portainer`,
    `- Senha do Postgres (superusuario e axon_app)`,
    `- N8N_ENCRYPTION_KEY e N8N_RUNNERS_AUTH_TOKEN`
  ].join("\n");
}

function buildLessonStepContent(step, lesson) {
  // Campos de dados do projeto — substituem o checklist nas etapas que geram dados
  // Campos marcados como inline:true são renderizados dentro do tutorial item que os referencia
  const fields = (step.fields || []).filter(f => !f.inline).map((field) => {
    const value = memberApp.state.project[field.key] || "";
    return `
      <label class="wizard-data-field${value ? " is-filled" : ""}">
        <span>${escapeHtml(field.label)}</span>
        <span class="wizard-data-input">
          <input data-project-field="${field.key}" placeholder="${escapeHtml(field.placeholder || "")}" value="${escapeHtml(value)}" />
          <svg class="field-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
        </span>
      </label>
    `;
  }).join("");
  const fieldsHtml = fields ? `<div class="wizard-data-fields">${fields}</div>` : "";

  // Tutorial passo a passo (etapas com campo tutorial[])
  const tutorialHtml = (step.tutorial || []).map((block) => {
    const cmdHtml = block.command
      ? `<div class="inline-command"><pre class="command-box"><code>${escapeHtml(fillTemplate(block.command))}</code></pre><button class="btn-copy-inline" type="button" data-copy-command title="Copiar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>`
      : "";
    let inlineFieldHtml = "";
    const blockFieldKeys = block.fields || (block.field ? [block.field] : []);
    if (blockFieldKeys.length) {
      const inner = blockFieldKeys.map((key) => {
        const fieldDef = (step.fields || []).find(f => f.key === key);
        if (!fieldDef) return "";
        const value = memberApp.state.project[fieldDef.key] || "";
        return `<label class="wizard-data-field${value ? " is-filled" : ""}"><span>${escapeHtml(fieldDef.label)}</span><span class="wizard-data-input"><input data-project-field="${escapeHtml(fieldDef.key)}" placeholder="${escapeHtml(fieldDef.placeholder || "")}" value="${escapeHtml(value)}" /><svg class="field-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span></label>`;
      }).join("");
      if (inner) inlineFieldHtml = `<div class="wizard-data-fields">${inner}</div>`;
    }
    let generateHtml = "";
    if (block.generate) {
      const gen = block.generate;
      const cached = contentCache[gen.id];
      if (gen.type === "text") {
        generateHtml = `
          <div class="generate-block" data-generate-id="${escapeHtml(gen.id)}">
            <button class="button button-primary btn-generate" type="button"
              data-generate-id="${escapeHtml(gen.id)}"
              data-generate-type="text"
              data-generate-loading="${escapeHtml(gen.loadingMessage || "Gerando...")}">
              ${cached ? "Gerar novamente" : escapeHtml(gen.label)}
            </button>
            <div class="generate-status hidden" id="generate-status-${escapeHtml(gen.id)}"></div>
            <div class="generate-output hidden" id="generate-result-${escapeHtml(gen.id)}"></div>
          </div>`;
      } else if (gen.type === "image") {
        const cachedImg = contentCache[gen.id];
        generateHtml = `
          <div class="generate-block" data-generate-id="${escapeHtml(gen.id)}">
            <label class="generate-brief-label" for="generate-brief-${escapeHtml(gen.id)}">Instruções personalizadas (opcional)</label>
            <textarea class="generate-feedback-input" id="generate-brief-${escapeHtml(gen.id)}" placeholder="Se você já tem logo, nome, conceito ou uma ideia de peça, descreva aqui — o agente vai priorizar. Deixe em branco para criar do zero a partir do seu planejamento."></textarea>
            <button class="button button-primary btn-generate" type="button"
              data-generate-id="${escapeHtml(gen.id)}"
              data-generate-type="image"
              data-generate-loading="${escapeHtml(gen.loadingMessage || "Gerando imagem...")}">
              ${escapeHtml(gen.label)}
            </button>
            <div class="generate-status hidden" id="generate-status-${escapeHtml(gen.id)}"></div>
            <div class="generate-image-result${cachedImg ? "" : " hidden"}" id="generate-result-${escapeHtml(gen.id)}">
              <img class="generated-image" id="generate-image-${escapeHtml(gen.id)}" src="${cachedImg || ""}" alt="Peca gerada" />
              <div class="generate-image-actions">
                <button class="button button-primary btn-approve-image" type="button" data-generate-id="${escapeHtml(gen.id)}">Aprovar e baixar</button>
                <button class="button button-secondary btn-generate-feedback" type="button" data-generate-id="${escapeHtml(gen.id)}">Quero ajustar</button>
              </div>
              <div class="generate-feedback hidden" id="generate-feedback-${escapeHtml(gen.id)}">
                <textarea class="generate-feedback-input" placeholder="O que voce quer ajustar? (opcional — deixe em branco para gerar outra versao)"></textarea>
                <button class="button button-primary btn-regenerate" type="button"
                  data-generate-id="${escapeHtml(gen.id)}"
                  data-generate-type="image"
                  data-generate-loading="${escapeHtml(gen.loadingMessage || "Gerando imagem...")}">
                  Gerar nova versao
                </button>
              </div>
            </div>
          </div>`;
      }
    }
    return `<div class="tutorial-block"><h4 class="tutorial-heading">${escapeHtml(block.heading)}</h4><div class="tutorial-body">${fillTemplate(block.body)}${inlineFieldHtml}${cmdHtml}${generateHtml}</div></div>`;
  }).join("");

  // Bloco de comando isolado (etapas sem tutorial, ex: VPS, Swarm)
  const technical = !step.tutorial && lesson[2] === "technical" && step.command
    ? `
      <div class="technical-command">
        <div class="wizard-block-title">
          <h4>Comando</h4>
          <button class="button button-secondary" type="button" data-copy-command>Copiar</button>
        </div>
        <pre class="command-box"><code>${escapeHtml(fillTemplate(step.command))}</code></pre>
        <div class="wizard-validation">
          <div>
            <h4>Validacao</h4>
            <p>${escapeHtml(step.validation || "")}</p>
          </div>
          <div>
            <h4>Pode seguir se</h4>
            <p>${escapeHtml(step.done || "")}</p>
          </div>
        </div>
      </div>
    `
    : "";

  // YAML fica oculto na tela — o usuario so precisa do botao de copiar
  const yamlBlocks = lesson[2] === "technical" && step.yaml
    ? (Array.isArray(step.yaml) ? step.yaml : [{ name: "stack.yml", content: step.yaml }])
        .map(({ name, content, note }) => `
          <div class="technical-command">
            <div class="wizard-block-title">
              <h4>${escapeHtml(name)}</h4>
              <button class="button button-secondary" type="button" data-copy-yaml>Copiar YAML</button>
            </div>
            <pre class="command-box hidden"><code>${escapeHtml(fillTemplate(content))}</code></pre>
            <p class="wizard-yaml-note">${escapeHtml(note || "Copie e cole no editor do Portainer em Stacks > Add stack > Web editor.")}</p>
          </div>
        `).join("")
    : "";

  const intro = step.content ? `<p>${escapeHtml(step.content)}</p>` : "";

  return `
    ${intro}
    ${tutorialHtml}
    ${technical}
    ${yamlBlocks}
    ${fieldsHtml}
  `;
}

function buildStageContent(stage, module) {
  if (isWizardModule(module)) {
    return `
      <div class="wizard-layout">
        <nav class="wizard-steps" id="lesson-steps"></nav>
        <div class="wizard-panel">
          <p class="eyebrow" id="lesson-step-kicker"></p>
          <h3 id="lesson-step-title"></h3>
          <div id="lesson-step-content"></div>
        </div>
      </div>
    `;
  }
  const result = module.result ? `<p><strong>Resultado do modulo:</strong> ${escapeHtml(module.result)}.</p>` : "";
  return `
    <p>${escapeHtml(stage[2] || stage[1])}</p>
    ${result}
  `;
}

function getLessonIndex() {
  const raw = String(memberApp.state.currentLesson || "").split(".")[1];
  return Number.isFinite(Number(raw)) ? Number(raw) : 0;
}

function getStageIndex(module = currentModule()) {
  const lastIndex = Math.max(0, module.stages.length - 1);
  return Math.min(Math.max(0, getLessonIndex()), lastIndex);
}

function currentStep() {
  return WIZARD_STEPS[currentStepIndex()];
}

function currentStepIndex() {
  return Math.max(0, WIZARD_STEPS.findIndex((step) => step.id === memberApp.state.currentStep));
}

async function persistMemberState() {
  memberApp.state = normalizeMemberState({
    ...memberApp.state,
    updatedAt: new Date().toISOString()
  });
  saveMemberApp();

  if (!memberApp.token || memberApp.token.startsWith("local-")) return;

  try {
    await postMemberApi("/api/wizard/save", { token: memberApp.token, state: memberApp.state });
  } catch {
    // Local storage already preserves the experience for offline/local preview.
  }
}

async function postMemberApi(endpoint, payload, includeJson = true) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = includeJson || response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : {};

  if (!response.ok || data.ok === false) {
    throw new Error(errorMessageForCode(data.error || "request_failed"));
  }

  return data;
}

function errorMessageForCode(code) {
  const messages = {
    missing_token: "Sessao expirada ou invalida. Saia e entre novamente.",
    invalid_token: "Sessao expirada ou invalida. Saia e entre novamente.",
    database_unavailable: "Banco indisponivel para salvar a conversa. Confira /api/health e a DATABASE_URL.",
    openai_not_configured: "OPENAI_API_KEY ainda nao esta configurada no backend.",
    operation_assistant_failed: "O backend chamou o assistente, mas a OpenAI/API falhou. Confira os logs da stack.",
    request_failed: "A requisicao ao assistente falhou. Confira os logs da stack.",
    auth_failed: "Sessao expirada ou invalida. Saia e entre novamente.",
    stream_failed: "A geracao falhou no meio do caminho. Tente novamente em instantes.",
    generate_failed: "Nao consegui gerar o conteudo agora. Tente novamente em instantes.",
    invalid_agent_type: "Tipo de geracao invalido. Recarregue a pagina e tente de novo.",
    image_prompt_failed: "Nao consegui preparar o prompt da imagem. Tente novamente.",
    image_prompt_empty: "O agente nao retornou um prompt de imagem. Tente novamente.",
    image_generation_failed: "A geracao da imagem falhou. Tente novamente em instantes.",
    image_url_missing: "A imagem foi gerada mas a URL nao chegou. Tente novamente.",
    prompt_file_missing: "O prompt do agente nao esta no servidor. Rebuild da imagem do site necessario (source-material/Agents)."
  };
  return messages[code] || `Erro do assistente: ${code}`;
}

function generateRandomHex(length) {
  const chars = "abcdef0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function normalizeMemberState(state) {
  const projectName = state?.project?.name === "Meu negocio online" ? "" : state?.project?.name;
  const moduleId = COURSE_MODULES.some((module) => module.id === state?.currentModule)
    ? state.currentModule
    : DEFAULT_MEMBER_STATE.currentModule;
  
  const project = {
    ...DEFAULT_MEMBER_STATE.project,
    ...(state?.project || {}),
    id: state?.project?.id || DEFAULT_MEMBER_STATE.project.id,
    name: projectName || ""
  };

  if (!project.evolutionApiKey) {
    project.evolutionApiKey = "evo_api_" + generateRandomHex(24);
  }
  if (!project.chatwootSecretKey) {
    project.chatwootSecretKey = generateRandomHex(64);
  }
  if (!project.n8nEncryptionKey) {
    project.n8nEncryptionKey = generateRandomHex(32);
  }
  if (!project.n8nRunnersAuthToken) {
    project.n8nRunnersAuthToken = generateRandomHex(32);
  }

  return {
    ...structuredClone(DEFAULT_MEMBER_STATE),
    ...(state || {}),
    project,
    currentModule: moduleId,
    currentLesson: normalizeStageKey(moduleId, state?.currentLesson),
    currentLessonStep: state?.currentLessonStep || DEFAULT_MEMBER_STATE.currentLessonStep,
    completedSteps: Array.isArray(state?.completedSteps) ? state.completedSteps : [],
    checklist: state?.checklist && typeof state.checklist === "object" ? state.checklist : {},
    assistantThreads: state?.assistantThreads && typeof state.assistantThreads === "object" ? state.assistantThreads : {}
  };
}

function normalizeStageKey(moduleId, currentLesson) {
  const module = COURSE_MODULES.find((item) => item.id === moduleId) || COURSE_MODULES[0];
  const rawIndex = String(currentLesson || "").split(".")[1];
  const index = Number.isFinite(Number(rawIndex)) ? Number(rawIndex) : 0;
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, module.stages.length - 1));
  return `${module.id}.${safeIndex}`;
}

function loadMemberApp() {
  try {
    const stored = {
      ...memberApp,
      ...JSON.parse(window.localStorage.getItem(memberStoreKey) || "{}")
    };
    return {
      ...stored,
      activeView: stored.activeView || "dashboard",
      state: normalizeMemberState(stored.state)
    };
  } catch {
    return memberApp;
  }
}

function saveMemberApp() {
  window.localStorage.setItem(memberStoreKey, JSON.stringify(memberApp));
}

function setMemberStatus(scope, message, isError = false) {
  const element = document.querySelector(scope === "auth" ? "#auth-status" : "#auth-status");
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("form-status-error", isError);
  element.classList.toggle("form-status-success", Boolean(message) && !isError);
}

function buildLocalAnswer(step, question) {
  return `Etapa: ${step.title}\n\nFaca so esta parte agora: ${step.objective}\n\nSua duvida: ${question}\n\nValide assim: ${step.validation}\n\nPode seguir quando: ${step.done}`;
}

function buildLessonAgentAnswer(module, lesson, input) {
  return [
    `Modulo ${module.number}: ${module.title}`,
    `Etapa: ${lesson[0]}`,
    "",
    "Entrada recebida:",
    input,
    "",
    "Proxima entrega: transformar essa resposta em uma acao concreta do projeto, com decisao, contexto, pendencias e proximo passo."
  ].join("\n");
}

const MODULE1_AGENT_OPENINGS = {
  "business_modeling":         "Vamos começar pelo fundamento do seu negócio. Me conta: quais são as habilidades, experiências ou interesses que você já tem e que poderiam virar uma fonte de renda?",
  "target_audience":           "Agora vou pesquisar quem tem maior probabilidade de comprar o que você vai oferecer. Preciso só confirmar uma coisa: a ideia principal ficou clara para você ou quer ajustar algo antes de continuar?",
  "strategic_differentiation": "Vou mapear os concorrentes e encontrar onde o mercado está falhando. Antes de pesquisar: tem algum concorrente ou referência que você já conhece e quer que eu considere?",
  "strategic_pricing":         "Vou pesquisar os preços praticados no mercado para você. Só me diz: qual seria sua meta de faturamento mensal? Com isso consigo mostrar quantas vendas você precisaria fazer.",
  "product_concept":           "Com tudo que construímos até aqui, vou propor nome, proposta de valor e slogan para o seu negócio. Posso começar?",
  "visual_identity":           "Vou criar a direção visual do seu negócio com base no posicionamento e conceito que definimos. Posso apresentar minha proposta?"
};

function ensureAssistantThread(module, lesson) {
  const key = currentLessonKey();
  if (memberApp.state.assistantThreads[key]?.length) {
    return;
  }

  let opening;
  if (module.id === "module-1") {
    const agentId = lesson[3] || agentIdForStageKey(key);
    opening = MODULE1_AGENT_OPENINGS[agentId]
      || `Vamos trabalhar a etapa "${lesson[0]}". Pode começar.`;
  } else if (isWizardModule(module)) {
    const steps = getLessonSteps(lesson);
    const first = steps[0];
    opening = first
      ? `Agora vamos configurar: ${lesson[0]}. Se travar em qualquer passo, me diga aqui o que esta vendo na tela — eu ajudo a resolver.`
      : `Vamos configurar esta parte da infraestrutura. Se travar, me descreva aqui o que esta vendo.`;
  } else {
    opening = `Vamos trabalhar a etapa "${lesson[0]}". Me conte o contexto do seu negocio para eu transformar isso em um proximo passo claro.`;
  }

  memberApp.state.assistantThreads[key] = [{ role: "assistant", text: opening }];
}

function addAssistantMessage(role, text) {
  const key = currentLessonKey();
  memberApp.state.assistantThreads[key] = memberApp.state.assistantThreads[key] || [];
  memberApp.state.assistantThreads[key].push({ role, text, createdAt: new Date().toISOString() });
}

function updateAssistantMessage(index, text) {
  const key = currentLessonKey();
  const thread = memberApp.state.assistantThreads[key] || [];
  if (!thread[index]) return;
  thread[index] = {
    ...thread[index],
    text,
    updatedAt: new Date().toISOString()
  };
}

async function requestLessonAgentAnswer(module, stage, input, thread = null) {
  if (!memberApp.token || memberApp.token.startsWith("local-")) {
    return {
      answer: isLocalPreview()
        ? buildLessonAgentAnswer(module, stage, input)
        : "Voce esta em modo local nesta sessao. Saia, entre com uma conta criada no servidor e tente de novo para chamar o assistente real.",
      status: "local_session"
    };
  }

  ensureProjectId();
  const key = currentLessonKey();
  const stagePayload = buildStagePayload(stage, key);
  const body = {
    token: memberApp.token,
    project: memberApp.state.project,
    module: { id: module.id, number: module.number, title: module.title, summary: module.summary },
    stage: stagePayload,
    stageKey: key,
    message: input,
    thread: thread || memberApp.state.assistantThreads[key] || []
  };

  if (isWizardModule(module)) {
    const steps = getLessonSteps(stage);
    const activeStep = steps.find((s) => s.id === memberApp.state.currentLessonStep) || steps[0];
    if (activeStep) {
      body.wizardStep = {
        id: activeStep.id,
        title: activeStep.title,
        objective: activeStep.content,
        command: fillTemplate(activeStep.command || ""),
        validation: activeStep.validation,
        done: activeStep.done
      };
    }
  }

  // Módulos 1 e 2 são agent-driven (streaming SSE); demais são guias técnicos (JSON simples)
  if (module.id === "module-1" || module.id === "module-2") {
    return await streamLessonAgentAnswer(body, key);
  }

  const response = await postMemberApi("/api/operation/assistant", body);
  return {
    answer: response.answer || buildLessonAgentAnswer(module, stage, input),
    status: response.status,
    agentId: response.agent_id,
    nextAgentId: response.next_agent_id || response.next_recommended_agent || "",
    nextStageKey: response.next_stage_key || ""
  };
}

async function streamLessonAgentAnswer(body, key) {
  // pendingIndex aponta para o placeholder "Estou organizando..." já adicionado antes desta chamada
  const pendingIndex = (memberApp.state.assistantThreads[key] || []).length - 1;
  let accumulated = "";

  const response = await fetch("/api/operation/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error("stream_failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let finalResult = null;
  // Linhas SSE podem chegar cortadas entre chunks — o resto fica no buffer
  let lineBuffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    lineBuffer += decoder.decode(value, { stream: true });
    const lines = lineBuffer.split("\n");
    lineBuffer = lines.pop();

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      let event;
      try {
        event = JSON.parse(line.slice(6));
      } catch {
        continue;
      }

      if (event.type === "delta") {
        accumulated += event.text;
        // Atualiza a bolha do assistente em tempo real com cursor piscante
        updateAssistantMessage(pendingIndex, accumulated + "▌");
        renderAssistantThread();
      } else if (event.type === "done") {
        finalResult = {
          answer: event.answer || accumulated,
          status: event.status,
          agentId: event.agent_id,
          nextAgentId: event.next_agent_id || event.next_recommended_agent || "",
          nextStageKey: event.next_stage_key || ""
        };
        // Remove cursor e mostra texto final
        updateAssistantMessage(pendingIndex, finalResult.answer);
        renderAssistantThread();
      } else if (event.type === "error") {
        throw new Error(errorMessageForCode(event.code || "request_failed"));
      }
    }
  }

  return finalResult || {
    answer: accumulated || "Nao obtive resposta. Tente novamente.",
    status: "conversation",
    nextAgentId: "",
    nextStageKey: ""
  };
}

function stageKeyForAgentId(agentId) {
  // Deve espelhar stageKeyFromAgentId() do servidor
  if (agentId === "business_modeling") return "module-1.0";
  const module2Agents = ["target_audience", "strategic_differentiation", "strategic_pricing", "product_concept", "visual_identity"];
  const index = module2Agents.indexOf(agentId);
  return index >= 0 ? `module-2.${index}` : "";
}

function isLocalPreview() {
  return ["localhost", "127.0.0.1", ""].includes(window.location.hostname);
}

function buildStagePayload(stage, key) {
  return {
    title: stage[0],
    summary: stage[1],
    content: stage[2] || stage[1],
    agentId: stage[3] || agentIdForStageKey(key),
    lessonId: key,
    moduleId: currentModule().id
  };
}

function agentIdForStageKey(key) {
  const index = Number(String(key || "").split(".")[1] || 0);
  return [
    "business_modeling",
    "target_audience",
    "strategic_differentiation",
    "strategic_pricing",
    "product_concept",
    "visual_identity"
  ][index] || "business_modeling";
}

function renderAssistantThread() {
  const root = document.querySelector("#assistant-thread");
  const module = currentModule();
  const lesson = currentLesson();
  const key = currentLessonKey();
  document.querySelector("#assistant-title").textContent = "Assistente da etapa";
  root.innerHTML = (memberApp.state.assistantThreads[key] || []).map((message) => `
    <article class="assistant-message ${message.role === "user" ? "from-user" : "from-assistant"}">
      <strong>${message.role === "user" ? "Voce" : "Axon"}</strong>
      <p>${escapeHtml(message.text)}</p>
    </article>
  `).join("");
  root.scrollTop = root.scrollHeight;
}

function initials(value) {
  return String(value || "AX")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AX";
}

function formatDate(value) {
  if (!value) return "agora";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
