import { RotateCcw, Phone, Video, MoreHorizontal } from 'lucide-react'
import { scenarios } from '../data/scenarios'
import type { GameSaveData } from '../types/game'

interface ChatListProps {
  saveData: GameSaveData
  onSelectScenario: (scenarioId: string) => void
  onResetAll: () => void
}

function StatusBadge({
  status,
}: {
  status: 'unread' | 'in_progress' | 'success' | 'bad'
}) {
  if (status === 'success') {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-600/20 text-green-400 border border-green-600/40 shrink-0">
        救出成功
      </span>
    )
  }
  if (status === 'bad') {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-600/40 shrink-0">
        音信不通
      </span>
    )
  }
  if (status === 'in_progress') {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-600/20 text-yellow-400 border border-yellow-600/40 shrink-0">
        進行中
      </span>
    )
  }
  return null
}

export function ChatList({
  saveData,
  onSelectScenario,
  onResetAll,
}: ChatListProps) {
  return (
    <div className="h-full w-full bg-[#0f1115] flex flex-col">
      <header className="bg-[#111318] px-4 pt-5 pb-3 flex items-center justify-between border-b border-white/5">
        <h1 className="text-white text-lg font-bold tracking-wide">トーク</h1>
        <button
          onClick={onResetAll}
          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-full border border-white/10"
        >
          <RotateCcw className="w-3 h-3" />
          全データ初期化
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        {scenarios.map((scenario) => {
          const progress = saveData.progress[scenario.id]
          const status = progress?.status ?? 'unread'
          const isUnread = status === 'unread'

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors text-left relative"
            >
              <div className="relative shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow"
                  style={{ backgroundColor: scenario.character.avatarColor }}
                >
                  {scenario.character.avatarEmoji}
                </div>
                {isUnread && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white flex items-center justify-center font-bold border-2 border-[#0f1115]">
                    1
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white text-sm font-semibold truncate">
                    {scenario.character.name}
                  </span>
                  <StatusBadge status={status} />
                </div>
                <p className="text-gray-400 text-xs truncate mt-0.5">
                  {scenario.title} ─ {scenario.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      <footer className="px-4 py-3 border-t border-white/5 flex items-center justify-center gap-6 text-gray-600">
        <Phone className="w-5 h-5" />
        <Video className="w-5 h-5" />
        <MoreHorizontal className="w-5 h-5" />
      </footer>
    </div>
  )
}
