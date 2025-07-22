import React from 'react'
import { Player } from '../types'

interface PlayerCardProps {
  player: Player
  onRemove?: () => void
}

const getLevelColor = (level?: string) => {
  if (level === "Professional") return "status-rejected"
  if (level === "Sportship") return "status-pending"
  if (level === "Intermediate") return "status-approved"
  if (level === "Beginner") return "bg-gradient-to-r from-blue-400 to-blue-500 text-white border border-blue-300/30"
  return "bg-gradient-to-r from-slate-300 to-slate-400 text-white border border-slate-300/30"
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onRemove }) => (
  <span className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg border transform transition-all duration-300 hover:scale-105 cursor-pointer w-full sm:w-auto justify-center btn-3d plan-cell ${getLevelColor(player.level)}`}>
    <span className="font-bold mr-2 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
      {player.name}
    </span>
    {onRemove && (
      <button 
        onClick={onRemove} 
        className="ml-2 bg-white/20 text-current px-1.5 py-0.5 rounded-full text-xs font-medium hover:bg-white/30 transition-all duration-200"
      >
        ×
      </button>
    )}
  </span>
)

export default PlayerCard 