import Codigo from '../components/Codigo.jsx'
import { IconeVoltar } from '../components/Icones.jsx'
import Mascote from '../components/Mascote.jsx'
import './Guia.css'

export default function Guia({ unidade, numero, onVoltar }) {
  return (
    <div className="guia" style={{ '--cor': unidade.cor }}>
      <header className="guia__topo">
        <button className="guia__voltar" onClick={onVoltar} aria-label="Voltar para a trilha">
          <IconeVoltar tamanho={26} />
        </button>
        <div>
          <span className="guia__numero">Guia · Unidade {numero}</span>
          <h1 className="guia__titulo">{unidade.titulo}</h1>
        </div>
      </header>

      {unidade.guia.length === 0 ? (
        <div className="guia__vazio">
          <Mascote tamanho={110} />
          <p>O guia desta unidade está chegando em breve!</p>
        </div>
      ) : (
        <div className="guia__secoes">
          {unidade.guia.map((secao) => (
            <section key={secao.titulo} className="guia__secao">
              <h2>{secao.titulo}</h2>
              <p>{secao.texto}</p>
              {secao.codigo && <Codigo codigo={secao.codigo} />}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
