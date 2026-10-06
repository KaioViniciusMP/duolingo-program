import { describe, expect, it } from 'vitest'
import {
  criarLicao,
  exercicioAtual,
  licaoTerminada,
  ordenarExercicios,
  precisao,
  progresso,
  registrarResposta,
  semErros,
} from './fila.js'

const exercicios = [
  { id: 'a', tipo: 'digitar' },
  { id: 'b', tipo: 'multipla_escolha' },
  { id: 'c', tipo: 'lacuna' },
  { id: 'd', tipo: 'pares' },
]

describe('ordenarExercicios', () => {
  it('coloca reconhecimento, depois meio, depois produção', () => {
    expect(ordenarExercicios(exercicios).map((e) => e.id)).toEqual(['b', 'd', 'c', 'a'])
  })

  it('trata prever_saida com opções como reconhecimento e sem opções como produção', () => {
    const lista = [
      { id: 'x', tipo: 'prever_saida', opcoes: null },
      { id: 'y', tipo: 'lacuna' },
      { id: 'z', tipo: 'prever_saida', opcoes: ['1', '2'] },
    ]
    expect(ordenarExercicios(lista).map((e) => e.id)).toEqual(['z', 'y', 'x'])
  })
})

describe('registrarResposta', () => {
  it('acerto tira o exercício da fila e avança o progresso', () => {
    let estado = criarLicao(exercicios)
    estado = registrarResposta(estado, { correto: true })
    expect(estado.fila).toEqual(['d', 'c', 'a'])
    expect(progresso(estado)).toBe(0.25)
  })

  it('erro manda o exercício para o fim e não avança o progresso', () => {
    let estado = criarLicao(exercicios)
    estado = registrarResposta(estado, { correto: false })
    expect(estado.fila).toEqual(['d', 'c', 'a', 'b'])
    expect(progresso(estado)).toBe(0)
    expect(estado.errosPorExercicio).toEqual({ b: 1 })
  })

  it('pares com erro no caminho sai da fila mas conta como erro', () => {
    let estado = criarLicao([{ id: 'p', tipo: 'pares' }])
    estado = registrarResposta(estado, { correto: true, erros: 2 })
    expect(licaoTerminada(estado)).toBe(true)
    expect(estado.errosPorExercicio).toEqual({ p: 1 })
    expect(precisao(estado)).toBe(0)
  })

  it('termina quando a fila esvazia, mesmo depois de erros', () => {
    let estado = criarLicao([{ id: 'a', tipo: 'multipla_escolha' }, { id: 'b', tipo: 'multipla_escolha' }])
    estado = registrarResposta(estado, { correto: false }) // a vai para o fim
    estado = registrarResposta(estado, { correto: true }) // b
    expect(exercicioAtual(estado)).toBe('a')
    estado = registrarResposta(estado, { correto: false }) // a de novo
    estado = registrarResposta(estado, { correto: true }) // a
    expect(licaoTerminada(estado)).toBe(true)
    expect(estado.errosPorExercicio).toEqual({ a: 2 })
    expect(precisao(estado)).toBe(50)
    expect(semErros(estado)).toBe(false)
  })

  it('conta erros seguidos e zera no acerto', () => {
    let estado = criarLicao(exercicios)
    estado = registrarResposta(estado, { correto: false })
    estado = registrarResposta(estado, { correto: false })
    expect(estado.errosSeguidos).toBe(2)
    estado = registrarResposta(estado, { correto: true })
    expect(estado.errosSeguidos).toBe(0)
  })

  it('lição perfeita tem 100% de precisão', () => {
    let estado = criarLicao(exercicios)
    while (!licaoTerminada(estado)) estado = registrarResposta(estado, { correto: true })
    expect(precisao(estado)).toBe(100)
    expect(semErros(estado)).toBe(true)
  })
})
