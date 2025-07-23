import { useState, useEffect } from 'react'

export const useMatchTimer = (startTime?: Date, endTime?: Date) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (startTime && !endTime) {
      const interval = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [startTime, endTime])

  const formatDuration = (durationMs: number): string => {
    const totalSeconds = Math.floor(durationMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    } else {
      return `${seconds}s`
    }
  }

  const formatTime = (date?: Date): string => {
    if (!date) return '--:--'
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const getDuration = (): string => {
    if (!startTime) return '--'
    
    const endTimeToUse = endTime || currentTime
    const duration = endTimeToUse.getTime() - startTime.getTime()
    
    return formatDuration(duration)
  }

  return {
    formatTime,
    getDuration,
    currentTime
  }
}
