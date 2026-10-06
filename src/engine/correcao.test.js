import { describe, expect, it } from 'vitest'
import { corrigir, juntarBlocos, normalizarCodigo, parCorreto } from './correcao.js'

describe('multipla_escolha', () => {
  const exercicio = {
    tipo: 'multipla_escolha',
    opcoes: ["print('Olá')", "mostrar('Olá')"],
    respostasAceitas: ["print('Olá')"],
  }

  it('aceita a opção correta', () => {
    expect(corrigir(exercicio, "print('Olá')")).toBe(true)
  })

  it('recusa outra opção', () => {
    expect(corrigir(exercicio, "mostrar('Olá')")).toBe(false)
  })
})

describe('pares', () => {
  const exercicio = {
    tipo: 'pares',
    respostasAceitas: [
      ["print('Oi')", 'mostra Oi'],
      ['print(2 + 3)', 'mostra 5'],
    ],
  }

  it('valida um par certo', () => {
    expect(parCorreto(exercicio, 'print(2 + 3)', 'mostra 5')).toBe(true)
  })

  it('recusa um par trocado', () => {
    expect(parCorreto(exercicio, 'print(2 + 3)', 'mostra Oi')).toBe(false)
  })
})

describe('blocos', () => {
  const exercicio = {
    tipo: 'blocos',
    opcoes: ['print', '(', "'Oi'", ')', 'input'],
    respostasAceitas: [['print', '(', "'Oi'", ')']],
  }

  it('aceita a sequência certa', () => {
    expect(corrigir(exercicio, ['print', '(', "'Oi'", ')'])).toBe(true)
  })

  it('recusa ordem errada ou bloco a mais', () => {
    expect(corrigir(exercicio, ['print', "'Oi'", '(', ')'])).toBe(false)
    expect(corrigir(exercicio, ['print', '(', "'Oi'", ')', 'input'])).toBe(false)
  })

  it('aceita qualquer uma das sequências aceitas', () => {
    const soma = { tipo: 'blocos', respostasAceitas: [['a', '+', 'b'], ['b', '+', 'a']] }
    expect(corrigir(soma, ['b', '+', 'a'])).toBe(true)
  })
})

describe('juntarBlocos', () => {
  it('monta um código legível', () => {
    expect(juntarBlocos(['print', '(', "'Bom dia'", ')'])).toBe("print('Bom dia')")
    expect(juntarBlocos(['print', '(', 'type', '(', '3.5', ')', ')'])).toBe('print(type(3.5))')
    expect(juntarBlocos(['idade', '=', 'int', '(', 'input', '(', ')', ')'])).toBe('idade = int(input())')
    expect(juntarBlocos(['x', '>', '1', 'and', '(', 'y', '<', '2', ')'])).toBe('x > 1 and (y < 2)')
  })
})

describe('digitar', () => {
  const exercicio = { tipo: 'digitar', respostasAceitas: ["print('Olá, mundo!')"] }

  it('aceita aspas duplas e espaços extras', () => {
    expect(corrigir(exercicio, 'print("Olá, mundo!")')).toBe(true)
    expect(corrigir(exercicio, "  print (  'Olá, mundo!' )  ")).toBe(true)
  })

  it('diferencia maiúsculas', () => {
    expect(corrigir(exercicio, "Print('Olá, mundo!')")).toBe(false)
  })

  it('não ignora espaços dentro do texto', () => {
    expect(corrigir(exercicio, "print('Olá,mundo!')")).toBe(false)
  })

  it('ignora espaços ao redor de operadores', () => {
    const conta = { tipo: 'digitar', respostasAceitas: ['total = 10 * 2'] }
    expect(corrigir(conta, 'total=10*2')).toBe(true)
    expect(corrigir(conta, 'total  =  10  *  2')).toBe(true)
  })

  it('mantém palavras separadas', () => {
    const comparacao = { tipo: 'digitar', respostasAceitas: ['print(x > 1 and x < 5)'] }
    expect(corrigir(comparacao, 'print(x>1 and x<5)')).toBe(true)
    expect(corrigir(comparacao, 'print(x>1andx<5)')).toBe(false)
  })

  it('respeita o recuo das linhas', () => {
    const bloco = { tipo: 'digitar', respostasAceitas: ['if x > 1:\n    print(x)'] }
    expect(corrigir(bloco, 'if x>1:\n    print(x)\n')).toBe(true)
    expect(corrigir(bloco, 'if x>1:\nprint(x)')).toBe(false)
  })
})

describe('normalizarCodigo', () => {
  it('troca aspas duplas por simples', () => {
    expect(normalizarCodigo('nome = "Ana"')).toBe("nome='Ana'")
  })
})
