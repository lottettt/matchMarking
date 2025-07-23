import React, { useState, useMemo } from 'react'
import { Court } from '../types'

interface CourtModalProps {
  matchId: string
  availableCourts: Court[]
  onSelectCourt: (matchId: string, court: Court) => void
  onClose: () => void
}

const getStatusColor = (status: string) => {
  if (status === 'available') return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
  if (status === 'occupied') return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
  return 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
}

const getStatusIcon = (status: string) => {
  if (status === 'available') return '🟢'
  if (status === 'occupied') return '🔴'
  return '⚪'
}

const CourtModal: React.FC<CourtModalProps> = ({ matchId, availableCourts, onSelectCourt, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter courts based on search
  const filteredCourts = useMemo(() => {
    return availableCourts.filter(court =>
      court.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [availableCourts, searchTerm])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-white/30 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 9h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                Select Court for Match
              </h4>
              <p className="text-emerald-100 mt-1">Choose an available court for this match</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200 bg-white/50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search courts by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>
          
          {/* Results Count */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>Showing {filteredCourts.length} of {availableCourts.length} available courts</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Courts List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredCourts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 9h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm ? 'No courts found' : 'No available courts'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search term' 
                  : 'All courts are currently occupied or unavailable'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCourts.map(court => (
                <button 
                  key={court.id} 
                  onClick={() => onSelectCourt(matchId, court)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg hover:scale-105 transform ${getStatusColor(court.status)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                      🏟️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg text-gray-800 truncate">{court.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm flex items-center gap-1">
                          {getStatusIcon(court.status)}
                          <span className="capitalize font-medium">{court.status}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {court.id}
                        </span>
                      </div>
                    </div>
                    <div className="text-emerald-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Available courts only
              </span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourtModal 