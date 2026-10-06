import { useMemo, useRef, useState } from 'react'
import BarraProgresso from '../components/BarraProgresso.jsx'
import Codigo from '../components/Codigo.jsx'
import FaixaFeedback from '../components/FaixaFeedback.jsx'
import { componentesPorTipo, TIPOS_AUTOCORRIGIDOS } from '../components/exercicios/index.js'
import { corrigir, respostaParaMostrar } from '../engine/correcao.js'
import { criarLicao, exercicioAtual, licaoTerminada, progresso, registrarResposta } from '../engine/fila.js'
import './Licao.css'

export default function Licao({ licao, onSair, onConcluir }) {
  const exerciciosPorId = useMemo(
    () => Object.fromEntries(licao.exercicios.map((e) => [e.id, e])),
    [licao],
  )
  const [estado, setEstado] = useState(() => criarLicao(licao.exercicios))
  const [resposta, setResposta] = useState(null)
  // Enquanto a faixa aparece, o exercício mostrado é o que acabou de ser respondido.
  const [feedback, setFeedback] = useState(null)
  // Muda a cada exercício para remontar o componente (e reembaralhar as opções).
  const [rodada, setRodada] = useState(0)
  const inicio = useRef(Date.now())

  const exercicio = exerciciosPorId[feedback ? feedback.exercicioId : exercicioAtual(estado)]
  const Componente = componentesPorTipo[exercicio.tipo]
  const autocorrigido = TIPOS_AUTOCORRIGIDOS.has(exercicio.tipo)

  function responder(resultado) {
    setEstado(registrarResposta(estado, resultado))
    setFeedback({ exercicioId: exercicio.id, correto: resultado.correto })
  }

  function verificar() {
    responder({ correto: corrigir(exercicio, resposta) })
  }

  function continuar() {
    if (licaoTerminada(estado)) {
      onConcluir({ estado, tempoMs: Date.now() - inicio.current })
      return
    }
    setFeedback(null)
    setResposta(null)
    setRodada((r) => r + 1)
  }

  return (
    <div className="licao">
      <header className="licao__topo">
        <button className="licao__sair" onClick={onSair} aria-label="Sair da lição">
          ✕
        </button>
        <BarraProgresso valor={progresso(estado)} />
      </header>

      <main className="licao__corpo">
        <h1 className="licao__enunciado">{exercicio.enunciado}</h1>
        {exercicio.codigo && <Codigo codigo={exercicio.codigo} />}
        <div className="licao__exercicio">
          <Componente
            key={rodada}
            exercicio={exercicio}
            resposta={resposta}
            bloqueado={feedback !== null}
            onMudarResposta={setResposta}
            onConcluir={({ erros }) => responder({ correto: true, erros })}
          />
        </div>
      </main>

      <footer className="licao__rodape">
        {feedback ? (
          <FaixaFeedback
            correto={feedback.correto}
            respostaCorreta={respostaParaMostrar(exercicio)}
            explicacao={exercicio.explicacao}
            onContinuar={continuar}
          />
        ) : (
          <div className="licao__acao">
            <button
              className="botao botao--largo"
              disabled={autocorrigido || resposta === null}
              onClick={verificar}
            >
              Verificar
            </button>
          </div>
        )}
      </footer>
    </div>
  )
}
