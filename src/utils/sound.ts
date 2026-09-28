// Web Audio API による効果音ジェネレータ
// 外部音声ファイルに一切依存せず、OscillatorNode / GainNode / AudioBuffer(ノイズ)で
// LINE風の通知音・グリッチ音・心音・警告ノイズなどをプログラマティックに合成する。

class SoundEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private muted = false

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.5
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  setMuted(muted: boolean) {
    this.muted = muted
  }

  isMuted() {
    return this.muted
  }

  /** ユーザー操作の中で一度呼び出し、AudioContextをアンロックする */
  unlock() {
    try {
      this.ensureContext()
    } catch {
      // ignore - ブラウザが未対応の場合は無音で続行
    }
  }

  private tone(
    freq: number,
    startTime: number,
    duration: number,
    opts: {
      type?: OscillatorType
      gain?: number
      freqEnd?: number
      attack?: number
      release?: number
    } = {}
  ) {
    if (this.muted) return
    const ctx = this.ensureContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = opts.type ?? 'sine'
    osc.frequency.setValueAtTime(freq, startTime)
    if (opts.freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(opts.freqEnd, 1),
        startTime + duration
      )
    }
    const peak = opts.gain ?? 0.3
    const attack = opts.attack ?? 0.01
    const release = opts.release ?? duration * 0.6
    gain.gain.setValueAtTime(0.0001, startTime)
    gain.gain.exponentialRampToValueAtTime(peak, startTime + attack)
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + attack + release
    )
    osc.connect(gain)
    gain.connect(this.masterGain!)
    osc.start(startTime)
    osc.stop(startTime + duration + 0.05)
  }

  private noiseBuffer(duration: number): AudioBuffer {
    const ctx = this.ensureContext()
    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }

  /** LINE風の「ピコン」受信音 */
  receive() {
    if (this.muted) return
    const ctx = this.ensureContext()
    const now = ctx.currentTime
    this.tone(1046.5, now, 0.12, { type: 'sine', gain: 0.25, attack: 0.005 })
    this.tone(1318.5, now + 0.09, 0.15, {
      type: 'sine',
      gain: 0.22,
      attack: 0.005,
    })
  }

  /** 送信音（軽いポップ音） */
  send() {
    if (this.muted) return
    const ctx = this.ensureContext()
    const now = ctx.currentTime
    this.tone(700, now, 0.08, {
      type: 'sine',
      gain: 0.18,
      freqEnd: 900,
      attack: 0.005,
    })
  }

  /** 低音の心音パルス（ドクン、ドクン） */
  heartbeat(bpm = 70) {
    if (this.muted) return
    const ctx = this.ensureContext()
    const now = ctx.currentTime
    const beatGap = 0.16
    this.tone(60, now, 0.15, {
      type: 'sine',
      gain: 0.5,
      freqEnd: 40,
      attack: 0.01,
      release: 0.1,
    })
    this.tone(55, now + beatGap, 0.15, {
      type: 'sine',
      gain: 0.4,
      freqEnd: 35,
      attack: 0.01,
      release: 0.1,
    })
    void bpm
  }

  /** ホワイトノイズ + 不協和音による恐怖/警告ノイズ */
  fearNoise(duration = 0.8) {
    if (this.muted) return
    const ctx = this.ensureContext()
    const now = ctx.currentTime

    const noise = ctx.createBufferSource()
    noise.buffer = this.noiseBuffer(duration)
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.0001, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.18, now + 0.05)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1200
    filter.Q.value = 0.7
    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.masterGain!)
    noise.start(now)
    noise.stop(now + duration)

    // 不協和音（半音でぶつかる2音）
    this.tone(185, now, duration, {
      type: 'sawtooth',
      gain: 0.12,
      attack: 0.02,
      release: duration * 0.8,
    })
    this.tone(196, now + 0.02, duration, {
      type: 'sawtooth',
      gain: 0.1,
      attack: 0.02,
      release: duration * 0.8,
    })
  }

  /** 通話切断ノイズ（ザザッというグリッチ的切断音） */
  callEnd() {
    if (this.muted) return
    const ctx = this.ensureContext()
    const now = ctx.currentTime
    const noise = ctx.createBufferSource()
    noise.buffer = this.noiseBuffer(0.6)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 800
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain!)
    noise.start(now)
    noise.stop(now + 0.6)

    this.tone(320, now, 0.3, { type: 'square', gain: 0.15, freqEnd: 60 })
  }

  /** 非常警報ベル */
  alarm() {
    if (this.muted) return
    const ctx = this.ensureContext()
    const now = ctx.currentTime
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.3
      this.tone(880, t, 0.15, { type: 'square', gain: 0.2 })
      this.tone(660, t + 0.15, 0.15, { type: 'square', gain: 0.2 })
    }
  }
}

export const soundEngine = new SoundEngine()
