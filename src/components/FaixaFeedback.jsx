import './FaixaFeedback.css'

// Verde: "Boa!" + Continuar. Vermelha: resposta correta + explicação + Entendi.
export default function FaixaFeedback({ correto, respostaCorreta, explicacao, onContinuar }) {
  return (
    <div className={`faixa-feedback ${correto ? 'faixa-feedback--certo' : 'faixa-feedback--errado'}`} role="status">
      <div className="faixa-feedback__conteudo">
        {correto ? (
          <p className="faixa-feedback__titulo">Boa!</p>
        ) : (
          <>
            <p className="faixa-feedback__titulo">Resposta correta:</p>
            <p className="faixa-feedback__resposta">{respostaCorreta}</p>
            <p className="faixa-feedback__explicacao">{explicacao}</p>
          </>
        )}
      </div>
      <button className="botao botao--largo" onClick={onContinuar} autoFocus>
        {correto ? 'Continuar' : 'Entendi'}
      </button>
    </div>
  )
}
