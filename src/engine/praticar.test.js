import { describe, expect, it } from 'vitest'
import { exerciciosParaPraticar, praticaLiberada, registrarPratica } from './praticar.js'
import { progressoInicial } from './progresso.js'

const curso = [
  {
    id: 'u1',
    licoes: [
      { id: 'u1-l1', exercicios: [{ id: 'a' }, { id: 'b' }] },
      { id: 'u1-rev', revisao: true, exercicios: [{ id: 'c' }] },
    ],
  },
  { id: 'u2', licoes: [{ id: 'u2-l1', exercicios: [{ id: 'd' }] }] },
]

describe('praticaLiberada', () => {
  it('só libera depois da revisão da unidade 1', () => {
    expect(praticaLiberada(curso, ['u1-l1'])).toBe(false)
    expect(praticaLiberada(curso, ['u1-l1', 'u1-rev'])).toBe(true)
  })
})

describe('exerciciosParaPraticar', () => {
  it('ordena dos mais errados para os menos e desempata pela ordem do curso', () => {
    const lista = exerciciosParaPraticar(curso, { d: 1, a: 1, c: 3 })
    expect(lista.map((e) => e.id)).toEqual(['c', 'a', 'd'])
  })

  it('respeita o limite e ignora ids que não existem mais', () => {
    const lista = exerciciosParaPraticar(curso, { a: 2, b: 1, sumiu: 9 }, 1)
    expect(lista.map((e) => e.id)).toEqual(['a'])
  })

  it('fica vazia sem erros', () => {
    expect(exerciciosParaPraticar(curso, {})).toEqual([])
  })
})

describe('registrarPratica', () => {
  it('acerto de primeira tira 1 e remove quando chega a 0', () => {
    const progresso = { ...progressoInicial(), errosPorExercicio: { a: 2, b: 1 } }
    const estado = { primeiraTentativa: { a: true, b: true }, errosPorExercicio: {} }
    expect(registrarPratica(progresso, estado).errosPorExercicio).toEqual({ a: 1 })
  })

  it('erro na prática soma no contador', () => {
    const progresso = { ...progressoInicial(), errosPorExercicio: { a: 1 } }
    const estado = { primeiraTentativa: { a: false }, errosPorExercicio: { a: 2 } }
    expect(registrarPratica(progresso, estado).errosPorExercicio).toEqual({ a: 3 })
  })
})
