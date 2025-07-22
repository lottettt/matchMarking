import React from 'react'
import { Court } from '../types'

interface CourtCardProps {
  court: Court
  onRemove: (id: string) => void
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onRemove }) => (
  <div className="glass-card rounded-2xl p-6 shadow-2xl border border-slate-200/50 w-full text-base backdrop-blur-xl bg-white/80 hover:scale-105 transition-all duration-300 btn-3d">
    <div className="flex items-center gap-3">
      <span className="font-bold text-indigo-600 text-xl drop-shadow-sm animate-glow">{court.name}</span>
      <span className={`text-sm px-3 py-1 rounded-full ml-2 font-medium shadow-lg transition-all duration-300 ${
        court.status === 'available' 
          ? 'status-approved' 
          : court.status === 'occupied' 
          ? 'status-pending' 
          : 'bg-gradient-to-r from-slate-300 to-slate-400 text-white border border-slate-300/30'
      }`}>
        {court.status}
      </span>
      <button 
        onClick={() => onRemove(court.id)} 
        className="ml-auto enhanced-input bg-transparent text-slate-600 px-3 py-1.5 rounded-xl text-sm font-medium hover:text-red-500 hover:bg-red-50/50 transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        Remove
      </button>
    </div>
  </div>
)

export default CourtCard 