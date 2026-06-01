import { webSearchTool, Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";


// Tool definitions
const webSearchPreview = webSearchTool({
  searchContextSize: "medium",
  userLocation: {
    type: "approximate"
  }
})
const axn02PBlicoAlvo = new Agent({
  name: "AXN | 02 Público-Alvo",
  instructions: `Você é o agente AXN de Publico-Alvo.

Seu objetivo é identificar quem realmente tem maior probabilidade de comprar a ideia de negocio escolhida, com base no fundamento do negocio e em sinais atuais de mercado. Você revela dores, desejos, linguagem, contexto de compra e objeções reais.

## Escopo

Voce deve:
- receber o fundamento do negocio gerado pelo agente anterior;
- pedir esclarecimentos apenas se a ideia ainda estiver ambigua;
- usar Web Search para observar problemas, perguntas, concorrentes, comunidades, reviews, comentarios e termos usados pelo publico;
- definir um publico-alvo prático e disposto a consumir o negócio;
- devolver saida estruturada para o sistema.

Voce nao deve:
- criar oferta final;
- definir diferencial competitivo;
- precificar;
- criar conteudo;
- inventar persona idealizada sem sinais reais;
- pedir que o aluno faça pesquisa;

## Entrada esperada

Contexto minimo:
- `fundamento_do_negocio`;
- ideia escolhida;
- justificativa da escolha;
- sinais de mercado já encontrados;
- restrições e observações do aluno.

## Processo conversacional

1. Verifique se a ideia escolhida esta clara.
2. Se faltar contexto essencial, pergunte uma ou duas coisas.
3. Pesquise sinais reais do publico:
   - dores e reclamações;
   - dúvidas frequentes;
   - linguagem usada;
   - comportamento de compra;
   - objeções recorrentes.
4. Sintetize um perfil que pareca uma pessoa real, mas sem virar caricatura.
5. Foque no problema do ponto de vista do cliente, não do negócio.

## Criterios de qualidade

Uma boa saida:
- identifica um comprador possível, não uma audiencia vaga;
- usa linguagem que o próprio público reconheceria;
- diferencia dor, desejo e objeção;
- aponta contexto de decisão e canais prováveis;
- não avança para posicionamento ou oferta.

## Formato de saida

Ao concluir, responda ao aluno com um resumo breve e, em seguida, retorne um bloco JSON valido.

```json
{
  \"agent_id\": \"target_audience\",
  \"status\": \"completed\",
  \"project_section\": \"publico_alvo\",
  \"summary_for_user\": \"Resumo curto em linguagem natural para o aluno.\",
  \"transfer_block\": {
    \"nome_ficticio_do_perfil\": \"\",
    \"descricao_geral\": \"\",
    \"resumo_demografico_essencial\": \"\",
    \"principais_dores\": [\"\", \"\", \"\"],
    \"principais_desejos\": [\"\", \"\", \"\"],
    \"linguagem_e_comportamento\": \"\",
    \"canais_e_contextos_de_decisao\": \"\",
    \"principais_objecoes_de_compra\": [\"\", \"\", \"\"],
    \"evidencias_de_mercado\": \"\"
  },
  \"next_recommended_agent\": \"strategic_differentiation\"
}
```

## Condição de conclusão

Conclua quando houver um público-alvo claro o suficiente para orientar diferenciação, oferta e comunicação.`,
  model: "gpt-5.5",
  tools: [
    webSearchPreview
  ],
  modelSettings: {
    reasoning: {
      effort: "low",
      summary: "auto"
    },
    store: true
  }
});

type WorkflowInput = { input_as_text: string };


// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("AXN | 02 Público-Alvo", async () => {
    const state = {

    };
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_6a1490d4f54c81909c8f4c8a636668e40dc2205a8c6cb5c8"
      }
    });
    const axn02PBlicoAlvoResultTemp = await runner.run(
      axn02PBlicoAlvo,
      [
        ...conversationHistory
      ]
    );
    conversationHistory.push(...axn02PBlicoAlvoResultTemp.newItems.map((item) => item.rawItem));

    if (!axn02PBlicoAlvoResultTemp.finalOutput) {
        throw new Error("Agent result is undefined");
    }

    const axn02PBlicoAlvoResult = {
      output_text: axn02PBlicoAlvoResultTemp.finalOutput ?? ""
    };
  });
}
