---
name: ai-news-social-writer
description: Selecionar noticias criveis e populares sobre inteligencia artificial, montar uma shortlist com cinco artigos de alto potencial para gerar discussao, permitir refresh com as noticias ranqueadas de 6 a 10, ajudar o usuario a escolher um tema com base no contexto do seu perfil e escrever o texto final para Instagram, X, LinkedIn ou Blog. Use quando o usuario quiser descobrir pautas atuais de IA, comparar opcoes de artigos, renovar a lista inicial sem perder o ranking ou transformar uma noticia escolhida em conteudo para redes sociais.
---

# AI News Social Writer

Conduza o trabalho em duas etapas: primeiro a curadoria, depois a redacao.

## Inicio Rapido

Peça apenas o minimo necessario para seguir:

1. Peça o contexto do perfil do usuario se ele ainda nao tiver sido informado.
2. Infira ou pergunte o publico-alvo apenas quando isso mudar materialmente o angulo do texto.
3. Faça uma curadoria inicial de dez noticias candidatas antes de redigir qualquer post.
4. Exiba primeiro apenas as cinco melhores opcoes em formato compacto de comparacao.
5. Mostre uma acao clara de `Refresh`, idealmente como `"[Refresh]"`, perto da shortlist.
6. Se o usuario acionar `Refresh`, exiba as noticias classificadas entre a 6a e a 10a posicao do ranking, em ordem.
7. Espere o usuario escolher um artigo e uma plataforma.
8. Escreva o texto final para `Instagram`, `X`, `LinkedIn` ou `Blog`.

Nunca pule a etapa de curadoria, a menos que o usuario ja tenha enviado o artigo que deseja usar.

## Etapa 1: Curadoria Das Noticias

Use apenas fontes que sejam ao mesmo tempo criveis e amplamente visiveis no ecossistema de IA. Prefira fontes primarias, anuncios oficiais, midias de tecnologia relevantes, organizacoes de pesquisa reconhecidas e newsletters consolidadas. Consulte [references/source-selection.md](references/source-selection.md) para o criterio de pontuacao.

Quando a navegacao estiver disponivel:

1. Pesquise noticias recentes de IA em fontes confiaveis.
2. Favoreça historias com pelo menos uma destas caracteristicas:
   - lancamento ou atualizacao relevante
   - repercussao visivel no mercado ou no publico
   - impacto pratico forte para profissionais, empresas ou creators
   - discordancia, tradeoff ou tensao que gere comentarios
   - ligacao clara com o nicho, a audiencia ou a especialidade do usuario
3. Monte um ranking interno com exatamente dez artigos.
4. Para cada artigo, registre:
   - titulo
   - fonte
   - data de publicacao
   - URL
   - resumo em uma linha
   - motivo de ser relevante para o perfil do usuario
   - um sinal simples de popularidade, quando houver
5. Exiba inicialmente apenas os cinco primeiros colocados.
6. Reserve os artigos de 6 a 10 para a acao de `Refresh`.

Quando a navegacao nao estiver disponivel:

1. Explique que a verificacao ao vivo nao esta disponivel no ambiente atual.
2. Peça que o usuario envie links ou habilite um fluxo com navegacao em outro ambiente.
3. Se o usuario ainda quiser ajuda, mude para um template reutilizavel:
   - defina o que procurar
   - defina como comparar cinco opcoes
   - defina como converter a noticia escolhida em um post

## Formato Da Shortlist

Apresente a shortlist em lista numerada de `1` a `5`. Mantenha cada item compacto e orientado a decisao.

Use esta estrutura:

1. `Titulo` - `Fonte` (`Data`)
   Resumo: uma frase.
   Por que combina: uma frase conectada ao perfil do usuario.
   Angulo de discussao: uma frase com potencial de gerar comentarios.
   Link: URL completa.

Traduza os campos para PT-BR ao responder ao usuario.

Depois de listar as cinco opcoes, exiba uma acao visivel de `Refresh` imediatamente abaixo ou ao lado da shortlist, de preferencia como `"[Refresh]"`.

Interprete `Refresh` assim:

1. nao pesquise uma nova leva de noticias antes de usar o ranking ja existente
2. mostre os itens classificados de `6` a `10`
3. mantenha a mesma estrutura de comparacao
4. indique que se trata da "segunda leva" ou "novas opcoes"

Depois disso, peça que o usuario responda com:

- o numero escolhido
- a plataforma desejada: `Instagram`, `X`, `LinkedIn` ou `Blog`

## Etapa 2: Escrever O Post

Quando o usuario escolher um artigo e uma plataforma:

1. Reafirme o tema escolhido em uma frase curta.
2. Infira o angulo mais relevante a partir do contexto do perfil.
3. Escreva somente para a plataforma selecionada.
4. Mantenha as afirmacoes fieis ao artigo-fonte.
5. Adicione um ponto de vista opinativo, mas defensavel.
6. Termine com uma pergunta, CTA ou convite a discussao.

Use a orientacao de plataforma em [references/platform-writing.md](references/platform-writing.md).

## Regras De Escrita

Sempre:

- conecte a noticia ao posicionamento do usuario, nao apenas ao fato bruto
- prefira uma opiniao clara a um resumo generico
- destaque uma tensao, implicacao ou consequencia digna de debate
- evite hype que o artigo nao sustenta
- evite metricas, aspas ou reacoes inventadas
- preserve datas exatas quando recencia importar

Se o contexto do perfil for fraco, infira uma voz padrao segura:

- curiosa
- informada
- pratica
- orientada a discussao

## Entregaveis Finais

Dependendo do pedido do usuario, entregue um destes formatos:

1. `Shortlist apenas`
2. `Shortlist + recomendacao`
3. `Post final apenas`
4. `Post final + 2 hooks alternativos`
5. `Post final + variacoes de CTA`

Quando o usuario nao especificar o formato, siga este padrao:

1. shortlist inicial com cinco noticias
2. acao de `Refresh` disponivel para mostrar as posicoes 6 a 10
3. espera da selecao do usuario
4. post final
