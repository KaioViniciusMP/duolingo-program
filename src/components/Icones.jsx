// Ícones em SVG para ficarem iguais em qualquer celular (emoji muda de aparelho para aparelho).

function Icone({ tamanho = 32, children, ...props }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

export function IconeEstrela(props) {
  return (
    <Icone {...props}>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" strokeLinejoin="round" />
    </Icone>
  )
}

export function IconeCheck(props) {
  return (
    <Icone {...props}>
      <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </Icone>
  )
}

export function IconeCadeado(props) {
  return (
    <Icone {...props}>
      <path d="M7 10V7.5a5 5 0 0110 0V10" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <rect x="4.5" y="10" width="15" height="11" rx="2.5" />
    </Icone>
  )
}

export function IconeTrofeu(props) {
  return (
    <Icone {...props}>
      <path d="M7 3h10v6a5 5 0 01-10 0z" />
      <path d="M7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="10.5" y="13" width="3" height="4" />
      <rect x="7" y="17" width="10" height="3.5" rx="1" />
    </Icone>
  )
}

export function IconeLivro(props) {
  return (
    <Icone {...props}>
      <path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </Icone>
  )
}

export function IconeCasa(props) {
  return (
    <Icone {...props}>
      <path d="M3 11l9-7.5 9 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 10v10h5v-6h3v6h5V10" />
    </Icone>
  )
}

export function IconePerfil(props) {
  return (
    <Icone {...props}>
      <circle cx="12" cy="8" r="4.5" />
      <path d="M3.5 21a8.5 8.5 0 0117 0z" />
    </Icone>
  )
}

export function IconeVoltar(props) {
  return (
    <Icone {...props}>
      <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </Icone>
  )
}

export function IconePular(props) {
  return (
    <Icone {...props}>
      <path d="M3.5 6.2v11.6c0 .8.9 1.3 1.6.8L13 13v4.8c0 .8.9 1.3 1.6.8l7.6-5.8c.5-.4.5-1.2 0-1.6l-7.6-5.8c-.7-.5-1.6 0-1.6.8V11L5.1 5.4c-.7-.5-1.6 0-1.6.8z" />
    </Icone>
  )
}
