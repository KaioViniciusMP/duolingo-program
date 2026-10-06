import { useState } from 'react'
import { embaralhar } from '../../engine/embaralhar.js'
import './MultiplaEscolha.css'

export default function MultiplaEscolha({ exercicio, resposta, bloqueado, onMudarResposta }) {
  const [opcoes] = useState(() => embaralhar(exercicio.opcoes))

  return (
    <div className="multipla-escolha" role="radiogroup">
      {opcoes.map((opcao) => (
        <button
          key={opcao}
          role="radio"
          aria-checked={resposta === opcao}
          className={`opcao ${resposta === opcao ? 'opcao--selecionada' : ''}`}
          disabled={bloqueado}
          onClick={() => onMudarResposta(resposta === opcao ? null : opcao)}
        >
          {opcao}
        </button>
      ))}
    </div>
  )
}
