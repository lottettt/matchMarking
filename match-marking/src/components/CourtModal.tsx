import React from 'react'
import { Court } from '../types'

interface CourtModalProps {
  matchId: string
  availableCourts: Court[]
  onSelectCourt: (matchId: string, court: Court) => void
  onClose: () => void
}

const CourtModal: React.FC<CourtModalProps> = ({ matchId, availableCourts, onSelectCourt, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 min-w-[320px] max-w-xs animate-fade-in flex flex-col gap-4 border border-white/20">
      <h4 className="text-lg font-bold mb-2">Select a Court</h4>
      <div className="flex flex-col gap-2">
        {availableCourts.length === 0 && <div className="text-gray-400 italic">No available courts</div>}
        {availableCourts.map(court => (
          <button key={court.id} onClick={() => onSelectCourt(matchId, court)}
            className="w-full px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition text-left shadow border border-blue-100">
            {court.name}
          </button>
        ))}
      </div>
      <button onClick={onClose} className="mt-2 text-gray-500 hover:text-gray-700">Cancel</button>
    </div>
  </div>
)

export default CourtModal 