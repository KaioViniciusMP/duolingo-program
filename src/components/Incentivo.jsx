import Mascote from './Mascote.jsx'
import './Modal.css'

// Aparece depois de 2 erros seguidos, antes do próximo exercício.
export default function Incentivo({ onContinuar }) {
  return (
    <div className="modal modal--tela-cheia">
      <div className="modal__caixa" role="dialog" aria-modal="true" aria-labelledby="incentivo-titulo">
        <Mascote tamanho={140} />
        <h2 id="incentivo-titulo" className="modal__titulo">
          Errar faz parte, vamos de novo?
        </h2>
        <button className="botao botao--largo" onClick={onContinuar} autoFocus>
          Vamos!
        </button>
      </div>
    </div>
  )
}
