// Cada lição é dividida em partes de cerca de 5 exercícios, para não cansar.
import { ordenarExercicios } from './fila.js'

export const EXERCICIOS_POR_PARTE = 5

export function quantidadeDePartes(totalDeExercicios) {
  return Math.max(1, Math.round(totalDeExercicios / EXERCICIOS_POR_PARTE))
}

// Distribui os exercícios já ordenados (reconhecimento → produção) um para
// cada parte, em rodízio. Assim toda parte tem um pouco de cada grupo e
// continua na ordem certa. A divisão é sempre a mesma para o mesmo conteúdo.
export function dividirEmPartes(exercicios) {
  const total = quantidadeDePartes(exercicios.length)
  const partes = Array.from({ length: total }, () => [])
  ordenarExercicios(exercicios).forEach((exercicio, indice) => {
    partes[indice % total].push(exercicio)
  })
  return partes
}

// partesFeitas conta todas as partes já concluídas da lição, inclusive ao
// refazer. Por isso o resto da divisão dá a próxima parte e, depois que a
// lição foi concluída, as partes se alternam.
export function proximaParte(partesFeitas, totalDePartes) {
  return partesFeitas % totalDePartes
}
