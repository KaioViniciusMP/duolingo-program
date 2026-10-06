import Mascote from '../components/Mascote.jsx'
import './BoasVindas.css'

// Só na primeira vez. A escolha da meta diária entra junto com a regra de XP.
export default function BoasVindas({ onComecar }) {
  return (
    <div className="boas-vindas">
      <div className="boas-vindas__centro">
        <Mascote tamanho={170} />
        <h1 className="boas-vindas__titulo">Oi! Eu sou o Cobi.</h1>
        <p className="boas-vindas__texto">Vamos aprender Python juntos, um pouquinho por dia?</p>
      </div>
      <button className="botao botao--largo" onClick={onComecar} autoFocus>
        Começar
      </button>
    </div>
  )
}
