import type { Character, StoryMessage } from '../types/game'
import { EerieImage } from './EeriImage'

interface MessageBubbleProps {
  message: StoryMessage
  character: Character
  isRead?: boolean
  timeLabel?: string
}

export function MessageBubble({
  message,
  character,
  isRead,
  timeLabel,
}: MessageBubbleProps) {
  const effectClass =
    message.effect === 'shake'
      ? 'animate-shake'
      : message.effect === 'shake-hard'
      ? 'animate-shake-hard'
      : ''

  const flashWrapperClass =
    message.effect === 'flash-red' ? 'animate-flash-red rounded-xl' : ''

  if (message.sender === 'system') {
    return (
      <div className={`flex justify-center my-3 px-6 ${flashWrapperClass}`}>
        <div className="flex flex-col items-center gap-2 max-w-[80%]">
          {message.text && (
            <span className="text-[11px] text-gray-400 bg-black/30 px-3 py-1 rounded-full text-center">
              {message.text}
            </span>
          )}
          {message.image && <EerieImage image={message.image} />}
        </div>
      </div>
    )
  }

  const isMe = message.sender === 'me'

  return (
    <div
      className={`flex w-full px-3 my-1.5 ${
        isMe ? 'justify-end' : 'justify-start'
      } ${effectClass}`}
    >
      {!isMe && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mr-2 mt-auto shadow"
          style={{ backgroundColor: character.avatarColor }}
        >
          {character.avatarEmoji}
        </div>
      )}
      <div
        className={`flex items-end gap-1.5 max-w-[72%] ${
          isMe ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`px-3 py-2 rounded-2xl text-[14px] leading-snug shadow whitespace-pre-wrap break-words ${
            isMe
              ? 'bg-line-bubble text-black rounded-br-sm'
              : 'bg-white text-black rounded-bl-sm'
          } ${flashWrapperClass}`}
        >
          {message.glitchText ? (
            <span className="glitch-text">{message.text}</span>
          ) : (
            message.text
          )}
        </div>
        <div
          className={`flex flex-col text-[10px] text-gray-300 shrink-0 ${
            isMe ? 'items-end' : 'items-start'
          }`}
        >
          {isMe && isRead && <span>既読</span>}
          {timeLabel && <span>{timeLabel}</span>}
        </div>
      </div>
    </div>
  )
}
