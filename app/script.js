const DEFAULT_AXON_CONFIG = {
  social: {
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    linkedin: "https://linkedin.com/"
  },
  webhooks: {
    lead: "https://hooks.axnconsult.com.br/site-lead",
    consultoria: "https://hooks.axnconsult.com.br/site-consultoria",
    perfil: "https://hooks.axnconsult.com.br/site-perfil"
  },
  checkout: {
    deploy: "",
    operacaoComercial: "",
    consultoria: ""
  }
};

const AXON_CONFIG = mergeConfig(
  DEFAULT_AXON_CONFIG,
  typeof window !== "undefined" ? window.AXON_RUNTIME_CONFIG || {} : {}
);

const THANK_YOU_COPY = {
  curso: {
    title: "Seu interesse nos cursos da Axon foi registrado.",
    copy:
      "Você entrou na fila das próximas turmas. O próximo passo natural é conectar este formulário a CRM, e-mail e checkout."
  },
  consultoria: {
    title: "Sua triagem de consultoria foi recebida.",
    copy:
      "Agora a Axon já tem contexto suficiente para uma resposta manual mais inteligente. Em produção, este fluxo pode seguir para HubSpot, e-mail e agenda."
  },
  ferramenta: {
    title: "Ferramenta liberada.",
    copy:
      "Seu acesso foi registrado neste MVP. Abaixo da dobra está o gerador de prompts da Axon pronto para uso."
  }
};

const demoNewsProfile = {
  niche: "Consultoria e implementação de operação comercial com IA para pequenas empresas.",
  audience: "Empreendedores e donos de pequenas empresas travados entre teoria, atendimento caotico e vendas sem processo.",
  voice: "Direto, pratico, anti-teoria e orientado a execucao.",
  goal: "Gerar autoridade, conversa e interesse pelas ofertas da Axon."
};

