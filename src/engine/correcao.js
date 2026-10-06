// Correção por comparação com as respostas aceitas.

export function corrigirMultiplaEscolha(exercicio, resposta) {
  return exercicio.respostasAceitas.includes(resposta)
}

// Em `pares`, cada item de respostasAceitas é [esquerda, direita].
export function parCorreto(exercicio, esquerda, direita) {
  return exercicio.respostasAceitas.some(([a, b]) => a === esquerda && b === direita)
}

// Em `blocos`, a resposta é a lista de textos dos blocos na ordem escolhida.
export function corrigirBlocos(exercicio, resposta) {
  return exercicio.respostasAceitas.some(
    (aceita) => aceita.length === resposta.length && aceita.every((bloco, i) => bloco === resposta[i]),
  )
}

const TEXTO_ENTRE_ASPAS = /('[^']*'|"[^"]*")/

// Normaliza uma linha de código para comparar:
// - textos entre aspas ficam iguais, só trocando " por ';
// - fora das aspas, espaços repetidos viram um só e somem ao redor de
//   operadores e pontuação (x=5 é igual a x = 5);
// - o recuo do começo da linha é mantido.
function normalizarLinha(linha) {
  const recuo = linha.match(/^\s*/)[0]
  return (
    recuo +
    linha
      .trim()
      .split(TEXTO_ENTRE_ASPAS)
      .map((trecho, i) =>
        i % 2 === 1
          ? `'${trecho.slice(1, -1)}'`
          : trecho.replace(/\s+/g, ' ').replace(/\s*([^\w\s])\s*/g, '$1'),
      )
      .join('')
  )
}

// Tab vale 4 espaços. O recuo comum a todas as linhas é removido, então
// só o recuo relativo (o que importa no Python) é comparado.
export function normalizarCodigo(texto) {
  const linhas = texto
    .replace(/\r\n/g, '\n')
    .replaceAll('\t', '    ')
    .split('\n')
    .map((linha) => linha.trimEnd())
    .filter((linha) => linha.length > 0)
  const recuoComum = Math.min(...linhas.map((linha) => linha.match(/^ */)[0].length))
  return linhas.map((linha) => normalizarLinha(linha.slice(recuoComum))).join('\n')
}

export function corrigirDigitar(exercicio, resposta) {
  const normalizada = normalizarCodigo(resposta)
  return exercicio.respostasAceitas.some((aceita) => normalizarCodigo(aceita) === normalizada)
}

const PALAVRAS_RESERVADAS = new Set(['and', 'or', 'not', 'in', 'is', 'if', 'elif', 'while', 'return'])

// Junta blocos de código num texto legível: print ( 'Oi' ) -> print('Oi')
export function juntarBlocos(blocos) {
  return blocos
    .join(' ')
    .replace(/\s+([),.:\]])/g, '$1')
    .replace(/([([])\s+/g, '$1')
    .replace(/(\w+)\s+([([])/g, (trecho, palavra, abre) =>
      PALAVRAS_RESERVADAS.has(palavra) ? trecho : palavra + abre,
    )
}

// Em `ordenar_linhas`, a resposta é a lista de { texto, nivel } na ordem escolhida.
export function corrigirOrdenarLinhas(exercicio, resposta) {
  return exercicio.respostasAceitas.some(
    (aceita) =>
      aceita.length === resposta.length &&
      aceita.every((linha, i) => linha.texto === resposta[i].texto && linha.nivel === resposta[i].nivel),
  )
}

// Cada nível de recuo vale 4 espaços.
export function montarLinhas(linhas) {
  return linhas.map(({ texto, nivel }) => ' '.repeat(4 * nivel) + texto).join('\n')
}

// Em `encontrar_erro`, a resposta é [linha, trecho]: o número da linha
// (começando em 0) e o texto do trecho tocado.
export function corrigirEncontrarErro(exercicio, [linha, trecho]) {
  return exercicio.respostasAceitas.some(([l, t]) => l === linha && t === trecho)
}

// `prever_saida` com opções funciona como múltipla escolha; sem opções, como digitar.
export function corrigirPreverSaida(exercicio, resposta) {
  return exercicio.opcoes ? corrigirMultiplaEscolha(exercicio, resposta) : corrigirDigitar(exercicio, resposta)
}

// Em `lacuna`, o espaço vazio é marcado com ___ no código.
export const LACUNA = '___'

// Linha do código que tem a lacuna, já preenchida com o bloco e sem o comentário.
export function preencherLacuna(codigo, bloco) {
  const linha = codigo.split('\n').find((l) => l.includes(LACUNA))
  return linha.replace(LACUNA, bloco).replace(/\s+#.*$/, '').trim()
}

// Texto mostrado na faixa vermelha como "resposta correta".
export function respostaParaMostrar(exercicio) {
  const primeira = exercicio.respostasAceitas[0]
  if (exercicio.tipo === 'blocos') return juntarBlocos(primeira)
  if (exercicio.tipo === 'lacuna') return preencherLacuna(exercicio.codigo, primeira)
  if (exercicio.tipo === 'ordenar_linhas') return montarLinhas(primeira)
  if (exercicio.tipo === 'encontrar_erro') return `Linha ${primeira[0] + 1}: ${primeira[1].trim()}`
  return primeira
}

const corretores = {
  multipla_escolha: corrigirMultiplaEscolha,
  lacuna: corrigirMultiplaEscolha,
  blocos: corrigirBlocos,
  digitar: corrigirDigitar,
  ordenar_linhas: corrigirOrdenarLinhas,
  encontrar_erro: corrigirEncontrarErro,
  prever_saida: corrigirPreverSaida,
}

export function corrigir(exercicio, resposta) {
  const corretor = corretores[exercicio.tipo]
  if (!corretor) throw new Error(`Tipo de exercício sem correção: ${exercicio.tipo}`)
  return corretor(exercicio, resposta)
}
