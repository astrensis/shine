import { useState } from 'react'
import type { ImagePlaceholder } from '../types/game'

// 実写画像がある場合はそちらを優先し、読み込みに失敗した場合のみ
// SVG/CSSのみで描画する「不穏な画像」プレースホルダーにフォールバックする。
const SCENE_PHOTOS: Partial<Record<ImagePlaceholder['kind'], string>> = {
  doorscope: '/images/scenes/doorscope.jpg',
  eyes: '/images/scenes/eyes.jpg',
  cctv: '/images/scenes/cctv.jpg',
  handprints: '/images/scenes/handprints.jpg',
  tunnel: '/images/scenes/tunnel.jpg',
  doorajar: '/images/scenes/doorajar.jpg',
  corridor: '/images/scenes/corridor.jpg',
}

function DoorscopeSvg() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <defs>
        <radialGradient id="dsVignette" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="70%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <filter id="dsWarp">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="1" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="8" />
        </filter>
      </defs>
      <rect width="300" height="200" fill="#000" />
      <circle cx="150" cy="100" r="90" fill="url(#dsVignette)" filter="url(#dsWarp)" />
      <circle cx="150" cy="100" r="92" fill="none" stroke="#111" strokeWidth="14" />
      <rect x="60" y="150" width="180" height="8" fill="#1a1a1a" opacity="0.6" />
    </svg>
  )
}

function EyesSvg() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <rect width="300" height="200" fill="#050505" />
      <rect x="0" y="120" width="300" height="10" fill="#161616" />
      <g opacity="0.95">
        <ellipse cx="130" cy="115" rx="10" ry="6" fill="#e8e2c8" />
        <ellipse cx="166" cy="115" rx="10" ry="6" fill="#e8e2c8" />
        <circle cx="131" cy="115" r="3" fill="#1a1200" />
        <circle cx="167" cy="115" r="3" fill="#1a1200" />
      </g>
      <rect x="0" y="0" width="300" height="200" fill="url(#eyesVig)" />
      <defs>
        <radialGradient id="eyesVig" cx="50%" cy="55%" r="70%">
          <stop offset="40%" stopColor="transparent" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
      </defs>
    </svg>
  )
}

function CctvSvg() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <rect width="300" height="200" fill="#0a0f0a" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={0} y={i * 20} width="300" height="1" fill="#00ff66" opacity="0.06" />
      ))}
      <rect x="20" y="20" width="70" height="45" fill="none" stroke="#00ff66" strokeWidth="1.5" opacity="0.5" />
      <rect x="170" y="30" width="16" height="80" fill="#111" stroke="#00ff66" strokeWidth="1" opacity="0.6" />
      <rect x="150" y="105" width="56" height="8" fill="#111" stroke="#00ff66" strokeWidth="1" opacity="0.6" />
      <rect x="170" y="10" width="16" height="24" fill="#050505" stroke="#00ff66" strokeWidth="1" opacity="0.8" />
      <text x="14" y="190" fill="#00ff66" fontSize="12" opacity="0.7" fontFamily="monospace">
        REC ● CAM-03
      </text>
      <rect width="300" height="200" fill="#00ff66" opacity="0.03" />
    </svg>
  )
}

function HandprintsSvg() {
  const prints = [
    { x: 40, y: 60, r: -15 },
    { x: 120, y: 40, r: 20 },
    { x: 200, y: 70, r: -5 },
    { x: 80, y: 120, r: 10 },
    { x: 220, y: 130, r: -25 },
  ]
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <rect width="300" height="200" fill="#141414" />
      <rect width="300" height="200" fill="#8899aa" opacity="0.08" />
      {prints.map((p, i) => (
        <g key={i} transform={`translate(${p.x},${p.y}) rotate(${p.r})`} opacity="0.55">
          <ellipse cx="0" cy="14" rx="9" ry="13" fill="#c9d6e0" />
          <ellipse cx="-11" cy="-2" rx="3" ry="9" fill="#c9d6e0" />
          <ellipse cx="-4" cy="-8" rx="3" ry="10" fill="#c9d6e0" />
          <ellipse cx="4" cy="-8" rx="3" ry="10" fill="#c9d6e0" />
          <ellipse cx="11" cy="-2" rx="3" ry="9" fill="#c9d6e0" />
        </g>
      ))}
    </svg>
  )
}

function TunnelSvg() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <defs>
        <radialGradient id="tunnelFog" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#5a5a5a" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
      </defs>
      <rect width="300" height="200" fill="#020202" />
      <ellipse cx="150" cy="90" rx="110" ry="80" fill="url(#tunnelFog)" opacity="0.9" />
      <path d="M60 200 Q150 60 240 200 Z" fill="#000" opacity="0.85" />
      <rect x="0" y="185" width="300" height="15" fill="#0d0d0d" />
      <circle cx="150" cy="95" r="55" fill="#111" opacity="0.6" />
    </svg>
  )
}

function DoorAjarSvg() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <rect width="300" height="200" fill="#050505" />
      <rect x="90" y="10" width="90" height="185" fill="#0a0a0a" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="180" y="10" width="14" height="185" fill="#141414" opacity="0.85" />
      <rect width="300" height="200" fill="url(#doorajarVig)" />
      <defs>
        <radialGradient id="doorajarVig" cx="55%" cy="50%" r="70%">
          <stop offset="35%" stopColor="transparent" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
        </radialGradient>
      </defs>
    </svg>
  )
}

function CorridorSvg() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      <defs>
        <radialGradient id="corridorFog" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#2a2a20" />
          <stop offset="100%" stopColor="#040400" />
        </radialGradient>
      </defs>
      <rect width="300" height="200" fill="#020200" />
      <circle cx="150" cy="100" r="90" fill="url(#corridorFog)" />
      <circle cx="150" cy="100" r="92" fill="none" stroke="#111" strokeWidth="14" />
      <ellipse cx="150" cy="120" rx="10" ry="32" fill="#000" opacity="0.85" />
    </svg>
  )
}

function fallbackSvg(kind: ImagePlaceholder['kind']) {
  switch (kind) {
    case 'doorscope':
      return <DoorscopeSvg />
    case 'eyes':
      return <EyesSvg />
    case 'cctv':
      return <CctvSvg />
    case 'handprints':
      return <HandprintsSvg />
    case 'tunnel':
      return <TunnelSvg />
    case 'doorajar':
      return <DoorAjarSvg />
    case 'corridor':
      return <CorridorSvg />
    default:
      return null
  }
}

export function EerieImage({ image }: { image: ImagePlaceholder }) {
  const photo = SCENE_PHOTOS[image.kind]
  const [failed, setFailed] = useState(false)

  return (
    <div className="rounded-lg overflow-hidden border border-black/40 shadow-lg max-w-[220px] animate-flicker">
      <div className="aspect-[3/2] bg-black">
        {photo && !failed ? (
          <img
            src={photo}
            alt={image.caption ?? ''}
            className="w-full h-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          fallbackSvg(image.kind)
        )}
      </div>
      {image.caption && (
        <div className="bg-black/80 text-[10px] text-gray-400 px-2 py-1 font-mono">
          {image.caption}
        </div>
      )}
    </div>
  )
}
