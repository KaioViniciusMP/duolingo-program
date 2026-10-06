import { useEffect, useRef, useState } from 'react'
import { parCorreto } from '../../engine/correcao.js'
import { embaralhar } from '../../engine/embaralhar.js'
import './Pares.css'

// Valida cada par na hora. Um par errado pisca em vermelho, mas o exercício
// não reinicia. Quando todos os pares estão feitos, chama onConcluir.
export default function Pares({ exercicio, bloqueado, onConcluir }) {
  const [esquerda] = useState(() => embaralhar(exercicio.respostasAceitas.map(([a]) => a)))
  const [direita] = useState(() => embaralhar(exercicio.respostasAceitas.map(([, b]) => b)))
  const [selecao, setSelecao] = useState({ esq: null, dir: null })
  const [feitos, setFeitos] = useState({ esq: [], dir: [] })
  const [parErrado, setParErrado] = useState(null)
  const erros = useRef(0)

  useEffect(() => {
    if (!parErrado) return
    const timer = setTimeout(() => setParErrado(null), 600)
    return () => clearTimeout(timer)
  }, [parErrado])

  function tocar(lado, indice) {
    if (bloqueado || parErrado) return
    const nova = { ...selecao, [lado]: selecao[lado] === indice ? null : indice }

    if (nova.esq === null || nova.dir === null) {
      setSelecao(nova)
      return
    }

    setSelecao({ esq: null, dir: null })
    if (parCorreto(exercicio, esquerda[nova.esq], direita[nova.dir])) {
      const novosFeitos = { esq: [...feitos.esq, nova.esq], dir: [...feitos.dir, nova.dir] }
      setFeitos(novosFeitos)
      if (novosFeitos.esq.length === esquerda.length) onConcluir({ erros: erros.current })
    } else {
      erros.current += 1
      setParErrado(nova)
    }
  }

  function classe(lado, indice) {
    if (feitos[lado].includes(indice)) return 'par par--feito'
    if (parErrado?.[lado] === indice) return 'par par--errado'
    if (selecao[lado] === indice) return 'par par--selecionado'
    return 'par'
  }

  function coluna(lado, itens) {
    return (
      <div className="pares__coluna">
        {itens.map((texto, indice) => (
          <button
            key={indice}
            className={classe(lado, indice)}
            disabled={bloqueado || feitos[lado].includes(indice)}
            onClick={() => tocar(lado, indice)}
          >
            {texto}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="pares">
      {coluna('esq', esquerda)}
      {coluna('dir', direita)}
    </div>
  )
}
