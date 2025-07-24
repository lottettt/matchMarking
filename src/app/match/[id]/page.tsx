'use client'

import { useParams } from 'next/navigation'

export default function MatchDetail() {
  const params = useParams()
  const matchId = params.id

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Match Detail</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg">Match ID: {matchId}</p>
          <p className="text-gray-600 mt-2">Match detail page coming soon...</p>
        </div>
      </div>
    </div>
  )
}
