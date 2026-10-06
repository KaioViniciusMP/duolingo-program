# PyLingo — App para aprender Python no estilo Duolingo

Nome provisório. Este arquivo é a especificação do projeto. Siga as decisões abaixo e pergunte antes de mudar qualquer uma delas.

## Visão geral

PWA mobile-first, instalável e com funcionamento offline, em português do Brasil, que ensina Python com a dinâmica do Duolingo: lições curtas, correção imediata, repetição dos erros, trilha com desbloqueio sequencial, XP e sequência de dias.

## Decisões fechadas

- **Sem sistema de vidas no MVP.** O aluno pode errar à vontade. O erro só faz o exercício voltar para o fim da fila. Um "modo desafio" com corações fica para o futuro.
- **Sem login.** Todo o progresso fica salvo no aparelho, no localStorage (chave `pylingo:progresso`).
- **Lições divididas em partes.** Cada lição (círculo da Trilha) é dividida automaticamente em partes de cerca de 5 exercícios (`round(total / 5)`, no mínimo 1). Cada parte mistura reconhecimento e produção. Um anel em volta da lição atual mostra um segmento por parte. A lição só conta como concluída depois da última parte. Ao refazer uma lição concluída, abre uma parte por vez, alternando entre elas.
- **XP ainda em aberto.** Com as partes, a regra de XP (por lição ou por parte), a sequência e a meta diária precisam ser decididas de novo na etapa 4. Por enquanto, nada de XP.
- **Correção por comparação** com respostas aceitas. Não executar Python no navegador por enquanto.
- **Identidade visual própria.** Não usar o mascote, as ilustrações nem a marca do Duolingo. O mascote é uma cobrinha original, com nome provisório "Cobi". Feedback: verde para acerto, vermelho para erro. A cor principal puxa o azul e o amarelo do Python.
- **Idioma:** a interface é em pt-BR. O código dos exercícios é em Python normal, com nomes de variáveis em português (`idade`, `nome`, `total`).
- **Fora do escopo:** qualquer exercício de voz ou áudio.

## Stack

- Vite + React + JavaScript
- vite-plugin-pwa (somente na etapa 5)
- Prism (ou outra biblioteca leve) para destacar a sintaxe
- Fonte monoespaçada legível no celular (JetBrains Mono ou Fira Code)
- Sem backend

## Estrutura de pastas

```
src/
  data/                  conteúdo: um arquivo JSON por unidade (unidade-01.json…) + curso.js
  engine/                regras: fila da lição, partes, correção, trilha, progresso (com testes Vitest)
  screens/               Splash, Boas-vindas, Trilha, Guia, Licao, LicaoConcluida, Perfil, PraticarErros
  components/exercicios/ um componente por tipo de exercício
  components/            barra de progresso, faixa de feedback, modais, mascote
docs/
```

O conteúdo fica sempre separado das telas: nenhum exercício escrito direto em componente.

## Telas

| Tela | Conteúdo |
|---|---|
| Splash | Toda vez que o app abre: Cobi entrando, nome PyLingo e barra de carregamento (~1,6 s). Um toque pula. |
| Boas-vindas (só na primeira vez) | Mascote, frase curta e botão "Começar", com escolha da meta diária (1, 2 ou 3), que pode ser trocada no Perfil. |
| Trilha (home) | Caminho em zigue-zague de lições em círculos "3D", agrupadas por unidade. O cabeçalho colorido da unidade fica preso no topo e tem o botão do guia. Estados: concluída (✓), atual (anel de partes + etiqueta "Começar" + Cobi ao lado) e bloqueada (cinza com cadeado). A revisão usa 🏆. Tocar num círculo abre um balão com título, "Lição X de Y · Parte N de M" e o botão Começar / Refazer / Em breve. No topo: sequência 🔥 e XP total. Botão "Praticar erros" liberado após a unidade 1. Barra inferior: Trilha e Perfil. |
| Guia da unidade | Resumo de cada assunto da unidade com exemplos de código (campo `guia` do JSON). |
| Lição | Barra de progresso no topo, "X" para sair, enunciado, área do exercício e botão "Verificar" fixo embaixo, desativado até haver resposta. |
| Faixa de feedback | Verde: "Boa!" + "Continuar". Vermelha: resposta correta + explicação de 1 a 2 linhas + "Entendi". |
| Incentivo | Depois de 2 erros seguidos: mascote + "Errar faz parte, vamos de novo?". |
| Confirmar saída | Ao tocar no "X": "Espera! Você vai perder o progresso desta lição", com "Continuar aprendendo" e "Sair". |
| Lição concluída | Mascote comemorando e três cartões: XP ganho, precisão (% de acerto na primeira tentativa) e tempo. Se a sequência aumentou, mostra antes uma tela extra da 🔥. |
| Perfil | XP total, maior sequência, lições concluídas e "Zerar progresso" com confirmação. |
| Praticar erros | Até 10 exercícios, dos mais errados para os menos. Cada acerto de primeira tira 1 do contador do exercício; com 0 ele sai da lista. Sem erros, o botão fica desativado com "Nenhum erro para praticar 🎉". |

