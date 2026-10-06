// Teste de salto ("Pular pra cá?"): libera uma unidade lá na frente para quem
// já sabe o conteúdo das anteriores.
import { embaralhar } from './embaralhar.js'
import { exerciciosErrados, licaoTerminada } from './fila.js'

export const EXERCICIOS_NO_TESTE = 10
export const ERROS_PERMITIDOS = 3

// Exercícios sorteados das unidades antes da escolhida que ainda não foram
// concluídas por inteiro.
export function exerciciosDoTeste(curso, unidadeId, licoesConcluidas, sortear = embaralhar) {
  const concluidas = new Set(licoesConcluidas)
  const anteriores = curso.slice(0, curso.findIndex((u) => u.id === unidadeId))
  const pendentes = anteriores.filter((u) => !u.licoes.every((l) => concluidas.has(l.id)))
  const exercicios = pendentes.flatMap((u) => u.licoes.flatMap((l) => l.exercicios))
  return sortear(exercicios).slice(0, EXERCICIOS_NO_TESTE)
}

export function reprovouNoTeste(estado) {
  return exerciciosErrados(estado) > ERROS_PERMITIDOS
}

// O teste acaba quando a fila esvazia ou no erro que passa do limite.
export function testeTerminado(estado) {
  return licaoTerminada(estado) || reprovouNoTeste(estado)
}

// Passar libera a unidade escolhida e todas as de antes, com as lições
// puladas pendentes (liberadas, mas não concluídas).
export function liberarAte(curso, progresso, unidadeId) {
  const ate = curso.findIndex((u) => u.id === unidadeId)
  const novas = curso.slice(0, ate + 1).map((u) => u.id)
  return { ...progresso, unidadesLiberadas: [...new Set([...progresso.unidadesLiberadas, ...novas])] }
}
