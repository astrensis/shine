import type { GameSaveData, ScenarioStatus } from '../types/game'

const STORAGE_KEY = 'line-horror-save-v1'

function emptySave(): GameSaveData {
  return { progress: {} }
}

export function loadSave(): GameSaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptySave()
    const parsed = JSON.parse(raw) as GameSaveData
    if (!parsed || typeof parsed !== 'object' || !parsed.progress) {
      return emptySave()
    }
    return parsed
  } catch {
    return emptySave()
  }
}

export function saveSave(data: GameSaveData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorageが使えない環境では無視（ゲームは継続可能）
  }
}

export function updateScenarioStatus(
  scenarioId: string,
  status: ScenarioStatus,
  lastNodeId?: string
): GameSaveData {
  const data = loadSave()
  data.progress[scenarioId] = { scenarioId, status, lastNodeId }
  saveSave(data)
  return data
}

export function resetSave(): GameSaveData {
  const empty = emptySave()
  saveSave(empty)
  return empty
}