## Regras do motor da lição

- A lição começa com uma fila de exercícios. Se o aluno acerta, o exercício sai da fila. Se erra, o exercício vai para o fim da fila.
- A barra de progresso só avança com acertos. A lição termina quando a fila esvazia.
- XP: 10 por lição concluída, mais 5 de bônus se não houver nenhum erro. Refazer uma lição já concluída vale 5 XP.
- Sequência de dias: conta qualquer dia com pelo menos uma lição concluída. Se o aluno passar um dia inteiro sem estudar, ela volta a zero. O dia vira à meia-noite do fuso do aparelho.
- Desbloqueio sequencial: cada lição abre a próxima. A lição de revisão no fim da unidade desbloqueia a unidade seguinte.
- Ordem dentro da lição (o motor ordena sozinho; a ordem no JSON não importa): 1) reconhecimento: `pares`, `multipla_escolha`, `prever_saida` com opções; 2) meio: `lacuna`, `blocos`, `encontrar_erro`; 3) produção: `digitar`, `ordenar_linhas`, `prever_saida` digitado.
- Registrar quantas vezes cada exercício foi errado; isso alimenta "Praticar erros".
- Em `pares`, errar um par conta como erro (para a precisão e para "Praticar erros"), mas o exercício não volta para o fim da fila.

## Tipos de exercício

| Tipo | Interface | Correção |
|---|---|---|
| `pares` | 4 a 5 pares embaralhados em duas colunas | Valida cada par na hora. Um par errado pisca em vermelho, mas o exercício não reinicia. |
| `multipla_escolha` | Pergunta ou código + 3 a 4 opções | Compara com a opção correta. |
| `lacuna` | Código com um espaço vazio + opções em blocos | Compara com a opção correta. |
| `blocos` | Blocos embaralhados com 1 a 2 distratores. Tocar leva o bloco para a resposta (área com linhas) e tocar de novo devolve; o banco guarda o espaço vazio. | Compara a sequência com uma ou mais sequências aceitas. |
| `digitar` | Campo de texto monoespaçado, sem corretor e sem maiúscula automática, com uma barra de símbolos `( ) ' " : = + - * [ ]` e ⇥ (4 espaços) | Normaliza antes de comparar: ignora espaços extras e espaços ao redor de operadores (fora das aspas), e trata `'` e `"` como iguais. O texto entre aspas é comparado exatamente. Mantém o recuo relativo das linhas. Diferencia maiúsculas de minúsculas. Aceita várias respostas. |
| `ordenar_linhas` | Linhas embaralhadas + setas para ajustar a indentação | Valida a ordem e o nível de indentação de cada linha. |
| `encontrar_erro` | Código dividido em trechos tocáveis | Compara o trecho tocado com o trecho do bug. |
| `prever_saida` | Código de um loop + campo ou opções | Igual a `digitar` ou `multipla_escolha`. |

## Modelo de dados

