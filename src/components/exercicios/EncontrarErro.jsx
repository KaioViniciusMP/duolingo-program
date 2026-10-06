import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import './EncontrarErro.css'

function destacar(trecho) {
  return { __html: Prism.highlight(trecho, Prism.languages.python, 'python') }
}

// O código vem dividido em trechos (opcoes: uma lista de trechos por linha),
// colados exatamente como estão. Trechos só de espaços não são tocáveis.
// A resposta é [linha, trecho].
export default function EncontrarErro({ exercicio, resposta, bloqueado, onMudarResposta }) {
  const linhas = exercicio.opcoes

  function tocar(linha, trecho) {
    const mesmo = resposta && resposta[0] === linha && resposta[1] === trecho
    onMudarResposta(mesmo ? null : [linha, trecho])
  }

  return (
    <pre className="codigo encontrar-erro">
      {linhas.map((trechos, linha) => (
        <div key={linha} className="encontrar-erro__linha">
          {trechos.map((trecho, indice) =>
            trecho.trim() === '' ? (
              <span key={indice}>{trecho}</span>
            ) : (
              <button
                key={indice}
                className={`encontrar-erro__trecho ${
                  resposta && resposta[0] === linha && resposta[1] === trecho ? 'encontrar-erro__trecho--selecionado' : ''
                }`}
                disabled={bloqueado}
                onClick={() => tocar(linha, trecho)}
              >
                <code dangerouslySetInnerHTML={destacar(trecho)} />
              </button>
            ),
          )}
        </div>
      ))}
    </pre>
  )
}