const rankedNews = [
  {
    id: 1,
    title: "OpenAI amplia recursos para construir agentes empresariais",
    source: "OpenAI",
    date: "12 mar 2026",
    summary: "Atualizacao reforca o foco da IA em fluxos reais de negocio, nao apenas em chats isolados.",
    fit: "Conecta com a tese da Axon de tirar IA do piloto e levar para a operação.",
    angle: "Quando a IA entra no processo, o diferencial sai da ferramenta e vai para a implementacao.",
    popularity: "Alta visibilidade por ser anuncio oficial de plataforma.",
    link: "https://openai.com/"
  },
  {
    id: 2,
    title: "Google acelera Gemini no Workspace para produtividade operacional",
    source: "Google",
    date: "11 mar 2026",
    summary: "Os novos recursos mostram a IA sendo empurrada para o fluxo diario de empresas e times enxutos.",
    fit: "Ajuda a discutir como pequenas empresas podem operar melhor com menos gente.",
    angle: "O mercado nao esta premiando quem tem acesso a IA, mas quem consegue embedar IA na rotina.",
    popularity: "Tema recorrente e amplo para profissionais e pequenas empresas.",
    link: "https://blog.google/"
  },
  {
    id: 3,
    title: "Plataformas de CRM reforcam automacao com IA para vendas",
    source: "Salesforce",
    date: "10 mar 2026",
    summary: "O movimento reforca que atendimento, follow-up e revenue workflows estao virando terreno central da IA.",
    fit: "Conversa diretamente com CRM, funil e previsibilidade comercial.",
    angle: "Sem processo comercial claro, IA vira custo bonito em vez de aumento real de receita.",
    popularity: "Forte aderência para quem pensa em vendas e operação.",
    link: "https://www.salesforce.com/news/"
  },
  {
    id: 4,
    title: "Ferramentas no-code reposicionam IA para pequenos times",
    source: "Zapier",
    date: "9 mar 2026",
    summary: "Novidades em automacao mostram que times pequenos conseguem montar fluxos antes restritos a estruturas maiores.",
    fit: "Excelente para a tese de democratizacao de capacidade operacional.",
    angle: "A vantagem nao esta em empilhar stack. Esta em escolher poucos fluxos que realmente rodam.",
    popularity: "Alta relevancia para pequenos negocios e creators.",
    link: "https://zapier.com/blog/"
  },
  {
    id: 5,
    title: "Atendimento com IA vira pauta central em software de suporte",
    source: "TechCrunch",
    date: "8 mar 2026",
    summary: "O tema mostra que o jogo do atendimento saiu da curiosidade e entrou na infraestrutura comercial.",
    fit: "Abre uma boa conversa sobre resposta, triagem e qualidade de atendimento.",
    angle: "Se você responde mal ou tarde, não precisa de mais lead. Precisa de operação.",
    popularity: "Boa chance de gerar comentario pela proximidade com dor real do mercado.",
    link: "https://techcrunch.com/"
  },
  {
    id: 6,
    title: "Anthropic reforca uso de IA em fluxos longos de trabalho",
    source: "Anthropic",
    date: "7 mar 2026",
    summary: "A narrativa saiu do prompt isolado e foi para tarefas com contexto e continuidade.",
    fit: "Bom gancho para diferenciar tarefa pontual de processo operacional.",
    angle: "Nao adianta pedir genialidade da IA se o seu processo continua quebrado.",
    popularity: "Marca forte e assunto em alta no ecossistema de IA.",
    link: "https://www.anthropic.com/news"
  },
  {
    id: 7,
    title: "Microsoft leva Copilot para fluxos de vendas e atendimento",
    source: "Microsoft",
    date: "7 mar 2026",
    summary: "A expansão mostra a IA cada vez mais perto da operação diária de revenue teams.",
    fit: "Serve bem para falar de vendas, follow-up e produtividade comercial.",
    angle: "O futuro próximo não é ter IA. É ter equipe e IA operando juntas com menos atrito.",
    popularity: "Tema enterprise com alto alcance.",
    link: "https://news.microsoft.com/"
  },
  {
    id: 8,
    title: "Nvidia reforca corrida por infraestrutura de agentes",
    source: "Wired",
    date: "6 mar 2026",
    summary: "Mais infraestrutura para agentes pressiona o mercado a profissionalizar a implementacao.",
    fit: "Bom para reforcar que ferramenta vai commoditizar e execucao vai diferenciar.",
    angle: "Se a infraestrutura barateia, o valor migra para quem sabe acoplar isso a receita.",
    popularity: "Tema quente por envolver Nvidia e agentes.",
    link: "https://www.wired.com/"
  },
  {
    id: 9,
    title: "HubSpot reforca IA para marketing e vendas conectados",
    source: "HubSpot",
    date: "5 mar 2026",
    summary: "Mais um sinal de que conteudo, CRM e comercial estao convergindo em um unico sistema.",
    fit: "Muito alinhado ao discurso de operação comercial integrada.",
    angle: "Marketing sozinho nao resolve. Vendas sozinhas tambem nao. O ganho aparece na conexao.",
    popularity: "Boa aderencia para o publico da Axon.",
    link: "https://blog.hubspot.com/"
  },
  {
    id: 10,
    title: "Mercado de IA pressiona empresas a revisar a jornada do cliente",
    source: "MIT Technology Review",
    date: "4 mar 2026",
    summary: "A pressao competitiva empurra negocios a redesenhar atendimento e experiencia com IA.",
    fit: "Abre conversa sobre jornada, pontos de contato e resposta mais inteligente.",
    angle: "Nao basta automatizar touchpoints. E preciso desenhar uma jornada que faca sentido.",
    popularity: "Tema denso e com boa percepcao de credibilidade.",
    link: "https://www.technologyreview.com/"
  }
];

const newsState = {
  profile: null,
  currentBatch: 0,
  selectedNews: null,
  selectedPlatform: null
};

