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
    summary: "Use IA para criar estrategia, conteudo e pecas de divulgacao, depois publique o site e conecte o pagamento.",
    result: "Presenca comercial publicada e aceitando pagamentos",
    stages: [
      ["Estrategia de divulgacao", "Agentes leem seu planejamento dos modulos 1 e 2 e geram grade de postagens e roteiros.", "Transforme a estrategia que voce ja construiu em um plano de conteudo concreto, com temas, formatos e cadencia definidos pelos agentes."],
      ["Pecas de divulgacao", "Use a API da OpenAI para gerar as primeiras artes estaticas para redes sociais.", "Com os roteiros prontos, os agentes criam as pecas visuais iniciais automaticamente — voce revisa e aprova."],
      ["Canva e CapCut", "Aprenda o essencial para criar e adaptar pecas por conta propria apos esse inicio.", "Uma introducao pratica as ferramentas que voce vai usar para produzir conteudo de forma independente depois daqui."],
      ["Site com Claude Code", "Agentes geram o prompt do site. Voce instala o Claude Code e ele constroi a pagina com todas as credenciais ja configuradas.", "Nao e uma aula de programacao — e aprender a usar o Code como executor da sua estrategia, com autonomia para ajustes futuros."],
      ["Stripe e checkout", "Conecte o pagamento e defina o proximo passo comercial para o visitante.", "Prepare o caminho de compra ou agendamento para que o interessado saiba exatamente o que fazer."]
    ]
  },
  {
    id: "module-5",
    number: 5,
    title: "Operacao Assistida",
    summary: "Transforme IA em apoio operacional para CRM, rotina, decisao, tarefas e atendimento.",
    result: "Operacao assistida em funcionamento",
    stages: [
      ["CRM e leads", "Configure Chatwoot como CRM leve e conecte o registro automatico de leads via n8n.", "technical", null, ["crm"]],
      ["Agentes basicos", "Configure os primeiros agentes de apoio operacional.", "Defina funcao, limite, entrada e entrega de cada agente para manter utilidade e controle."],
      ["Calendario do gestor", "Crie uma rotina assistida para prioridades e agenda.", "Organize compromissos, revisoes e proximas acoes para reduzir dispersao."],
      ["Apoio a decisao", "Use IA para comparar caminhos e preparar decisoes.", "Estruture perguntas, criterios e blocos de transferencia para decidir com mais clareza."],
      ["Rotina e tarefas", "Conecte tarefas recorrentes ao acompanhamento operacional.", "Transforme o planejamento em rotina acompanhada pelo sistema e pelo assistente."],
      ["Atendimento basico", "Prepare o primeiro apoio de atendimento ao cliente.", "Monte respostas, limites e encaminhamentos para apoiar sem perder controle humano."]
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
    id: "atendimento",
    title: "Atendimento automatico",
    objective: "Subir Evolution API e Chatwoot em um clique, conectar WhatsApp e configurar o agente de atendimento no n8n.",
    tutorial: [
      {
        heading: "1. DNS (Opcional)",
        body: `<p>Se você configurou o registro curinga (<code>*</code>) no Módulo 3, pode pular esta etapa.</p>
<p>Caso contrário, acesse a Cloudflare e adicione dois registros A para o IP da sua VPS:</p>
<table style="width:100%;border-collapse:collapse;font-size:0.85rem">
  <tr style="text-align:left"><th>Type</th><th>Name</th><th>IPv4 address</th><th>Proxy status</th></tr>
  <tr><td>A</td><td><code>evo</code></td><td><code>{{serverIp}}</code></td><td>DNS only</td></tr>
  <tr><td>A</td><td><code>chat</code></td><td><code>{{serverIp}}</code></td><td>DNS only</td></tr>
</table>
<p style="margin-top:8px">Mantenha <strong>DNS only</strong> — o Traefik precisa resolver o certificado HTTPS diretamente.</p>`
      },
      {
        heading: "2. Executar script de Auto-Implementação",
        body: `<p>Vamos automatizar a criação de volumes, banco de dados, arquivos de stack e inicialização dos serviços.</p>
<p>Conecte-se ao SSH da sua VPS e execute o comando abaixo (ele contém suas credenciais auto-geradas e seguras):</p>`,
        command: `cat << 'EOF' > deploy-atendimento.sh
#!/bin/bash
set -e

# Configurações do seu projeto
DOMAIN="{{domain}}"
POSTGRES_PASS="{{postgresPassword}}"
EVO_KEY="{{evolutionApiKey}}"
CHATWOOT_SECRET="{{chatwootSecretKey}}"

echo "🚀 Iniciando auto-implementação..."

# 1. Volumes
echo "📦 Criando volumes Docker..."
docker volume create evolution_instances || true
docker volume create redis_chatwoot_data || true

# 2. Banco de dados
echo "🗄️ Criando banco 'chatwoot' no Postgres..."
POSTGRES_CONTAINER=$(docker ps -q -f name=postgres || docker ps -q -f name=axon_postgres)
if [ -z "$POSTGRES_CONTAINER" ]; then
  echo "❌ ERRO: Container Postgres não encontrado."
  exit 1
fi
docker exec -t $POSTGRES_CONTAINER psql -U postgres -c "CREATE DATABASE chatwoot;" || true
docker exec -t $POSTGRES_CONTAINER psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE chatwoot TO axon_app;" || true

# 3. Stack Evolution
echo "📝 Criando stack do Evolution API..."
mkdir -p /opt/stacks/evolution
cat << 'STACK_EOF' > /opt/stacks/evolution/stack.yml
version: "3.7"
services:
  evolution:
    image: evoapicloud/evolution-api:v2.3.7
    environment:
      - SERVER_URL=https://evo.DOMAIN_PLACEHOLDER
      - AUTHENTICATION_API_KEY=EVO_KEY_PLACEHOLDER
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://axon_app:POSTGRES_PASS_PLACEHOLDER@axon_postgres_axon_postgres:5432/evolution
      - DATABASE_URL=postgresql://axon_app:POSTGRES_PASS_PLACEHOLDER@axon_postgres_axon_postgres:5432/evolution
      - REDIS_ENABLED=true
      - REDIS_URI=redis://chatwoot_redis-chatwoot:6379
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://chatwoot_redis-chatwoot:6379
      - CACHE_REDIS_PREFIX_KEY=evolution
      - CACHE_REDIS_SAVE_INSTANCES=true
      - CACHE_LOCAL_ENABLED=false
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
        - "traefik.docker.network=network_swarm_public"
        - "traefik.http.routers.evolution.rule=Host(\`evo.DOMAIN_PLACEHOLDER\`)"
        - "traefik.http.routers.evolution.entrypoints=websecure"
        - "traefik.http.routers.evolution.tls=true"
        - "traefik.http.routers.evolution.tls.certresolver=letsencryptresolver"
        - "traefik.http.routers.evolution.middlewares=evolution-ws"
        - "traefik.http.services.evolution.loadbalancer.server.port=8080"
        - "traefik.http.routers.evolution-http.rule=Host(\`evo.DOMAIN_PLACEHOLDER\`)"
        - "traefik.http.routers.evolution-http.entrypoints=web"
        - "traefik.http.routers.evolution-http.middlewares=evolution-redirect"
        - "traefik.http.middlewares.evolution-redirect.redirectscheme.scheme=https"
        - "traefik.http.middlewares.evolution-redirect.redirectscheme.permanent=true"
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
STACK_EOF

sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /opt/stacks/evolution/stack.yml
sed -i "s/EVO_KEY_PLACEHOLDER/$EVO_KEY/g" /opt/stacks/evolution/stack.yml
sed -i "s/POSTGRES_PASS_PLACEHOLDER/$POSTGRES_PASS/g" /opt/stacks/evolution/stack.yml

# 4. Stack Chatwoot
echo "📝 Criando stack do Chatwoot..."
mkdir -p /opt/stacks/chatwoot
cat << 'STACK_EOF' > /opt/stacks/chatwoot/stack.yml
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
      - SECRET_KEY_BASE=CHATWOOT_SECRET_PLACEHOLDER
      - FRONTEND_URL=https://chat.DOMAIN_PLACEHOLDER
      - DEFAULT_LOCALE=pt_BR
      - RAILS_ENV=production
      - RAILS_LOG_TO_STDOUT=true
      - REDIS_URL=redis://redis-chatwoot:6379
      - POSTGRES_HOST=axon_postgres_axon_postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DATABASE=chatwoot
      - POSTGRES_USERNAME=axon_app
      - POSTGRES_PASSWORD=POSTGRES_PASS_PLACEHOLDER
    command: bundle exec rails s -p 3000 -b 0.0.0.0
    networks:
      - network_swarm_public
    deploy:
      mode: replicated
      replicas: 1
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=network_swarm_public"
        - "traefik.http.routers.chatwoot.rule=Host(\`chat.DOMAIN_PLACEHOLDER\`)"
        - "traefik.http.routers.chatwoot.entrypoints=websecure"
        - "traefik.http.routers.chatwoot.tls.certresolver=letsencryptresolver"
        - "traefik.http.services.chatwoot.loadbalancer.server.port=3000"
  chatwoot-worker:
    image: chatwoot/chatwoot:v3.11.0
    environment:
      - SECRET_KEY_BASE=CHATWOOT_SECRET_PLACEHOLDER
      - FRONTEND_URL=https://chat.DOMAIN_PLACEHOLDER
      - RAILS_ENV=production
      - REDIS_URL=redis://redis-chatwoot:6379
      - POSTGRES_HOST=axon_postgres_axon_postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DATABASE=chatwoot
      - POSTGRES_USERNAME=axon_app
      - POSTGRES_PASSWORD=POSTGRES_PASS_PLACEHOLDER
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
    name: redis_chatwoot_data`
      }
    ]
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
    title: "CRM e leads",
    objective: "Configurar Chatwoot como CRM leve, criar pipeline de contatos e conectar o n8n para registrar automaticamente novos leads do atendimento.",
    tutorial: [
      {
        heading: "1. Configure o pipeline no Chatwoot",
        body: `<p>No Chatwoot, acesse <strong>Configurações → Labels</strong> e crie etiquetas para as fases do funil:</p>
<ul>
  <li><code>novo-lead</code></li>
  <li><code>em-contato</code></li>
  <li><code>proposta-enviada</code></li>
  <li><code>fechado</code></li>
  <li><code>perdido</code></li>
</ul>
<p>Cada conversa pode receber uma etiqueta que representa o estágio do lead. Avance manualmente conforme o lead progride no funil.</p>`
      },
      {
        heading: "2. Configure campos de contato",
        body: `<p>No Chatwoot, acesse <strong>Configurações → Atributos personalizados → Contato</strong>. Crie os atributos que o agente vai coletar:</p>
<ul>
  <li><strong>Empresa</strong> (tipo: texto)</li>
  <li><strong>Interesse</strong> (tipo: texto)</li>
  <li><strong>Canal de origem</strong> (tipo: texto)</li>
</ul>
<p>Esses campos aparecem no perfil do contato e podem ser preenchidos via API pelo n8n automaticamente.</p>`
      },
      {
        heading: "3. Configure o webhook do Chatwoot no n8n",
        body: `<p>No Chatwoot, acesse <strong>Configurações → Integrações → Webhooks → Adicionar</strong>. Crie um webhook com:</p>
<ul>
  <li><strong>URL:</strong> a URL do nó Webhook do n8n que você vai criar.</li>
  <li><strong>Evento:</strong> marque <code>conversation_created</code>.</li>
</ul>
<p>No n8n, crie um workflow com um nó <strong>Webhook</strong> (método POST) e copie a URL gerada de volta para o campo no Chatwoot.</p>`
      },
      {
        heading: "4. Registre o lead e aplique a etiqueta via n8n",
        body: `<p>No workflow do n8n, após o Webhook, adicione dois nós <strong>HTTP Request</strong> em sequência:</p>
<ol>
  <li><strong>Atualiza atributos do contato</strong> — preenche empresa, interesse e canal de origem com os dados coletados pelo agente.</li>
  <li><strong>Aplica etiqueta novo-lead</strong> — marca a conversa no funil:</li>
</ol>`,
        command: `POST https://chat.{{domain}}/api/v1/accounts/1/conversations/ID_CONVERSA/labels\n{ "labels": ["novo-lead"] }`
      },
      {
        heading: "5. Valide o fluxo",
        body: `<p>Envie uma mensagem de teste para o WhatsApp conectado. Verifique:</p>
<ul>
  <li>A conversa aparece no Chatwoot com a etiqueta <code>novo-lead</code>.</li>
  <li>O contato tem os atributos preenchidos.</li>
  <li>O agente respondeu automaticamente.</li>
</ul>`
      }
    ],
    validation: "Um lead de teste aparecer no Chatwoot com etiqueta novo-lead e atributos preenchidos.",
    done: "Pipeline de leads ativo e registro automatico funcionando via n8n."
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
    n8nRunnersAuthToken: ""
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

  const isModule3 = module.id === "module-3" || module.id === "module-4";
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
    .replaceAll("{{n8nRunnersAuthToken}}", project.n8nRunnersAuthToken || "{{n8nRunnersAuthToken}}");
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

  document.querySelector("#download-n8n-atendimento")?.addEventListener("click", () => {
    const blob = new Blob([buildAtendimentoWorkflowJson()], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agente-atendimento.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
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

function buildAtendimentoWorkflowJson() {
  const domain = memberApp.state.project.domain || "seudominio.com.br";
  const workflow = {
    name: "Agente de Atendimento",
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path: "atendimento",
          responseMode: "lastNode",
          options: {}
        },
        id: "webhook-evolution",
        name: "Webhook Evolution",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [240, 300],
        webhookId: "atendimento-webhook"
      },
      {
        parameters: {
          conditions: {
            options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
            conditions: [
              {
                id: "cond-event",
                leftValue: "={{ $json.body.event }}",
                rightValue: "messages.upsert",
                operator: { type: "string", operation: "equals" }
              },
              {
                id: "cond-from-me",
                leftValue: "={{ $json.body.data.key.fromMe }}",
                rightValue: false,
                operator: { type: "boolean", operation: "false" }
              }
            ],
            combinator: "and"
          },
          options: {}
        },
        id: "filtra-mensagem",
        name: "Filtra mensagem recebida",
        type: "n8n-nodes-base.if",
        typeVersion: 2,
        position: [460, 300]
      },
      {
        parameters: {
          resource: "chat",
          modelId: { value: "gpt-4o-mini" },
          messages: {
            values: [
              {
                role: "system",
                content: "Voce e o agente de atendimento do negocio. Responda de forma direta, simpatica e objetiva. Se o cliente pedir para falar com humano, confirme a transferencia."
              },
              {
                role: "user",
                content: "={{ $json.body.data.message.conversation }}"
              }
            ]
          },
          options: {}
        },
        id: "agente-ia",
        name: "Agente IA",
        type: "n8n-nodes-base.openAi",
        typeVersion: 1.8,
        position: [680, 220],
        credentials: {
          openAiApi: { id: "SUBSTITUA_PELO_ID_DA_CREDENCIAL", name: "OpenAi account" }
        }
      },
      {
        parameters: {
          method: "POST",
          url: `https://evo.${domain}/message/sendText/atendimento`,
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: "apikey", value: memberApp.state.project.evolutionApiKey || "CHAVE_EVOLUTION_AQUI" }]
          },
          sendBody: true,
          bodyParameters: {
            parameters: [
              { name: "number", value: "={{ $('Webhook Evolution').item.json.body.data.key.remoteJid }}" },
              { name: "text", value: "={{ $json.message.content }}" }
            ]
          },
          options: {}
        },
        id: "responder-evolution",
        name: "Responder via Evolution API",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.2,
        position: [900, 220]
      }
    ],
    connections: {
      "Webhook Evolution": { main: [[{ node: "Filtra mensagem recebida", type: "main", index: 0 }]] },
      "Filtra mensagem recebida": { main: [[{ node: "Agente IA", type: "main", index: 0 }]] },
      "Agente IA": { main: [[{ node: "Responder via Evolution API", type: "main", index: 0 }]] }
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
    if (block.field) {
      const fieldDef = (step.fields || []).find(f => f.key === block.field);
      if (fieldDef) {
        const value = memberApp.state.project[fieldDef.key] || "";
        inlineFieldHtml = `<div class="wizard-data-fields"><label class="wizard-data-field${value ? " is-filled" : ""}"><span>${escapeHtml(fieldDef.label)}</span><span class="wizard-data-input"><input data-project-field="${escapeHtml(fieldDef.key)}" placeholder="${escapeHtml(fieldDef.placeholder || "")}" value="${escapeHtml(value)}" /><svg class="field-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span></label></div>`;
      }
    }
    return `<div class="tutorial-block"><h4 class="tutorial-heading">${escapeHtml(block.heading)}</h4><div class="tutorial-body">${fillTemplate(block.body)}${inlineFieldHtml}${cmdHtml}</div></div>`;
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
  if (module.id === "module-3" || module.id === "module-4") {
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
    request_failed: "A requisicao ao assistente falhou. Confira os logs da stack."
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
  } else if (module.id === "module-3" || module.id === "module-4") {
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

  if (module.id === "module-3" || module.id === "module-4") {
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

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
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
