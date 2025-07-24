import React from 'react'
import { formatNameUltraCompact, formatNameCompact } from '../lib/nameUtils'

interface ResponsivePlayerNameProps {
  name: string
  className?: string
  maxLength?: number
  showTooltip?: boolean
}

/**
 * A component that displays player names responsively based on screen size
 */
const ResponsivePlayerName: React.FC<ResponsivePlayerNameProps> = ({ 
  name, 
  className = '', 
  maxLength = 12,
  showTooltip = true 
}) => {
  const props = showTooltip ? { title: name } : {}
  
  return (
    <span className={`${className}`} {...props}>
      {/* Show ultra-compact on mobile */}
      <span className="block sm:hidden">
        {formatNameUltraCompact(name, Math.min(maxLength, 8))}
      </span>
      
      {/* Show compact on tablets */}
      <span className="hidden sm:block lg:hidden">
        {formatNameCompact(name)}
      </span>
      
      {/* Show full or moderately truncated on desktop */}
      <span className="hidden lg:block">
        {name.length > maxLength ? formatNameUltraCompact(name, maxLength) : name}
      </span>
    </span>
  )
}

export default ResponsivePlayerName