const entrepreneurQuestions = [
  {
    id: "q1",
    text: "Ganhar mais dinheiro e construir estabilidade financeira é o principal motivo para eu empreender hoje.",
    helper: "Camada: motivação",
    type: "motivation",
    scoring: { money: 1 }
  },
  {
    id: "q2",
    text: "Ter liberdade para decidir meu ritmo, minha agenda e meu jeito de trabalhar pesa mais do que crescer rápido.",
    helper: "Camada: motivação",
    type: "motivation",
    scoring: { autonomy: 1 }
  },
  {
    id: "q3",
    text: "Eu empreendo porque quero fazer algo que tenha significado real para mim e para outras pessoas.",
    helper: "Camada: motivação",
    type: "motivation",
    scoring: { purpose: 1 }
  },
  {
    id: "q4",
    text: "Se eu não fizer meu negócio andar, minha situação financeira ou profissional fica apertada rápido.",
    helper: "Camada: motivação",
    type: "motivation",
    scoring: { necessity: 1 }
  },
  {
    id: "q5",
    text: "Mesmo sem vontade, eu consigo manter rotina, constância e entregas por bastante tempo.",
    helper: "Camada: comportamento",
    type: "behavior",
    scoring: { discipline: 1 }
  },
  {
    id: "q6",
    text: "Eu tenho facilidade para imaginar novas possibilidades, campanhas, produtos e caminhos pouco óbvios.",
    helper: "Camada: comportamento",
    type: "behavior",
    scoring: { creativity: 1 }
  },
  {
    id: "q7",
    text: "Conversar, persuadir, vender e puxar relacionamento com outras pessoas me energiza.",
    helper: "Camada: comportamento",
    type: "behavior",
    scoring: { sociability: 1 }
  },
  {
    id: "q8",
    text: "Quando algo dá errado, eu consigo manter clareza e seguir agindo sem me desmontar fácil.",
    helper: "Camada: comportamento",
    type: "behavior",
    scoring: { emotional_stability: 1 }
  },
  {
    id: "q9",
    text: "Eu enxergo com facilidade o que faz sentido construir, priorizar e para onde o negócio deveria ir.",
    helper: "Camada: perfil operacional",
    type: "operational",
    scoring: { strategist: 1 }
  },
  {
    id: "q10",
    text: "Eu funciono melhor quando existe algo concreto para executar agora, sem muita enrolação.",
    helper: "Camada: perfil operacional",
    type: "operational",
    scoring: { executor: 1 }
  },
  {
    id: "q11",
    text: "Minha melhor energia aparece quando preciso convencer, influenciar ou transformar interesse em venda.",
    helper: "Camada: perfil operacional",
    type: "operational",
    scoring: { communicator: 1 }
  },
  {
    id: "q12",
    text: "Eu gero mais valor quando aprofundo domínio técnico e resolvo problemas com alta qualidade.",
    helper: "Camada: perfil operacional",
    type: "operational",
    scoring: { specialist: 1 }
  },
  {
    id: "q13",
    text: "Eu gosto de organizar fluxo, padronizar processo, acompanhar indicadores e manter a casa em ordem.",
    helper: "Camada: perfil operacional",
    type: "operational",
    scoring: { manager: 1 }
  },
  {
    id: "q14",
    text: "Hoje meu maior gargalo não é ter ideias, e sim conseguir estruturar tudo para a operação não depender do meu improviso.",
    helper: "Camada: perfil operacional",
    type: "operational",
    scoring: { executor: 0.5, manager: 0.5, strategist: 0.25 }
  }
];

const entrepreneurResults = {
  strategist: {
    label: "Estrategista",
    description:
      "Você lê bem direção, oportunidade e posicionamento. Seu valor aparece quando consegue enxergar o desenho maior antes da maioria.",
    risk:
      "Virar uma fábrica de ideias boas sem lastro de execução, ficando preso em visão sem materialização consistente.",
    blindspot:
      "Confundir clareza estratégica com progresso real. Nem sempre pensar melhor significa operar melhor.",
    nextStep:
      "Transformar direção em sistema: oferta, rotina comercial, CRM, follow-up e prioridade semanal.",
    ctaLabel: "Ver o Deploy",
    ctaHref: "./deploy.html",
    ctaCopy:
      "Seu próximo salto tende a vir de execução assistida. O Deploy foi desenhado exatamente para tirar estratégia do papel."
  },
  executor: {
    label: "Executor",
    description:
      "Você ganha tração quando existe ação clara. Seu valor aparece na capacidade de fazer andar e não deixar o negócio parado.",
    risk:
      "Executar demais em cima de uma estrutura fraca e acabar produzindo volume sem previsibilidade.",
    blindspot:
      "Subestimar o peso de posicionamento, sistema comercial e acompanhamento de dados.",
    nextStep:
      "Organizar melhor a estrutura antes de acelerar mais: funil, mensagem, rotina e automações básicas.",
    ctaLabel: "Conhecer Operação Comercial",
    ctaHref: "./operacao-comercial.html",
    ctaCopy:
      "Você tende a aproveitar melhor um passo a passo estruturado. O curso Operação Comercial encaixa bem nesse momento."
  },
  communicator: {
    label: "Comunicador",
    description:
      "Você gera valor em relação, influência, venda e leitura do outro. Seu negócio tende a ganhar quando a comunicação vira processo.",
    risk:
      "Depender demais do carisma e deixar receita vulnerável quando a operação não acompanha sua capacidade comercial.",
    blindspot:
      "Achar que a força da comunicação substitui estrutura de atendimento, CRM e acompanhamento.",
    nextStep:
      "Empacotar melhor o seu poder de venda dentro de uma operação com resposta, triagem e follow-up mais previsíveis.",
    ctaLabel: "Ver consultoria",
    ctaHref: "./consultoria.html",
    ctaCopy:
      "Seu potencial cresce muito quando relacionamento e venda deixam de depender só de você. A consultoria pode acelerar isso."
  },
  specialist: {
    label: "Especialista",
    description:
      "Você gera valor principalmente por domínio técnico, profundidade e qualidade da entrega. Seu negócio costuma ter substância real.",
    risk:
      "Virar refém do próprio conhecimento e crescer pouco porque marketing, vendas e follow-up ficam fracos.",
    blindspot:
      "Acreditar que um serviço excelente se vende sozinho, mesmo sem sistema de aquisição e atendimento.",
    nextStep:
      "Traduzir melhor seu valor para uma oferta mais clara e uma operação comercial que não dependa apenas de indicação.",
    ctaLabel: "Começar pela Operação Comercial",
    ctaHref: "./operacao-comercial.html",
    ctaCopy:
      "Seu caso normalmente melhora quando o técnico deixa de competir com o comercial. O curso pode te ajudar a montar essa ponte."
  },
  manager: {
    label: "Gestor",
    description:
      "Você gera valor quando cria ordem, sistema, previsibilidade e processo. Sua força está em fazer o negócio funcionar com menos caos.",
    risk:
      "Organizar demais uma proposta ainda fraca ou burocratizar antes de validar o que realmente move receita.",
    blindspot:
      "Confundir controle com crescimento. Nem todo ajuste interno melhora o valor percebido pelo cliente.",
    nextStep:
      "Equilibrar estrutura com aquisição e venda, para a operação sustentar crescimento em vez de só manter ordem.",
    ctaLabel: "Pedir diagnóstico",
    ctaHref: "./consultoria.html",
    ctaCopy:
      "Seu perfil responde bem a ajuste fino de processo. A consultoria tende a fazer mais sentido quando o desafio já é estrutural."
  }
};

