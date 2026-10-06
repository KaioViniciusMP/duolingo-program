import { useEffect, useMemo, useRef, useState } from 'react'
import { IconeCadeado, IconeCheck, IconeEstrela, IconeLivro, IconeTrofeu } from '../components/Icones.jsx'
import Mascote from '../components/Mascote.jsx'
import { quantidadeDePartes } from '../engine/partes.js'
import { estadosDasLicoes } from '../engine/trilha.js'
import './Trilha.css'

// Deslocamento horizontal (px) de cada círculo, formando o zigue-zague.
const ZIGUE_ZAGUE = [0, 44, 70, 44, 0, -44, -70, -44]

export default function Trilha({ curso, progresso, onComecarLicao, onAbrirGuia }) {
  const estados = useMemo(() => estadosDasLicoes(curso, progresso.licoesConcluidas), [curso, progresso])
  const [selecionada, setSelecionada] = useState(null)
  const atualRef = useRef(null)

  useEffect(() => {
    atualRef.current?.scrollIntoView({ block: 'center' })
  }, [])

  return (
    <div className="trilha" onClick={() => setSelecionada(null)}>
      <header className="trilha__topo">
        <span className="trilha__contador trilha__contador--fogo" title="Sequência de dias">
          🔥 {progresso.sequenciaAtual}
        </span>
        <span className="trilha__contador trilha__contador--xp" title="XP total">
          <IconeEstrela tamanho={22} /> {progresso.xpTotal} XP
        </span>
      </header>

      {curso.map((unidade, indiceUnidade) => (
        <section key={unidade.id} className="unidade" style={{ '--cor': unidade.cor }}>
          <div className="unidade__fixo">
            <div className="unidade__cabecalho">
              <div className="unidade__textos">
                <span className="unidade__numero">Unidade {indiceUnidade + 1}</span>
                <span className="unidade__titulo">{unidade.titulo}</span>
              </div>
              <button
                className="unidade__guia"
                aria-label={`Guia da unidade ${indiceUnidade + 1}`}
                onClick={() => onAbrirGuia(unidade.id)}
              >
                <IconeLivro tamanho={26} />
              </button>
            </div>
          </div>

          <ol className="caminho">
            {unidade.licoes.map((licao, indice) => (
              <NoLicao
                key={licao.id}
                licao={licao}
                numero={indice + 1}
                totalNaUnidade={unidade.licoes.length}
                estado={estados[licao.id]}
                deslocamento={ZIGUE_ZAGUE[indice % ZIGUE_ZAGUE.length]}
                partesFeitas={progresso.partesConcluidas[licao.id] ?? 0}
                selecionada={selecionada === licao.id}
                refAtual={estados[licao.id] === 'atual' ? atualRef : null}
                onTocar={() => setSelecionada(selecionada === licao.id ? null : licao.id)}
                onComecar={() => onComecarLicao(licao.id)}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

function NoLicao({ licao, numero, totalNaUnidade, estado, deslocamento, partesFeitas, selecionada, refAtual, onTocar, onComecar }) {
  const temConteudo = licao.exercicios.length > 0
  const Icone = estado === 'bloqueada' ? IconeCadeado : estado === 'concluida' ? IconeCheck : licao.revisao ? IconeTrofeu : IconeEstrela
  const totalDePartes = quantidadeDePartes(licao.exercicios.length)
  const nomeDaLicao = licao.revisao ? 'Revisão da unidade' : `Lição ${numero} de ${totalNaUnidade}`

  let detalhe = nomeDaLicao
  if (estado === 'bloqueada') detalhe = 'Complete as lições anteriores para liberar esta.'
  else if (estado === 'atual' && temConteudo && totalDePartes > 1)
    detalhe = `${nomeDaLicao} · Parte ${partesFeitas + 1} de ${totalDePartes}`

  return (
    <li ref={refAtual} className={`no no--${estado}`} style={{ '--deslocamento': `${deslocamento}px` }}>
      {estado === 'atual' && (
        <div className={`no__mascote ${deslocamento > 0 ? 'no__mascote--esquerda' : 'no__mascote--direita'}`}>
          <Mascote tamanho={88} />
        </div>
      )}

      <div className="no__posicao">
        {estado === 'atual' && !selecionada && <span className="no__etiqueta">Começar</span>}
        {estado === 'atual' && <AnelDePartes total={totalDePartes} feitas={partesFeitas} />}
        <button
          className="no__circulo"
          aria-label={`${licao.titulo} (${estado})`}
          onClick={(e) => {
            e.stopPropagation()
            onTocar()
          }}
        >
          <Icone tamanho={licao.revisao && estado !== 'concluida' ? 34 : 32} />
        </button>
      </div>

      {selecionada && (
        <div className="balao" onClick={(e) => e.stopPropagation()}>
          <h3 className="balao__titulo">{licao.titulo}</h3>
          <p className="balao__detalhe">{detalhe}</p>
          {estado !== 'bloqueada' &&
            (temConteudo ? (
              <button className="balao__botao" onClick={onComecar}>
                {estado === 'concluida' ? 'Refazer' : 'Começar'}
              </button>
            ) : (
              <button className="balao__botao" disabled>
                Em breve
              </button>
            ))}
        </div>
      )}
    </li>
  )
}

// Anel em volta da lição atual, com um segmento por parte.
const RAIO_ANEL = 46
const ESPACO_ENTRE_SEGMENTOS = 16 // graus

function pontoNoAnel(graus) {
  const radianos = (graus * Math.PI) / 180
  return `${50 + RAIO_ANEL * Math.sin(radianos)} ${50 - RAIO_ANEL * Math.cos(radianos)}`
}

function AnelDePartes({ total, feitas }) {
  const classe = (indice) => `anel__segmento ${indice < feitas ? 'anel__segmento--feito' : ''}`

  return (
    <svg className="anel" viewBox="0 0 100 100" aria-hidden="true">
      {total === 1 ? (
        <circle className={classe(0)} cx="50" cy="50" r={RAIO_ANEL} />
      ) : (
        Array.from({ length: total }, (_, indice) => {
          const tamanho = 360 / total
          const inicio = indice * tamanho + ESPACO_ENTRE_SEGMENTOS / 2
          const fim = (indice + 1) * tamanho - ESPACO_ENTRE_SEGMENTOS / 2
          const arcoGrande = fim - inicio > 180 ? 1 : 0
          return (
            <path
              key={indice}
              className={classe(indice)}
              d={`M ${pontoNoAnel(inicio)} A ${RAIO_ANEL} ${RAIO_ANEL} 0 ${arcoGrande} 1 ${pontoNoAnel(fim)}`}
            />
          )
        })
      )}
    </svg>
  )
}
