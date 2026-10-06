import './Mascote.css'

// Cobi, a cobrinha do PyLingo. Primeira versão; o acabamento vem na etapa 7.
export default function Mascote({ tamanho = 96, animado = true, className = '' }) {
  return (
    <svg
      className={`mascote ${animado ? 'mascote--animado' : ''} ${className}`}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Cobi, a cobrinha"
    >
      <ellipse cx="60" cy="110" rx="36" ry="6" fill="rgb(0 0 0 / 0.12)" />

      <g className="mascote__corpo">
        {/* Rolinho de baixo */}
        <ellipse cx="60" cy="97" rx="36" ry="13" fill="#24557f" />
        <ellipse cx="60" cy="94" rx="36" ry="13" fill="#3776ab" />
        {/* Rolinho de cima */}
        <ellipse cx="60" cy="81" rx="27" ry="11" fill="#24557f" />
        <ellipse cx="60" cy="78" rx="27" ry="11" fill="#4a8bc4" />
        <circle cx="38" cy="95" r="3.5" fill="#ffd43b" />
        <circle cx="82" cy="95" r="3.5" fill="#ffd43b" />
        <circle cx="60" cy="101" r="3.5" fill="#ffd43b" />
        <circle cx="47" cy="79" r="3" fill="#ffd43b" />
        <circle cx="73" cy="79" r="3" fill="#ffd43b" />

        {/* Pescoço com barriga amarela */}
        <path d="M60 76 C60 66, 56 58, 58 46" stroke="#3776ab" strokeWidth="20" strokeLinecap="round" fill="none" />
        <path d="M61 74 C61 66, 58 60, 59 50" stroke="#ffd43b" strokeWidth="8" strokeLinecap="round" fill="none" />

        <g className="mascote__cabeca">
          <ellipse cx="58" cy="36" rx="25" ry="20" fill="#3776ab" />
          <ellipse cx="58" cy="32" rx="21" ry="13" fill="#4a8bc4" />
          {/* Olhos */}
          <g className="mascote__olhos">
            <circle cx="48" cy="32" r="7.5" fill="#fff" />
            <circle cx="68" cy="32" r="7.5" fill="#fff" />
            <circle cx="49.5" cy="33" r="4" fill="#1f2a37" />
            <circle cx="69.5" cy="33" r="4" fill="#1f2a37" />
            <circle cx="51" cy="31.5" r="1.5" fill="#fff" />
            <circle cx="71" cy="31.5" r="1.5" fill="#fff" />
          </g>
          {/* Bochechas */}
          <ellipse cx="40" cy="43" rx="4.5" ry="3" fill="#ff8fa3" opacity="0.7" />
          <ellipse cx="76" cy="43" rx="4.5" ry="3" fill="#ff8fa3" opacity="0.7" />
          {/* Sorriso e linguinha */}
          <path d="M51 44 Q58 50 65 44" stroke="#1f2a37" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path className="mascote__lingua" d="M58 48 L58 54 M58 54 L55 57 M58 54 L61 57" stroke="#e5484d" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      </g>
    </svg>
  )
}
