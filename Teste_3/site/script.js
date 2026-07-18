/* ==========================================================
   Deploy — script.js
   - Ano no rodapé
   - Envio do formulário de interesse via fetch (POST JSON)
   AVISO: o endpoint de leads será ativado no módulo 6 do curso.
   O formulário funciona, mas os leads ainda NÃO são registrados.
   ========================================================== */

(function () {
  "use strict";

  var LEADS_ENDPOINT = "https://workflows.axnconsult.com/webhook/leads";

  // Ano dinâmico no rodapé
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var form = document.getElementById("lead-form");
  if (!form) return;

  var feedback = document.getElementById("form-feedback");
  var submitBtn = document.getElementById("lead-submit");

  function setFeedback(message, type) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = "form-feedback" + (type ? " " + type : "");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var nome = form.nome;
    var email = form.email;
    var whatsapp = form.whatsapp;
    var mensagem = form.mensagem;

    // Validação simples dos campos obrigatórios
    var required = [nome, email, whatsapp];
    var firstInvalid = null;

    required.forEach(function (field) {
      field.classList.remove("invalid");
    });
    email.classList.remove("invalid");

    required.forEach(function (field) {
      if (!field.value.trim()) {
        field.classList.add("invalid");
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (email.value.trim() && !isValidEmail(email.value.trim())) {
      email.classList.add("invalid");
      if (!firstInvalid) firstInvalid = email;
    }

    if (firstInvalid) {
      setFeedback("Preencha os campos obrigatórios corretamente.", "error");
      firstInvalid.focus();
      return;
    }

    var payload = {
      nome: nome.value.trim(),
      email: email.value.trim(),
      whatsapp: whatsapp.value.trim(),
      mensagem: mensagem.value.trim(),
      origem: "landing-deploy",
      enviado_em: new Date().toISOString()
    };

    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = "Enviando...";
    setFeedback("", null);

    fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function () {
        // Mensagem genérica de sucesso, independente da resposta do endpoint.
        form.reset();
        setFeedback("Mensagem enviada! Responderemos em até 24h.", "success");
      })
      .catch(function () {
        // Mesmo em caso de falha de rede, mantemos experiência genérica de sucesso
        // para o usuário final, conforme escopo (endpoint ainda não ativo).
        form.reset();
        setFeedback("Mensagem enviada! Responderemos em até 24h.", "success");
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
})();
