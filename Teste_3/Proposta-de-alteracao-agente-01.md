O agente não está ansioso. Ele está tentando ser agradável.

Veja esta parte do prompt:

"Uma ou duas perguntas por rodada..."

e mais abaixo:

"Quando atingir o contexto mínimo, gere hipóteses."

Até aí, perfeito.

O problema aparece quando ele resolve escrever frases como:

"Só quero afinar dois pontos..."

"Com isso já parto..."

"Na próxima resposta eu trago..."

Essas frases não estão em lugar nenhum do prompt. O modelo inventou essa estratégia conversacional.

Por que ele faz isso?

Porque modelos recentes (principalmente GPT-5) aprenderam um padrão muito comum em atendimento:

"Só mais uma perguntinha..."

Isso reduz abandono da conversa.

Só que, para um entrevistador estruturado, isso é péssimo.

Tem outro problema escondido

Você escreveu:

Assim que as 4 perguntas do contexto mínimo estiverem respondidas, PARE de perguntar...

Excelente.

Só que depois você diz:

Para cada hipótese, avalie mercado...

e

use Web Search...

e

convide o aluno a escolher...

Na cabeça do modelo isso vira:

Ainda preciso pesquisar.
Ainda preciso montar hipóteses.
Ainda preciso validar.
Ainda preciso confirmar.

Então ele pensa:

"Vou avisar que falta só mais uma."

Só que depois encontra outra tarefa.

E repete.

Eu proibiria isso explicitamente.

Eu adicionaria uma seção inteira.

## Nunca prometa quantas perguntas faltam

Nao diga:

- "so mais uma pergunta"
- "mais duas perguntas"
- "estamos quase terminando"
- "na proxima resposta"
- "depois dessa"
- "antes de concluir"

Voce NAO sabe antecipadamente quantas rodadas ainda serao necessarias.

Pergunte apenas o que precisa nesta rodada.

Quando tiver contexto suficiente, simplesmente pare de perguntar e gere as hipoteses.

Nunca anuncie que esta perto do fim.
Nunca faca promessas sobre o numero de perguntas restantes.

Eu acho que isso sozinho elimina 80% desse comportamento.

Outro detalhe

Hoje você escreveu:

"Pergunte apenas o necessário."

Eu mudaria para:

Cada rodada deve ser independente.

Nao explique por que esta perguntando.

Nao anuncie o que perguntara depois.

Nao antecipe etapas futuras.

Apenas faca as perguntas da rodada atual.

Isso tira aquela mania de:

"Depois disso vou..."

Outro ponto MUITO importante

Você usa:

Conclua somente quando...

Mas eu acrescentaria:

Se voce perceber que ja possui informacoes suficientes para concluir, conclua imediatamente.

Nao faca perguntas adicionais apenas para aumentar sua confianca.

Nao faca perguntas por educacao.

Nao faca perguntas para confirmar algo que ja foi dito claramente.

Isso é MUITO GPT-5.

Ele adora confirmar.

E acho que encontrei outro defeito (esse é mais sério)

Você escreveu:

O aluno escolheu explicitamente uma hipótese.

O agente, porém, ficou quase cinco rodadas perguntando sobre preço.

Preço não é requisito para concluir.

Você mesmo proibiu que ele faça precificação:

"Você não deve fazer precificação final."

Mesmo assim ele gastou metade da entrevista nisso.

Isso é um sintoma de que ele percebeu "preço" como uma variável importante porque o prompt menciona "monetizável" várias vezes.

Na prática, ele virou um entrevistador de preço.

Eu removeria completamente preço da primeira etapa.

Na verdade, eu faria o oposto:

Viabilidade nesta etapa significa apenas verificar se existe mercado comprador.

Nao tente definir ticket.

Nao tente validar preco.

Nao tente estimar faturamento.

Nao tente construir modelo financeiro.

Esses temas pertencem ao agente de precificacao.

Acho que isso deixaria a entrevista muito mais enxuta.

Minha impressão geral

O prompt está muito bom. Diria que é um dos melhores prompts de orquestração que já vi para esse tipo de fluxo.

O problema é que ele ainda está escrito como uma especificação funcional ("o que fazer"). O GPT-5 também precisa de uma especificação comportamental ("como conversar").

Os modelos mais novos tendem a preencher lacunas comportamentais com padrões de assistente conversacional — daí surgem frases como "só mais uma pergunta", "estamos quase lá", "na próxima resposta...", mesmo sem nenhuma instrução nesse sentido.

Se eu estivesse refinando esse agente, dedicaria umas 20–30 linhas apenas ao comportamento conversacional. Acredito que isso melhoraria mais a experiência do que qualquer ajuste na lógica da entrevista.