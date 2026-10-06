import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import { useState } from 'react'
import { embaralhar } from '../../engine/embaralhar.js'
import './OrdenarLinhas.css'

const NIVEL_MAXIMO = 3

function LinhaDeCodigo({ texto }) {
  const html = Prism.highlight(texto, Prism.languages.python, 'python')
  return <code className="ordenar__texto" dangerouslySetInnerHTML={{ __html: html }} />
}

// Tocar numa linha do banco leva ela para o fim do código; tocar no texto dela
// no código devolve. As setas ◀ ▶ mudam o recuo. Só aparecem quando o exercício
// usa recuo, para não confundir quem ainda não viu blocos como o if.
export default function OrdenarLinhas({ exercicio, bloqueado, onMudarResposta }) {
  const [banco] = useState(() => embaralhar(exercicio.opcoes))
  const [linhas, setLinhas] = useState([]) // { indice, nivel }
  const usaRecuo = exercicio.respostasAceitas.some((aceita) => aceita.some((l) => l.nivel > 0))

  function atualizar(novas) {
    setLinhas(novas)
    onMudarResposta(
      novas.length === banco.length ? novas.map(({ indice, nivel }) => ({ texto: banco[indice], nivel })) : null,
    )
  }

  function mudarNivel(posicao, delta) {
    atualizar(
      linhas.map((linha, i) =>
        i === posicao ? { ...linha, nivel: Math.min(NIVEL_MAXIMO, Math.max(0, linha.nivel + delta)) } : linha,
      ),
    )
  }

  const usados = new Set(linhas.map((l) => l.indice))

  return (
    <div className="ordenar">
      <ol className="ordenar__codigo" aria-label="Seu código">
        {linhas.map(({ indice, nivel }, posicao) => (
          <li key={indice} className="ordenar__linha">
            <span className="ordenar__numero">{posicao + 1}</span>
            <button
              className="ordenar__conteudo"
              style={{ '--nivel': nivel }}
              disabled={bloqueado}
              onClick={() => atualizar(linhas.filter((_, i) => i !== posicao))}
              aria-label={`Tirar a linha ${banco[indice]}`}
            >
              <LinhaDeCodigo texto={banco[indice]} />
            </button>
            {usaRecuo && (
              <span className="ordenar__setas">
                <button
                  className="ordenar__seta"
                  disabled={bloqueado || nivel === 0}
                  onClick={() => mudarNivel(posicao, -1)}
                  aria-label="Diminuir recuo"
                >
                  ◀
                </button>
                <button
                  className="ordenar__seta"
                  disabled={bloqueado || nivel === NIVEL_MAXIMO}
                  onClick={() => mudarNivel(posicao, 1)}
                  aria-label="Aumentar recuo"
                >
                  ▶
                </button>
              </span>
            )}
          </li>
        ))}
        {linhas.length < banco.length && <li className="ordenar__vaga" aria-hidden="true" />}
      </ol>

      <div className="ordenar__banco">
        {banco.map((texto, indice) =>
          usados.has(indice) ? (
            <span key={indice} className="ordenar__opcao ordenar__opcao--vazia" aria-hidden="true">
              {texto}
            </span>
          ) : (
            <button
              key={indice}
              className="ordenar__opcao"
              disabled={bloqueado}
              onClick={() => atualizar([...linhas, { indice, nivel: 0 }])}
            >
              {texto}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
