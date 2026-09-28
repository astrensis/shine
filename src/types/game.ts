// ===== 基本型定義 =====

export type Sender = 'them' | 'me' | 'system'

export type EffectType =
  | 'shake'
  | 'shake-hard'
  | 'flash-red'
  | 'glitch'
  | 'none'

export type SoundType =
  | 'receive'
  | 'send'
  | 'heartbeat'
  | 'noise'
  | 'callEnd'
  | 'alarm'
  | 'none'

export interface ImagePlaceholder {
  kind: 'doorscope' | 'eyes' | 'cctv' | 'handprints' | 'tunnel' | 'doorajar' | 'corridor'
  caption?: string
}

// タイムライン上の1メッセージ（システム側が自動で流すもの）
export interface StoryMessage {
  id: string
  sender: Sender
  text: string
  /** 表示前の「入力中...」待機時間(ms)。省略時はランダム(1000〜2500ms) */
  delayMs?: number
  effect?: EffectType
  sound?: SoundType
  image?: ImagePlaceholder
  /** trueの場合、文字化けエフェクト（グリッチテキスト）として表示 */
  glitchText?: boolean
}

// プレイヤーの選択肢
export interface Choice {
  id: string
  label: string
  /** 選ぶと遷移する次のノードID */
  nextNodeId: string
}

// シナリオの1ノード（メッセージの塊 + その後の選択肢 or 自動遷移）
export interface StoryNode {
  id: string
  messages: StoryMessage[]
  choices?: Choice[]
  /** 選択肢がない場合、自動でこのノードへ遷移(ms待って) */
  autoNextNodeId?: string
  autoNextDelayMs?: number
  /** このノードが結末の場合 */
  ending?: {
    type: 'success' | 'bad'
    title: string
    description: string
  }
}

export interface Character {
  id: string
  name: string
  avatarEmoji: string
  avatarColor: string
  /** 実写アバター画像パス（未指定ならavatarEmojiを表示） */
  avatarImage?: string
}

export interface Scenario {
  id: string
  title: string
  character: Character
  description: string
  startNodeId: string
  nodes: Record<string, StoryNode>
}

// ===== プレイ状態の永続化 =====

export type ScenarioStatus = 'unread' | 'in_progress' | 'success' | 'bad'

export interface ScenarioProgress {
  scenarioId: string
  status: ScenarioStatus
  lastNodeId?: string
}

export interface GameSaveData {
  progress: Record<string, ScenarioProgress>
}
