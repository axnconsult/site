window.AXON_RUNTIME_CONFIG = {
  social: {
    // Troque pelos links reais da Axon.
    instagram: "https://www.instagram.com/axonconsult/",
    youtube: "https://www.youtube.com/@axnconsult",
    linkedin: "https://linkedin.comhttps://www.linkedin.com/in/axn-consult-780a1b39b//"
  },
  webhooks: {
    // Estes endpoints devem existir no seu n8n.
    lead: "https://hooks.axnconsult.com.br/site-lead",
    consultoria: "https://hooks.axnconsult.com.br/site-consultoria",
    perfil: "https://hooks.axnconsult.com.br/site-perfil"
  },
  checkout: {
    // Pode deixar vazio por enquanto.
    // Quando o Stripe entrar, cole aqui os links de pagamento.
    deploy: "",
    operacaoComercial: "",
    consultoria: ""
  }
};
