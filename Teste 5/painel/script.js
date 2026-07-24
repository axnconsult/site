'use strict';

/* ===== Djubs Brigadeiria — Painel de Gestão ===== */

const API = 'https://workflows.djubsbrigadeiria.com.br/webhook';

/* ---------- Utilitários ---------- */

function esperar(ms) {
  return new Promise(function (resolver) { setTimeout(resolver, ms); });
}

/* Falha de rede (fetch lança TypeError): tenta de novo uma vez antes de desistir */
async function fetchComRetry(url, opcoes) {
  try {
    return await fetch(url, opcoes);
  } catch (e) {
    await esperar(1500);
    return fetch(url, opcoes);
  }
}

async function apiPost(caminho, payload) {
  // Retry de rede apenas em ações de leitura — nunca em gerações (custo de IA)
  const leitura = payload && ['listar', 'carregar', 'baixar'].indexOf(payload.action) >= 0;
  const executarFetch = leitura ? fetchComRetry : fetch;
  const r = await executarFetch(API + '/' + caminho, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const texto = await r.text();
  let dados = {};
  try { dados = texto ? JSON.parse(texto) : {}; } catch (e) { dados = {}; }
  if (!r.ok) {
    const msg = dados.message || dados.error || ('Erro ' + r.status + ' ao falar com o servidor.');
    throw new Error(msg);
  }
  return dados;
}

async function apiGet(caminho) {
  const r = await fetchComRetry(API + '/' + caminho);
  if (!r.ok) throw new Error('Erro ' + r.status + ' ao falar com o servidor.');
  return r.json();
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* Markdown simples: títulos, negrito, itálico, listas e parágrafos */
function md(texto) {
  const linhas = String(texto == null ? '' : texto).split('\n');
  let html = '';
  let emLista = false;
  let paragrafo = [];

  function inline(l) {
    return esc(l)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  }
  function fechaParagrafo() {
    if (paragrafo.length) {
      html += '<p>' + paragrafo.map(inline).join('<br>') + '</p>';
      paragrafo = [];
    }
  }
  function fechaLista() {
    if (emLista) { html += '</ul>'; emLista = false; }
  }

  for (const bruta of linhas) {
    const l = bruta.trim();
    if (!l) { fechaParagrafo(); fechaLista(); continue; }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { fechaParagrafo(); fechaLista(); html += '<h3>' + inline(h[2]) + '</h3>'; continue; }
    const item = l.match(/^[-*]\s+(.*)$/);
    if (item) {
      fechaParagrafo();
      if (!emLista) { html += '<ul>'; emLista = true; }
      html += '<li>' + inline(item[1]) + '</li>';
      continue;
    }
    fechaLista();
    paragrafo.push(l);
  }
  fechaParagrafo();
  fechaLista();
  return html;
}

function baixarTexto(nome, conteudo, mime) {
  const blob = new Blob([conteudo], { type: mime || 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
}

function baixarImagemB64(nome, b64) {
  const a = document.createElement('a');
  a.href = 'data:image/png;base64,' + b64;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* Converte tabela Markdown em CSV (mesma regra do servidor) */
function markdownParaCsv(conteudo) {
  const linhas = String(conteudo || '').split('\n');
  const tab = linhas.map(function (l) { return l.trim(); })
    .filter(function (l) { return l.startsWith('|') && !/^\|[\s:|-]+\|$/.test(l); })
    .map(function (l) { return l.slice(1, -1).split('|').map(function (c) { return c.trim(); }); });
  if (tab.length >= 2) {
    return tab.map(function (r) {
      return r.map(function (c) { return '"' + c.replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
  }
  return linhas.map(function (l) { return '"' + l.replace(/"/g, '""') + '"'; }).join('\n');
}

function mostrarStatus(elemento, texto, tipo) {
  elemento.hidden = false;
  elemento.className = 'mensagem-status ' + (tipo === 'ok' ? 'mensagem-ok' : tipo === 'erro' ? 'mensagem-erro' : 'mensagem-alerta');
  elemento.textContent = texto;
}

/* ---------- Tema claro/escuro ---------- */

(function () {
  const btn = document.getElementById('btn-tema');
  const salvo = localStorage.getItem('tema');
  const inicial = salvo || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro');
  aplicar(inicial);

  btn.addEventListener('click', function () {
    const atual = document.documentElement.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro';
    aplicar(atual);
    localStorage.setItem('tema', atual);
  });

  function aplicar(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    btn.textContent = tema === 'escuro' ? '☀️' : '🌙';
  }
})();

/* ---------- Abas ---------- */

const abasIniciadas = {};

(function () {
  const botoes = document.querySelectorAll('.aba');
  const salva = localStorage.getItem('abaAtiva');
  const inicial = ['administracao', 'marketing', 'vendas'].indexOf(salva) >= 0 ? salva : 'administracao';

  botoes.forEach(function (b) {
    b.addEventListener('click', function () { ativar(b.dataset.aba); });
  });
  ativar(inicial);

  function ativar(nome) {
    botoes.forEach(function (b) {
      const ativa = b.dataset.aba === nome;
      b.classList.toggle('ativa', ativa);
      b.setAttribute('aria-selected', ativa ? 'true' : 'false');
    });
    document.querySelectorAll('.painel-aba').forEach(function (s) {
      s.hidden = (s.id !== 'aba-' + nome);
    });
    localStorage.setItem('abaAtiva', nome);
    if (!abasIniciadas[nome]) {
      abasIniciadas[nome] = true;
      iniciarAba(nome);
    } else if (nome === 'administracao' || nome === 'vendas') {
      carregarMetricas(); // re-tenta se a primeira carga falhou (guardado por flag)
    }
  }
})();

function iniciarAba(nome) {
  const chat = document.querySelector('#aba-' + nome + ' .chat');
  if (chat) iniciarChat(chat);
  if (nome === 'administracao' || nome === 'vendas') carregarMetricas();
  if (nome === 'marketing') {
    carregarGrade();
    carregarHistoricoPecas();
  }
}

/* ---------- Métricas (Administração + Vendas) ---------- */

let metricasCarregadas = false;

async function carregarMetricas() {
  if (metricasCarregadas) return;
  metricasCarregadas = true;
  try {
    const m = await apiGet('painel-metricas');
    setTexto('m-total-leads', m.total_leads);
    setTexto('m-leads-7d', m.leads_7d);
    setTexto('m-conversoes-7d', m.conversoes_7d);
    setTexto('v-leads-7d', m.leads_7d);
    setTexto('v-conversoes-7d', m.conversoes_7d);
    preencherLeads(m.ultimos || []);
  } catch (e) {
    metricasCarregadas = false;
    preencherLeads(null);
  }

  function setTexto(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = (valor == null ? '—' : valor);
  }
}

function preencherLeads(ultimos) {
  const corpo = document.getElementById('leads-corpo');
  if (!corpo) return;
  if (ultimos === null) {
    corpo.innerHTML = '<tr><td colspan="5" class="texto-suave">Não foi possível carregar os leads agora.</td></tr>';
    return;
  }
  if (!ultimos.length) {
    corpo.innerHTML = '<tr><td colspan="5" class="texto-suave">Nenhum lead recebido ainda.</td></tr>';
    return;
  }
  corpo.innerHTML = ultimos.map(function (l) {
    return '<tr><td>' + esc(l.nome) + '</td><td>' + esc(l.email) + '</td><td>' + esc(l.whatsapp) +
      '</td><td>' + esc(l.mensagem) + '</td><td>' + esc(l.data) + '</td></tr>';
  }).join('');
}

/* ---------- Chat do Conselheiro ---------- */

function iniciarChat(raiz) {
  const dominio = raiz.dataset.dominio;
  let conversationId = 0;
  let enviando = false;

  raiz.innerHTML =
    '<aside class="chat-lateral">' +
    '  <button type="button" class="btn btn-secundario chat-nova">+ Nova conversa</button>' +
    '  <ul class="chat-conversas"></ul>' +
    '</aside>' +
    '<div class="chat-principal">' +
    '  <div class="chat-janela"><p class="chat-vazio">Faça uma pergunta para começar a conversa com o seu conselheiro.</p></div>' +
    '  <form class="chat-form">' +
    '    <textarea rows="1" placeholder="Escreva sua pergunta…" required></textarea>' +
    '    <button type="submit" class="btn">Enviar</button>' +
    '  </form>' +
    '</div>';

  const lista = raiz.querySelector('.chat-conversas');
  const janela = raiz.querySelector('.chat-janela');
  const form = raiz.querySelector('.chat-form');
  const campo = form.querySelector('textarea');
  const btnEnviar = form.querySelector('button');
  const btnNova = raiz.querySelector('.chat-nova');

  btnNova.addEventListener('click', function () {
    conversationId = 0;
    janela.innerHTML = '<p class="chat-vazio">Nova conversa — faça sua pergunta.</p>';
    marcarAtiva();
    campo.focus();
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    enviar();
  });

  campo.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      enviar();
    }
  });

  carregarConversas();

  async function carregarConversas() {
    try {
      const d = await apiPost('conselho', { action: 'listar', dominio: dominio });
      const conversas = d.conversas || [];
      lista.innerHTML = '';
      conversas.forEach(function (c) {
        const li = document.createElement('li');
        li.dataset.id = c.id;
        li.innerHTML = '<span class="chat-conversa-titulo">' + esc(c.titulo || 'Conversa') + '</span>' +
          '<span class="chat-conversa-data">' + esc(c.atualizado_em || '') + '</span>';
        li.addEventListener('click', function () { abrirConversa(c.id); });
        lista.appendChild(li);
      });
      marcarAtiva();
    } catch (e) { /* lista indisponível não impede o chat */ }
  }

  function marcarAtiva() {
    lista.querySelectorAll('li').forEach(function (li) {
      li.classList.toggle('ativa', Number(li.dataset.id) === conversationId && conversationId !== 0);
    });
  }

  async function abrirConversa(id) {
    conversationId = Number(id);
    marcarAtiva();
    janela.innerHTML = '<p class="chat-vazio">Carregando conversa…</p>';
    try {
      const d = await apiPost('conselho', { action: 'carregar', conversation_id: conversationId });
      janela.innerHTML = '';
      (d.mensagens || []).forEach(function (m) {
        adicionarBalao(m.papel === 'assistant' ? 'ia' : 'user', m.conteudo);
      });
      if (!janela.children.length) {
        janela.innerHTML = '<p class="chat-vazio">Conversa sem mensagens.</p>';
      }
    } catch (e) {
      janela.innerHTML = '<p class="chat-vazio">Não foi possível carregar esta conversa.</p>';
    }
  }

  function adicionarBalao(tipo, conteudo, extraClasse) {
    const vazio = janela.querySelector('.chat-vazio');
    if (vazio) vazio.remove();
    const div = document.createElement('div');
    div.className = 'balao ' + (tipo === 'user' ? 'balao-user' : 'balao-ia') + (extraClasse ? ' ' + extraClasse : '');
    div.innerHTML = md(conteudo);
    janela.appendChild(div);
    janela.scrollTop = janela.scrollHeight;
    return div;
  }

  async function enviar() {
    const pergunta = campo.value.trim();
    if (!pergunta || enviando) return;
    enviando = true;
    campo.value = '';
    btnEnviar.disabled = true;
    adicionarBalao('user', pergunta);
    const digitando = adicionarBalao('ia', 'O conselheiro está escrevendo…', 'balao-digitando');
    try {
      const d = await apiPost('conselho', {
        action: 'perguntar',
        dominio: dominio,
        pergunta: pergunta,
        conversation_id: conversationId
      });
      digitando.remove();
      adicionarBalao('ia', d.resposta || 'Não consegui responder agora. Tente novamente.');
      const novaConversa = conversationId === 0;
      conversationId = Number(d.conversation_id) || conversationId;
      if (novaConversa) carregarConversas(); else marcarAtiva();
    } catch (e) {
      digitando.remove();
      adicionarBalao('ia', 'Não consegui responder agora (' + e.message + '). Tente novamente.');
    } finally {
      enviando = false;
      btnEnviar.disabled = false;
      campo.focus();
    }
  }
}

/* ---------- Grade de Postagens ---------- */

const gradeArea = document.getElementById('grade-area');
let gradeOcupada = false;

async function carregarGrade() {
  gradeArea.innerHTML = '<p class="texto-suave">Carregando sua grade…</p>';
  try {
    const d = await apiPost('grade-postagens', { action: 'carregar' });
    renderizarGrade(d.grade || { status: 'vazia' });
  } catch (e) {
    gradeArea.innerHTML = '<p class="mensagem-status mensagem-erro">Não foi possível carregar a grade: ' + esc(e.message) + '</p>';
  }
}

function extrairSecoesGrade(conteudo) {
  const secoes = [];
  const regex = /^#{2,4}\s*(.+)$/gm;
  const texto = String(conteudo || '');
  let m;
  const marcas = [];
  while ((m = regex.exec(texto)) !== null) {
    marcas.push({ titulo: m[1].trim(), inicio: m.index, fimTitulo: m.index + m[0].length });
  }
  for (let i = 0; i < marcas.length; i++) {
    const corpo = texto.slice(marcas[i].fimTitulo, i + 1 < marcas.length ? marcas[i + 1].inicio : texto.length).trim();
    secoes.push({ titulo: marcas[i].titulo, corpo: corpo });
  }
  return secoes;
}

function renderizarGrade(g) {
  gradeOcupada = false;

  if (!g || g.status === 'vazia' || !g.conteudo) {
    gradeArea.innerHTML =
      '<div class="grade-secao">' +
      '  <p>Você ainda não tem uma grade de postagens. Gere a primeira: a IA monta 28 dias de conteúdo com base no seu planejamento estratégico.</p>' +
      '  <label class="campo-rotulo" for="grade-orientacoes">Direcionamento (opcional)</label>' +
      '  <textarea id="grade-orientacoes" rows="2" placeholder="Ex.: quero focar em encomendas para festas neste mês"></textarea>' +
      '  <button id="btn-gerar-grade" class="btn" type="button">Gerar grade de 28 dias</button>' +
      '  <p id="grade-status" hidden></p>' +
      '</div>';
    document.getElementById('btn-gerar-grade').addEventListener('click', function () {
      const orientacoes = document.getElementById('grade-orientacoes').value.trim();
      gerarGrade({ action: 'gerar', orientacoes: orientacoes });
    });
    return;
  }

  const secoes = extrairSecoesGrade(g.conteudo);
  const desejadas = [];
  secoes.forEach(function (s) {
    const t = s.titulo.toLowerCase();
    if (t.indexOf('classifica') >= 0) desejadas.push({ titulo: '1. Classificação e Frequência', corpo: s.corpo });
    else if (t.indexOf('pilares') >= 0) desejadas.push({ titulo: '2. Pilares de Conteúdo', corpo: s.corpo });
    else if (t.indexOf('nota estrat') >= 0) desejadas.push({ titulo: '3. Nota Estratégica', corpo: s.corpo });
  });

  const aprovada = g.status === 'aprovada';
  let html = '<p>' +
    (aprovada
      ? '<span class="selo selo-aprovada">Aprovada</span>'
      : '<span class="selo selo-proposta">Proposta — aguardando aprovação</span>') +
    (g.atualizado_em ? '<span class="grade-data">Atualizada em ' + esc(g.atualizado_em) + '</span>' : '') +
    '</p>';

  if (desejadas.length) {
    desejadas.forEach(function (s) {
      html += '<div class="grade-secao"><h3>' + esc(s.titulo) + '</h3>' + md(s.corpo) + '</div>';
    });
  } else {
    html += '<div class="grade-secao"><p>Grade enviada por você — baixe para revisar.</p></div>';
  }

  html += '<div class="botoes-linha">' +
    '  <button id="btn-baixar-grade" class="btn btn-secundario" type="button">⬇️ Baixar grade (planilha)</button>' +
    '  <button id="btn-upload-grade" class="btn btn-secundario" type="button">⬆️ Enviar grade editada</button>' +
    '  <input id="input-upload-grade" type="file" accept=".csv,text/csv" hidden>' +
    (aprovada ? '' : '  <button id="btn-aprovar-grade" class="btn" type="button">✅ Aprovar grade</button>') +
    '</div>';

  if (!aprovada) {
    html += '<div class="grade-secao">' +
      '  <label class="campo-rotulo" for="grade-feedback">O que você quer ajustar?</label>' +
      '  <textarea id="grade-feedback" rows="2" placeholder="Ex.: menos posts de conversão, mais bastidores da cozinha"></textarea>' +
      '  <div class="botoes-linha">' +
      '    <button id="btn-ajustar-grade" class="btn" type="button">Pedir ajuste</button>' +
      '    <button id="btn-zerar-grade" class="btn btn-discreto" type="button">Gerar do zero</button>' +
      '  </div>' +
      '</div>';
  } else {
    html += '<div class="botoes-linha">' +
      '  <button id="btn-nova-grade" class="btn btn-discreto" type="button">Gerar nova grade</button>' +
      '</div>';
  }

  html += '<p id="grade-status" hidden></p>';
  html += '<p class="grade-fluxo">Fluxo: gerar a grade → baixar e revisar na planilha → pedir ajuste aqui OU editar o CSV e reenviar → aprovar. A aprovação libera a geração das peças.</p>';

  gradeArea.innerHTML = html;

  document.getElementById('btn-baixar-grade').addEventListener('click', baixarGrade);

  const inputUpload = document.getElementById('input-upload-grade');
  document.getElementById('btn-upload-grade').addEventListener('click', function () { inputUpload.click(); });
  inputUpload.addEventListener('change', function () {
    const arquivo = inputUpload.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = function () {
      enviarUploadGrade(String(leitor.result || ''));
    };
    leitor.readAsText(arquivo, 'utf-8');
  });

  const btnAprovar = document.getElementById('btn-aprovar-grade');
  if (btnAprovar) btnAprovar.addEventListener('click', function () { aprovarGrade(g.grade_id); });

  const btnAjustar = document.getElementById('btn-ajustar-grade');
  if (btnAjustar) btnAjustar.addEventListener('click', function () {
    const feedback = document.getElementById('grade-feedback').value.trim();
    if (!feedback) {
      mostrarStatus(document.getElementById('grade-status'), 'Escreva o que você quer ajustar antes de pedir o ajuste.', 'alerta');
      return;
    }
    gerarGrade({ action: 'gerar', feedback: feedback });
  });

  const btnZerar = document.getElementById('btn-zerar-grade');
  if (btnZerar) btnZerar.addEventListener('click', function () {
    if (confirm('Gerar uma grade do zero? A grade atual será substituída por uma nova proposta.')) {
      gerarGrade({ action: 'gerar' });
    }
  });

  const btnNova = document.getElementById('btn-nova-grade');
  if (btnNova) btnNova.addEventListener('click', function () {
    if (confirm('Gerar uma nova grade? Ela nascerá como proposta e precisará ser aprovada de novo.')) {
      gerarGrade({ action: 'gerar' });
    }
  });
}

function botoesGrade(desabilitar) {
  gradeArea.querySelectorAll('button').forEach(function (b) { b.disabled = desabilitar; });
}

async function gerarGrade(payload) {
  if (gradeOcupada) return;
  gradeOcupada = true;
  botoesGrade(true);
  const status = document.getElementById('grade-status');
  if (status) mostrarStatus(status, 'Gerando sua grade… isso pode levar de 30 segundos a 2 minutos. Não feche a página.', 'alerta');
  try {
    await apiPost('grade-postagens', payload);
    await carregarGrade();
  } catch (e) {
    gradeOcupada = false;
    botoesGrade(false);
    if (status) mostrarStatus(status, 'Não foi possível gerar a grade: ' + e.message, 'erro');
  }
}

async function baixarGrade() {
  const status = document.getElementById('grade-status');
  try {
    const d = await apiPost('grade-postagens', { action: 'baixar' });
    baixarTexto(d.filename || 'grade-de-postagens.csv', d.csv || '');
    if (status) mostrarStatus(status, 'Grade baixada! Abra o arquivo no Google Planilhas (Arquivo → Importar).', 'ok');
  } catch (e) {
    if (status) mostrarStatus(status, 'Não foi possível baixar a grade: ' + e.message, 'erro');
  }
}

async function enviarUploadGrade(conteudo) {
  if (gradeOcupada) return;
  if (!conteudo.trim()) return;
  gradeOcupada = true;
  botoesGrade(true);
  const status = document.getElementById('grade-status');
  if (status) mostrarStatus(status, 'Enviando sua grade…', 'alerta');
  try {
    await apiPost('grade-postagens', { action: 'upload', conteudo: conteudo });
    await carregarGrade();
  } catch (e) {
    gradeOcupada = false;
    botoesGrade(false);
    if (status) mostrarStatus(status, 'Não foi possível enviar a grade: ' + e.message, 'erro');
  }
}

async function aprovarGrade(gradeId) {
  if (gradeOcupada) return;
  gradeOcupada = true;
  botoesGrade(true);
  const status = document.getElementById('grade-status');
  if (status) mostrarStatus(status, 'Aprovando a grade…', 'alerta');
  try {
    await apiPost('grade-postagens', { action: 'aprovar', grade_id: gradeId });
    await carregarGrade();
  } catch (e) {
    gradeOcupada = false;
    botoesGrade(false);
    if (status) mostrarStatus(status, 'Não foi possível aprovar a grade: ' + e.message, 'erro');
  }
}

/* ---------- Peças de divulgação ---------- */

const pecasBotoes = document.getElementById('pecas-botoes');
const pecasStatus = document.getElementById('pecas-status');
let pecaOcupada = false;

pecasBotoes.querySelectorAll('button').forEach(function (b) {
  b.addEventListener('click', function () { gerarPecas(b.dataset.tipo); });
});

async function gerarPecas(tipo) {
  if (pecaOcupada) return;
  pecaOcupada = true;
  pecasBotoes.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
  mostrarStatus(pecasStatus, 'Escrevendo suas peças… isso pode levar 1–2 minutos.', 'alerta');
  try {
    const d = await apiPost('fabrica-imagens', { action: 'gerar', tipo: tipo });
    baixarTexto(d.filename || ('pecas-' + tipo + '.csv'), d.csv || '');
    mostrarStatus(pecasStatus, '✅ Peças geradas — arquivo baixado. Importe no Google Planilhas.', 'ok');
    carregarHistoricoPecas();
  } catch (e) {
    mostrarStatus(pecasStatus, 'Não foi possível gerar as peças: ' + e.message, 'erro');
  } finally {
    pecaOcupada = false;
    pecasBotoes.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
  }
}

async function carregarHistoricoPecas() {
  const bloco = document.getElementById('pecas-historico-bloco');
  const listaEl = document.getElementById('pecas-historico');
  try {
    const d = await apiPost('fabrica-imagens', { action: 'listar' });
    const pecas = d.pecas || [];
    if (!pecas.length) { bloco.hidden = true; return; }
    bloco.hidden = false;
    listaEl.innerHTML = '';
    pecas.forEach(function (p) {
      const li = document.createElement('li');
      li.innerHTML = '<span class="peca-tipo">' + esc(p.tipo) + '</span>' +
        '<span class="peca-titulo">' + esc(p.titulo) + '</span>' +
        '<span class="peca-data">' + esc(p.criado_em) + '</span>';
      li.addEventListener('click', function () { abrirPeca(p.id); });
      listaEl.appendChild(li);
    });
  } catch (e) { bloco.hidden = true; }
}

async function abrirPeca(id) {
  const detalhe = document.getElementById('peca-detalhe');
  detalhe.hidden = false;
  detalhe.innerHTML = '<p class="texto-suave">Carregando peça…</p>';
  try {
    const d = await apiPost('fabrica-imagens', { action: 'carregar', peca_id: id });
    const p = d.peca || {};
    if (!p.peca_id) {
      detalhe.innerHTML = '<p class="mensagem-status mensagem-erro">Peça não encontrada.</p>';
      return;
    }
    if (p.imagem_b64) {
      detalhe.innerHTML = '<img alt="' + esc(p.titulo || 'Peça gerada') + '">' +
        '<button class="btn btn-secundario" type="button">⬇️ Baixar imagem</button>';
      detalhe.querySelector('img').src = 'data:image/png;base64,' + p.imagem_b64;
      detalhe.querySelector('button').addEventListener('click', function () {
        baixarImagemB64('djubs-' + (p.tipo || 'arte') + '-' + p.peca_id + '.png', p.imagem_b64);
      });
    } else {
      const csv = markdownParaCsv(p.conteudo);
      baixarTexto('pecas-' + (p.tipo || 'conteudo') + '-' + p.peca_id + '.csv', csv);
      detalhe.innerHTML = '<p class="mensagem-status mensagem-ok">✅ Arquivo da peça "' + esc(p.titulo || '') + '" baixado novamente.</p>';
    }
  } catch (e) {
    detalhe.innerHTML = '<p class="mensagem-status mensagem-erro">Não foi possível carregar a peça: ' + esc(e.message) + '</p>';
  }
}

/* ---------- Fábrica de Vídeos ---------- */

(function () {
  const campo = document.getElementById('video-roteiro');
  const btn = document.getElementById('btn-video');
  const status = document.getElementById('video-status');

  campo.addEventListener('input', function () {
    btn.disabled = !campo.value.trim();
  });

  btn.addEventListener('click', async function () {
    const roteiro = campo.value.trim();
    if (!roteiro) return;
    btn.disabled = true;
    mostrarStatus(status, 'Enviando o roteiro…', 'alerta');
    try {
      await apiPost('fabrica-videos', { roteiro: roteiro });
      mostrarStatus(status, '✅ Roteiro enviado! O vídeo pronto chega no seu WhatsApp em ~3 minutos.', 'ok');
      campo.value = '';
    } catch (e) {
      mostrarStatus(status, 'Não foi possível enviar (' + e.message + '). Confira se a Fábrica de Vídeos está ativa no n8n.', 'erro');
      btn.disabled = false;
    }
  });
})();

/* ---------- Fábrica de Imagens ---------- */

(function () {
  const prompt = document.getElementById('img-prompt');
  const texto = document.getElementById('img-texto');
  const finalidade = document.getElementById('img-finalidade');
  const formato = document.getElementById('img-formato');
  const btn = document.getElementById('btn-imagem');
  const status = document.getElementById('img-status');
  const resultado = document.getElementById('img-resultado');
  let ocupada = false;

  prompt.addEventListener('input', function () {
    btn.disabled = !prompt.value.trim() || ocupada;
  });

  btn.addEventListener('click', async function () {
    const p = prompt.value.trim();
    if (!p || ocupada) return;
    ocupada = true;
    btn.disabled = true;
    resultado.hidden = true;
    mostrarStatus(status, 'Gerando sua imagem… isso pode levar de 1 a 3 minutos. Não feche a página.', 'alerta');
    try {
      const d = await apiPost('fabrica-imagens', {
        action: 'arte',
        prompt: p,
        texto: texto.value.trim(),
        finalidade: finalidade.value,
        dimensao: formato.value
      });
      if (!d.imagem_b64) throw new Error('a imagem não veio na resposta');
      status.hidden = true;
      resultado.hidden = false;
      resultado.innerHTML = '<img alt="' + esc(d.titulo || 'Imagem gerada') + '">' +
        '<button class="btn btn-secundario" type="button">⬇️ Baixar imagem</button>';
      resultado.querySelector('img').src = 'data:image/png;base64,' + d.imagem_b64;
      resultado.querySelector('button').addEventListener('click', function () {
        baixarImagemB64('djubs-arte-' + (d.peca_id || Date.now()) + '.png', d.imagem_b64);
      });
      carregarHistoricoPecas();
    } catch (e) {
      mostrarStatus(status, 'Não foi possível gerar a imagem: ' + e.message, 'erro');
    } finally {
      ocupada = false;
      btn.disabled = !prompt.value.trim();
    }
  });
})();

/* ---------- Fábrica de Carrosséis ---------- */

(function () {
  const campo = document.getElementById('carrossel-conteudo');
  const btn = document.getElementById('btn-carrossel');
  const status = document.getElementById('carrossel-status');

  campo.addEventListener('input', function () {
    btn.disabled = !campo.value.trim();
  });

  btn.addEventListener('click', async function () {
    const carrossel = campo.value.trim();
    if (!carrossel) return;
    btn.disabled = true;
    mostrarStatus(status, 'Enviando o carrossel…', 'alerta');
    try {
      await apiPost('fabrica-carrosseis', { carrossel: carrossel });
      mostrarStatus(status, '✅ Carrossel enviado! As 5 imagens prontas chegam no seu WhatsApp em ~3 minutos.', 'ok');
      campo.value = '';
    } catch (e) {
      mostrarStatus(status, 'Não foi possível enviar (' + e.message + '). Confira se a Fábrica de Carrosséis está ativa no n8n.', 'erro');
      btn.disabled = false;
    }
  });
})();
