// "Praticar erros": treino com os exercícios que o aluno mais errou.

export const LIMITE_DA_PRATICA = 10

// Liberado depois da revisão da unidade 1.
export function praticaLiberada(curso, licoesConcluidas) {
  return licoesConcluidas.includes(curso[0].licoes.at(-1).id)
}

// Até 10 exercícios, dos mais errados para os menos. No empate, vale a ordem do curso.
// Ids que não existem mais no conteúdo são ignorados.
export function exerciciosParaPraticar(curso, errosPorExercicio, limite = LIMITE_DA_PRATICA) {
  return curso
    .flatMap((u) => u.licoes.flatMap((l) => l.exercicios))
    .filter((e) => (errosPorExercicio[e.id] ?? 0) > 0)
    .map((exercicio, indice) => ({ exercicio, indice, erros: errosPorExercicio[exercicio.id] }))
    .sort((a, b) => b.erros - a.erros || a.indice - b.indice)
    .slice(0, limite)
    .map(({ exercicio }) => exercicio)
}

// Cada acerto de primeira tira 1 do contador; com 0, o exercício sai da lista.
// Os erros cometidos durante a prática somam no contador, como numa lição.
export function registrarPratica(progresso, estado) {
  const errosPorExercicio = { ...progresso.errosPorExercicio }
  for (const [id, quantidade] of Object.entries(estado.errosPorExercicio)) {
    errosPorExercicio[id] = (errosPorExercicio[id] ?? 0) + quantidade
  }
  for (const [id, acertouDePrimeira] of Object.entries(estado.primeiraTentativa)) {
    if (!acertouDePrimeira) continue
    errosPorExercicio[id] = (errosPorExercicio[id] ?? 0) - 1
    if (errosPorExercicio[id] <= 0) delete errosPorExercicio[id]
  }
  return { ...progresso, errosPorExercicio }
}
