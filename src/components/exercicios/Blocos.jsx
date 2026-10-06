import { useState } from 'react'
import { embaralhar } from '../../engine/embaralhar.js'
import './Blocos.css'

// Tocar num bloco do banco leva ele para a resposta; tocar na resposta devolve.
// O bloco usado deixa um espaço vazio no banco, para não bagunçar a posição dos outros.
export default function Blocos({ exercicio, bloqueado, onMudarResposta }) {
  const [banco] = useState(() => embaralhar(exercicio.opcoes))
  const [usados, setUsados] = useState([])

  function atualizar(novos) {
    setUsados(novos)
    onMudarResposta(novos.length > 0 ? novos.map((i) => banco[i]) : null)
  }

  return (
    <div className="blocos">
      <div className="blocos__resposta" aria-label="Sua resposta">
        {usados.map((indice) => (
          <button
            key={indice}
            className="bloco"
            disabled={bloqueado}
            onClick={() => atualizar(usados.filter((i) => i !== indice))}
          >
            {banco[indice]}
          </button>
        ))}
      </div>

      <div className="blocos__banco">
        {banco.map((texto, indice) =>
          usados.includes(indice) ? (
            <span key={indice} className="bloco bloco--vazio" aria-hidden="true">
              {texto}
            </span>
          ) : (
            <button
              key={indice}
              className="bloco"
              disabled={bloqueado}
              onClick={() => atualizar([...usados, indice])}
            >
              {texto}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
