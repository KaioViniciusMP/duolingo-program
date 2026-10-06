import { useCallback, useEffect, useState } from 'react'
import BarraNavegacao from './components/BarraNavegacao.jsx'
import { curso } from './data/curso.js'
import { aplicarTema, carregarConfiguracoes, salvarConfiguracoes } from './engine/configuracoes.js'
import { dividirEmPartes, proximaParte } from './engine/partes.js'
import { exerciciosParaPraticar, praticaLiberada, registrarPratica } from './engine/praticar.js'
import { carregarProgresso, progressoInicial, registrarParteConcluida, salvarProgresso, somarErros } from './engine/progresso.js'
import { exerciciosDoTeste, liberarAte, reprovouNoTeste } from './engine/salto.js'
import { encontrarLicao, totalDeLicoes } from './engine/trilha.js'
import BoasVindas from './screens/BoasVindas.jsx'
import Guia from './screens/Guia.jsx'
import Licao from './screens/Licao.jsx'
import LicaoConcluida from './screens/LicaoConcluida.jsx'
import Perfil from './screens/Perfil.jsx'
import Splash from './screens/Splash.jsx'
import Trilha from './screens/Trilha.jsx'

export default function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true)
  const [progresso, setProgresso] = useState(carregarProgresso)
  const [configuracoes, setConfiguracoes] = useState(carregarConfiguracoes)
  const [tela, setTela] = useState({ nome: 'trilha' })
  const fecharSplash = useCallback(() => setMostrarSplash(false), [])

  // A Trilha rola sozinha até a lição atual; as outras telas abrem no topo.
  useEffect(() => {
    if (tela.nome !== 'trilha') window.scrollTo(0, 0)
  }, [tela.nome])

  function mudarConfiguracoes(mudancas) {
    const novas = { ...configuracoes, ...mudancas }
    setConfiguracoes(novas)
    salvarConfiguracoes(novas)
    aplicarTema(novas.tema)
  }

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

  function comecarPratica() {
    const exercicios = exerciciosParaPraticar(curso, progresso.errosPorExercicio)
    setTela({ nome: 'licao', licao: { id: 'praticar-erros', exercicios }, pratica: true })
  }

  function comecarTeste(unidadeId) {
    const exercicios = exerciciosDoTeste(curso, unidadeId, progresso.licoesConcluidas)
    // Unidades anteriores ainda sem conteúdo: não há o que testar, libera direto.
    if (exercicios.length === 0) {
      atualizarProgresso(liberarAte(curso, progresso, unidadeId))
      return
    }
    setTela({ nome: 'licao', licao: { id: `teste-${unidadeId}`, exercicios }, teste: unidadeId })
  }

  function concluirParte({ estado, tempoMs }) {
    if (tela.teste) {
      const comErros = somarErros(progresso, estado.errosPorExercicio)
      const numero = curso.findIndex((u) => u.id === tela.teste) + 1
      if (reprovouNoTeste(estado)) {
        atualizarProgresso(comErros)
        setTela({
          nome: 'concluida',
          estado,
          tempoMs,
          titulo: 'Quase!',
          subtitulo: 'Você errou mais de 3. Siga pelas lições ou tente o teste de novo.',
          comemorando: false,
        })
      } else {
        atualizarProgresso(liberarAte(curso, comErros, tela.teste))
        setTela({ nome: 'concluida', estado, tempoMs, titulo: `Unidade ${numero} liberada!` })
      }
      return
    }
    if (tela.pratica) {
      atualizarProgresso(registrarPratica(progresso, estado))
      setTela({ nome: 'concluida', estado, tempoMs, titulo: 'Treino concluído!' })
      return
    }
    const { licao, totalDePartes } = tela
    const novo = registrarParteConcluida(progresso, licao.id, totalDePartes, estado.errosPorExercicio)
    const licaoTerminou = novo.partesConcluidas[licao.id] === totalDePartes
    atualizarProgresso(novo)
    setTela({ nome: 'concluida', estado, tempoMs, titulo: licaoTerminou ? 'Lição concluída!' : 'Parte concluída!' })
  }

  function estadoDaPratica() {
    if (!praticaLiberada(curso, progresso.licoesConcluidas)) return 'bloqueada'
    return exerciciosParaPraticar(curso, progresso.errosPorExercicio).length > 0 ? 'disponivel' : 'vazia'
  }

  if (mostrarSplash) return <Splash onFim={fecharSplash} />

  if (!progresso.boasVindasVista) {
    return <BoasVindas onComecar={() => atualizarProgresso({ ...progresso, boasVindasVista: true })} />
  }

  if (tela.nome === 'licao') {
    return (
      <Licao
        licao={tela.licao}
        teste={Boolean(tela.teste)}
        onSair={() => setTela({ nome: 'trilha' })}
        onConcluir={concluirParte}
      />
    )
  }

  if (tela.nome === 'concluida') {
    return (
      <LicaoConcluida
        estado={tela.estado}
        tempoMs={tela.tempoMs}
        titulo={tela.titulo}
        subtitulo={tela.subtitulo}
        comemorando={tela.comemorando}
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
          configuracoes={configuracoes}
          onMudarConfiguracoes={mudarConfiguracoes}
          onZerar={() => atualizarProgresso(progressoInicial())}
        />
      ) : (
        <Trilha
          curso={curso}
          progresso={progresso}
          pratica={estadoDaPratica()}
          onPraticar={comecarPratica}
          onPular={comecarTeste}
          onComecarLicao={comecarLicao}
          onAbrirGuia={(unidadeId) => setTela({ nome: 'guia', unidadeId })}
        />
      )}
      <BarraNavegacao abaAtiva={tela.nome} onMudarAba={(aba) => setTela({ nome: aba })} />
    </>
  )
}
