/* ===========================================================
   Deploy — Painel de Gestão
   Integrações: n8n em workflows.axnconsult.com
   =========================================================== */

const API = "https://workflows.axnconsult.com/webhook";
const CHAVE_TEMA = "painel:tema";
const CHAVE_ABA = "painel:aba";

const el = (id) => document.getElementById(id);
const norm = (j) => (Array.isArray(j) ? j[0] || {} : j || {});

async function pedir(rota, corpo, metodo = "POST") {
  const opcoes = { method: metodo, headers: { "Content-Type": "application/json" } };
  if (corpo) opcoes.body = JSON.stringify(corpo);

  let resposta;
  try {
    resposta = await fetch(`${API}/${rota}`, opcoes);
  } catch {
    throw new Error("Não consegui falar com o servidor. Verifique sua conexão.");
  }
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 404
        ? "O workflow não está ativo no n8n (404)."
        : `O servidor respondeu ${resposta.status}.`
    );
  }
  const texto = await resposta.text();
  if (!texto.trim()) return {};
  try {
    return JSON.parse(texto);
  } catch {
    throw new Error("O servidor devolveu uma resposta inválida.");
  }
}

/* ---------------- Markdown ---------------- */

function esc(valor) {
  return String(valor ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function mdLinha(texto) {
  return texto
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?=[^*\w]|$)/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

// Converte Markdown em HTML. O texto é escapado antes de qualquer marcação,
// então nada que venha da IA ou do banco pode injetar tags.
function md(origem) {
  const linhas = esc(origem).split(/\r?\n/);
  const saida = [];
  const celulas = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  const eBloco = (l) => /^\s*(\||#{1,6}\s|[-*+]\s|\d+[.)]\s)/.test(l) || /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l);
  let i = 0;

  while (i < linhas.length) {
    const linha = linhas[i];

    if (!linha.trim()) { i++; continue; }

    // Tabela: cabeçalho + linha separadora |---|---|
    if (/^\s*\|/.test(linha) && i + 1 < linhas.length && /^\s*\|?[\s:|-]*-[\s:|-]*\|/.test(linhas[i + 1])) {
      const cabecalho = celulas(linha);
      i += 2;
      const corpo = [];
      while (i < linhas.length && /^\s*\|/.test(linhas[i])) { corpo.push(celulas(linhas[i])); i++; }
      saida.push(
        '<div class="tabela-md-rolagem"><table class="tabela-md"><thead><tr>' +
          cabecalho.map((c) => `<th>${mdLinha(c)}</th>`).join("") +
          "</tr></thead><tbody>" +
          corpo.map((r) => "<tr>" + r.map((c) => `<td>${mdLinha(c)}</td>`).join("") + "</tr>").join("") +
          "</tbody></table></div>"
      );
      continue;
    }

    const titulo = linha.match(/^\s*(#{1,6})\s+(.*)$/);
    if (titulo) {
      const nivel = Math.min(titulo[1].length + 1, 6);
      saida.push(`<h${nivel}>${mdLinha(titulo[2])}</h${nivel}>`);
      i++;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(linha)) { saida.push("<hr>"); i++; continue; }

    if (/^\s*[-*+]\s+/.test(linha)) {
      const itens = [];
      while (i < linhas.length && /^\s*[-*+]\s+/.test(linhas[i])) { itens.push(linhas[i].replace(/^\s*[-*+]\s+/, "")); i++; }
      saida.push("<ul>" + itens.map((t) => `<li>${mdLinha(t)}</li>`).join("") + "</ul>");
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(linha)) {
      const itens = [];
      while (i < linhas.length && /^\s*\d+[.)]\s+/.test(linhas[i])) { itens.push(linhas[i].replace(/^\s*\d+[.)]\s+/, "")); i++; }
      saida.push("<ol>" + itens.map((t) => `<li>${mdLinha(t)}</li>`).join("") + "</ol>");
      continue;
    }

    const paragrafo = [];
    while (i < linhas.length && linhas[i].trim() && !eBloco(linhas[i])) { paragrafo.push(linhas[i].trim()); i++; }
    if (paragrafo.length) saida.push(`<p>${mdLinha(paragrafo.join("<br>"))}</p>`);
    else i++;
  }
  return saida.join("");
}

/* ---------------- Tema ---------------- */

(function tema() {
  const salvo = localStorage.getItem(CHAVE_TEMA);
  const inicial = salvo || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro");
  document.documentElement.dataset.tema = inicial;

  el("btn-tema").addEventListener("click", () => {
    const novo = document.documentElement.dataset.tema === "escuro" ? "claro" : "escuro";
    document.documentElement.dataset.tema = novo;
    localStorage.setItem(CHAVE_TEMA, novo);
  });
})();

/* ---------------- Abas ---------------- */

const jaAbriu = { administracao: false, marketing: false, vendas: false };

function mostraAba(nome) {
  document.querySelectorAll(".aba").forEach((b) => {
    const ativa = b.dataset.aba === nome;
    b.setAttribute("aria-selected", String(ativa));
  });
  document.querySelectorAll(".painel").forEach((p) => {
    p.hidden = p.id !== `painel-${nome}`;
  });
  localStorage.setItem(CHAVE_ABA, nome);

  if (!jaAbriu[nome]) {
    jaAbriu[nome] = true;
    if (chats[nome]) chats[nome].listar();
    if (nome === "marketing") { carregaGrade(); listaPecas(); }
  }
}

document.querySelectorAll(".aba").forEach((b) => {
  b.addEventListener("click", () => mostraAba(b.dataset.aba));
});

/* ---------------- Métricas + tabela de leads ---------------- */

async function carregaMetricas() {
  try {
    const dados = norm(await pedir("painel-metricas", null, "GET"));
    document.querySelectorAll("[data-metrica]").forEach((no) => {
      const valor = dados[no.dataset.metrica];
      no.textContent = valor === null || valor === undefined ? "—" : String(valor);
    });
    preencheLeads(Array.isArray(dados.ultimos) ? dados.ultimos : []);
  } catch (erro) {
    document.querySelectorAll("[data-metrica]").forEach((no) => { no.textContent = "—"; });
    el("tabela-leads").innerHTML = `<tr><td colspan="5" class="tabela-vazia">Não foi possível carregar: ${esc(erro.message)}</td></tr>`;
  }
}

function preencheLeads(lista) {
  const corpo = el("tabela-leads");
  const dez = lista.slice(0, 10);
  if (!dez.length) {
    corpo.innerHTML = '<tr><td colspan="5" class="tabela-vazia">Nenhum lead registrado ainda.</td></tr>';
    return;
  }
  corpo.innerHTML = dez
    .map(
      (l) => `<tr>
        <td>${esc(l.nome)}</td>
        <td>${esc(l.email)}</td>
        <td>${esc(l.whatsapp)}</td>
        <td>${esc(l.mensagem)}</td>
        <td>${esc(l.data)}</td>
      </tr>`
    )
    .join("");
}

/* ---------------- Grade de postagens ---------------- */

const botoesGrade = ["btn-gerar-grade", "btn-ajustar-grade", "btn-aprovar-grade", "btn-zero-grade", "btn-nova-grade"];
let gradeAtual = { grade_id: 0, status: "vazia", conteudo: "" };

function travaGrade(travado) {
  botoesGrade.forEach((id) => { el(id).disabled = travado; });
}

function erroGrade(mensagem) {
  const no = el("grade-erro");
  no.hidden = !mensagem;
  no.textContent = mensagem ? `⚠️ ${mensagem}` : "";
}

function renderGrade(grade) {
  gradeAtual = grade || { grade_id: 0, status: "vazia", conteudo: "" };
  const vazia = gradeAtual.status === "vazia" || !String(gradeAtual.conteudo || "").trim();
  const proposta = !vazia && gradeAtual.status === "proposta";
  const aprovada = !vazia && gradeAtual.status === "aprovada";

  el("grade-vazia").hidden = !vazia;
  el("grade-conteudo-wrap").hidden = vazia;
  el("grade-acoes-proposta").hidden = !proposta;
  el("grade-acoes-aprovada").hidden = !aprovada;

  const selo = el("grade-selo");
  selo.hidden = vazia;
  selo.className = "selo " + (aprovada ? "selo-aprovada" : "selo-proposta");
  selo.textContent = aprovada ? "Aprovada" : "Proposta — aguardando aprovação";

  const data = el("grade-data");
  data.hidden = vazia || !gradeAtual.atualizado_em;
  data.textContent = gradeAtual.atualizado_em ? `Atualizada em ${gradeAtual.atualizado_em}` : "";

  if (!vazia) el("grade-conteudo").innerHTML = md(gradeAtual.conteudo);
}

async function carregaGrade() {
  const carregando = el("grade-carregando");
  carregando.textContent = "Carregando a grade...";
  carregando.hidden = false;
  erroGrade("");
  try {
    const dados = norm(await pedir("grade-postagens", { action: "carregar" }));
    renderGrade(dados.grade || dados);
  } catch (erro) {
    erroGrade(`Não consegui carregar a grade. ${erro.message}`);
  } finally {
    carregando.hidden = true;
  }
}

async function geraGrade(corpo) {
  const carregando = el("grade-carregando");
  carregando.textContent = "Gerando sua grade... isso leva de 30 a 120 segundos.";
  carregando.hidden = false;
  erroGrade("");
  travaGrade(true);
  try {
    const dados = norm(await pedir("grade-postagens", { action: "gerar", ...corpo }));
    renderGrade({
      grade_id: dados.grade_id,
      conteudo: dados.conteudo,
      status: dados.status || "proposta",
      atualizado_em: dados.atualizado_em,
    });
    el("grade-orientacoes").value = "";
    el("grade-feedback").value = "";
  } catch (erro) {
    erroGrade(`Não consegui gerar a grade. ${erro.message}`);
  } finally {
    carregando.hidden = true;
    travaGrade(false);
  }
}

el("btn-gerar-grade").addEventListener("click", () => {
  geraGrade({ orientacoes: el("grade-orientacoes").value.trim() });
});

el("btn-ajustar-grade").addEventListener("click", () => {
  const feedback = el("grade-feedback").value.trim();
  if (!feedback) { erroGrade("Escreva o que você quer ajustar antes de pedir o ajuste."); return; }
  geraGrade({ feedback });
});

el("btn-aprovar-grade").addEventListener("click", async () => {
  travaGrade(true);
  erroGrade("");
  try {
    const dados = norm(await pedir("grade-postagens", { action: "aprovar", grade_id: gradeAtual.grade_id }));
    renderGrade({ ...gradeAtual, grade_id: dados.grade_id || gradeAtual.grade_id, status: dados.status || "aprovada" });
  } catch (erro) {
    erroGrade(`Não consegui aprovar a grade. ${erro.message}`);
  } finally {
    travaGrade(false);
  }
});

el("btn-zero-grade").addEventListener("click", () => {
  if (!confirm("Gerar uma grade totalmente nova? A proposta atual será substituída.")) return;
  geraGrade({ orientacoes: "" });
});

el("btn-nova-grade").addEventListener("click", () => {
  if (!confirm("Gerar uma nova grade? A grade aprovada atual deixará de ser a mais recente.")) return;
  geraGrade({ orientacoes: "" });
});

/* ---------------- Peças de divulgação ---------------- */

const botoesPecas = () => [
  ...document.querySelectorAll(".btn-formato"),
  el("btn-peca-avulsa"),
];

function travaPecas(travado) {
  botoesPecas().forEach((b) => { b.disabled = travado; });
  el("pecas-carregando").hidden = !travado;
}

function erroPecas(mensagem) {
  const no = el("pecas-erro");
  no.hidden = !mensagem;
  no.textContent = mensagem ? `⚠️ ${mensagem}` : "";
}

function mostraPeca(peca) {
  el("peca-resultado").hidden = false;
  el("peca-titulo").textContent = peca.titulo || "Peça gerada";
  el("peca-conteudo").innerHTML = md(peca.conteudo || "");
  const imagem = el("peca-imagem");
  if (peca.imagem_b64) {
    imagem.src = `data:image/png;base64,${peca.imagem_b64}`;
    imagem.hidden = false;
  } else {
    imagem.hidden = true;
    imagem.removeAttribute("src");
  }
  el("peca-resultado").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function geraPeca(tipo, briefing) {
  travaPecas(true);
  erroPecas("");
  try {
    const dados = norm(await pedir("pecas", { action: "gerar", tipo, briefing: briefing || "" }));
    mostraPeca(dados);
    listaPecas();
  } catch (erro) {
    erroPecas(`Não consegui gerar a peça. ${erro.message}`);
  } finally {
    travaPecas(false);
  }
}

document.querySelectorAll(".btn-formato").forEach((botao) => {
  botao.addEventListener("click", () => geraPeca(botao.dataset.tipo, ""));
});

el("btn-peca-avulsa").addEventListener("click", () => {
  const briefing = el("peca-briefing").value.trim();
  if (!briefing) { erroPecas("Descreva a peça avulsa antes de gerar."); return; }
  geraPeca(el("peca-formato").value, briefing);
});

el("btn-copiar-peca").addEventListener("click", async () => {
  const botao = el("btn-copiar-peca");
  try {
    await navigator.clipboard.writeText(el("peca-conteudo").innerText);
    botao.textContent = "Copiado ✓";
  } catch {
    botao.textContent = "Não deu para copiar";
  }
  setTimeout(() => { botao.textContent = "Copiar conteúdo"; }, 1800);
});

async function listaPecas() {
  const lista = el("pecas-historico");
  try {
    const dados = norm(await pedir("pecas", { action: "listar" }));
    const pecas = Array.isArray(dados.pecas) ? dados.pecas : [];
    if (!pecas.length) {
      lista.innerHTML = '<li class="historico-vazio">Nenhuma peça gerada ainda.</li>';
      return;
    }
    lista.innerHTML = pecas
      .map(
        (p) => `<li><button class="historico-item" data-peca="${esc(p.id)}">
          <span class="historico-tipo">${esc(p.tipo)}</span>
          <span class="historico-titulo">${esc(p.titulo)}</span>
          <span class="historico-data">${esc(p.criado_em)}</span>
        </button></li>`
      )
      .join("");
    lista.querySelectorAll("[data-peca]").forEach((botao) => {
      botao.addEventListener("click", () => abrePeca(botao.dataset.peca));
    });
  } catch {
    lista.innerHTML = '<li class="historico-vazio">Não foi possível carregar o histórico.</li>';
  }
}

async function abrePeca(id) {
  erroPecas("");
  try {
    const dados = norm(await pedir("pecas", { action: "carregar", peca_id: Number(id) }));
    const peca = dados.peca || dados;
    if (!peca || !peca.peca_id) { erroPecas("Essa peça não foi encontrada."); return; }
    mostraPeca(peca);
  } catch (erro) {
    erroPecas(`Não consegui abrir a peça. ${erro.message}`);
  }
}

/* ---------------- Arte de post ---------------- */

el("btn-gerar-arte").addEventListener("click", async () => {
  const prompt = el("arte-prompt").value.trim();
  const erroNo = el("arte-erro");
  erroNo.hidden = true;

  if (!prompt) {
    erroNo.hidden = false;
    erroNo.textContent = "⚠️ Escreva o prompt de imagem antes de gerar.";
    return;
  }

  el("btn-gerar-arte").disabled = true;
  el("arte-carregando").hidden = false;
  try {
    const dados = norm(await pedir("pecas", { action: "arte", prompt, texto: el("arte-texto").value.trim() }));
    if (!dados.imagem_b64) throw new Error("A IA não devolveu a imagem.");
    el("arte-resultado").hidden = false;
    el("arte-titulo").textContent = dados.titulo || "Arte gerada";
    el("arte-imagem").src = `data:image/png;base64,${dados.imagem_b64}`;
  } catch (erro) {
    erroNo.hidden = false;
    erroNo.textContent = `⚠️ Não consegui gerar a arte. ${erro.message}`;
  } finally {
    el("btn-gerar-arte").disabled = false;
    el("arte-carregando").hidden = true;
  }
});

el("btn-baixar-arte").addEventListener("click", () => {
  const origem = el("arte-imagem").src;
  if (!origem) return;
  const link = document.createElement("a");
  link.href = origem;
  link.download = `arte-${Date.now()}.png`;
  link.click();
});

/* ---------------- Fábricas ---------------- */

function ligaFabrica({ campo, botao, retorno, rota, chave, sucesso }) {
  const noCampo = el(campo);
  const noBotao = el(botao);
  const noRetorno = el(retorno);

  const revalida = () => { noBotao.disabled = !noCampo.value.trim(); };
  noCampo.addEventListener("input", revalida);
  revalida();

  noBotao.addEventListener("click", async () => {
    const texto = noCampo.value.trim();
    if (!texto) return;

    noBotao.disabled = true;
    noRetorno.hidden = true;
    try {
      await pedir(rota, { [chave]: texto });
      noCampo.value = "";
      noRetorno.hidden = false;
      noRetorno.className = "retorno retorno-ok";
      noRetorno.textContent = sucesso;
    } catch (erro) {
      noRetorno.hidden = false;
      noRetorno.className = "retorno retorno-erro";
      noRetorno.textContent = `⚠️ Não consegui falar com a Fábrica. ${erro.message} Seu texto continua aqui — tente de novo em instantes.`;
    } finally {
      revalida();
    }
  });
}

ligaFabrica({
  campo: "fab-video-texto",
  botao: "btn-fab-video",
  retorno: "fab-video-retorno",
  rota: "fabrica-videos",
  chave: "roteiro",
  sucesso: "✅ Pedido enviado! Chega no seu WhatsApp em ~3 minutos.",
});

ligaFabrica({
  campo: "fab-carrossel-texto",
  botao: "btn-fab-carrossel",
  retorno: "fab-carrossel-retorno",
  rota: "fabrica-carrosseis",
  chave: "carrossel",
  sucesso: "✅ Pedido enviado! Chega no seu WhatsApp em ~3 minutos.",
});

/* ---------------- Conselheiros (3 chats) ---------------- */

const chats = {};

function criaChat(slot) {
  const dominio = slot.dataset.dominio;
  const molde = el("molde-chat").content.cloneNode(true);
  slot.appendChild(molde);

  const lista = slot.querySelector(".lista-conversas");
  const mensagens = slot.querySelector(".mensagens");
  const formulario = slot.querySelector(".chat-form");
  const campo = slot.querySelector(".chat-campo");
  const enviar = slot.querySelector(".btn-enviar");
  const nova = slot.querySelector(".btn-nova");

  campo.placeholder = slot.dataset.placeholder || "Escreva sua pergunta...";
  let conversaId = 0;

  function vazio(texto) {
    mensagens.innerHTML = `<p class="chat-vazio">${esc(texto)}</p>`;
  }

  function balao(papel, conteudo) {
    const vazioNo = mensagens.querySelector(".chat-vazio");
    if (vazioNo) vazioNo.remove();
    const no = document.createElement("div");
    no.className = `balao balao-${papel === "user" ? "user" : "assistant"}`;
    no.innerHTML = `<div class="markdown">${md(conteudo)}</div>`;
    mensagens.appendChild(no);
    mensagens.scrollTop = mensagens.scrollHeight;
    return no;
  }

  async function listar() {
    try {
      const dados = norm(await pedir("conselho", { action: "listar", dominio }));
      const conversas = Array.isArray(dados.conversas) ? dados.conversas : [];
      if (!conversas.length) {
        lista.innerHTML = '<li class="conversa-vazia">Nenhuma conversa ainda.</li>';
        return;
      }
      lista.innerHTML = conversas
        .map(
          (c) => `<li><button class="conversa-item" data-conversa="${esc(c.id)}" ${
            Number(c.id) === conversaId ? 'aria-current="true"' : ""
          }>
            <span class="conversa-titulo">${esc(c.titulo)}</span>
            <span class="conversa-data">${esc(c.atualizado_em)}</span>
          </button></li>`
        )
        .join("");
      lista.querySelectorAll("[data-conversa]").forEach((botao) => {
        botao.addEventListener("click", () => abrir(Number(botao.dataset.conversa)));
      });
    } catch {
      lista.innerHTML = '<li class="conversa-vazia">Não foi possível carregar as conversas.</li>';
    }
  }

  async function abrir(id) {
    conversaId = id;
    vazio("Carregando a conversa...");
    try {
      const dados = norm(await pedir("conselho", { action: "carregar", conversation_id: id }));
      const msgs = Array.isArray(dados.mensagens) ? dados.mensagens : [];
      mensagens.innerHTML = "";
      if (!msgs.length) vazio("Conversa vazia.");
      else msgs.forEach((m) => balao(m.papel, m.conteudo));
      listar();
    } catch (erro) {
      vazio(`Não consegui abrir a conversa. ${erro.message}`);
    }
  }

  nova.addEventListener("click", () => {
    conversaId = 0;
    mensagens.innerHTML = "";
    vazio("Nova conversa — faça sua primeira pergunta.");
    lista.querySelectorAll("[data-conversa]").forEach((b) => b.removeAttribute("aria-current"));
    campo.focus();
  });

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const pergunta = campo.value.trim();
    if (!pergunta) return;

    campo.value = "";
    campo.disabled = true;
    enviar.disabled = true;
    balao("user", pergunta);

    const pensando = balao("assistant", "_pensando..._");
    pensando.classList.add("balao-pensando");

    try {
      const dados = norm(
        await pedir("conselho", { action: "perguntar", dominio, pergunta, conversation_id: conversaId || 0 })
      );
      pensando.remove();
      balao("assistant", dados.resposta || "(o conselheiro não devolveu resposta)");
      if (dados.conversation_id) conversaId = Number(dados.conversation_id);
      listar();
    } catch (erro) {
      pensando.remove();
      balao("assistant", `⚠️ Não consegui falar com o conselheiro. ${erro.message}`);
    } finally {
      campo.disabled = false;
      enviar.disabled = false;
      campo.focus();
    }
  });

  campo.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter" && !evento.shiftKey) {
      evento.preventDefault();
      formulario.requestSubmit();
    }
  });

  vazio("Faça uma pergunta para começar.");
  lista.innerHTML = '<li class="conversa-vazia">Carregando...</li>';

  return { listar };
}

document.querySelectorAll(".chat-slot").forEach((slot) => {
  chats[slot.dataset.dominio] = criaChat(slot);
});

/* ---------------- Início ---------------- */

carregaMetricas();
mostraAba(localStorage.getItem(CHAVE_ABA) || "administracao");
