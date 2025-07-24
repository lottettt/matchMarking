import React from 'react'
import { Court } from '../types'

interface CourtCardProps {
  court: Court
  onRemove: (id: string) => void
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onRemove }) => (
  <div className="glass-card rounded-2xl p-6 shadow-2xl border border-slate-200/50 w-full text-base backdrop-blur-xl bg-white/80 hover:scale-105 transition-all duration-300 btn-3d relative">
    {/* Remove button - top right */}
    <button 
      onClick={() => onRemove(court.id)} 
      className="absolute top-3 right-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 p-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
      title="Remove court"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4L4 12m8-8l-8 8" />
      </svg>
    </button>

    {/* Court name - top left */}
    <div className="font-bold text-indigo-600 text-xl drop-shadow-sm animate-glow mb-8 pr-12">
      {court.name}
    </div>

    {/* Bottom row: Time available (left) and Status (right) */}
    <div className="flex justify-between items-center">
      <span className="text-slate-600 text-sm font-medium">
        {court.timeAvailable || "Available Now"}
      </span>
      <span className={`text-sm px-3 py-1 rounded-full font-medium shadow-lg transition-all duration-300 ${
        court.status === 'available' 
          ? 'status-approved' 
          : court.status === 'occupied' 
          ? 'status-pending' 
          : 'bg-gradient-to-r from-slate-300 to-slate-400 text-white border border-slate-300/30'
      }`}>
        {court.status}
      </span>
    </div>
  </div>
)

export default CourtCard 