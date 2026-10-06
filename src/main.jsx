import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/700.css'
import '@fontsource/nunito/800.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/600.css'
import './index.css'
import App from './App.jsx'
import { aplicarTema, carregarConfiguracoes } from './engine/configuracoes.js'
import { ligarSons } from './sons.js'

// Antes de desenhar, para não piscar o tema errado.
const configuracoes = carregarConfiguracoes()
aplicarTema(configuracoes.tema)
ligarSons(configuracoes.sons)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
