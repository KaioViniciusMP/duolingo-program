import Mascote from './Mascote.jsx'
import './Modal.css'

// Aparece ao tocar no "X" da lição. Tocar fora da caixa também continua a lição.
export default function ConfirmarSaida({ onContinuar, onSair }) {
  return (
    <div className="modal" onClick={onContinuar}>
      <div
        className="modal__caixa"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="sair-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <Mascote tamanho={96} />
        <h2 id="sair-titulo" className="modal__titulo">
          Espera! Você vai perder o progresso desta lição
        </h2>
        <button className="botao botao--largo" onClick={onContinuar} autoFocus>
          Continuar aprendendo
        </button>
        <button className="modal__secundario" onClick={onSair}>
          Sair
        </button>
      </div>
    </div>
  )
}
