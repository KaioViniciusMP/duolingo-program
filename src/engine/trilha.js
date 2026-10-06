// Desbloqueio sequencial: cada lição abre a próxima, e a revisão no fim
// da unidade abre a unidade seguinte. Como a revisão é a última lição da
// unidade, basta seguir a ordem do curso.

export function licoesEmOrdem(curso) {
  return curso.flatMap((unidade) => unidade.licoes)
}

// id da lição -> 'concluida' | 'atual' | 'bloqueada'
export function estadosDasLicoes(curso, licoesConcluidas) {
  const concluidas = new Set(licoesConcluidas)
  const estados = {}
  let achouAtual = false
  for (const licao of licoesEmOrdem(curso)) {
    if (concluidas.has(licao.id)) {
      estados[licao.id] = 'concluida'
    } else if (!achouAtual) {
      estados[licao.id] = 'atual'
      achouAtual = true
    } else {
      estados[licao.id] = 'bloqueada'
    }
  }
  return estados
}

export function encontrarLicao(curso, licaoId) {
  for (const unidade of curso) {
    const licao = unidade.licoes.find((l) => l.id === licaoId)
    if (licao) return { unidade, licao }
  }
  return null
}

export function totalDeLicoes(curso) {
  return licoesEmOrdem(curso).length
}
