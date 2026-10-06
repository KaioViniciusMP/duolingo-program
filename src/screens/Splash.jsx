import { useEffect, useState } from 'react'
import Mascote from '../components/Mascote.jsx'
import './Splash.css'

const DURACAO_MS = 1600
const SAIDA_MS = 300

// Aparece toda vez que o app abre. Tocar na tela pula a animação.
export default function Splash({ onFim }) {
  const [saindo, setSaindo] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSaindo(true), DURACAO_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!saindo) return
    const timer = setTimeout(onFim, SAIDA_MS)
    return () => clearTimeout(timer)
  }, [saindo, onFim])

  return (
    <div className={`splash ${saindo ? 'splash--saindo' : ''}`} onClick={() => setSaindo(true)}>
      <div className="splash__mascote">
        <Mascote tamanho={150} />
      </div>
      <h1 className="splash__nome">
        Py<span>Lingo</span>
      </h1>
      <p className="splash__frase">Python, um passo de cada vez</p>
      <div className="splash__carregando" aria-hidden="true">
        <div className="splash__carregando-barra" />
      </div>
    </div>
  )
}
