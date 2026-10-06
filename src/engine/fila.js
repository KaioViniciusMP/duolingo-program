// Motor da lição: fila de exercícios, progresso, precisão e erros.
// Funções puras: recebem um estado e devolvem um novo estado.

// Grupo de cada tipo: 1 = reconhecimento, 2 = meio, 3 = produção.
export function grupoDoExercicio(exercicio) {
  switch (exercicio.tipo) {
    case 'pares':
    case 'multipla_escolha':
      return 1
    case 'lacuna':
    case 'blocos':
    case 'encontrar_erro':
      return 2
    case 'digitar':
    case 'ordenar_linhas':
      return 3
    case 'prever_saida':
      return exercicio.opcoes ? 1 : 3
    default:
      return 2
  }
}

// Ordena por grupo mantendo a ordem original dentro de cada grupo.
export function ordenarExercicios(exercicios) {
  return exercicios
    .map((exercicio, indice) => ({ exercicio, indice }))
    .sort((a, b) => grupoDoExercicio(a.exercicio) - grupoDoExercicio(b.exercicio) || a.indice - b.indice)
    .map(({ exercicio }) => exercicio)
}

export function criarLicao(exercicios) {
  const ordenados = ordenarExercicios(exercicios)
  return {
    fila: ordenados.map((e) => e.id),
    total: ordenados.length,
    acertos: 0,
    tentativas: 0,
    errosSeguidos: 0,
    // id -> true se acertou de primeira, false se errou na primeira vez
    primeiraTentativa: {},
    // id -> quantas vezes o exercício foi errado nesta lição
    errosPorExercicio: {},
  }
}

export function exercicioAtual(estado) {
  return estado.fila[0] ?? null
}

// resultado: { correto, erros }
// - correto: o exercício foi resolvido (sai da fila) ou não (vai para o fim).
// - erros: quantos erros aconteceram nesta tentativa. Em `pares` o exercício
//   termina correto mesmo com pares errados no caminho.
export function registrarResposta(estado, resultado) {
  const id = exercicioAtual(estado)
  if (id === null) return estado

  const erros = resultado.erros ?? (resultado.correto ? 0 : 1)
  const errou = erros > 0
  const [, ...resto] = estado.fila

  return {
    ...estado,
    fila: resultado.correto ? resto : [...resto, id],
    acertos: resultado.correto ? estado.acertos + 1 : estado.acertos,
    tentativas: estado.tentativas + 1,
    errosSeguidos: errou ? estado.errosSeguidos + 1 : 0,
    primeiraTentativa:
      id in estado.primeiraTentativa
        ? estado.primeiraTentativa
        : { ...estado.primeiraTentativa, [id]: !errou },
    errosPorExercicio: errou
      ? { ...estado.errosPorExercicio, [id]: (estado.errosPorExercicio[id] ?? 0) + 1 }
      : estado.errosPorExercicio,
  }
}

export function licaoTerminada(estado) {
  return estado.fila.length === 0
}

// Fração de 0 a 1. Só avança com acertos.
export function progresso(estado) {
  return estado.total === 0 ? 1 : estado.acertos / estado.total
}

// Percentual (0 a 100) de exercícios acertados na primeira tentativa.
export function precisao(estado) {
  const valores = Object.values(estado.primeiraTentativa)
  if (valores.length === 0) return 100
  return Math.round((valores.filter(Boolean).length / valores.length) * 100)
}

export function semErros(estado) {
  return Object.keys(estado.errosPorExercicio).length === 0
}
