import { describe, expect, it } from 'vitest'
import { encontrarLicao, estadosDasLicoes } from './trilha.js'

const curso = [
  { id: 'u1', licoes: [{ id: 'u1-l1' }, { id: 'u1-l2' }, { id: 'u1-rev' }] },
  { id: 'u2', licoes: [{ id: 'u2-l1' }, { id: 'u2-l2' }] },
]

describe('estadosDasLicoes', () => {
  it('no começo só a primeira lição está liberada', () => {
    expect(estadosDasLicoes(curso, [])).toEqual({
      'u1-l1': 'atual',
      'u1-l2': 'bloqueada',
      'u1-rev': 'bloqueada',
      'u2-l1': 'bloqueada',
      'u2-l2': 'bloqueada',
    })
  })

  it('cada lição concluída libera a próxima', () => {
    const estados = estadosDasLicoes(curso, ['u1-l1'])
    expect(estados['u1-l1']).toBe('concluida')
    expect(estados['u1-l2']).toBe('atual')
  })

  it('a revisão libera a próxima unidade', () => {
    const estados = estadosDasLicoes(curso, ['u1-l1', 'u1-l2', 'u1-rev'])
    expect(estados['u2-l1']).toBe('atual')
    expect(estados['u2-l2']).toBe('bloqueada')
  })

  it('com tudo concluído não há lição atual', () => {
    const todas = ['u1-l1', 'u1-l2', 'u1-rev', 'u2-l1', 'u2-l2']
    expect(Object.values(estadosDasLicoes(curso, todas))).not.toContain('atual')
  })
})

describe('encontrarLicao', () => {
  it('acha a lição e a unidade dela', () => {
    const achado = encontrarLicao(curso, 'u2-l2')
    expect(achado.unidade.id).toBe('u2')
    expect(achado.licao.id).toBe('u2-l2')
  })
})
