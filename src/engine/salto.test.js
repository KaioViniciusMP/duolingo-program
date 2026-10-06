import { describe, expect, it } from 'vitest'
import { criarLicao, progresso, registrarResposta } from './fila.js'
import { progressoInicial } from './progresso.js'
import { exerciciosDoTeste, liberarAte, reprovouNoTeste, testeTerminado } from './salto.js'

const ex = (id) => ({ id, tipo: 'multipla_escolha' })
const curso = [
  { id: 'u1', licoes: [{ id: 'u1-l1', exercicios: [ex('a'), ex('b')] }, { id: 'u1-rev', exercicios: [ex('c')] }] },
  { id: 'u2', licoes: [{ id: 'u2-l1', exercicios: [ex('d')] }] },
  { id: 'u3', licoes: [{ id: 'u3-l1', exercicios: [ex('e')] }] },
]
const semSortear = (lista) => lista

describe('exerciciosDoTeste', () => {
  it('pega exercícios das unidades anteriores ainda não concluídas', () => {
    expect(exerciciosDoTeste(curso, 'u3', [], semSortear).map((e) => e.id)).toEqual(['a', 'b', 'c', 'd'])
    expect(exerciciosDoTeste(curso, 'u3', ['u1-l1', 'u1-rev'], semSortear).map((e) => e.id)).toEqual(['d'])
  })
})

describe('modo teste', () => {
  it('o exercício errado não volta para a fila e a barra avança mesmo assim', () => {
    let estado = criarLicao([ex('a'), ex('b')], { teste: true })
    estado = registrarResposta(estado, { correto: false })
    expect(estado.fila).toEqual(['b'])
    expect(progresso(estado)).toBe(0.5)
  })

  it('reprova no 4º exercício errado', () => {
    let estado = criarLicao(['a', 'b', 'c', 'd', 'e'].map(ex), { teste: true })
    for (let i = 0; i < 3; i++) estado = registrarResposta(estado, { correto: false })
    expect(reprovouNoTeste(estado)).toBe(false)
    expect(testeTerminado(estado)).toBe(false)
    estado = registrarResposta(estado, { correto: false })
    expect(reprovouNoTeste(estado)).toBe(true)
    expect(testeTerminado(estado)).toBe(true)
  })
})

describe('liberarAte', () => {
  it('libera a unidade escolhida e as anteriores', () => {
    const novo = liberarAte(curso, { ...progressoInicial(), unidadesLiberadas: [] }, 'u3')
    expect(novo.unidadesLiberadas).toEqual(['u1', 'u2', 'u3'])
  })
})
