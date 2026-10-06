import { useState } from 'react'
import Mascote from '../components/Mascote.jsx'
import './Perfil.css'

// Versão simples. Meta diária e o resto do perfil entram na etapa 4.
export default function Perfil({ progresso, totalDeLicoes, onZerar }) {
  const [confirmando, setConfirmando] = useState(false)

  return (
    <div className="perfil">
      <div className="perfil__topo">
        <Mascote tamanho={110} />
        <h1>Seu progresso</h1>
      </div>

      <div className="perfil__estatisticas">
        <div className="estatistica">
          <span className="estatistica__valor">⭐ {progresso.xpTotal}</span>
          <span className="estatistica__rotulo">XP total</span>
        </div>
        <div className="estatistica">
          <span className="estatistica__valor">🔥 {progresso.maiorSequencia}</span>
          <span className="estatistica__rotulo">Maior sequência</span>
        </div>
        <div className="estatistica">
          <span className="estatistica__valor">
            {progresso.licoesConcluidas.length}/{totalDeLicoes}
          </span>
          <span className="estatistica__rotulo">Lições concluídas</span>
        </div>
      </div>

      {confirmando ? (
        <div className="perfil__confirmar" role="alertdialog" aria-labelledby="zerar-titulo">
          <p id="zerar-titulo">Tem certeza? Todo o seu progresso será apagado e não dá para desfazer.</p>
          <div className="perfil__confirmar-botoes">
            <button className="botao botao--largo" onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
            <button
              className="botao botao--largo botao--perigo"
              onClick={() => {
                onZerar()
                setConfirmando(false)
              }}
            >
              Zerar
            </button>
          </div>
        </div>
      ) : (
        <button className="perfil__zerar" onClick={() => setConfirmando(true)}>
          Zerar progresso
        </button>
      )}
    </div>
  )
}