- **Unidade:** id, titulo, cor, guia[] ({titulo, texto, codigo}), licoes[]
- **Licao:** id, titulo, revisao (true na última da unidade), exercicios[]. Uma lição sem exercícios aparece como "Em breve".
- **Exercicio:** id (`u1-l2-e03`, nunca muda depois de publicado), tipo, enunciado, codigo (opcional), opcoes, respostasAceitas[], explicacao
- **Progresso:** licoesConcluidas, partesConcluidas (id da lição → total de partes feitas, inclusive ao refazer), xpTotal, sequenciaAtual, maiorSequencia, ultimoDiaEstudo, errosPorExercicio

Formato de `opcoes` e `respostasAceitas` por tipo:

| Tipo | `opcoes` | `respostasAceitas` |
|---|---|---|
| `multipla_escolha` | textos das opções | texto da opção correta |
| `pares` | `null` | lista de `[esquerda, direita]` |
| `lacuna` | blocos para a lacuna (marcada com `___` no `codigo`) | texto do bloco correto |
| `blocos` | todos os blocos, com os distratores | lista de sequências de blocos |
| `digitar` | `null` | lista de códigos aceitos |
| `ordenar_linhas` | linhas sem recuo | lista de sequências de `{texto, nivel}` |
| `encontrar_erro` | linhas como listas de trechos | `[[linha, trecho]]` |
| `prever_saida` | opções ou `null` (vira campo de digitar) | saída esperada (`\n` entre linhas) |

## Conteúdo (cerca de 42 lições, com 10 a 15 exercícios cada)

1. **Primeiros passos:** Olá, `print` · Variáveis · Tipos de dados · `input` e conversão (`int()`, `float()`) · Operadores aritméticos · Operadores relacionais e lógicos · Revisão
2. **Decisões:** `if` simples · `if/else` · `elif` · Condições compostas · Indentação e erros comuns · Revisão
3. **Repetição com while:** Contador · Condição de parada · Acumuladores · Loop infinito e `break` · Validando entrada com `while` · Revisão
4. **Repetição com for:** `range(fim)` · `range(início, fim)` · Passo e contagem regressiva · `for` × `while` · `break` e `continue` · Revisão
5. **Listas:** Índices (inclusive negativos) · `append`, `insert`, `remove`, `pop` · `len` e `in` · Fatiamento · Revisão
6. **Iteração sobre listas:** `for item in lista` · Soma, contagem e maior valor · Filtrar para uma nova lista · `enumerate` · Introdução a list comprehension · Revisão
7. **Tuplas e dicionários:** Tuplas e imutabilidade · Desempacotamento · Dicionário: criar, acessar e alterar · `.keys()`, `.values()`, `.items()` · Percorrer um dicionário · Revisão

## Ordem de construção

1. ✅ Motor da lição com `multipla_escolha` e `pares`, usando uma lição de teste sobre `print`.
2. Os demais tipos de exercício, um por vez. ✅ `blocos`, `digitar` e `lacuna`. Faltam `ordenar_linhas`, `encontrar_erro` e `prever_saida`.
3. ✅ Trilha, desbloqueio, partes, splash, guia e progresso salvo (feita antes da etapa 2, a pedido).
4. XP, sequência de dias, lição concluída, incentivo e confirmação de saída.
5. PWA: instalação e funcionamento offline.
6. Conteúdo completo, unidade por unidade. (A unidade 1 já está escrita; as unidades 2 a 7 só têm os títulos das lições.)
7. Acabamento: animações, sons, mascote e "Praticar erros".

## Como trabalhar neste projeto

- Uma etapa por vez. Ao terminar cada etapa, resuma o que foi feito, diga como testar e sugira uma mensagem de commit.
- Mobile-first: projetar para cerca de 380px de largura e testar no celular com `npm run dev -- --host`.
- Áreas de toque com no mínimo 44px. O botão principal fica sempre ao alcance do polegar.
- Explicações dos exercícios curtas, em linguagem simples, para quem nunca programou.
- Antes de mudar qualquer decisão desta especificação, perguntar.

## Para depois

Modo desafio com vidas · login e sincronização · ranking semanal · Python real no navegador (Pyodide) · modo escuro · baús de recompensa entre as lições da Trilha.