const motivationLabels = {
  money: "Dinheiro",
  autonomy: "Autonomia",
  purpose: "Propósito",
  necessity: "Necessidade"
};

const behaviorLabels = {
  discipline: "Disciplina",
  creativity: "Criatividade",
  sociability: "Sociabilidade",
  emotional_stability: "Estabilidade emocional"
};

boot();

function boot() {
  wireMenu();
  markActiveNav();
  injectSocialLinks();
  wireForms();
  wireEntrepreneurProfile();
  wireToolAccess();
  wirePromptBuilder();
  wireNewsCurator();
  wireThankYouPage();
}

function wireMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function markActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) {
      return;
    }

    const normalized = href.replace("./", "");
    if (path === normalized || (path === "" && normalized === "index.html")) {
      link.classList.add("active");
    }
  });
}

function injectSocialLinks() {
  document.querySelectorAll("[data-social-link]").forEach((link) => {
    const network = link.dataset.socialLink;
    const href = AXON_CONFIG.social[network];
    if (href) {
      link.href = href;
    }
  });
}

function wireForms() {
  document.querySelectorAll("[data-form-type]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = formDataToObject(formData);
      const formType = form.dataset.formType || "curso";
      const endpoint = getWebhookEndpoint(formType);
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : "";
      const status = ensureFormStatus(form);

      clearFormStatus(status);
      setFormLoading(submitButton, true, "Enviando...");

      if (formType === "ferramenta") {
        try {
          await submitWebhook(endpoint, {
            ...buildSubmissionMeta(formType),
            ...payload
          });

          window.localStorage.setItem("axonToolUnlocked", "true");
          const tool = document.querySelector("#tool-builder");
          if (tool) {
            tool.classList.remove("hidden");
            tool.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          form.classList.add("hidden");
          setFormStatus(status, "success", "Ferramenta liberada.");
        } catch (error) {
          setFormStatus(status, "error", "Nao foi possivel liberar a ferramenta agora. Tente novamente.");
        } finally {
          setFormLoading(submitButton, false, originalButtonText);
        }
        return;
      }

      try {
        await submitWebhook(endpoint, {
          ...buildSubmissionMeta(formType),
          ...payload
        });

        const query = new URLSearchParams({
          type: formType,
          interest: payload.interest || ""
        });
        const isNested = window.location.pathname.includes("/ferramentas/");
        const target = isNested ? "../obrigado.html" : "./obrigado.html";
        window.location.href = `${target}?${query.toString()}`;
      } catch (error) {
        setFormStatus(status, "error", "Nao foi possivel enviar agora. Verifique a conexao e tente novamente.");
      } finally {
        setFormLoading(submitButton, false, originalButtonText);
      }
    });
  });
}

function getWebhookEndpoint(formType) {
  if (formType === "consultoria") {
    return AXON_CONFIG.webhooks.consultoria;
  }

  if (formType === "perfil_empreendedor") {
    return AXON_CONFIG.webhooks.perfil;
  }

  return AXON_CONFIG.webhooks.lead;
}

function buildSubmissionMeta(formType) {
  return {
    formType,
    page: window.location.pathname,
    title: document.title,
    createdAt: new Date().toISOString()
  };
}

