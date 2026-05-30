const COURSE_MODULES = [
  {
    id: "module-1",
    number: 1,
    title: "Diagnostico Operacional",
    summary: "Entenda o negocio e monte o nucleo operacional antes de automatizar qualquer coisa.",
    result: "Planejamento Estrategico Operacional",
    stages: [
      ["Diagnostico do negocio", "Mapeie nicho, produto, oferta e contexto operacional atual.", "Vamos identificar o que o negocio vende, para quem vende e qual problema operacional precisa ser resolvido primeiro.", "business_modeling"],
      ["Publico-alvo", "Identifique quem tem maior chance de comprar.", "Vamos transformar a ideia escolhida em um publico compravel, com dores, desejos, objecoes e contexto real de decisao.", "target_audience"],
      ["Diferencial estrategico", "Defina por que esse negocio merece atencao.", "Vamos comparar alternativas, encontrar lacunas do mercado e transformar isso em um posicionamento simples de entender.", "strategic_differentiation"],
      ["Precificacao estrategica", "Escolha uma faixa de preco viavel.", "Vamos ligar preco a valor percebido, meta financeira, benchmarks e volume necessario de vendas.", "strategic_pricing"],
      ["Conceito de produto", "Consolide nome, promessa e slogan.", "Vamos transformar as decisoes estrategicas em um conceito comunicavel para o produto ou negocio.", "product_concept"],
      ["Identidade visual inicial", "Defina a direcao visual do negocio.", "Vamos traduzir estrategia, publico e posicionamento em paleta, tipografia e diretrizes praticas de estilo.", "visual_identity"]
    ]
  },
  {
    id: "module-2",
    number: 2,
    title: "Estrutura Digital",
    summary: "Coloque a infraestrutura no ar com dominio, VPS, Docker, Swarm e servicos base.",
    result: "Infraestrutura digital operacional",
    stages: [
      ["Dominio e Cloudflare", "Compre o dominio, conecte na Cloudflare e prepare os registros DNS.", "A etapa guia dominio, nameservers, registros principais e validacao simples antes de seguir."],
      ["VPS, Docker e Swarm", "Acesse a VPS, instale Docker e inicialize o Swarm.", "Prepare o servidor como base operacional, com comandos copiaveis e validacao objetiva."],
      ["Portainer e Traefik", "Suba o painel operacional e o proxy publico da infraestrutura.", "Publique o Portainer, mantenha Traefik como proxy unico e confirme HTTPS nos servicos."],
      ["PostgreSQL e Redis", "Suba os bancos e servicos de apoio para site, n8n e automacoes.", "Configure Postgres, Redis e a rede interna para que os servicos conversem de forma previsivel."],
      ["Validacao da infra", "Revise DNS, servicos, logs e saude da estrutura.", "Use a validacao final para confirmar que a base tecnica esta pronta para receber o sistema operacional."]
    ]
  },
  {
    id: "module-3",
    number: 3,
    title: "Sistema Operacional da Empresa",
    summary: "Instale o nucleo operacional com n8n, OpenAI API, memoria e workflows.",
    result: "Nucleo operacional instalado",
    stages: [
      ["n8n e OpenAI API", "Conecte o ambiente de automacao com a plataforma de IA.", "Prepare credenciais, variaveis e conexoes sem colocar automacao critica no caminho errado."],
      ["Workflows base", "Crie os primeiros fluxos operacionais do negocio.", "Monte fluxos simples para receber dados, registrar eventos e disparar proximas acoes."],
      ["Memoria operacional", "Organize onde o sistema guarda contexto, decisoes e entregas.", "Defina o que precisa virar memoria do projeto para que os agentes trabalhem com continuidade."],
      ["Automacoes basicas", "Ative automacoes praticas para tarefas recorrentes.", "Conecte pequenas rotinas que reduzem trabalho manual sem complicar a operacao."],
      ["Organizacao operacional", "Feche a base de operacao e documente como manter o sistema.", "Revise painel, logs, credenciais e responsabilidades para operar com seguranca."]
    ]
  },
  {
    id: "module-4",
    number: 4,
    title: "Presenca Comercial",
    summary: "Coloque o negocio vendendo com pagina, checkout, CTA e conteudo.",
    result: "Presenca comercial publicada",
    stages: [
      ["Landing page", "Publique a pagina que apresenta a oferta e capta interesse.", "Estruture promessa, prova, chamada e caminho de conversao com clareza."],
      ["Stripe, checkout e CTA", "Conecte pagamento e proximo passo comercial.", "Prepare o caminho de compra ou agendamento para que o interessado saiba exatamente o que fazer."],
      ["Grade de conteudo", "Organize temas e cadencia para divulgar a oferta.", "Transforme o planejamento operacional em uma grade simples para atrair, educar e converter."],
      ["Artes e posts", "Produza os primeiros materiais de divulgacao.", "Crie pecas praticas para colocar a presenca comercial em movimento."],
      ["Calendario comercial", "Feche a agenda de publicacao e acompanhamento.", "Distribua as acoes no calendario e defina como medir o que esta funcionando."]
    ]
  },
  {
    id: "module-5",
    number: 5,
    title: "Operacao Assistida",
    summary: "Transforme IA em apoio operacional para rotina, decisao, tarefas e atendimento.",
    result: "Operacao assistida em funcionamento",
    stages: [
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
    actions: ["Compre ou selecione o dominio.", "Adicione o dominio na Cloudflare.", "Troque os nameservers no registrador.", "Aguarde o status ativo."],
    command: "nslookup -type=ns {{domain}}",
    validation: "O comando deve mostrar nameservers da Cloudflare.",
    done: "A Cloudflare mostrar o dominio como ativo.",
    checklist: ["Dominio comprado", "Dominio adicionado na Cloudflare", "Nameservers trocados", "Cloudflare ativa"]
  },
  {
    id: "dns",
    title: "Configurar DNS",
    objective: "Criar os registros que levam site, painel, workflows e webhooks para a VPS.",
    actions: ["Crie o registro A do dominio raiz.", "Crie o A de manager01.", "Crie CNAMEs para painel, workflows e webhooks.", "Mantenha tudo como DNS only."],
    command: "nslookup {{domain}}\nnslookup painel.{{domain}}\nnslookup workflows.{{domain}}\nnslookup webhooks.{{domain}}",
    validation: "Os nomes devem resolver para o IP da VPS.",
    done: "Todos os subdominios resolverem corretamente.",
    checklist: ["A raiz criado", "A manager01 criado", "CNAME painel criado", "CNAME workflows criado", "CNAME webhooks criado"]
  },
  {
    id: "email",
    title: "E-mail profissional",
    objective: "Validar o dominio para envio profissional com MailerSend.",
    actions: ["Adicione o dominio no MailerSend.", "Copie SPF, DKIM e DMARC.", "Cole os registros na Cloudflare.", "Aguarde a verificacao."],
    command: "nslookup -type=txt {{domain}}\nnslookup -type=txt _dmarc.{{domain}}",
    validation: "MailerSend deve mostrar o dominio como verificado.",
    done: "SPF, DKIM e DMARC estiverem aprovados.",
    checklist: ["Dominio no MailerSend", "SPF configurado", "DKIM configurado", "DMARC configurado", "Envio testado"]
  },
  {
    id: "vps",
    title: "Acessar VPS",
    objective: "Entrar no servidor e preparar a base do sistema.",
    actions: ["Copie o IP publico da VPS.", "Acesse via SSH.", "Atualize pacotes do servidor."],
    command: "ssh root@{{serverIp}}\napt update && apt upgrade -y",
    validation: "Voce deve conseguir operar o terminal da VPS.",
    done: "O acesso SSH funcionar sem erro.",
    checklist: ["VPS criada", "IP confirmado", "SSH funcionando", "Servidor atualizado"]
  },
  {
    id: "swarm",
    title: "Docker Swarm",
    objective: "Instalar Docker, iniciar Swarm e criar a rede publica da infra.",
    actions: ["Instale Docker.", "Inicialize o Swarm.", "Crie a rede publica.", "Crie volumes base."],
    command: "curl -fsSL https://get.docker.com | sh\ndocker swarm init --advertise-addr {{serverIp}}\ndocker network create --driver=overlay --attachable network_swarm_public\ndocker volume create volume_swarm_certificates\ndocker volume create portainer_data\ndocker volume create postgres_data\ndocker volume create redis_n8n_data",
    validation: "`docker node ls` deve mostrar o node como Ready.",
    done: "A rede network_swarm_public existir.",
    checklist: ["Docker instalado", "Swarm iniciado", "Rede publica criada", "Volumes criados"]
  },
  {
    id: "traefik",
    title: "Subir Traefik",
    objective: "Publicar o proxy publico unico com HTTP, HTTPS e Let's Encrypt.",
    actions: ["Abra o template do Traefik.", "Troque o e-mail tecnico.", "Suba a stack.", "Confira os logs."],
    command: "docker service ls\ndocker service logs traefik_traefik --tail 100",
    validation: "O servico Traefik deve aparecer com replica 1/1.",
    done: "Traefik rodar e portas 80/443 estarem abertas.",
    checklist: ["Stack criada", "E-mail Let's Encrypt configurado", "Portas 80/443 abertas", "Servico 1/1"]
  },
  {
    id: "portainer",
    title: "Subir Portainer",
    objective: "Abrir o painel operacional em HTTPS.",
    actions: ["Use o template do Portainer.", "Troque painel pelo seu dominio.", "Suba a stack.", "Acesse pelo navegador."],
    command: "https://painel.{{domain}}",
    validation: "A tela do Portainer deve abrir com HTTPS valido.",
    done: "O Portainer mostrar o ambiente Swarm.",
    checklist: ["Stack criada", "DNS painel validado", "HTTPS abriu", "Swarm conectado"]
  },
  {
    id: "site",
    title: "Publicar site",
    objective: "Publicar uma imagem Docker como site em dominio proprio.",
    actions: ["Use o template do site.", "Configure a imagem.", "Configure DATABASE_URL.", "Valide /health."],
    command: "curl -I https://{{domain}}\ncurl https://{{domain}}/health",
    validation: "O /health deve responder ok.",
    done: "O site abrir em HTTPS e o container nao reiniciar.",
    checklist: ["Imagem configurada", "Labels Traefik configuradas", "DATABASE_URL preenchida", "/health ok"]
  },
  {
    id: "postgres",
    title: "Subir Postgres",
    objective: "Criar banco operacional para o site e automacoes.",
    actions: ["Suba a stack do Postgres.", "Crie o banco axon_ops.", "Crie o usuario axon_app.", "Teste conexao interna."],
    command: "docker run --rm -it --network network_swarm_public postgres:16 psql \"postgres://axon_app:SENHA_FORTE_AQUI@axon_postgres:5432/axon_ops\"",
    validation: "O prompt do psql deve abrir sem erro.",
    done: "O host interno axon_postgres funcionar.",
    checklist: ["Stack Postgres rodando", "Banco axon_ops criado", "Usuario axon_app criado", "Conexao interna validada"]
  },
  {
    id: "n8n",
    title: "n8n em fila",
    objective: "Subir editor, webhooks, worker, runners e Redis.",
    actions: ["Suba Redis.", "Suba editor.", "Suba webhooks.", "Suba worker e runners.", "Execute um workflow simples."],
    command: "docker service ls | grep n8n\ndocker service logs n8n_worker --tail 100",
    validation: "Editor abre em workflows e jobs executam no worker.",
    done: "Um workflow manual executar sem erro.",
    checklist: ["Redis rodando", "Editor publicado", "Webhooks publicados", "Worker rodando", "Runners conectados"]
  },
  {
    id: "ops",
    title: "Operacao minima",
    objective: "Aprender a ver saude, logs, atualizacao e rollback.",
    actions: ["Liste servicos.", "Veja logs.", "Confira tasks da stack.", "Aprenda onde fazer rollback no Portainer."],
    command: "docker service ls\ndocker stack ps NOME_DA_STACK\ndocker service logs NOME_DO_SERVICO --tail 100",
    validation: "Voce deve conseguir identificar se o problema e DNS, proxy, container ou banco.",
    done: "Voce souber diagnosticar uma falha simples.",
    checklist: ["Sei ver servicos", "Sei ver logs", "Sei ver stack ps", "Sei localizar rollback"]
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
    siteImage: "ghcr.io/axnconsult/site:main"
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
      memberApp.token = response.token;
      memberApp.member = response.member;
      memberApp.state = normalizeMemberState(response.state);
      saveMemberApp();
      setMemberStatus("auth", "");
      renderMemberApp();
    } catch {
      if (memberApp.mode === "login") {
        setMemberStatus("auth", "Nao consegui entrar pelo servidor. Se o banco local nao estiver ativo, crie uma conta para testar em modo local.", true);
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

    addAssistantMessage("user", value);
    addAssistantMessage("assistant", "Estou organizando sua resposta e preparando o proximo passo.");
    const pendingIndex = memberApp.state.assistantThreads[currentLessonKey()].length - 1;
    if (input) {
      input.value = "";
    }
    if (submit) submit.disabled = true;
    persistMemberState();
    renderAssistantThread();

    try {
      const result = await requestLessonAgentAnswer(module, stage, value);
      updateAssistantMessage(pendingIndex, result.answer);
      handleAgentHandoff(result);
    } catch {
      updateAssistantMessage(pendingIndex, buildLessonAgentAnswer(module, stage, value));
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

function renderModules() {
  const root = document.querySelector("#module-grid");
  if (!root) return;

  root.innerHTML = COURSE_MODULES.map((module) => `
    <article class="module-card">
      <span>Modulo ${module.number}</span>
      <h3>${escapeHtml(module.title)}</h3>
      <p>${escapeHtml(module.summary)}</p>
      <small>${module.stages.length} etapas</small>
      <button class="button button-secondary" type="button" data-module-id="${module.id}">Abrir modulo</button>
    </article>
  `).join("");

  root.querySelectorAll("[data-module-id]").forEach((button) => {
    button.addEventListener("click", () => openModule(button.dataset.moduleId));
  });
}

function openModule(moduleId) {
  memberApp.state.currentModule = moduleId;
  const module = currentModule();
  memberApp.state.currentLesson = `${module.id}.0`;
  memberApp.state.currentLessonStep = "main";
  persistMemberState();
  renderModuleDetail();
  showMemberView("module");
}

function renderModuleDetail() {
  const module = currentModule();
  if (!module) return;
  document.querySelector("#module-kicker").textContent = `Modulo ${module.number}`;
  document.querySelector("#module-title").textContent = module.title;
  document.querySelector("#module-summary").textContent = module.summary;
  renderLessonDetail(module, getStageIndex(module));
}

function renderLessonDetail(module, index) {
  const stage = module.stages[index] || module.stages[0];
  document.querySelector("#stage-kicker").textContent = `Modulo ${module.number} - Etapa ${index + 1} de ${module.stages.length}`;
  document.querySelector("#stage-title").textContent = stage[0];
  document.querySelector("#stage-summary").textContent = stage[1];
  document.querySelector("#stage-content").innerHTML = buildStageContent(stage, module);
  document.querySelector("#stage-progress-label").textContent = `Etapa ${index + 1} de ${module.stages.length}`;
  document.querySelector("#previous-stage").disabled = index === 0;
  document.querySelector("#next-stage").textContent = index === module.stages.length - 1 ? "Concluir modulo" : "Avancar";
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
    .replaceAll("{{siteImage}}", project.siteImage || "IMAGEM_DO_SITE_AQUI");
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
    return WIZARD_STEPS.map((step) => ({
      id: step.id,
      title: step.title,
      content: step.objective,
      command: step.command,
      checklist: step.checklist,
      validation: step.validation,
      done: step.done
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

  document.querySelectorAll("[data-copy-command]").forEach((button) => {
    button.addEventListener("click", async () => {
      const command = button.closest(".technical-command")?.querySelector("code")?.textContent || "";
      await navigator.clipboard?.writeText(command);
    });
  });

  document.querySelectorAll("[data-stage-check]").forEach((input) => {
    input.addEventListener("change", () => {
      memberApp.state.checklist[input.dataset.stageCheck] = input.checked;
      persistMemberState();
    });
  });
}

function buildLessonStepContent(step, lesson) {
  const checklist = (step.checklist || []).map((item, index) => {
    const id = `${currentLessonKey()}.${step.id}.${index}`;
    return `
      <label class="inline-check">
        <input type="checkbox" data-stage-check="${id}" ${memberApp.state.checklist[id] ? "checked" : ""} />
        ${escapeHtml(item)}
      </label>
    `;
  }).join("");

  const technical = lesson[2] === "technical" && step.command
    ? `
      <div class="technical-command">
        <div class="wizard-block-title">
          <h4>Comando gerado</h4>
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

  return `
    <p>${escapeHtml(step.content)}</p>
    ${technical}
    <div class="wizard-checklist">${checklist}</div>
  `;
}

function buildStageContent(stage, module) {
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
    throw new Error(data.error || "request_failed");
  }

  return data;
}

function normalizeMemberState(state) {
  const projectName = state?.project?.name === "Meu negocio online" ? "" : state?.project?.name;
  const moduleId = COURSE_MODULES.some((module) => module.id === state?.currentModule)
    ? state.currentModule
    : DEFAULT_MEMBER_STATE.currentModule;
  return {
    ...structuredClone(DEFAULT_MEMBER_STATE),
    ...(state || {}),
    project: {
      ...DEFAULT_MEMBER_STATE.project,
      ...(state?.project || {}),
      id: state?.project?.id || DEFAULT_MEMBER_STATE.project.id,
      name: projectName || ""
    },
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
    "Nao consegui acionar o assistente real agora. Tente novamente em instantes; sua resposta ficou registrada nesta conversa."
  ].join("\n");
}

function ensureAssistantThread(module, lesson) {
  const key = currentLessonKey();
  if (memberApp.state.assistantThreads[key]?.length) {
    return;
  }

  const opening = lesson[2] === "technical"
    ? "Vamos configurar esta parte como conversa guiada. Me diga o dominio, IP da VPS, e-mail tecnico e o que voce quer publicar."
    : `Vamos trabalhar a etapa "${lesson[0]}". Eu vou te conduzir com perguntas curtas. Para comecar: qual e o negocio ou ideia que voce quer validar agora?`;

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

function buildAssistantThreadForApi(key, currentInput) {
  const thread = [...(memberApp.state.assistantThreads[key] || [])];
  const pendingText = "Estou organizando sua resposta e preparando o proximo passo.";

  if (thread.at(-1)?.role === "assistant" && thread.at(-1)?.text === pendingText) {
    thread.pop();
  }

  if (thread.at(-1)?.role === "user" && String(thread.at(-1)?.text || "").trim() === String(currentInput || "").trim()) {
    thread.pop();
  }

  return thread;
}

async function requestLessonAgentAnswer(module, stage, input) {
  if (!memberApp.token || memberApp.token.startsWith("local-")) {
    return {
      answer: buildLessonAgentAnswer(module, stage, input),
      status: "conversation",
      agentId: stage[3] || "",
      nextAgentId: ""
    };
  }

  ensureProjectId();
  const key = currentLessonKey();
  const stagePayload = buildStagePayload(stage, key);
  const response = await postMemberApi("/api/operation/assistant", {
    token: memberApp.token,
    project: memberApp.state.project,
    module: {
      id: module.id,
      number: module.number,
      title: module.title,
      summary: module.summary
    },
    stage: stagePayload,
    stageKey: key,
    message: input,
    thread: buildAssistantThreadForApi(key, input)
  });

  const answer = response.answer || buildLessonAgentAnswer(module, stage, input);
  if (response.status === "completed" || response.status === "result") {
    markCurrentStageComplete();
  }
  return {
    answer,
    status: response.status,
    agentId: response.agent_id,
    nextAgentId: response.next_agent_id || response.next_recommended_agent || ""
  };
}

function handleAgentHandoff(result) {
  if (!result || result.status !== "result" || !result.nextAgentId) return;

  const module = currentModule();
  const nextIndex = stageIndexForAgentId(module, result.nextAgentId);
  if (nextIndex < 0 || nextIndex === getStageIndex(module)) return;

  memberApp.state.currentLesson = `${module.id}.${nextIndex}`;
  memberApp.state.currentLessonStep = "main";
  persistMemberState();
  renderModuleDetail();
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

function stageIndexForAgentId(module, agentId) {
  const target = String(agentId || "");
  return (module?.stages || []).findIndex((stage, index) => (stage[3] || agentIdForStageKey(`${module.id}.${index}`)) === target);
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
