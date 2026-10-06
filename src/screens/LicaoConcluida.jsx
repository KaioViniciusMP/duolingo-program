import { precisao } from '../engine/fila.js'
import './LicaoConcluida.css'

// Versão provisória da etapa 1. XP, sequência e mascote entram na etapa 4.
export default function LicaoConcluida({ estado, tempoMs, licaoTerminou, onContinuar }) {
  const segundos = Math.round(tempoMs / 1000)
  const tempo = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`

  return (
    <div className="concluida">
      <h1 className="concluida__titulo">{licaoTerminou ? 'Lição concluída!' : 'Parte concluída!'}</h1>
      <div className="concluida__cartoes">
        <div className="cartao cartao--amarelo">
          <span className="cartao__rotulo">Precisão</span>
          <span className="cartao__valor">{precisao(estado)}%</span>
        </div>
        <div className="cartao cartao--azul">
          <span className="cartao__rotulo">Tempo</span>
          <span className="cartao__valor">{tempo}</span>
        </div>
      </div>
      <button className="botao botao--largo" onClick={onContinuar}>
        Continuar
      </button>
    </div>
  )
}
