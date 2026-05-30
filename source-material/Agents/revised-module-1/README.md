# Agentes Revisados - Operacao Comercial / Modulo 1

Esta pasta contem as instrucoes revisadas dos agentes do Modulo 1 para uso no OpenAI Agent Builder.

Arquitetura escolhida:
- o Agent Builder/OpenAI Platform e a fonte principal do fluxo conversacional;
- o fluxo do Modulo 1 e serial e fixo, sem orquestrador inteligente decidindo a ordem;
- o aluno conversa com uma jornada unica no app;
- cada agente responde em JSON estruturado com `status`, `assistant_message`, `transfer_block` e `next_agent_id`;
- o app/site salva o estado oficial do projeto e atualiza o documento operacional;
- o n8n fica reservado para automacoes assincronas, nao para orquestrar a conversa principal.

Veja o mapa de montagem em `AGENT_BUILDER_BLUEPRINT.md`.

Configuracao recomendada:

| Agente | Tool Web Search | Temperatura | Max tokens inicial |
| --- | --- | ---: | ---: |
| AXN \| 01 Modelagem de Negocio | Sim | 0.5 | 8000 |
| AXN \| 02 Publico-Alvo | Sim | 0.5 | 8000 |
| AXN \| 03 Diferencial Estrategico | Sim | 0.5 | 8000 |
| AXN \| 04 Precificacao Estrategica | Sim | 0.4 | 8000 |
| AXN \| 05 Conceito de Produto | Nao | 0.7 | 6000 |
| AXN \| 06 Identidade Visual | Nao | 0.7 | 6000 |

Observacoes:
- evitar `gpt-4o-mini` como padrao para decisoes estrategicas;
- manter os workflows em draft ate validacao manual;
- usar saida em texto contendo JSON valido quando o Agent Builder nao estiver configurado com output schema;
- remover qualquer instrucao antiga de "feche esta conversa" ou "abra o proximo GPT".


