import type { Character } from '../types/game'

export function TypingIndicator({ character }: { character: Character }) {
  return (
    <div className="flex w-full px-3 my-1.5 justify-start">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mr-2 mt-auto shadow overflow-hidden bg-cover bg-center"
        style={{
          backgroundColor: character.avatarColor,
          backgroundImage: character.avatarImage ? `url(${character.avatarImage})` : undefined,
        }}
      >
        {!character.avatarImage && character.avatarEmoji}
      </div>
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow flex items-center gap-1">
        <span className="typing-dot w-1.5 h-1.5 bg-gray-400 rounded-full inline-block" />
        <span className="typing-dot w-1.5 h-1.5 bg-gray-400 rounded-full inline-block" />
        <span className="typing-dot w-1.5 h-1.5 bg-gray-400 rounded-full inline-block" />
      </div>
    </div>
  )
}
