import Digitar from './Digitar.jsx'
import MultiplaEscolha from './MultiplaEscolha.jsx'

// O código aparece em cima (pela tela da lição). Com opções, o aluno escolhe a
// saída; sem opções, digita o que o programa mostra, uma linha por print.
export default function PreverSaida(props) {
  return props.exercicio.opcoes ? (
    <MultiplaEscolha {...props} />
  ) : (
    <Digitar {...props} comSimbolos={false} placeholder="Digite a saída do programa" />
  )
}
