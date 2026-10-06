import { describe, expect, it } from 'vitest'
import { aplicarTema, carregarConfiguracoes, configuracoesIniciais, salvarConfiguracoes } from './configuracoes.js'

function armazenamentoFalso() {
  const dados = {}
  return { getItem: (c) => dados[c] ?? null, setItem: (c, v) => (dados[c] = v) }
}

describe('configurações', () => {
  it('começa seguindo o tema do celular e com sons ligados', () => {
    expect(carregarConfiguracoes(armazenamentoFalso())).toEqual({ tema: 'sistema', sons: true })
  })

  it('guarda e recupera as escolhas', () => {
    const armazenamento = armazenamentoFalso()
    salvarConfiguracoes({ tema: 'escuro', sons: false }, armazenamento)
    expect(carregarConfiguracoes(armazenamento)).toEqual({ tema: 'escuro', sons: false })
  })

  it('ignora valores estragados', () => {
    const armazenamento = armazenamentoFalso()
    armazenamento.setItem('pylingo:configuracoes', '{quebrado')
    expect(carregarConfiguracoes(armazenamento)).toEqual(configuracoesIniciais())
    armazenamento.setItem('pylingo:configuracoes', '{"tema":"roxo"}')
    expect(carregarConfiguracoes(armazenamento).tema).toBe('sistema')
  })

  it('aplicarTema marca a raiz só quando o tema é forçado', () => {
    const raiz = { dataset: {} }
    aplicarTema('escuro', raiz)
    expect(raiz.dataset.tema).toBe('escuro')
    aplicarTema('sistema', raiz)
    expect(raiz.dataset.tema).toBeUndefined()
  })
})
