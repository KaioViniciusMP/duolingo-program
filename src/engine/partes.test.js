import { describe, expect, it } from 'vitest'
import { dividirEmPartes, proximaParte, quantidadeDePartes } from './partes.js'

function criar(tipos) {
  return tipos.map((tipo, i) => ({ id: `e${i + 1}`, tipo }))
}

describe('quantidadeDePartes', () => {
  it('usa cerca de 5 exercícios por parte', () => {
    expect(quantidadeDePartes(10)).toBe(2)
    expect(quantidadeDePartes(12)).toBe(2)
    expect(quantidadeDePartes(13)).toBe(3)
    expect(quantidadeDePartes(15)).toBe(3)
  })

  it('tem pelo menos uma parte', () => {
    expect(quantidadeDePartes(0)).toBe(1)
    expect(quantidadeDePartes(2)).toBe(1)
  })
})

describe('dividirEmPartes', () => {
  const exercicios = criar([
    'digitar', 'multipla_escolha', 'blocos', 'pares', 'digitar',
    'multipla_escolha', 'blocos', 'multipla_escolha', 'digitar', 'pares',
  ])

  it('usa todos os exercícios uma única vez', () => {
    const ids = dividirEmPartes(exercicios).flat().map((e) => e.id)
    expect(ids.sort()).toEqual(exercicios.map((e) => e.id).sort())
  })

  it('cada parte começa no reconhecimento e termina na produção', () => {
    for (const parte of dividirEmPartes(exercicios)) {
      expect(['multipla_escolha', 'pares']).toContain(parte[0].tipo)
      expect(parte.at(-1).tipo).toBe('digitar')
    }
  })

  it('divide sempre do mesmo jeito', () => {
    expect(dividirEmPartes(exercicios)).toEqual(dividirEmPartes(exercicios))
  })
})

describe('proximaParte', () => {
  it('segue em ordem e depois alterna ao refazer', () => {
    expect([0, 1, 2, 3, 4].map((feitas) => proximaParte(feitas, 3))).toEqual([0, 1, 2, 0, 1])
  })
})
