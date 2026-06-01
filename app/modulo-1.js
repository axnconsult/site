const MODULE_1_INITIAL_MESSAGE =
  'Vamos trabalhar a etapa "Diagnostico do negocio". Eu vou te conduzir com perguntas curtas. Para comecar: qual e o negocio ou ideia que voce quer validar agora?';

const MODULE_1_STORAGE_KEY = "axonModulo1State";

const moduleState = loadModuleState();

bootModule1();

function bootModule1() {
  const form = document.querySelector("#module-chat-form");
  const resetButton = document.querySelector("#module-reset");
  const exportButton = document.querySelector("#module-export");

  if (!form) {
    return;
  }

  renderModuleState();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.querySelector("#module-chat-input");
    const text = input.value.trim();

    if (!text || moduleState.isSending || moduleState.isComplete) {
      return;
    }

    input.value = "";
    moduleState.messages.push({ role: "user", content: text });
    moduleState.isSending = true;
    saveModuleState();
    renderModuleState();

    try {
      const response = await submitModuleTurn(text);
      applyModuleResponse(response);
    } catch (error) {
      setModuleStatus(
        error.message === "openai_not_configured"
          ? "A chave OPENAI_API_KEY ainda nao esta configurada neste ambiente."
          : "Nao foi possivel continuar a conversa agora. Tente novamente em instantes.",
        "error"
      );
    } finally {
      moduleState.isSending = false;
      saveModuleState();
      renderModuleState();
    }
  });

  resetButton?.addEventListener("click", () => {
    window.localStorage.removeItem(MODULE_1_STORAGE_KEY);
    moduleState.conversationId = "";
    moduleState.messages = [{ role: "assistant", content: MODULE_1_INITIAL_MESSAGE }];
    moduleState.isComplete = false;
    moduleState.isSending = false;
    saveModuleState();
    renderModuleState();
    setModuleStatus("", "");
  });

  exportButton?.addEventListener("click", exportModulePlan);
}

async function submitModuleTurn(message) {
  const endpoint = window.AXON_RUNTIME_CONFIG?.endpoints?.module1Chat || "/api/module-1/chat";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId: moduleState.conversationId || "",
      message
    })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || "module_1_request_failed");
  }

  return payload;
}

function applyModuleResponse(response) {
  if (response.conversationId) {
    moduleState.conversationId = response.conversationId;
  }

  const assistantMessage = response.assistant_message || response.assistantMessage;
  if (assistantMessage) {
    moduleState.messages.push({ role: "assistant", content: assistantMessage });
  }

  moduleState.isComplete = Boolean(response.isComplete);
  setModuleStatus(moduleState.isComplete ? "Modulo 1 concluido. Voce ja pode seguir para o proximo modulo." : "", "success");
}

function renderModuleState() {
  renderMessages();
  renderSendingState();
}

function renderMessages() {
  const thread = document.querySelector("#module-chat-thread");
  if (!thread) {
    return;
  }

  thread.innerHTML = moduleState.messages
    .map(
      (message) => `
        <article class="assistant-message ${message.role === "user" ? "from-user" : ""}">
          <strong>${message.role === "user" ? "Voce" : "AXN"}</strong>
          <p>${escapeHtml(message.content)}</p>
        </article>
      `
    )
    .join("");

  thread.scrollTop = thread.scrollHeight;
}

function renderSendingState() {
  const button = document.querySelector("#module-send");
  const input = document.querySelector("#module-chat-input");

  if (button) {
    button.disabled = moduleState.isSending || moduleState.isComplete;
    button.textContent = moduleState.isSending ? "Pensando..." : moduleState.isComplete ? "Concluido" : "Enviar";
  }

  if (input) {
    input.disabled = moduleState.isSending || moduleState.isComplete;
    input.placeholder = moduleState.isComplete
      ? "Modulo concluido. Use Next para seguir."
      : "Escreva sua resposta aqui...";
  }
}

async function exportModulePlan() {
  if (!moduleState.conversationId) {
    downloadJson({
      exportedAt: new Date().toISOString(),
      module: "Modulo 1 - Planejamento Estrategico",
      messages: moduleState.messages,
      transferBlocks: []
    });
    return;
  }

  try {
    const endpoint = window.AXON_RUNTIME_CONFIG?.endpoints?.module1Export || "/api/module-1/export";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: moduleState.conversationId })
    });
    const payload = await response.json();

    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error || "module_1_export_failed");
    }

    downloadJson({
      exportedAt: new Date().toISOString(),
      module: "Modulo 1 - Planejamento Estrategico",
      conversationId: payload.conversationId,
      transferBlocks: payload.transferBlocks || [],
      messages: payload.messages || moduleState.messages
    });
  } catch {
    downloadJson({
      exportedAt: new Date().toISOString(),
      module: "Modulo 1 - Planejamento Estrategico",
      conversationId: moduleState.conversationId,
      messages: moduleState.messages,
      transferBlocks: []
    });
  }
}

function downloadJson(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "planejamento-estrategico-axon-modulo-1.json";
  link.click();
  URL.revokeObjectURL(url);
}

function loadModuleState() {
  const fallback = {
    conversationId: "",
    messages: [{ role: "assistant", content: MODULE_1_INITIAL_MESSAGE }],
    isComplete: false,
    isSending: false
  };

  try {
    const saved = JSON.parse(window.localStorage.getItem(MODULE_1_STORAGE_KEY) || "null");
    if (!saved?.messages?.length) {
      return fallback;
    }

    return {
      ...fallback,
      ...saved,
      isSending: false
    };
  } catch {
    return fallback;
  }
}

function saveModuleState() {
  window.localStorage.setItem(
    MODULE_1_STORAGE_KEY,
    JSON.stringify({
      conversationId: moduleState.conversationId,
      messages: moduleState.messages,
      isComplete: moduleState.isComplete
    })
  );
}

function setModuleStatus(message, type) {
  const status = document.querySelector("#module-chat-status");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.className = `form-status ${type ? `form-status-${type}` : ""}`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}