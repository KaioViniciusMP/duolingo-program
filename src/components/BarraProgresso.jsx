import './BarraProgresso.css'

export default function BarraProgresso({ valor }) {
  const porcentagem = Math.round(valor * 100)
  return (
    <div
      className="barra-progresso"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={porcentagem}
    >
      <div className="barra-progresso__preenchida" style={{ width: `${porcentagem}%` }} />
    </div>
  )
}
