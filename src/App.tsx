import { useState } from 'react'
import { ChatList } from './components/ChatList'
import { ChatRoom } from './components/ChatRoom'
import { ResultModal } from './components/ResultModal'
import { getScenarioById } from './data/scenarios'
import { loadSave, resetSave, updateScenarioStatus } from './utils/storage'
import type { GameSaveData } from './types/game'

type Screen = 'list' | 'chat'

interface EndingState {
  scenarioId: string
  type: 'success' | 'bad'
  title: string
  description: string
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('list')
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)
  const [saveData, setSaveData] = useState<GameSaveData>(() => loadSave())
  const [ending, setEnding] = useState<EndingState | null>(null)
  // key を変えることで ChatRoom を強制的に再マウントし、シナリオを最初からやり直す
  const [playKey, setPlayKey] = useState(0)

  function handleSelectScenario(scenarioId: string) {
    setSelectedScenarioId(scenarioId)
    setEnding(null)
    setPlayKey((k) => k + 1)
    setScreen('chat')
    const next = updateScenarioStatus(scenarioId, 'in_progress')
    setSaveData(next)
  }

  function handleExitChat() {
    setScreen('list')
    setSelectedScenarioId(null)
  }

  function handleEnding(result: {
    type: 'success' | 'bad'
    title: string
    description: string
  }) {
    if (!selectedScenarioId) return
    const next = updateScenarioStatus(selectedScenarioId, result.type)
    setSaveData(next)
    setEnding({ scenarioId: selectedScenarioId, ...result })
  }

  function handleRetry() {
    if (!ending) return
    setPlayKey((k) => k + 1)
    setEnding(null)
  }

  function handleBackToListFromResult() {
    setEnding(null)
    setScreen('list')
    setSelectedScenarioId(null)
  }

  function handleResetAll() {
    if (!window.confirm('すべてのプレイ状況をリセットします。よろしいですか？')) {
      return
    }
    const next = resetSave()
    setSaveData(next)
  }

  const scenario = selectedScenarioId ? getScenarioById(selectedScenarioId) : undefined

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-black">
      <div className="relative w-full max-w-md h-full sm:h-[850px] sm:max-h-[95vh] sm:rounded-3xl overflow-hidden shadow-2xl bg-white">
        {screen === 'list' && (
          <ChatList
            saveData={saveData}
            onSelectScenario={handleSelectScenario}
            onResetAll={handleResetAll}
          />
        )}

        {screen === 'chat' && scenario && (
          <ChatRoom
            key={`${scenario.id}-${playKey}`}
            scenario={scenario}
            onExit={handleExitChat}
            onEnding={handleEnding}
          />
        )}

        {ending && (
          <ResultModal
            type={ending.type}
            title={ending.title}
            description={ending.description}
            onRetry={handleRetry}
            onBackToList={handleBackToListFromResult}
          />
        )}
      </div>
    </div>
  )
}