async function submitWebhook(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function ensureFormStatus(form) {
  let status = form.querySelector(".form-status");
  if (!status) {
    status = document.createElement("p");
    status.className = "form-status";
    form.appendChild(status);
  }
  return status;
}

function clearFormStatus(status) {
  if (!status) {
    return;
  }

  status.textContent = "";
  status.classList.remove("form-status-success", "form-status-error");
}

function setFormStatus(status, kind, message) {
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.remove("form-status-success", "form-status-error");
  status.classList.add(kind === "success" ? "form-status-success" : "form-status-error");
}

function setFormLoading(button, isLoading, loadingText) {
  if (!button) {
    return;
  }

  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  if (isLoading) {
    button.textContent = loadingText;
  }
}

function formDataToObject(formData) {
  const output = {};

  for (const [key, value] of formData.entries()) {
    if (Object.prototype.hasOwnProperty.call(output, key)) {
      const current = output[key];
      output[key] = Array.isArray(current) ? [...current, value] : [current, value];
    } else {
      output[key] = value;
    }
  }

  return output;
}

function wireToolAccess() {
  const isUnlocked = window.localStorage.getItem("axonToolUnlocked") === "true";
  const tool = document.querySelector("#tool-builder");
  const form = document.querySelector("#tool-access-form");

  if (!tool || !form) {
    return;
  }

  if (isUnlocked) {
    tool.classList.remove("hidden");
  }
}

function wireEntrepreneurProfile() {
  const gateForm = document.querySelector("#profile-gate-form");
  const quizSection = document.querySelector("#entrepreneur-quiz-section");
  const quizForm = document.querySelector("#entrepreneur-quiz-form");
  const questionsRoot = document.querySelector("#entrepreneur-questions");
  const resultSection = document.querySelector("#entrepreneur-result-section");

  if (!gateForm || !quizSection || !quizForm || !questionsRoot || !resultSection) {
    return;
  }

  renderEntrepreneurQuestions(questionsRoot);
  let leadPayload = null;
  const gateStatus = ensureFormStatus(gateForm);
  const quizStatus = ensureFormStatus(quizForm);

  gateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    leadPayload = {
      ...formDataToObject(new FormData(gateForm)),
      interest: "Perfil Empreendedor"
    };
    clearFormStatus(gateStatus);
    gateForm.classList.add("hidden");
    quizSection.classList.remove("hidden");
    quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  quizForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const answers = formDataToObject(new FormData(quizForm));
    const submitButton = quizForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : "";
    if (!allQuestionsAnswered(answers)) {
      return;
    }

    if (!leadPayload) {
      setFormStatus(quizStatus, "error", "Preencha seus dados antes de gerar o diagnostico.");
      return;
    }

    const result = evaluateEntrepreneurProfile(answers);
    clearFormStatus(quizStatus);
    setFormLoading(submitButton, true, "Calculando...");

    try {
      await submitWebhook(getWebhookEndpoint("perfil_empreendedor"), {
        ...buildSubmissionMeta("perfil_empreendedor"),
        lead: leadPayload,
        answers,
        result
      });

      paintEntrepreneurResult(result);
      resultSection.classList.remove("hidden");
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      setFormStatus(quizStatus, "error", "Nao foi possivel salvar seu diagnostico agora. Tente novamente.");
    } finally {
      setFormLoading(submitButton, false, originalButtonText);
    }
  });
}

function renderEntrepreneurQuestions(root) {
  root.innerHTML = "";

  entrepreneurQuestions.forEach((question, index) => {
    const article = document.createElement("article");
    article.className = "question-card";
    article.innerHTML = `
      <h3>${index + 1}. ${question.text}</h3>
      <p>${question.helper}</p>
      <div class="likert-grid">
        ${[1, 2, 3, 4, 5]
          .map(
            (value) => `
              <label class="likert-option">
                <input type="radio" name="${question.id}" value="${value}" required />
                <span>${likertLabel(value)}</span>
              </label>
            `
          )
          .join("")}
      </div>
    `;
    root.appendChild(article);
  });
}

function allQuestionsAnswered(answers) {
  return entrepreneurQuestions.every((question) => Boolean(answers[question.id]));
}

