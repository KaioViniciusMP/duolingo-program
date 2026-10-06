import Blocos from './Blocos.jsx'
import Digitar from './Digitar.jsx'
import Lacuna from './Lacuna.jsx'
import MultiplaEscolha from './MultiplaEscolha.jsx'
import Pares from './Pares.jsx'

// Tipos que o aluno resolve sozinhos, sem o botão "Verificar".
export const TIPOS_AUTOCORRIGIDOS = new Set(['pares'])

// Tipos que desenham o próprio código (a tela da lição não mostra o código de novo).
export const TIPOS_COM_CODIGO_PROPRIO = new Set(['lacuna'])

export const componentesPorTipo = {
  multipla_escolha: MultiplaEscolha,
  pares: Pares,
  blocos: Blocos,
  digitar: Digitar,
  lacuna: Lacuna,
}
