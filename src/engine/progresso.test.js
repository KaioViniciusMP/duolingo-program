import { describe, expect, it } from 'vitest'
import { carregarProgresso, progressoInicial, registrarParteConcluida, salvarProgresso } from './progresso.js'

function armazenamentoFalso() {
  const dados = {}
  return {
    getItem: (chave) => dados[chave] ?? null,
    setItem: (chave, valor) => {
      dados[chave] = valor
    },
  }
}

describe('registrarParteConcluida', () => {
  it('só conclui a lição depois da última parte', () => {
    let progresso = progressoInicial()
    progresso = registrarParteConcluida(progresso, 'u1-l1', 2, {})
    expect(progresso.partesConcluidas).toEqual({ 'u1-l1': 1 })
    expect(progresso.licoesConcluidas).toEqual([])
    progresso = registrarParteConcluida(progresso, 'u1-l1', 2, {})
    expect(progresso.licoesConcluidas).toEqual(['u1-l1'])
  })

  it('refazer conta a parte sem repetir a lição concluída', () => {
    let progresso = progressoInicial()
    for (let i = 0; i < 3; i++) progresso = registrarParteConcluida(progresso, 'u1-l1', 2, {})
    expect(progresso.partesConcluidas).toEqual({ 'u1-l1': 3 })
    expect(progresso.licoesConcluidas).toEqual(['u1-l1'])
  })

  it('soma os erros de cada exercício', () => {
    let progresso = progressoInicial()
    progresso = registrarParteConcluida(progresso, 'u1-l1', 2, { a: 2 })
    progresso = registrarParteConcluida(progresso, 'u1-l1', 2, { a: 1, b: 1 })
    expect(progresso.errosPorExercicio).toEqual({ a: 3, b: 1 })
  })
})

describe('salvar e carregar', () => {
  it('guarda e recupera o progresso', () => {
    const armazenamento = armazenamentoFalso()
    const progresso = registrarParteConcluida(progressoInicial(), 'u1-l1', 1, {})
    salvarProgresso(progresso, armazenamento)
    expect(carregarProgresso(armazenamento)).toEqual(progresso)
  })

  it('volta ao progresso inicial se o salvo estiver corrompido', () => {
    const armazenamento = armazenamentoFalso()
    armazenamento.setItem('pylingo:progresso', '{quebrado')
    expect(carregarProgresso(armazenamento)).toEqual(progressoInicial())
  })

  it('funciona sem armazenamento', () => {
    expect(carregarProgresso(null)).toEqual(progressoInicial())
  })
})
