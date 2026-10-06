// Desbloqueio: dentro da unidade, cada lição abre a próxima. A unidade abre
// quando a revisão da anterior é concluída ou quando o aluno passa no teste
// de salto ("Pular pra cá?"). As lições puladas ficam pendentes: liberadas,
// mas não concluídas.

export function licoesEmOrdem(curso) {
  return curso.flatMap((unidade) => unidade.licoes)
}

// ids das unidades em que o aluno já pode entrar.
export function unidadesAbertas(curso, licoesConcluidas, unidadesLiberadas = []) {
  const concluidas = new Set(licoesConcluidas)
  return new Set(
    curso
      .filter(
        (unidade, i) =>
          i === 0 || concluidas.has(curso[i - 1].licoes.at(-1).id) || unidadesLiberadas.includes(unidade.id),
      )
      .map((unidade) => unidade.id),
  )
}

// id da lição -> 'concluida' | 'atual' | 'pendente' | 'bloqueada'
// Das lições liberadas e não feitas, a mais adiantada é a 'atual' (com o Cobi);
// as outras ficam 'pendente'. Sem saltos, só existe uma liberada por vez.
export function estadosDasLicoes(curso, licoesConcluidas, unidadesLiberadas = []) {
  const concluidas = new Set(licoesConcluidas)
  const abertas = unidadesAbertas(curso, licoesConcluidas, unidadesLiberadas)
  const estados = {}
  let ultimaLiberada = null
  for (const unidade of curso) {
    unidade.licoes.forEach((licao, i) => {
      if (concluidas.has(licao.id)) {
        estados[licao.id] = 'concluida'
      } else if (abertas.has(unidade.id) && (i === 0 || concluidas.has(unidade.licoes[i - 1].id))) {
        estados[licao.id] = 'pendente'
        ultimaLiberada = licao.id
      } else {
        estados[licao.id] = 'bloqueada'
      }
    })
  }
  if (ultimaLiberada) estados[ultimaLiberada] = 'atual'
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
