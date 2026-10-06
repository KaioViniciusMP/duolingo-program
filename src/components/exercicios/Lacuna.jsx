import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import { useState } from 'react'
import { LACUNA } from '../../engine/correcao.js'
import { embaralhar } from '../../engine/embaralhar.js'
import '../Codigo.css'
import './Blocos.css'
import './Lacuna.css'

function escaparHtml(texto) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// O código aparece com um espaço vazio no lugar do ___. Tocar num bloco do banco
// coloca ele na lacuna (trocando o que estava lá); tocar na lacuna devolve o bloco.
export default function Lacuna({ exercicio, bloqueado, onMudarResposta }) {
  const [banco] = useState(() => embaralhar(exercicio.opcoes))
  const [escolhido, setEscolhido] = useState(null)

  function escolher(indice) {
    setEscolhido(indice)
    onMudarResposta(indice === null ? null : banco[indice])
  }

  // O destaque do Prism vem como HTML, então a lacuna também entra como HTML.
  // Os toques nela são tratados no onClick do <pre>.
  const espaco =
    escolhido === null
      ? '<span class="lacuna__espaco" aria-label="Espaço vazio"></span>'
      : `<button type="button" class="lacuna__espaco lacuna__espaco--preenchido"${bloqueado ? ' disabled' : ''}>${escaparHtml(banco[escolhido])}</button>`
  const html = Prism.highlight(exercicio.codigo, Prism.languages.python, 'python').replace(LACUNA, espaco)

  function tocarCodigo(evento) {
    if (!bloqueado && evento.target.closest('button.lacuna__espaco')) escolher(null)
  }

  return (
    <div className="lacuna">
      <pre className="codigo lacuna__codigo" onClick={tocarCodigo}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>

      <div className="blocos__banco">
        {banco.map((texto, indice) =>
          indice === escolhido ? (
            <span key={indice} className="bloco bloco--vazio" aria-hidden="true">
              {texto}
            </span>
          ) : (
            <button key={indice} className="bloco" disabled={bloqueado} onClick={() => escolher(indice)}>
              {texto}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
