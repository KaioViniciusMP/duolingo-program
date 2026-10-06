// Progresso do aluno salvo no aparelho (localStorage).

export const CHAVE_PROGRESSO = 'pylingo:progresso'

export function progressoInicial() {
  return {
    licoesConcluidas: [],
    xpTotal: 0,
    sequenciaAtual: 0,
    maiorSequencia: 0,
    ultimoDiaEstudo: null,
    errosPorExercicio: {},
    // id da lição -> total de partes concluídas (conta também ao refazer)
    partesConcluidas: {},
    // false até o aluno passar pela tela de boas-vindas
    boasVindasVista: false,
  }
}

function armazenamentoPadrao() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

export function carregarProgresso(armazenamento = armazenamentoPadrao()) {
  try {
    const texto = armazenamento?.getItem(CHAVE_PROGRESSO)
    if (!texto) return progressoInicial()
    return { ...progressoInicial(), ...JSON.parse(texto) }
  } catch {
    return progressoInicial()
  }
}

export function salvarProgresso(progresso, armazenamento = armazenamentoPadrao()) {
  try {
    armazenamento?.setItem(CHAVE_PROGRESSO, JSON.stringify(progresso))
  } catch {
    // Sem espaço ou armazenamento bloqueado: o app segue funcionando nesta sessão.
  }
}

// errosDaParte: id do exercício -> quantas vezes foi errado na parte.
// A lição entra em licoesConcluidas quando todas as partes foram feitas.
export function registrarParteConcluida(progresso, licaoId, totalDePartes, errosDaParte) {
  const errosPorExercicio = { ...progresso.errosPorExercicio }
  for (const [id, quantidade] of Object.entries(errosDaParte)) {
    errosPorExercicio[id] = (errosPorExercicio[id] ?? 0) + quantidade
  }
  const partesFeitas = (progresso.partesConcluidas[licaoId] ?? 0) + 1
  const concluiu = partesFeitas >= totalDePartes
  return {
    ...progresso,
    partesConcluidas: { ...progresso.partesConcluidas, [licaoId]: partesFeitas },
    licoesConcluidas:
      concluiu && !progresso.licoesConcluidas.includes(licaoId)
        ? [...progresso.licoesConcluidas, licaoId]
        : progresso.licoesConcluidas,
    errosPorExercicio,
  }
}
