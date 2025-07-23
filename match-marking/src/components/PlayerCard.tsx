import React from 'react'
import { Player } from '../types'

interface PlayerCardProps {
  player: Player
  onRemove?: () => void
}

const getLevelColor = (level?: string) => {
  if (level === "Professional") return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
  if (level === "Intermediate") return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
  if (level === "Beginner") return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
  return "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
}

const getStateIcon = (state: string) => {
  return state === 'ready' 
    ? { letter: 'R', bgColor: 'bg-green-500', textColor: 'text-white' }
    : { letter: 'S', bgColor: 'bg-yellow-500', textColor: 'text-white' }
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onRemove }) => {
  const statusInfo = getStateIcon(player.state)
  
  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg hover:scale-105 transform relative ${getLevelColor(player.level)}`}>
      {/* Status badge in top right */}
      <div className={`absolute top-2 right-2 w-6 h-6 ${statusInfo.bgColor} ${statusInfo.textColor} rounded-md flex items-center justify-center text-xs font-bold shadow-sm`}>
        {statusInfo.letter}
      </div>
      
      {/* Remove button */}
      {onRemove && (
        <button 
          onClick={onRemove} 
          className="absolute top-2 right-10 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 text-xs font-bold shadow-sm"
          title="Remove player"
        >
          ×
        </button>
      )}
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
          {player.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{player.name}</div>
          <div className="text-xs text-gray-600 mt-1">
            Today: {player.todayMatches || 0} match{(player.todayMatches || 0) !== 1 ? 'es' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard 