import React, { useState } from 'react'

interface AddCourtModalProps {
  onAddCourt: (name: string) => void
  onClose: () => void
  existingCourtNames?: string[]
}

const AddCourtModal: React.FC<AddCourtModalProps> = ({ onAddCourt, onClose, existingCourtNames = [] }) => {
  const [courtName, setCourtName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate court name
    const trimmedName = courtName.trim()
    if (!trimmedName) {
      setError('Court name is required')
      return
    }
    
    if (trimmedName.length < 2) {
      setError('Court name must be at least 2 characters long')
      return
    }
    
    if (trimmedName.length > 50) {
      setError('Court name must be less than 50 characters')
      return
    }
    
    // Check for duplicate names (case-insensitive)
    const duplicateName = existingCourtNames.some(name => 
      name.toLowerCase() === trimmedName.toLowerCase()
    )
    
    if (duplicateName) {
      setError('A court with this name already exists')
      return
    }

    // Clear error and add court
    setError('')
    onAddCourt(trimmedName)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-white/30 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add New Court
              </h4>
              <p className="text-blue-100 mt-1">Enter a name for the new court</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="courtName" className="block text-sm font-medium text-gray-700 mb-2">
              Court Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 9h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <input
                id="courtName"
                type="text"
                value={courtName}
                onChange={(e) => {
                  setCourtName(e.target.value)
                  if (error) setError('') // Clear error as user types
                }}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Center Court, Court A, Main Court..."
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                  error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
                autoFocus
                maxLength={50}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Court name must be 2-50 characters long
            </p>
          </div>

          {/* Quick Name Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Names
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(num => {
                const quickName = `Court no.${num}`
                const isDisabled = existingCourtNames.some(name => 
                  name.toLowerCase() === quickName.toLowerCase()
                )
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setCourtName(quickName)
                      if (error) setError('')
                    }}
                    disabled={isDisabled}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        : courtName === quickName
                        ? 'bg-blue-500 text-white border border-blue-500 shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                    }`}
                    title={isDisabled ? 'Court name already exists' : `Set name to "${quickName}"`}
                  >
                    {num}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Click a number to quickly set the court name. Grayed out numbers are already in use.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!courtName.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Court
              </span>
            </button>
          </div>
        </form>

        {/* Footer note */}
        <div className="px-6 pb-6">
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              The new court will be created with &quot;available&quot; status
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCourtModal
