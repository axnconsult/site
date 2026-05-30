# Agentes Revisados - Operacao Comercial / Modulo 1

Esta pasta contem as instrucoes revisadas dos agentes do Modulo 1 para uso no OpenAI Agent Builder.

Arquitetura escolhida:
- cada agente e um workflow separado na OpenAI Platform;
- o aluno conversa com a jornada unica no app;
- o n8n orquestra qual agente chamar, envia o contexto do projeto e salva o `transfer_block`;
- o documento operacional do projeto substitui o antigo fluxo manual de copiar e colar entre GPTs.

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

