import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, Phone, Video, Menu } from 'lucide-react'
import type { Scenario, StoryMessage, EffectType } from '../types/game'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { soundEngine } from '../utils/sound'

interface ChatRoomProps {
  scenario: Scenario
  onExit: () => void
  onEnding: (ending: { type: 'success' | 'bad'; title: string; description: string }) => void
}

interface TimelineEntry {
  message: StoryMessage
  timeLabel: string
}

function nowLabel() {
  const d = new Date()
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function playSound(sound: StoryMessage['sound']) {
  switch (sound) {
    case 'receive':
      soundEngine.receive()
      break
    case 'send':
      soundEngine.send()
      break
    case 'heartbeat':
      soundEngine.heartbeat()
      break
    case 'noise':
      soundEngine.fearNoise()
      break
    case 'callEnd':
      soundEngine.callEnd()
      break
    case 'alarm':
      soundEngine.alarm()
      break
    default:
      break
  }
}

export function ChatRoom({ scenario, onExit, onEnding }: ChatRoomProps) {
  const [currentNodeId, setCurrentNodeId] = useState(scenario.startNodeId)
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingWho, setTypingWho] = useState<'them' | null>(null)
  const [showChoices, setShowChoices] = useState(false)
  const [screenEffect, setScreenEffect] = useState<EffectType>('none')
  const [callFlash, setCallFlash] = useState(false)
  const [otherStatus, setOtherStatus] = useState<'オンライン' | '入力中...' | 'オフライン'>(
    'オンライン'
  )
  const scrollRef = useRef<HTMLDivElement>(null)
  const processedNodeRef = useRef<string | null>(null)
  const cancelledRef = useRef(false)

  useEffect(() => {
    soundEngine.unlock()
    return () => {
      cancelledRef.current = true
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [timeline, isTyping, showChoices])

  useEffect(() => {
    if (processedNodeRef.current === currentNodeId) return
    processedNodeRef.current = currentNodeId
    cancelledRef.current = false
    setShowChoices(false)

    const node = scenario.nodes[currentNodeId]
    if (!node) return

    let cancelled = false

    async function run() {
      for (const msg of node.messages) {
        if (cancelled || cancelledRef.current) return

        if (msg.sender === 'them') {
          setTypingWho('them')
          setOtherStatus('入力中...')
          setIsTyping(true)
          await wait(msg.delayMs ?? randomDelay())
          if (cancelled || cancelledRef.current) return
          setIsTyping(false)
          setOtherStatus('オンライン')
        } else if (msg.delayMs) {
          await wait(msg.delayMs)
          if (cancelled || cancelledRef.current) return
        }

        setTimeline((prev) => [...prev, { message: msg, timeLabel: nowLabel() }])
        playSound(msg.sound)
        if (msg.effect && msg.effect !== 'none') {
          triggerScreenEffect(msg.effect)
        }
        await wait(250)
      }

      if (cancelled || cancelledRef.current) return

      if (node.ending) {
        setOtherStatus('オフライン')
        await wait(600)
        if (cancelled || cancelledRef.current) return
        onEnding(node.ending)
        return
      }

      if (node.choices && node.choices.length > 0) {
        setShowChoices(true)
        return
      }

      if (node.autoNextNodeId) {
        await wait(node.autoNextDelayMs ?? 1200)
        if (cancelled || cancelledRef.current) return
        setCurrentNodeId(node.autoNextNodeId)
      }
    }

    run()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeId])

  function triggerScreenEffect(effect: EffectType) {
    setScreenEffect(effect)
    window.setTimeout(() => setScreenEffect('none'), 600)
  }

  function wait(ms: number) {
    return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
  }

  function randomDelay() {
    return 1000 + Math.random() * 1500
  }

  function handleChoice(label: string, nextNodeId: string) {
    soundEngine.send()
    setTimeline((prev) => [
      ...prev,
      {
        message: {
          id: `choice-${Date.now()}`,
          sender: 'me',
          text: label,
        },
        timeLabel: nowLabel(),
      },
    ])
    setShowChoices(false)
    window.setTimeout(() => setCurrentNodeId(nextNodeId), 400)
  }

  function handleCallTap() {
    soundEngine.callEnd()
    setCallFlash(true)
    window.setTimeout(() => setCallFlash(false), 700)
  }

  const node = scenario.nodes[currentNodeId]
  const currentChoices = node?.choices ?? []

  const rootEffectClass =
    screenEffect === 'shake'
      ? 'animate-shake'
      : screenEffect === 'shake-hard'
      ? 'animate-shake-hard'
      : ''
  const rootFlashClass = screenEffect === 'flash-red' ? 'animate-flash-red' : ''

  return (
    <div
      className={`h-full w-full flex flex-col bg-[#8DBEE6] relative overflow-hidden ${rootEffectClass} ${rootFlashClass}`}
    >
      {callFlash && (
        <div className="absolute inset-0 z-40 bg-black flex items-center justify-center animate-flash-red">
          <span className="text-red-500 text-sm font-mono tracking-widest">
            通話が強制切断されました
          </span>
        </div>
      )}

      <header className="bg-[#3d3d3d] text-white px-3 py-2.5 flex items-center gap-2 shrink-0 shadow z-10">
        <button onClick={onExit} className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 overflow-hidden bg-cover bg-center"
          style={{
            backgroundColor: scenario.character.avatarColor,
            backgroundImage: scenario.character.avatarImage
              ? `url(${scenario.character.avatarImage})`
              : undefined,
          }}
        >
          {!scenario.character.avatarImage && scenario.character.avatarEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{scenario.character.name}</p>
          <p
            className={`text-[10px] truncate ${
              otherStatus === '入力中...'
                ? 'text-green-300'
                : otherStatus === 'オフライン'
                ? 'text-red-400'
                : 'text-gray-300'
            }`}
          >
            {otherStatus}
          </p>
        </div>
        <button onClick={handleCallTap} className="p-1.5">
          <Phone className="w-4 h-4" />
        </button>
        <button onClick={handleCallTap} className="p-1.5">
          <Video className="w-4 h-4" />
        </button>
        <button className="p-1.5">
          <Menu className="w-4 h-4" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
        {timeline.map((entry, i) => (
          <MessageBubble
            key={entry.message.id + i}
            message={entry.message}
            character={scenario.character}
            isRead={entry.message.sender === 'me'}
            timeLabel={entry.timeLabel}
          />
        ))}
        {isTyping && typingWho === 'them' && (
          <TypingIndicator character={scenario.character} />
        )}
      </div>

      {showChoices && currentChoices.length > 0 && (
        <div className="shrink-0 bg-[#eef1f4] border-t border-black/10 px-3 py-3 flex flex-col gap-2 z-10">
          {currentChoices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice.label, choice.nextNodeId)}
              className="w-full text-left px-4 py-3 rounded-xl bg-white shadow border border-black/5 text-[13px] text-gray-800 font-medium hover:bg-gray-50 active:scale-[0.98] transition-transform"
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
