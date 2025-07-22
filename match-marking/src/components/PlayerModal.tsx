import React from 'react'
import { Player } from '../types'

interface PlayerModalProps {
  matchId: string
  team: number
  slotIdx: number
  availablePlayers: Player[]
  onSelectPlayer: (matchId: string, team: number, slotIdx: number, player: Player) => void
  onClose: () => void
  columns?: number
}

const getLevelColor = (level?: string) => {
  if (level === "Professional") return "!bg-red-100 !text-red-700 !border-red-200"
  if (level === "Sportship") return "!bg-orange-100 !text-orange-700 !border-orange-200"
  if (level === "Intermediate") return "!bg-green-100 !text-green-700 !border-green-200"
  if (level === "Beginner") return "!bg-blue-100 !text-blue-700 !border-blue-200"
  return "!bg-gray-100 !text-gray-500 !border-gray-200"
}

const PlayerModal: React.FC<PlayerModalProps> = ({ matchId, team, slotIdx, availablePlayers, onSelectPlayer, onClose, columns = 3 }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-xs animate-fade-in flex flex-col gap-4 border border-white/20">
      <h4 className="text-lg font-bold mb-2">Select a Player</h4>
      <div className={`grid gap-2 grid-cols-${columns}`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {availablePlayers.length === 0 && <div className="text-gray-400 italic col-span-full">No available players</div>}
        {availablePlayers.map(player => (
          <button key={player.id} onClick={() => onSelectPlayer(matchId, team, slotIdx, player)}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition text-left shadow ${getLevelColor(player.level)}`}>
            {player.name}
          </button>
        ))}
      </div>
      <button onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-700 w-full">Cancel</button>
    </div>
  </div>
)

export default PlayerModal 