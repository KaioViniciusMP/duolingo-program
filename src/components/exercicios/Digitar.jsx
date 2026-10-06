import { useRef, useState } from 'react'
import './Digitar.css'

// Símbolos difíceis de achar no teclado do celular. O ⇥ insere 4 espaços de recuo.
const SIMBOLOS = ['(', ')', "'", '"', ':', '=', '+', '-', '*', '[', ']', '⇥']

export default function Digitar({ bloqueado, onMudarResposta }) {
  const [texto, setTexto] = useState('')
  const campo = useRef(null)

  function mudar(novo) {
    setTexto(novo)
    onMudarResposta(novo.trim() ? novo : null)
  }

  function inserir(simbolo) {
    const el = campo.current
    const trecho = simbolo === '⇥' ? '    ' : simbolo
    const inicio = el.selectionStart
    mudar(texto.slice(0, inicio) + trecho + texto.slice(el.selectionEnd))
    // Depois que o React atualizar o campo, coloca o cursor logo após o símbolo.
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(inicio + trecho.length, inicio + trecho.length)
    })
  }

  return (
    <div className="digitar">
      <textarea
        ref={campo}
        className="digitar__campo"
        value={texto}
        onChange={(e) => mudar(e.target.value)}
        disabled={bloqueado}
        placeholder="Digite o código aqui"
        rows={4}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        aria-label="Sua resposta"
      />
      <div className="digitar__simbolos" aria-label="Símbolos">
        {SIMBOLOS.map((simbolo) => (
          <button
            key={simbolo}
            className="digitar__simbolo"
            disabled={bloqueado}
            // Impede o campo de perder o foco (e o teclado de fechar) ao tocar.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => inserir(simbolo)}
            aria-label={simbolo === '⇥' ? 'Recuo de 4 espaços' : simbolo}
          >
            {simbolo}
          </button>
        ))}
      </div>
    </div>
  )
}
