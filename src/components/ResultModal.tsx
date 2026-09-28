import { Skull, PartyPopper, RotateCcw, ArrowLeft } from 'lucide-react'

interface ResultModalProps {
  type: 'success' | 'bad'
  title: string
  description: string
  onRetry: () => void
  onBackToList: () => void
}

export function ResultModal({
  type,
  title,
  description,
  onRetry,
  onBackToList,
}: ResultModalProps) {
  const isSuccess = type === 'success'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-6 animate-[fadeIn_0.4s_ease]">
      <div
        className={`w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl border ${
          isSuccess
            ? 'bg-gray-900 border-green-500/40'
            : 'bg-gray-950 border-red-600/50'
        }`}
      >
        <div className="flex justify-center mb-3">
          {isSuccess ? (
            <PartyPopper className="w-12 h-12 text-green-400" />
          ) : (
            <Skull className="w-12 h-12 text-red-500" />
          )}
        </div>
        <h2
          className={`text-xl font-bold mb-1 ${
            isSuccess ? 'text-green-400' : 'text-red-500'
          }`}
        >
          {isSuccess ? '救出成功' : 'BAD END'}
        </h2>
        <p className="text-white font-semibold mb-3">{title}</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            もう一度やり直す
          </button>
          <button
            onClick={onBackToList}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-line-green hover:brightness-110 text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            トーク一覧へ戻る
          </button>
        </div>
      </div>
    </div>
  )
}