function evaluateEntrepreneurProfile(answers) {
  const motivationScores = { money: 0, autonomy: 0, purpose: 0, necessity: 0 };
  const behaviorScores = {
    discipline: 0,
    creativity: 0,
    sociability: 0,
    emotional_stability: 0
  };
  const operationalScores = {
    strategist: 0,
    executor: 0,
    communicator: 0,
    specialist: 0,
    manager: 0
  };

  entrepreneurQuestions.forEach((question) => {
    const value = Number(answers[question.id] || 0);
    Object.entries(question.scoring).forEach(([dimension, weight]) => {
      if (question.type === "motivation") {
        motivationScores[dimension] += value * weight;
      }
      if (question.type === "behavior") {
        behaviorScores[dimension] += value * weight;
      }
      if (question.type === "operational") {
        operationalScores[dimension] += value * weight;
      }
    });
  });

  const dominantMotivation = getTopKey(motivationScores);
  const dominantOperational = getTopKey(operationalScores);
  const dominantBehavior = getTopKey(behaviorScores);
  const lowestBehavior = getLowestKey(behaviorScores);
  const operationalCopy = entrepreneurResults[dominantOperational];

  return {
    dominantMotivation,
    dominantOperational,
    dominantBehavior,
    lowestBehavior,
    motivationScores,
    behaviorScores,
    operationalScores,
    composite: `Você é um ${operationalCopy.label}, motivado por ${motivationLabels[dominantMotivation].toLowerCase()}, com tendência dominante de ${behaviorLabels[dominantBehavior].toLowerCase()}.`,
    title: `${operationalCopy.label}: seu valor existe, mas a estrutura ainda define o tamanho do seu crescimento.`,
    description: operationalCopy.description,
    risk: operationalCopy.risk,
    blindspot: buildBlindspot(operationalCopy.blindspot, lowestBehavior),
    nextStep: buildNextStep(operationalCopy.nextStep, dominantMotivation),
    ctaLabel: operationalCopy.ctaLabel,
    ctaHref: operationalCopy.ctaHref,
    ctaCopy: operationalCopy.ctaCopy
  };
}

function paintEntrepreneurResult(result) {
  setText("#result-composite", result.composite);
  setText("#result-title", result.title);
  setText("#result-description", result.description);
  setText("#result-risk", result.risk);
  setText("#result-blindspot", result.blindspot);
  setText("#result-next-step", result.nextStep);
  setText("#result-cta-copy", result.ctaCopy);

  const cta = document.querySelector("#result-cta-link");
  if (cta) {
    cta.textContent = result.ctaLabel;
    cta.href = result.ctaHref;
  }

  const layers = document.querySelector("#result-layers");
  if (layers) {
    layers.innerHTML = `
      <article class="layer-card">
        <h4>Perfil operacional dominante</h4>
        <p>${entrepreneurResults[result.dominantOperational].label}</p>
      </article>
      <article class="layer-card">
        <h4>Motivação dominante</h4>
        <p>${motivationLabels[result.dominantMotivation]}</p>
      </article>
      <article class="layer-card">
        <h4>Tendência comportamental</h4>
        <p>${behaviorLabels[result.dominantBehavior]}</p>
      </article>
    `;
  }
}

function wirePromptBuilder() {
  const form = document.querySelector("#prompt-builder-form");
  const output = document.querySelector("#prompt-output");
  const copyButton = document.querySelector("#copy-prompt");

  if (!form || !output || !copyButton) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    output.textContent = buildPrompt(values);
  });

  copyButton.addEventListener("click", async () => {
    if (!output.textContent.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output.textContent);
      copyButton.textContent = "Copiado";
      copyButton.classList.add("status-success");
      window.setTimeout(() => {
        copyButton.textContent = "Copiar";
        copyButton.classList.remove("status-success");
      }, 1400);
    } catch (error) {
      copyButton.textContent = "Falhou";
      window.setTimeout(() => {
        copyButton.textContent = "Copiar";
      }, 1400);
    }
  });
}

