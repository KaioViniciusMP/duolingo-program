import { IconeCasa, IconePerfil } from './Icones.jsx'
import './BarraNavegacao.css'

const ABAS = [
  { id: 'trilha', rotulo: 'Trilha', Icone: IconeCasa },
  { id: 'perfil', rotulo: 'Perfil', Icone: IconePerfil },
]

export default function BarraNavegacao({ abaAtiva, onMudarAba }) {
  return (
    <nav className="barra-navegacao">
      {ABAS.map(({ id, rotulo, Icone }) => (
        <button
          key={id}
          className={`barra-navegacao__aba ${abaAtiva === id ? 'barra-navegacao__aba--ativa' : ''}`}
          aria-current={abaAtiva === id ? 'page' : undefined}
          onClick={() => onMudarAba(id)}
        >
          <Icone tamanho={26} />
          <span>{rotulo}</span>
        </button>
      ))}
    </nav>
  )
}
