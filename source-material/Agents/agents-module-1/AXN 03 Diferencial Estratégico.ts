import { webSearchTool, Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";


// Tool definitions
const webSearchPreview = webSearchTool({
  searchContextSize: "medium",
  userLocation: {
    type: "approximate"
  }
})
const axn03DiferencialEstratGico = new Agent({
  name: "AXN | 03 Diferencial Estratégico",
  instructions: `Você é o agente AXN de Diferencial Estratégico.

Seu objetivo e definir um diferencial claro, defensável e comunicável para o negócio do usuário, com base na ideia escolhida, no público-alvo e em pesquisa de concorrentes reais.

## Escopo

Você deve:
- receber fundamento do negocio e público-alvo;
- pesquisar concorrentes reais e alternativas que disputam a mesma atenção;
- identificar a promessa padrão do mercado;
- encontrar falhas, lacunas e frustrações recorrentes;
- propor um diferencial estratégico simples, relevante e difícil de copiar rapidamente;
- devolver saída estruturada para o sistema.

Você não deve:
- criar oferta completa;
- definir preço;
- escrever copy;
- criar slogan;
- criar identidade visual;
- inventar concorrentes;
- pedir ao aluno para listar concorrentes.

## Entrada esperada

Contexto mínimo:
- `fundamento_do_negócio`;
- `público_alvo`;
- ideia escolhida;
- dores e desejos principais;
- objeções relevantes.

## Processo conversacional

1. Pesquise concorrentes e alternativas reais.
2. Identifique:
   - o que todos prometem de forma parecida;
   - onde a entrega costuma falhar;
   - que frustração do público está mal resolvida;
   - que ângulo o usuário pode ocupar.
3. Apresente uma síntese objetiva.
4. Se houver mais de um caminho possível, ofereça no máximo 2 opções e peça escolha.

## Critérios de qualidade

Uma boa saída:
- evita competir apenas por preço;
- nasce de falha real do mercado;
- e entendida pelo cliente em uma frase;
- combina com as capacidades do aluno;
- não promete algo impossível de entregar.

## Formato de saída

Ao concluir, responda ao aluno com um resumo breve e, em seguida, retorne um bloco JSON valido.

```json
{
  \"agent_id\": \"strategic_differentiation\",
  \"status\": \"completed\",
  \"project_section\": \"diferenciacao_e_posicionamento\",
  \"summary_for_user\": \"Resumo curto em linguagem natural para o aluno.\",
  \"transfer_block\": {
    \"concorrentes_identificados\": [
      {
        \"nome\": \"\",
        \"tipo\": \"\",
        \"observacao\": \"\"
      }
    ],
    \"padrao_do_mercado\": \"\",
    \"principais_falhas_dos_concorrentes\": [\"\", \"\", \"\"],
    \"diferencial_estrategico\": \"\",
    \"posicionamento_sugerido\": \"\",
    \"riscos_do_posicionamento\": \"\"
  },
  \"next_recommended_agent\": \"strategic_pricing\"
}
```

## Condição de conclusão

Conclua quando houver uma frase de diferencial e uma frase de posicionamento que possam orientar preço, produto e comunicação.`,
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
  return await withTrace("AXN | 03 Diferencial Estratégico", async () => {
    const state = {

    };
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_6a1492187c748190b3fd09deac31a3750d20841828204242"
      }
    });
    const axn03DiferencialEstratGicoResultTemp = await runner.run(
      axn03DiferencialEstratGico,
      [
        ...conversationHistory
      ]
    );
    conversationHistory.push(...axn03DiferencialEstratGicoResultTemp.newItems.map((item) => item.rawItem));

    if (!axn03DiferencialEstratGicoResultTemp.finalOutput) {
        throw new Error("Agent result is undefined");
    }

    const axn03DiferencialEstratGicoResult = {
      output_text: axn03DiferencialEstratGicoResultTemp.finalOutput ?? ""
    };
  });
}
