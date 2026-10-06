import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import './Codigo.css'

export default function Codigo({ codigo }) {
  const html = Prism.highlight(codigo, Prism.languages.python, 'python')
  return (
    <pre className="codigo">
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  )
}
