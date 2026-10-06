// Confere o conteúdo para pegar erros de digitação nos JSON.
import { describe, expect, it } from 'vitest'
import { curso } from './curso.js'

const exercicios = curso.flatMap((u) => u.licoes.flatMap((l) => l.exercicios))

describe('conteúdo do curso', () => {
  it('tem ids únicos em unidades, lições e exercícios', () => {
    const ids = [
      ...curso.map((u) => u.id),
      ...curso.flatMap((u) => u.licoes.map((l) => l.id)),
      ...exercicios.map((e) => e.id),
    ]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cada unidade termina com uma lição de revisão', () => {
    for (const unidade of curso) {
      expect(unidade.licoes.at(-1).revisao).toBe(true)
    }
  })

  it('exercícios têm enunciado e explicação', () => {
    for (const e of exercicios) {
      expect(e.enunciado, e.id).toBeTruthy()
      expect(e.explicacao, e.id).toBeTruthy()
    }
  })

  it('múltipla escolha: 3 a 4 opções sem repetir, com a resposta entre elas', () => {
    for (const e of exercicios.filter((e) => e.tipo === 'multipla_escolha')) {
      expect(e.opcoes.length, e.id).toBeGreaterThanOrEqual(3)
      expect(e.opcoes.length, e.id).toBeLessThanOrEqual(4)
      expect(new Set(e.opcoes).size, e.id).toBe(e.opcoes.length)
      for (const r of e.respostasAceitas) expect(e.opcoes, e.id).toContain(r)
    }
  })

  it('blocos: cada resposta usa só blocos do banco e sobram 1 a 2 distratores', () => {
    for (const e of exercicios.filter((e) => e.tipo === 'blocos')) {
      for (const aceita of e.respostasAceitas) {
        const banco = [...e.opcoes]
        for (const bloco of aceita) {
          const indice = banco.indexOf(bloco)
          expect(indice, `${e.id}: bloco ${bloco}`).toBeGreaterThanOrEqual(0)
          banco.splice(indice, 1)
        }
        expect(banco.length, e.id).toBeGreaterThanOrEqual(1)
        expect(banco.length, e.id).toBeLessThanOrEqual(2)
      }
    }
  })

  it('lacuna: um ___ no código e 3 a 4 blocos sem repetir, com a resposta entre eles', () => {
    for (const e of exercicios.filter((e) => e.tipo === 'lacuna')) {
      expect(e.codigo.split('___').length, e.id).toBe(2)
      expect(e.opcoes.length, e.id).toBeGreaterThanOrEqual(3)
      expect(e.opcoes.length, e.id).toBeLessThanOrEqual(4)
      expect(new Set(e.opcoes).size, e.id).toBe(e.opcoes.length)
      expect(e.respostasAceitas, e.id).toHaveLength(1)
      expect(e.opcoes, e.id).toContain(e.respostasAceitas[0])
    }
  })

  it('ordenar_linhas: cada resposta usa todas as linhas, com recuo de 0 a 3', () => {
    for (const e of exercicios.filter((e) => e.tipo === 'ordenar_linhas')) {
      expect(e.respostasAceitas.length, e.id).toBeGreaterThan(0)
      for (const aceita of e.respostasAceitas) {
        expect(aceita.map((l) => l.texto).sort(), e.id).toEqual([...e.opcoes].sort())
        for (const l of aceita) expect([0, 1, 2, 3], e.id).toContain(l.nivel)
      }
      for (const linha of e.opcoes) expect(linha, e.id).toBe(linha.trim())
    }
  })

  it('encontrar_erro: o trecho do bug existe na linha indicada e não é só espaço', () => {
    for (const e of exercicios.filter((e) => e.tipo === 'encontrar_erro')) {
      expect(e.respostasAceitas.length, e.id).toBeGreaterThan(0)
      for (const [linha, trecho] of e.respostasAceitas) {
        expect(e.opcoes[linha], e.id).toContain(trecho)
        expect(trecho.trim(), e.id).not.toBe('')
      }
    }
  })

  it('prever_saida: tem código e, se tiver opções, a saída está entre elas', () => {
    for (const e of exercicios.filter((e) => e.tipo === 'prever_saida')) {
      expect(e.codigo, e.id).toBeTruthy()
      expect(e.respostasAceitas.length, e.id).toBeGreaterThan(0)
      if (e.opcoes) {
        expect(e.opcoes.length, e.id).toBeGreaterThanOrEqual(3)
        expect(e.opcoes.length, e.id).toBeLessThanOrEqual(4)
        for (const r of e.respostasAceitas) expect(e.opcoes, e.id).toContain(r)
      }
    }
  })

  it('digitar: tem pelo menos uma resposta aceita', () => {
    for (const e of exercicios.filter((e) => e.tipo === 'digitar')) {
      expect(e.respostasAceitas.length, e.id).toBeGreaterThan(0)
    }
  })

  it('pares: 4 a 5 pares sem textos repetidos em cada coluna', () => {
    for (const e of exercicios.filter((e) => e.tipo === 'pares')) {
      const esquerda = e.respostasAceitas.map(([a]) => a)
      const direita = e.respostasAceitas.map(([, b]) => b)
      expect(esquerda.length, e.id).toBeGreaterThanOrEqual(4)
      expect(esquerda.length, e.id).toBeLessThanOrEqual(5)
      expect(new Set(esquerda).size, e.id).toBe(esquerda.length)
      expect(new Set(direita).size, e.id).toBe(direita.length)
    }
  })
})
