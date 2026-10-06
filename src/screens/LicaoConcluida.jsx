import { useEffect, useRef } from 'react'
import Mascote from '../components/Mascote.jsx'
import { precisao } from '../engine/fila.js'
import { tocarSom } from '../sons.js'
import './LicaoConcluida.css'

// O cartão de XP e a tela da sequência 🔥 entram quando a regra de XP for decidida.
export default function LicaoConcluida({ estado, tempoMs, titulo, subtitulo, comemorando = true, onContinuar }) {
  // O ref evita tocar duas vezes no modo de desenvolvimento (StrictMode).
  const tocou = useRef(false)
  useEffect(() => {
    if (comemorando && !tocou.current) tocarSom('concluida')
    tocou.current = true
  }, [comemorando])

  const segundos = Math.round(tempoMs / 1000)
  const tempo = `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`

  return (
    <div className="concluida">
      <div className="concluida__mascote">
        <Mascote tamanho={150} comemorando={comemorando} />
      </div>
      <h1 className="concluida__titulo">{titulo}</h1>
      {subtitulo && <p className="concluida__subtitulo">{subtitulo}</p>}
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