function wireNewsCurator() {
  const profileForm = document.querySelector("#news-profile-form");
  const fillDemoButton = document.querySelector("#news-fill-demo");
  const newsPanel = document.querySelector("#news-panel");
  const newsList = document.querySelector("#news-list");
  const refreshButton = document.querySelector("#refresh-news");
  const newsBatchLabel = document.querySelector("#news-batch-label");
  const composePanel = document.querySelector("#news-compose-panel");
  const selectedNewsChip = document.querySelector("#selected-news-chip");
  const platformGrid = document.querySelector("#platform-grid");
  const generateButton = document.querySelector("#generate-news-post");
  const outputPanel = document.querySelector("#news-output-panel");
  const outputPlatform = document.querySelector("#news-output-platform");
  const outputTitle = document.querySelector("#news-output-title");
  const output = document.querySelector("#news-post-output");
  const copyButton = document.querySelector("#copy-news-post");

  if (!profileForm) {
    return;
  }

  fillDemoButton?.addEventListener("click", () => {
    profileForm.querySelector('[name="niche"]').value = demoNewsProfile.niche;
    profileForm.querySelector('[name="audience"]').value = demoNewsProfile.audience;
    profileForm.querySelector('[name="voice"]').value = demoNewsProfile.voice;
    profileForm.querySelector('[name="goal"]').value = demoNewsProfile.goal;
  });

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(profileForm);
    newsState.profile = Object.fromEntries(formData.entries());
    newsState.currentBatch = 0;
    newsState.selectedNews = null;
    newsState.selectedPlatform = null;
    renderNews();
    newsPanel?.classList.remove("hidden");
    composePanel?.classList.add("hidden");
    outputPanel?.classList.add("hidden");
    newsPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  refreshButton?.addEventListener("click", () => {
    newsState.currentBatch = newsState.currentBatch === 0 ? 1 : 0;
    newsState.selectedNews = null;
    newsState.selectedPlatform = null;
    renderNews();
    composePanel?.classList.add("hidden");
    outputPanel?.classList.add("hidden");
  });

  platformGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-platform]");
    if (!button) {
      return;
    }

    newsState.selectedPlatform = button.dataset.platform;
    document.querySelectorAll(".platform-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.platform === newsState.selectedPlatform);
    });
  });

  generateButton?.addEventListener("click", () => {
    if (!newsState.profile || !newsState.selectedNews || !newsState.selectedPlatform) {
      return;
    }

    outputPlatform.textContent = newsState.selectedPlatform;
    outputTitle.textContent = newsState.selectedNews.title;
    output.textContent = buildNewsPost(
      newsState.profile,
      newsState.selectedNews,
      newsState.selectedPlatform
    );
    outputPanel?.classList.remove("hidden");
    outputPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  copyButton?.addEventListener("click", async () => {
    if (!output?.textContent.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output.textContent);
      copyButton.textContent = "Copiado";
      window.setTimeout(() => {
        copyButton.textContent = "Copiar";
      }, 1400);
    } catch (error) {
      copyButton.textContent = "Falhou";
      window.setTimeout(() => {
        copyButton.textContent = "Copiar";
      }, 1400);
    }
  });

  function renderNews() {
    if (!newsList || !newsBatchLabel) {
      return;
    }

    const start = newsState.currentBatch === 0 ? 0 : 5;
    const end = newsState.currentBatch === 0 ? 5 : 10;
    const items = rankedNews.slice(start, end);

    newsBatchLabel.textContent =
      newsState.currentBatch === 0
        ? "Top 5 para postar agora."
        : "Segunda leva ativa: posicoes 6 a 10.";

    if (refreshButton) {
      refreshButton.textContent =
        newsState.currentBatch === 0 ? "[Refresh]" : "[Voltar ao Top 5]";
    }

    newsList.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "news-card";
      card.innerHTML = `
        <div class="news-card-header">
          <div>
            <p class="eyebrow">Rank #${item.id}</p>
            <h3>${item.title}</h3>
          </div>
          <span class="button button-secondary">${item.source}</span>
        </div>
        <p class="news-meta">${item.date}</p>
        <p><strong>Resumo:</strong> ${item.summary}</p>
        <p><strong>Por que combina:</strong> ${item.fit}</p>
        <p><strong>Angulo de discussao:</strong> ${item.angle}</p>
        <p><strong>Sinal de popularidade:</strong> ${item.popularity}</p>
        <p><a href="${item.link}" target="_blank" rel="noreferrer">Abrir fonte</a></p>
        <div class="form-actions">
          <button class="button button-primary news-select" type="button" data-news-id="${item.id}">
            Escolher esta noticia
          </button>
        </div>
      `;
      newsList.appendChild(card);
    });

    newsList.querySelectorAll(".news-select").forEach((button) => {
      button.addEventListener("click", () => {
        const selectedId = Number(button.dataset.newsId);
        newsState.selectedNews = rankedNews.find((item) => item.id === selectedId) || null;
        newsList.querySelectorAll(".news-card").forEach((card) => {
          const cardButton = card.querySelector(".news-select");
          card.classList.toggle("selected", Number(cardButton.dataset.newsId) === selectedId);
        });
        selectedNewsChip.textContent = `Noticia escolhida: Rank #${newsState.selectedNews.id}`;
        composePanel?.classList.remove("hidden");
        outputPanel?.classList.add("hidden");
        composePanel?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }
}

function buildPrompt(values) {
  const role = compact(values.role);
  const audience = compact(values.audience);
  const context = compact(values.context);
  const goal = compact(values.goal);
  const format = compact(values.format);
  const constraints = compact(values.constraints);

  let prompt = `Você é ${role}.\n\n`;
  prompt += `Publico-alvo: ${audience}.\n\n`;
  prompt += `Contexto: ${context}.\n\n`;
  prompt += `Objetivo: ${goal}.\n\n`;
  prompt += `Formato de resposta esperado: ${format}.`;

  if (constraints) {
    prompt += `\n\nRegras extras: ${constraints}.`;
  }

  prompt +=
    "\n\nSe faltar alguma informacao critica, faca poucas perguntas objetivas antes de responder. Se houver premissa ruim, aponte o problema com clareza e ofereca uma alternativa melhor.";

  return prompt;
}

function buildNewsPost(profile, news, platform) {
  const niche = compact(profile.niche);
  const audience = compact(profile.audience);
  const voice = compact(profile.voice);
  const goal = compact(profile.goal);

  const hook = `A notícia sobre "${news.title}" mostra uma coisa: IA está saindo do discurso e entrando na operação.`;
  const bridge = `Para quem atua com ${niche}, o ponto central não é a novidade em si. É o que ela revela sobre como empresas vão divulgar, atender e vender daqui para frente.`;
  const practical = `Para um publico como ${audience}, isso importa porque processo bem desenhado com IA tende a vencer improviso bonito.`;

  if (platform === "Instagram") {
    return `${hook}

${news.summary}

Minha leitura:
quem continuar tratando IA como curiosidade vai perder para quem transformar IA em rotina.

${bridge}

${practical}

No fim, o jogo nao e ter acesso a ferramenta.
E conseguir fazer a ferramenta virar sistema.

Tom da casa: ${voice}.

${goal}

Você acha que o mercado já percebeu isso ou ainda está preso no hype?`;
  }

  if (platform === "X") {
    return `${news.title}

Minha opiniao:
IA está migrando de "recurso legal" para infra de operação.

${practical}

Quem ainda fala so de ferramenta vai perder para quem falar de processo e execucao.

Isso ja apareceu no seu mercado ou ainda nao?`;
  }

  if (platform === "LinkedIn") {
    return `${news.title}

${news.summary}

O que eu leio aqui:

${bridge}

${practical}

O mercado esta ficando menos impressionado com acesso a IA e mais atento a quem consegue integrar IA a marketing, atendimento e vendas com consistencia.

Na prática, isso muda a conversa: a vantagem não está em testar mais uma ferramenta. Está em desenhar uma operação que use melhor as ferramentas que já existem.

Tom: ${voice}.

Como você enxerga isso hoje no seu negócio: IA ainda é experimento ou já virou parte da operação?`;
  }

  return `${news.title}

Tese

${hook}

O que aconteceu

${news.summary}

Por que isso importa

${bridge}

${practical}

Ponto de vista

O sinal mais importante nao e o lancamento isolado. E a direcao do mercado: IA esta sendo acoplada a trabalho real, com impacto direto em atendimento, produtividade e receita.

Aprendizado para a audiencia

Se o seu negócio ainda trata IA como curiosidade ou entretenimento, você provavelmente está perdendo tempo. O ganho real aparece quando a tecnologia organiza melhor a operação.

Fechamento

${goal}

Pergunta final: no seu mercado, qual parte da operação deveria ser redesenhada primeiro por causa dessa mudança?`;
}

function wireThankYouPage() {
  const title = document.querySelector("#thank-you-title");
  const copy = document.querySelector("#thank-you-copy");

  if (!title || !copy) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") || "curso";
  const content = THANK_YOU_COPY[type] || THANK_YOU_COPY.curso;
  title.textContent = content.title;
  copy.textContent = content.copy;
}

function mergeConfig(base, override) {
  return {
    ...base,
    ...override,
    social: {
      ...base.social,
      ...(override.social || {})
    },
    webhooks: {
      ...base.webhooks,
      ...(override.webhooks || {})
    },
    checkout: {
      ...base.checkout,
      ...(override.checkout || {})
    }
  };
}

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function getTopKey(scores) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function getLowestKey(scores) {
  return Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
}

function likertLabel(value) {
  const labels = {
    1: "Discordo",
    2: "Discordo mais do que concordo",
    3: "Neutro",
    4: "Concordo mais do que discordo",
    5: "Concordo"
  };
  return labels[value];
}

function buildBlindspot(baseBlindspot, lowestBehavior) {
  return `${baseBlindspot} Hoje, o comportamento que mais tende a pedir atencao e ${behaviorLabels[
    lowestBehavior
  ].toLowerCase()}.`;
}

function buildNextStep(baseNextStep, dominantMotivation) {
  return `${baseNextStep} Como sua motivacao dominante hoje e ${motivationLabels[
    dominantMotivation
  ].toLowerCase()}, vale priorizar um caminho que respeite isso na implementacao.`;
}
