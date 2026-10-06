// Sons curtos gerados na hora com a Web Audio API: não precisa de arquivos
// e funciona offline. Ligar e desligar fica no Perfil.

let ligados = true
let contexto = null

export function ligarSons(valor) {
  ligados = valor
}

function audio() {
  if (!contexto) {
    const Contexto = globalThis.AudioContext ?? globalThis.webkitAudioContext
    if (!Contexto) return null
    contexto = new Contexto()
  }
  // O celular só libera o áudio depois de um toque; resume() tenta de novo.
  if (contexto.state === 'suspended') contexto.resume()
  return contexto
}

// Uma nota com ataque rápido e final suave, para não estalar.
function nota(ctx, frequencia, inicio, duracao, { tipo = 'triangle', volume = 0.18 } = {}) {
  const oscilador = ctx.createOscillator()
  const ganho = ctx.createGain()
  const t0 = ctx.currentTime + inicio
  oscilador.type = tipo
  oscilador.frequency.setValueAtTime(frequencia, t0)
  ganho.gain.setValueAtTime(0.0001, t0)
  ganho.gain.exponentialRampToValueAtTime(volume, t0 + 0.012)
  ganho.gain.exponentialRampToValueAtTime(0.0001, t0 + duracao)
  oscilador.connect(ganho).connect(ctx.destination)
  oscilador.start(t0)
  oscilador.stop(t0 + duracao + 0.02)
}

const SONS = {
  // Duas notas subindo
  acerto: (ctx) => {
    nota(ctx, 659.25, 0, 0.12)
    nota(ctx, 987.77, 0.09, 0.22)
  },
  // Duas notas graves descendo, mais baixinho
  erro: (ctx) => {
    nota(ctx, 233.08, 0, 0.14, { tipo: 'square', volume: 0.07 })
    nota(ctx, 185, 0.12, 0.24, { tipo: 'square', volume: 0.07 })
  },
  // Toque curtinho para cada par certo
  par: (ctx) => {
    nota(ctx, 880, 0, 0.09, { volume: 0.12 })
  },
  // Arpejo de comemoração
  concluida: (ctx) => {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((frequencia, i) => nota(ctx, frequencia, i * 0.1, 0.3))
    nota(ctx, 1318.51, 0.42, 0.5, { volume: 0.14 })
  },
}

export function tocarSom(nome) {
  if (!ligados) return
  try {
    const ctx = audio()
    if (ctx) SONS[nome]?.(ctx)
  } catch {
    // Sem áudio no aparelho: segue em silêncio.
  }
}
