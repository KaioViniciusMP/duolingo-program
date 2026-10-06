// Preferências do aparelho (tema e sons). Ficam fora do progresso para não
// sumirem ao "Zerar progresso".

export const CHAVE_CONFIGURACOES = 'pylingo:configuracoes'

export const TEMAS = ['sistema', 'claro', 'escuro']

export function configuracoesIniciais() {
  return { tema: 'sistema', sons: true }
}

function armazenamentoPadrao() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

export function carregarConfiguracoes(armazenamento = armazenamentoPadrao()) {
  try {
    const salvas = JSON.parse(armazenamento?.getItem(CHAVE_CONFIGURACOES) || '{}')
    const config = { ...configuracoesIniciais(), ...salvas }
    if (!TEMAS.includes(config.tema)) config.tema = 'sistema'
    return config
  } catch {
    return configuracoesIniciais()
  }
}

export function salvarConfiguracoes(config, armazenamento = armazenamentoPadrao()) {
  try {
    armazenamento?.setItem(CHAVE_CONFIGURACOES, JSON.stringify(config))
  } catch {
    // Armazenamento bloqueado: a escolha vale só nesta sessão.
  }
}

// 'sistema' segue o celular; 'claro' e 'escuro' forçam o tema (ver index.css).
export function aplicarTema(tema, raiz = globalThis.document?.documentElement) {
  if (!raiz) return
  if (tema === 'sistema') delete raiz.dataset.tema
  else raiz.dataset.tema = tema
}
