import { useCallback, useEffect, useState } from 'react'
import BarraNavegacao from './components/BarraNavegacao.jsx'
import { curso } from './data/curso.js'
import { dividirEmPartes, proximaParte } from './engine/partes.js'
import { carregarProgresso, progressoInicial, registrarParteConcluida, salvarProgresso } from './engine/progresso.js'
import { encontrarLicao, totalDeLicoes } from './engine/trilha.js'
import Guia from './screens/Guia.jsx'
import Licao from './screens/Licao.jsx'
import LicaoConcluida from './screens/LicaoConcluida.jsx'
import Perfil from './screens/Perfil.jsx'
import Splash from './screens/Splash.jsx'
import Trilha from './screens/Trilha.jsx'

export default function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true)
  const [progresso, setProgresso] = useState(carregarProgresso)
  const [tela, setTela] = useState({ nome: 'trilha' })
  const fecharSplash = useCallback(() => setMostrarSplash(false), [])

  // A Trilha rola sozinha até a lição atual; as outras telas abrem no topo.
  useEffect(() => {
    if (tela.nome !== 'trilha') window.scrollTo(0, 0)
  }, [tela.nome])

  function atualizarProgresso(novo) {
    setProgresso(novo)
    salvarProgresso(novo)
  }

  function comecarLicao(licaoId) {
    const { licao } = encontrarLicao(curso, licaoId)
    const partes = dividirEmPartes(licao.exercicios)
    const indiceParte = proximaParte(progresso.partesConcluidas[licaoId] ?? 0, partes.length)
    setTela({
      nome: 'licao',
      licao: { ...licao, exercicios: partes[indiceParte] },
      totalDePartes: partes.length,
    })
  }

  function concluirParte({ estado, tempoMs }) {
    const { licao, totalDePartes } = tela
    const novo = registrarParteConcluida(progresso, licao.id, totalDePartes, estado.errosPorExercicio)
    const licaoTerminou = novo.partesConcluidas[licao.id] === totalDePartes
    atualizarProgresso(novo)
    setTela({ nome: 'concluida', estado, tempoMs, titulo: licaoTerminou ? 'Lição concluída!' : 'Parte concluída!' })
  }

  if (mostrarSplash) return <Splash onFim={fecharSplash} />

  if (tela.nome === 'licao') {
    return <Licao licao={tela.licao} onSair={() => setTela({ nome: 'trilha' })} onConcluir={concluirParte} />
  }

  if (tela.nome === 'concluida') {
    return (
      <LicaoConcluida
        estado={tela.estado}
        tempoMs={tela.tempoMs}
        titulo={tela.titulo}
        onContinuar={() => setTela({ nome: 'trilha' })}
      />
    )
  }

  if (tela.nome === 'guia') {
    const indice = curso.findIndex((u) => u.id === tela.unidadeId)
    return <Guia unidade={curso[indice]} numero={indice + 1} onVoltar={() => setTela({ nome: 'trilha' })} />
  }

  return (
    <>
      {tela.nome === 'perfil' ? (
        <Perfil
          progresso={progresso}
          totalDeLicoes={totalDeLicoes(curso)}
          onZerar={() => atualizarProgresso(progressoInicial())}
        />
      ) : (
        <Trilha
          curso={curso}
          progresso={progresso}
          onComecarLicao={comecarLicao}
          onAbrirGuia={(unidadeId) => setTela({ nome: 'guia', unidadeId })}
        />
      )}
      <BarraNavegacao abaAtiva={tela.nome} onMudarAba={(aba) => setTela({ nome: aba })} />
    </>
  )
}
