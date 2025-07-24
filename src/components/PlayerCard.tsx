import React from 'react'
import { Player } from '../types'
import { getInitials } from '../lib/nameUtils'

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
  
  // Calculate minutes since last play
  const getLastPlayText = (lastPlayTime?: Date) => {
    if (!lastPlayTime) return 'Never played'
    
    const now = new Date()
    const diffMs = now.getTime() - lastPlayTime.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffMinutes < 1) return 'Just finished'
    if (diffMinutes < 60) return `${diffMinutes} min ago`
    
    const diffHours = Math.floor(diffMinutes / 60)
    const remainingMinutes = diffMinutes % 60
    
    if (diffHours < 24) {
      return remainingMinutes > 0 
        ? `${diffHours}h ${remainingMinutes}m ago`
        : `${diffHours}h ago`
    }
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }
  
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
          {getInitials(player.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate" title={player.name}>{player.name}</div>
          <div className="text-xs text-gray-600 mt-1 space-y-0.5">
            <div>Today: {player.todayMatches || 0} match{(player.todayMatches || 0) !== 1 ? 'es' : ''}</div>
            <div>Last play: {getLastPlayText(player.lastPlayTime)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard 