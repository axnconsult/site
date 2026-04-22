window.AXON_RUNTIME_CONFIG = {
  social: {
    // Troque pelos links reais da Axon.
    instagram: "https://www.instagram.com/axonconsult/",
    youtube: "https://www.youtube.com/@axnconsult",
    linkedin: "https://linkedin.comhttps://www.linkedin.com/in/axn-consult-780a1b39b//"
  },
  webhooks: {
    // Estes endpoints devem existir no seu n8n.
    lead: "https://webhooks.axnconsult.com.br/webhook/site-lead",
    consultoria: "https://webhooks.axnconsult.com.br/webhook/site-consultoria",
    perfil: "https://webhooks.axnconsult.com.br/webhook/site-perfil"
  },
  checkout: {
    // Pode deixar vazio por enquanto.
    // Quando o Stripe entrar, cole aqui os links de pagamento.
    deploy: "",
    operacaoComercial: "",
    consultoria: ""
  }
};
