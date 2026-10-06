import Blocos from './Blocos.jsx'
import Digitar from './Digitar.jsx'
import MultiplaEscolha from './MultiplaEscolha.jsx'
import Pares from './Pares.jsx'

// Tipos que o aluno resolve sozinhos, sem o botão "Verificar".
export const TIPOS_AUTOCORRIGIDOS = new Set(['pares'])

export const componentesPorTipo = {
  multipla_escolha: MultiplaEscolha,
  pares: Pares,
  blocos: Blocos,
  digitar: Digitar,
}
